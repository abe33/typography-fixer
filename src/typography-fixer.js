import R from 'ramda'

/**
 * Returns an array of rule violations in the passed-in string.
 *
 * Ignores and rules are separated at the beginning of the call, then the ranges
 * to ignore are computed. When the a check results intersect with or is
 * contained in a range it will be simply ignored.
 *
 * If there's no results, the function returns `undefined`.
 *
 * @param  {Array} ruleset the array with all the rules and ignores to use when
 *                         checking the passed-in string
 * @param  {string} string the string to check
 * @throws {Error} when one argument is missing
 * @type {Array|undefined} an array of rule violation results or `undefined`
 *                           when there is no violations.<br>Each result
 *                           object will have the following properties:
 * @property {string} name the name of the broken rule
 * @property {Array} range the range at which the violation can be found
 *                         in the string
 * @example
 * import {check} from 'typography-fixer'
 * import rules from 'typography-fixer/lib/rules/en-UK'
 *
 * const results = check(rules, 'Some string "to check".')
 */
export const check = R.curry(function check (ruleset, string) {
  let {ignores, rules} = filterRules(ruleset)

  if (rules.length === 0) { return undefined }

  const getRanges = R.compose(R.unnest, R.map(rangesIn(string)))
  const anyIntersection = R.anyPass(R.map(rangesIntersects, getRanges(ignores)))
  const noIntersection = R.compose(R.not, R.propSatisfies(anyIntersection, 'range'))
  const getResults = R.compose(R.flatten, R.map(checkString(string)))
  const results = R.filter(noIntersection, getResults(rules))

  return results.length > 0 ? results : undefined
})

/**
 * Returns the passed-in string modified by the specified ruleset.
 *
 * Ignores and rules are separated at the beginning of the call, then the ranges
 * to ignore are computed. The string is split using the ranges to have in one
 * array all the parts that can be modified and in another array all the ignored
 * parts. Once all the fixes were applied, the string from the two arrays are
 * joined together into a new string and returned.
 *
 * @param  {Array} ruleset the array with all the rules and ignores to use to
 *                         transform the passed-in string
 * @param  {string} string the string to fix
 * @return {string} the fixed string
 * @throws {Error} when one argument is missing
 * @example
 * import {fix} from 'typography-fixer'
 * import rules from 'typography-fixer/lib/rules/en-UK'
 *
 * const string = fix(rules, 'Some string "to fix".')
 */
export const fix = R.curry(function fix (ruleset, string) {
  let {ignores, rules} = filterRules(ruleset)

  if (rules.length === 0) { return string }

  const getRanges = R.compose(compactRanges, R.unnest, R.map(rangesIn(string)))
  const {included, excluded} = splitByRanges(string, getRanges(ignores))
  const replace = R.map(R.reduce(fixString, R.__, rules))

  return alternateJoin(replace(included), excluded)
})

/**
 * Returns a flat array of rules with names prefixed by the passed-in `name`.
 *
 * When called without a name the `group` function will only flatten the given
 * rules array.
 *
 * One use case of calling group without a name is when exporting a ruleset from
 * a file so that nested groups get flatten into the exported array.
 *
 * @param  {string} [name] the name of the rules group
 * @param  {Array} rules the rules to be part of the group
 * @return {Array} an array of new rules prefixed with this group name
 * @throws {Error} when the rules argument is missing
 *
 * @example
 * import {group, rule} from 'typography-fixer'
 *
 * export default group([
 *   group('spaces', [
 *     rule('spaceAfterPeriodOrColon', /(\D)(\.|:)([^\s\)])/, '$1$2 $3'),
 *     …
 *   ])
 * ])
 */
export function group (name, rules) {
  let groupName

  if (Array.isArray(name)) {
    rules = name
    groupName = []
  } else {
    if (!name || !rules) {
      throw new Error('The group rules argument is mandatory')
    }
    groupName = [name]
  }

  return R.flatten(rules).map((rule) => {
    let newObject = {
      name: groupName.concat(rule.name).join('.')
    }

    for (const key in rule) {
      if (key === 'name') { continue }
      newObject[key] = rule[key]
    }

    return newObject
  })
}

/**
 * Creates a new rule object that matches the specified `expression`.
 *
 * A rule is an object with a name and two methods `fix` and `check`.
 *
 * A rule can be created with either a string or a regular expression as the
 * `expression` parameter.
 *
 * - When given a regular expression the flags of the original expression
 *   are preserved except for the `global` which will be forcefully defined
 *   on the expression created when checking or fixing a string.
 * - When given a string this string will be used a source for the regular
 *   expressions. These expressions will be created with the `multiline` flag
 *   enabled.
 *
 * The `replacement` parameter is used when a match is found and will be passed
 * as the second argument of the `String#replace` method. A regular expression
 * based on the one used to search the string will be passed as the first
 * argument. It means that every group will be available to use in the
 * replacement string. A function can also be passed in the `replacement`
 * parameter and will then receive the matched string and the various groups as
 * arguments.
 *
 * @param  {string} name the name of the rule
 * @param  {string|RegExp} match the regular expression to match against
 *                               a string
 * @param  {string|function} replace the replacement string or function
 *                                   to use when a match is found
 * @throws {Error} when one argument is missing
 * @return {Object} the rule object
 * @property {string} name the rule's name
 * @property {function(string:string):string} fix a function to apply the rule
 *                                                on the passed-in string
 * @property {function(string:string):Array} check a function to check
 *                                                 violations in the passed-in
 *                                                 string
 * @example
 * import {rule} from 'typography-fixer'
 *
 * // this rule adds a space after `.` and `:` unless the characted is preceded
 * // by a number, as in 12.4 or 04:35, or followed by a space or `)`
 * const ruleObject = rule('spaceAfterPeriodOrColon', /(\D)(\.|:)([^\s\)])/, '$1$2 $3')
 */
export function rule (name, match, replace) {
  return {name, match, replace}
}

/**
 * Creates a new ignore rule that excludes the specified `expression`.
 *
 * An ignore rule is an object with a name and a `ranges` method.
 *
 * An ignore rule can be created with either a string or a regular expression
 * as the `expression` parameter.
 *
 * - When given a regular expression the flags of the original expression
 *   are preserved except for the `global` which will be forcefully defined
 *   on the expression created when checking or fixing a string.
 * - When given a string this string will be used a source for the regular
 *   expressions. These expressions will be created with the `multiline` flag
 *   enabled.
 *
 * The `ranges` function, when called with a string, returns an array of ranges
 * of the ignored section of the string. A range is an array with two numbers
 * for the start and end index in the string.
 *
 * An ignore rule can also ignores everything that is not matched by the
 * expression by passing `true` as the third argument of the `ignore` function.
 *
 * @param  {string} name the name of the rule
 * @param  {string|RegExp} ignore the regular expression to match against
 *                                a string
 * @param  {boolean} [invertRanges=false] if `true` the excluded ranges will
 *                                        cover every part of the string that
 *                                        is not matched by the expression
 * @throws {Error} when one argument is missing
 * @return {Object} [description]
 * @property {string} name the name of the rule
 * @property {function(string:string):Array} ranges a function that returns
 *                                                  an array of the ranges to
 *                                                  ignore in the passed-in
 *                                                  string
 * @example
 * import {ignore} from 'typography-fixer'
 *
 * // this rule ignores markdown code blocks defined using three consecutive backticks
 * const ignoreObject = ignore('codeBlock', /(```)(.|\n)*?\1/),
 */
export function ignore (name, ignore, invertRanges = false) {
  return {name, ignore, invertRanges}
}

const ruleRegExp = R.curry(function (global, prop, rule) {
  let source
  const flags = global ? ['g'] : []
  const expression = rule[prop]

  if (expression instanceof RegExp) {
    source = expression.source
    if (expression.multiline) { flags.push('m') }
    if (expression.ignoreCase) { flags.push('i') }
  } else {
    source = expression
    flags.push('m')
  }

  return new RegExp(source, flags.join(''))
})

const ignoreRuleRegExp = ruleRegExp(true, 'ignore')
const checkRuleRegExp = ruleRegExp(true, 'match')
const fixRuleRegExp = ruleRegExp(false, 'match')

const checkString = R.curry(function check (string, rule) {
  const searchRegExp = checkRuleRegExp(rule)
  const matchRegExp = fixRuleRegExp(rule)
  const matches = []

  let match
  do {
    match = searchRegExp.exec(string)
    if (match && match[0].replace(matchRegExp, rule.replace) !== match[0]) {
      matches.push({
        rule: rule.name,
        range: [match.index, searchRegExp.lastIndex]
      })
    }
  } while (match)

  return matches
})

const fixString = R.curry(function fix (string, rule) {
  return R.replace(checkRuleRegExp(rule), rule.replace, string)
})

const rangesIn = R.curry(function (string, rule) {
  if (rule.invertRanges) {
    return exclusiveRangesIn(string, rule)
  } else {
    return inclusiveRangesIn(string, rule)
  }
})

const inclusiveRangesIn = R.curry(function (string, rule) {
  const re = ignoreRuleRegExp(rule)
  const ranges = []
  let match

  do {
    match = re.exec(string)
    if (match) { ranges.push([match.index, re.lastIndex]) }
  } while (match)

  return ranges
})

const exclusiveRangesIn = R.curry(function (string, rule) {
  const re = ignoreRuleRegExp(rule)
  const ranges = []
  let start = 0
  let match

  do {
    match = re.exec(string)
    if (match) {
      ranges.push([start, match.index - 1])
      start = re.lastIndex
    }
  } while (match)

  ranges.push([start, string.length])

  return ranges
})

function filterRules (ruleset) {
  const ignores = []
  const rules = []

  for (let i = 0, len = ruleset.length; i < len; i++) {
    let rule = ruleset[i]

    if (rule.ignore) {
      ignores.push(rule)
    } else {
      rules.push(rule)
    }
  }

  return {ignores, rules}
}

const rangesIntersects = R.curry(function (rangeA, rangeB) {
  const [startA, endA] = rangeA
  const [startB, endB] = rangeB

  return (startB >= startA && startB <= endA) ||
         (endB >= startA && endB <= endA) ||
         (startA >= startB && startA <= endB) ||
         (endA >= startB && endA <= endB)
})

function splitByRanges (string, ranges) {
  const included = []
  const excluded = []

  let start = 0
  for (let i = 0, len = ranges.length; i < len; i++) {
    const range = ranges[i]

    included.push(string.slice(start, range[0]))
    excluded.push(string.slice(range[0], range[1]))
    start = range[1]
  }
  included.push(string.slice(start, string.length))

  return {included, excluded}
}

function alternateJoin (a, b) {
  let string = ''

  for (let i = 0, len = a.length; i < len; i++) {
    string += a[i]
    if (b[i]) { string += b[i] }
  }

  return string
}

function compactRanges (ranges) {
  if (ranges.length === 0) { return [] }

  const newRanges = ranges.reduce((memo, rangeA) => {
    if (memo.length === 0) {
      memo.push(rangeA)
      return memo
    } else {
      const newMemo = memo.filter((rangeB) => {
        if (rangesIntersects(rangeA, rangeB)) {
          rangeA[0] = Math.min(rangeA[0], rangeB[0])
          rangeA[1] = Math.max(rangeA[1], rangeB[1])
          return false
        } else {
          return true
        }
      })

      return newMemo.concat([rangeA])
    }
  }, [])

  return newRanges.sort((a, b) => { return a[0] - b[0] })
}

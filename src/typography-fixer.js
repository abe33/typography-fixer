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
 * See the {@link rule} and {@link ignore} documentation for details about how
 * rules and ignore rules are created.
 *
 * @param  {Array} [ruleset=[]] the array with all the rules and ignores to use
 *                              when checking the passed-in string
 * @param  {string} [string] the string to check
 * @return {Array|undefined} an array of rule violation results or `undefined`
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
 *
 * // The check function support currying
 * const checkString = check(rules)
 *
 * const results = checkSring('Some string "to check".')
 */
export function check (ruleset = [], string) {
  const {ignores, rules} = splitRules(ruleset)

  if (rules.length === 0) { return string ? undefined : function () {} }

  const getRanges = R.compose(R.unnest, R.ap(R.map(rangesFunctionFor, ignores)), R.of)

  const doCheck = (string) => {
    const anyIntersection = R.anyPass(R.map(rangesIntersects, getRanges(string)))
    const noIntersection = R.compose(R.not, R.propSatisfies(anyIntersection, 'range'))
    const getResults = R.compose(R.flatten, R.map(checkString(string)))
    const results = R.filter(noIntersection, getResults(rules))

    return results.length > 0 ? results : undefined
  }

  return string ? doCheck(string) : doCheck
}

/**
 * Returns the passed-in string modified by the specified ruleset.
 *
 * Ignores and rules are separated at the beginning of the call, then the ranges
 * to ignore are computed. The string is split using the ranges to have in one
 * array all the parts that can be modified and in another array all the ignored
 * parts. Once all the fixes were applied, the string from the two arrays are
 * joined together into a new string and returned.
 *
 * See the {@link rule} and {@link ignore} documentation for details about how
 * rules and ignore rules are created.
 *
 * @param  {Array} [ruleset=[]] the array with all the rules and ignores to use
 *                              to transform the passed-in string
 * @param  {string} [string] the string to fix
 * @return {string} the fixed string
 * @example
 * import {fix} from 'typography-fixer'
 * import rules from 'typography-fixer/lib/rules/en-UK'
 *
 * const string = fix(rules, 'Some string "to fix".')
 *
 * // The fix function support currying
 * const fixString = fix(rules)
 *
 * const results = fixString('Some string "to fix".')
 */
export function fix (ruleset = [], string) {
  const {ignores, rules} = splitRules(ruleset)

  if (rules.length === 0) { return string || function () {} }

  const getRanges = R.compose(compactRanges, R.unnest, R.ap(R.map(rangesFunctionFor, ignores)), R.of)

  const doFix = (string) => {
    const {legit, ignored} = splitByRanges(string, getRanges(string))
    const fixContent = R.map(R.reduce(fixString, R.__, rules))

    return alternateJoin(fixContent(legit), ignored)
  }

  return string ? doFix(string) : doFix
}

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
  const rulesAsFirstArgument = R.compose(R.isArrayLike, R.head)
  const nameThenRules = R.both(
    R.compose(R.is(String), R.head),
    R.compose(R.isArrayLike, R.tail)
  )

  const normalizeArguments = R.cond([
    [rulesAsFirstArgument, ([rules]) => [[], rules]],
    [nameThenRules, ([name, rules]) => [[name], rules]],
    [R.T, () => [[], []]]
  ])

  const [groupName, ruleset] = normalizeArguments([name, rules])

  const prefixName = R.compose(R.join('.'), R.concat(groupName))
  const convert = R.over(R.lensProp('name'), prefixName)

  return R.map(convert, R.flatten(ruleset))
}

/**
 * Creates a new rule object that matches the specified `match` expression.
 *
 * A rule is an object with a `name`, `match` and `replace` properties.
 *
 * A rule can be created with either a string or a regular expression as the
 * `match` parameter.
 *
 * - When given a regular expression the flags of the original expression
 *   are preserved except for the `global` which will be forcefully defined
 *   on the `match` created when checking or fixing a string.
 * - When given a string this string will be used a source for the regular
 *   expressions. These expressions will be created with the `multiline` flag
 *   enabled.
 *
 * The `replace` parameter is used when a match is found and will be passed
 * as the second argument of the `String#replace` method. A regular expression
 * based on the one used to search the string will be passed as the first
 * argument. It means that every group will be available to use in the
 * replacement string. A function can also be passed in the `replace`
 * parameter and will then receive the matched string and the various groups as
 * arguments.
 *
 * @param  {string} name the name of the rule
 * @param  {string|RegExp} match the regular expression to match against
 *                               a string
 * @param  {string|function} replace the replacement string or function
 *                                   to use when a match is found
 * @return {Object} the rule object
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
 * Creates a new ignore rule that excludes the specified `ignore` expression.
 *
 * An ignore rule is an object with a `name`, `ignore` and an optional
 * `invertRanges` properties.
 *
 * An ignore rule can be created with either a string or a regular expression
 * as the `ignore` parameter.
 *
 * - When given a regular expression the flags of the original expression
 *   are preserved except for the `global` which will be forcefully defined
 *   on the expression created when checking or fixing a string.
 * - When given a string this string will be used a source for the regular
 *   expressions. These expressions will be created with the `multiline` flag
 *   enabled.
 *
 * An ignore rule can also ignores everything that is not matched by the
 * expression by passing `true` as in the `invertRanges` argument of the
 * `ignore` function.
 *
 * @param  {string} name the name of the rule
 * @param  {string|RegExp} ignore the regular expression to match against
 *                                a string
 * @param  {boolean} [invertRanges=false] if `true` the excluded ranges will
 *                                        cover every part of the string that
 *                                        is not matched by the expression
 * @return {Object} [description]
 * @example
 * import {ignore} from 'typography-fixer'
 *
 * // this rule ignores markdown code blocks defined using three consecutive backticks
 * const ignoreObject = ignore('codeBlock', /(```)(.|\n)*?\1/),
 */
export function ignore (name, ignore, invertRanges = false) {
  return {name, ignore, invertRanges}
}

const baseFlags = (global) => global ? ['g'] : []

const flag = R.curry((prop, re) => re[prop] ? prop[0] : '')

const flagsForRegExp = R.curry((global, re) => {
  const appendFlags = R.compose(
    R.append(flag('multiline', re)),
    R.append(flag('ignoreCase', re))
  )

  return appendFlags(baseFlags(global))
})

const ruleRegExp = R.curry((global, prop, rule) => {
  const isRegExp = R.is(RegExp)
  const getSource = (e) => isRegExp(e) ? e.source : e
  const getFlags = R.compose(
    R.join(''),
    (e) => isRegExp(e) ? flagsForRegExp(global, e) : baseFlags(global).concat('m')
  )

  return new RegExp(getSource(rule[prop]), getFlags(rule[prop]))
})

const ignoreRuleRegExp = ruleRegExp(true, 'ignore')
const searchRuleRegExp = ruleRegExp(true, 'match')
const matchRuleRegExp = ruleRegExp(false, 'match')

const checkString = R.curry((string, rule) => {
  const searchRegExp = searchRuleRegExp(rule)
  const matchRegExp = matchRuleRegExp(rule)
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

const fixString = R.curry((string, rule) => {
  return R.replace(searchRuleRegExp(rule), rule.replace, string)
})

function rangesFunctionFor (rule) {
  return rule.invertRanges ? exclusiveRangesFor(rule) : inclusiveRangesFor(rule)
}

const inclusiveRangesFor = R.curry((rule, string) => {
  const re = ignoreRuleRegExp(rule)
  const ranges = []
  let match

  do {
    match = re.exec(string)
    if (match) { ranges.push([match.index, re.lastIndex]) }
  } while (match)

  return ranges
})

const exclusiveRangesFor = R.curry((rule, string) => {
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

function splitRules (ruleset) {
  const grouper = (rule) => rule.ignore ? 'ignores' : 'rules'

  return R.merge({ignores: [], rules: []}, R.groupBy(grouper, ruleset))
}

const rangesIntersects = R.curry((rangeA, rangeB) => {
  const [startA, endA] = rangeA
  const [startB, endB] = rangeB

  return (startB >= startA && startB <= endA) ||
         (endB >= startA && endB <= endA) ||
         (startA >= startB && startA <= endB) ||
         (endA >= startB && endA <= endB)
})

function splitByRanges (string, ranges) {
  const results = {legit: [], ignored: []}

  let start = 0
  const reducer = (memo, range) => {
    memo.legit.push(string.slice(start, range[0]))
    memo.ignored.push(string.slice(range[0], range[1]))
    start = range[1]
    return results
  }
  R.reduce(reducer, results, ranges)

  results.legit.push(string.slice(start, string.length))
  results.ignored.push('')

  return results
}

const joinReducer = (memo, [a, b]) => memo + a + b

const alternateJoin = (a, b) => R.reduce(joinReducer, '', R.transpose([a, b]))

function compactRanges (ranges) {
  if (ranges.length === 0) { return [] }

  const sort = (a, b) => a[0] - b[0]
  const reducer = (memo, rangeA) => {
    const filter = (rangeB) => {
      if (rangesIntersects(rangeA, rangeB)) {
        rangeA[0] = Math.min(rangeA[0], rangeB[0])
        rangeA[1] = Math.max(rangeA[1], rangeB[1])
        return false
      } else {
        return true
      }
    }

    return memo.length === 0
      ? R.append(rangeA, memo)
      : R.append(rangeA, R.filter(filter, memo))
  }

  return R.sort(sort, R.reduce(reducer, [], ranges))
}

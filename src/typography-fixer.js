import R from 'ramda'

const {
  anyPass, append, both, compose, concat, cond, converge, curry, filter, flatten, groupBy, head, is, isArrayLike, join, lensProp, map, merge, not, over, propSatisfies, reduce, replace, sort, tail, transpose, unapply, unnest
} = R

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

  const defined = i => i != null
  const getRanges = compose(unnest, R.ap(map(rangesFunctionFor, ignores)), R.of)
  const getCheckResults = converge(unapply(flatten), map(checkString, rules))

  const doCheck = (string) => {
    const anyIntersection = anyPass(map(rangesIntersects, getRanges(string)))
    const noIntersection = compose(not, propSatisfies(anyIntersection, 'range'))
    const results = filter(noIntersection, getCheckResults(string))

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

  const getRanges = compose(compactRanges, unnest, R.ap(map(rangesFunctionFor, ignores)), R.of)

  const doFix = (string) => {
    const {legit, ignored} = splitByRanges(string, getRanges(string))
    const fixContent = map(reduce(fixString, R.__, rules))

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
  const rulesAsFirstArgument = compose(isArrayLike, head)
  const nameThenRules = both(
    compose(is(String), head),
    compose(isArrayLike, tail)
  )

  const normalizeArguments = cond([
    when(rulesAsFirstArgument, ([rules]) => [[], rules]),
    when(nameThenRules, ([name, rules]) => [[name], rules]),
    when(R.T, () => [[], []])
  ])

  const [groupName, ruleset] = normalizeArguments([name, rules])

  const prefixer = compose(join('.'), concat(groupName))
  const prefixName = over(lensProp('name'), prefixer)

  return Object.freeze(map(prefixName, flatten(ruleset)))
}

/**
 * Creates a new rule object that matches the specified `match` expression.
 *
 * A rule is an object with a `name`, `match` and `replace` properties.
 *
 * A rule can be created with either a string or a regular expression as the
 * `match` paramete
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
  return Object.freeze({name, match, replace})
}

/**
 * Creates a new ignore rule that excludes the specified `ignore` expression.
 *
 * An ignore rule is an object with a `name`, `ignore` and an optional
 * `invertRanges` properties.
 *
 * An ignore rule can be created with either a string or a regular expression
 * as the `ignore` paramete
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
  return Object.freeze({name, ignore, invertRanges})
}

//  ########  ########  #### ##     ##    ###    ######## ########
//  ##     ## ##     ##  ##  ##     ##   ## ##      ##    ##
//  ##     ## ##     ##  ##  ##     ##  ##   ##     ##    ##
//  ########  ########   ##  ##     ## ##     ##    ##    ######
//  ##        ##   ##    ##   ##   ##  #########    ##    ##
//  ##        ##    ##   ##    ## ##   ##     ##    ##    ##
//  ##        ##     ## ####    ###    ##     ##    ##    ########

/**
 * Wraps the passed-in condition and function into an array to be used
 * in a `cond` argument.
 *
 * @param  {function(value:*):boolean} predicate a function to use as predicate
 * @param  {function(value:*):*} then a function to use when the predicate
 *                                    is fulfilled
 * @return {Array<Function>} an array with the two passed-in functions
 */
const when = (predicate, then) => [predicate, then]

/**
 * Returns the base flags array for a regular expression depending on whether
 * the regexp should match globally or not.
 *
 * @param  {boolean} global whether the regexp should match globally or not
 * @return {Array}
 * @access private
 */
const baseFlags = (global) => global ? ['g'] : []

/**
 * Extract the flag letter corresponding to a given property from the specified
 * regular expression. For instance, if asked the flag for the multiline
 * property and the passed-in expression has `multiline` enabled the function
 * will return `'m'` otherwise it will return an empty string.
 *
 * @param  {string} prop the property flag to extract
 * @param  {RegExp} re the target regular expression
 * @return {string} the flag string
 * @access private
 */
const flag = curry((prop, re) => re[prop] ? prop[0] : '')

/**
 * Returns the flags array for the given regular expression but with the
 * global flag defined using the specified parameter.
 *
 * This function is used to create clones of rules and ignores expression
 * but configurated to be used in different context.
 *
 * @param  {boolean} global whether the regexp should match globally or not
 * @param  {RegExp} re the target regular expression
 * @return {Array} an array of regular expression flags
 * @access private
 */
const flagsForRegExp = curry((global, re) => {
  const appendFlags = compose(
    append(flag('multiline', re)),
    append(flag('ignoreCase', re))
  )

  return appendFlags(baseFlags(global))
})

/**
 * Returns a cloned regular expression from the passed-in rule's property
 * specified in the arguments.
 *
 * @param  {boolean} global whether the regexp should match globally or not
 * @param  {string} prop the rule property to clone
 * @param  {Object} rule the source rule object
 * @return {RegExp} the cloned regular expression
 * @access private
 */
const ruleRegExp = curry((global, prop, rule) => {
  const isRegExp = is(RegExp)
  const getSource = (e) => isRegExp(e) ? e.source : e
  const getFlags = compose(
    join(''),
    (e) =>
      isRegExp(e) ? flagsForRegExp(global, e) : baseFlags(global).concat('m')
  )

  return new RegExp(getSource(rule[prop]), getFlags(rule[prop]))
})

/**
 * A parameterized function that returns a cloned regular expression for
 * the passed-in ignore rule.
 *
 * @param  {Object} ignore the source ignore rule
 * @return {RegExp} the cloned regular expression
 * @access private
 */
const ignoreRuleRegExp = ruleRegExp(true, 'ignore')

/**
 * A parameterized function that returns a cloned regular expression for
 * the passed-in rule to use when searching matches globally in a string.
 *
 * @param  {Object} ignore the source ignore rule
 * @return {RegExp} the cloned regular expression
 * @access private
 */
const searchRuleRegExp = ruleRegExp(true, 'match')

/**
 * A parameterized function that returns a clone regular expression for
 * the passed-in ignore rule when performing a simple match against a string.
 *
 * @param  {Object} ignore the source ignore rule
 * @return {RegExp} the cloned regular expression
 * @access private
 */
const matchRuleRegExp = ruleRegExp(false, 'match')

const checkString = curry((rule, string) => {
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

const fixString = curry((string, rule) => {
  return replace(searchRuleRegExp(rule), rule.replace, string)
})

function rangesFunctionFor (rule) {
  return rule.invertRanges ? exclusiveRangesFor(rule) : inclusiveRangesFor(rule)
}

const inclusiveRangesFor = curry((rule, string) => {
  const re = ignoreRuleRegExp(rule)
  const ranges = []
  let match

  do {
    match = re.exec(string)
    if (match) { ranges.push([match.index, re.lastIndex]) }
  } while (match)

  return ranges
})

const exclusiveRangesFor = curry((rule, string) => {
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

  return merge({ignores: [], rules: []}, groupBy(grouper, ruleset))
}

const rangesIntersects = curry((rangeA, rangeB) => {
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
  reduce(reducer, results, ranges)

  results.legit.push(string.slice(start, string.length))
  results.ignored.push('')

  return results
}

const joinReducer = (memo, [a, b]) => memo + a + b

const alternateJoin = (a, b) => reduce(joinReducer, '', transpose([a, b]))

function compactRanges (ranges) {
  if (ranges.length === 0) { return [] }

  const sorter = (a, b) => a[0] - b[0]
  const reducer = (memo, rangeA) => {
    const filterer = (rangeB) => {
      if (rangesIntersects(rangeA, rangeB)) {
        rangeA[0] = Math.min(rangeA[0], rangeB[0])
        rangeA[1] = Math.max(rangeA[1], rangeB[1])
        return false
      } else {
        return true
      }
    }

    return memo.length === 0
      ? append(rangeA, memo)
      : append(rangeA, filter(filterer, memo))
  }

  return sort(sorter, reduce(reducer, [], ranges))
}

import {rule, group} from '../typography-fixer'

let punctuations

/**
 * A ruleset to replace common punctuations mistake.
 *
 * It includes rules for:
 *
 * - Replacing consecutive `!` or `?` characters by a single one
 * - Replacing ellipsis after `etc` by a period
 * - Replacing three consecutive periods by an ellipsis character
 * - Replacing hyphen in a composed word by a non-breaking hyphen
 *
 * @type {Array<Object>}
 */
export default punctuations = createRuleset()

function createRuleset () {
  return group('punctuations.common', [
    rule('collapseMultiplePunctuation', /([!?])\1+/, '$1'),
    rule('shortEtCaetera', /([Ee]tc)(\.{3}|\u2026)/, '$1.'),
    rule('triplePeriods', /\.{3,}/, '\u2026'),
    rule('nonBreakingHyphen', /(\w)-(\w)/, '$1\u2011$2')
  ])
}

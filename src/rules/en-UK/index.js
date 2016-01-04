import {rule, group} from '../../typography-fixer'
import {currenciesRegExp} from '../../constants'
import fractions from '../fractions'
import symbols from '../symbols'
import units from '../units'

let ruleset

/**
 * The ruleset for english typography in the United Kingdom.
 *
 * Finally, the following rulesets are also included:
 *
 * - {@link src/rules/fractions.js~fractions}
 * - {@link src/rules/symbols.js~symbols}
 * - {@link src/rules/units.js~units}
 *
 * @see http://j.poitou.free.fr/pro/html/typ/anglais.html
 * @type {Array<Object>}
 */
export default ruleset = createRuleset().concat(fractions).concat(units).concat(symbols)

function createRuleset () {
  return group('en-UK', [
    group('punctuations', [
      rule('collapseMultiplePunctuation', /([!?])\1+/, '$1'),
      rule('shortEtCaetera', /([Ee]tc)(\.{3,}|\u2026)/, '$1.'),
      rule('triplePeriods', /\.{3,}/, '\u2026'),
      rule('enDashBetweenWords', /(\D\x20)-(\x20\D)/, '$1\u2013$2'),
      rule('enDashBetweenNumbers', /(\d)\s*-\s*(\d)/, '$1\u2013$2'),
      rule('noPeriodAfterAbbr', /\b(Mr|Ms|Mrs|Prof|Dr)\./, '$1')
    ]),
    group('quotes', [
      rule('singlePrime', /(\d)'/, '$1\u2032'),
      rule('doublePrime', /(\d)"/, '$1\u2033'),
      rule('singleQuote', /(\w)'(\w)/, '$1\u2019$2'),
      rule('doubleQuote', /"([^"]+)"/, '\u201c$1\u201d'),
      rule('punctuationAfterQuote', /(\u201d)(\.|,)/, '$2$1')
    ]),
    group('spaces', [
      rule('collapseMultipleSpaces', /\x20{2,}/, ' '),
      rule('noSpaceBeforePunctuation', /\s+(\.|,|;|:|!|\?|%|\)|\u2019|\u2026|\u2030|\u2031)/, '$1'),
      rule('noSpaceAfterParenthesis', /(\()\s+/, '$1'),
      rule('noSpaceAfterQuote', /([^s])(\u2019)\s+/, '$1$2'),
      rule('noSpaceAroundEnDashBetweenNumbers', /(\d)\s*\u2013\s*(\d)/, '$1\u2013$2'),
      rule('spaceAfterPunctuation', /(,|;|!|\?|%|\u2026|\u2030|\u2031)([^\s\)])/, '$1 $2'),
      rule('spaceAfterPeriodOrColon', /(\D)(\.|:)([^\s\)])/, '$1$2 $3'),
      rule('noSpaceAroundEmDash', /\s*(\u2014)\s*/, '$1'),
      rule('spaceAroundEnDash', /([^\d\s])\x20*(\u2013)\x20*(\D)/, '$1\u00a0$2 $3'),
      rule('noSpaceAfterLeftQuote', /(\u201c)\s*(\S)/, '$1$2'),
      rule('noSpaceBeforeRightQuote', /(\S)\s*(\u201d)/, '$1$2'),
      rule('spaceAfterParenthesis', /(\))(\w)/, '$1 $2'),
      rule('spaceBeforeParenthesis', /(\S)(\()/, '$1 $2'),
      rule('nonBreakingSpaceAfterHonorific', /(Mr|Mrs|Ms|Miss|Sir|Lady)\s([A-Z])/, '$1\u00a0$2'),
      rule('noSpaceAfterCurrency', `([${currenciesRegExp}])\\s*(\\d)`, '$1$2')
    ])
  ])
}

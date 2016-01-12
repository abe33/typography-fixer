import {rule, group} from '../../typography-fixer'
import {currenciesRegExp} from '../../constants'
import punctuations from '../punctuations'
import fractions from '../fractions'
import symbols from '../symbols'
import units from '../units'

let enUK

/**
 * The ruleset for english typography in the United Kingdom.
 *
 * It's hard to find a single, universally adopted, typographic styleguide
 * for english, so this ruleset try to rely only on commonly used rules.
 *
 * This ruleset includes:
 *
 * - Replacing hyphen between numbers such as in `1939-45` by an en-dash
 * - Replacing hyphen between words with an em-dash
 * - Removing a period placed after abbreviations such as `Mr` or `Dr`
 * - Replacing quotes after a number by the corresponding prime
 * - Replacing single quotes in words with typographic ones
 * - Replacing double quotes around a sentence with typographic ones
 * - Replacing `No.` and other variations before a number by `№`
 * - Moving punctuations after a quotation mark into it
 * - Collapsing multiple spaces into a single one
 * - Removing spaces before `,`, `.`, `)`, `…`, `’`, `”`, `?`, `!`, `;`, `%`,
 *   `‰`, `‱`, and `:`
 * - Removing spaces after `“`, `(`, and `’` but only if it is not preceded by
 *   a `s`
 * - Removing spaces around an en-dash placed between two numbers
 * - Removing spaces between a currency
 * - Adding spaces around an en-dash placed between two words
 * - Adding a space after `,`, `.`, `?`, `!`, `;`, `%`, `‰`, `‱`, `)`, and `:`
 * - Adding a non-breaking space after a `№`
 * - Adding a non-breaking space between an honorific and a name
 *
 * Finally, the following rulesets are also included:
 *
 * - {@link src/rules/punctuations.js~punctuations}
 * - {@link src/rules/fractions.js~fractions}
 * - {@link src/rules/symbols.js~symbols}
 * - {@link src/rules/units.js~units}
 *
 * @see http://typophile.com/files/typography_rules.pdf
 * @see http://j.poitou.free.fr/pro/html/typ/anglais.html
 * @type {Array<Object>}
 */
export default enUK = createRuleset()

function createRuleset () {
  return group('en-UK', [
    units,
    symbols,
    fractions,
    punctuations,
    group('punctuations', [
      rule('enDashBetweenWords', /(\D\x20)-(\x20\D)/, '$1\u2013$2'),
      rule('enDashBetweenNumbers', /(\d)\s*(?:-|\u2011)\s*(\d)/, '$1\u2013$2'),
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
      rule('noSpaceAfterLeftQuote', /(\u201c)\s*(\S)/, '$1$2'),
      rule('noSpaceAfterCurrency', `([${currenciesRegExp}])\\s*(\\d)`, '$1$2'),
      rule('noSpaceBeforeRightQuote', /(\S)\s*(\u201d)/, '$1$2'),
      rule('spaceAroundEnDash', /([^\d\s])\x20*(\u2013)\x20*(\D)/, '$1\u00a0$2 $3'),
      rule('spaceAfterParenthesis', /(\))(\w)/, '$1 $2'),
      rule('spaceBeforeParenthesis', /(\S)(\()/, '$1 $2'),
      rule('nonBreakingSpaceAfterHonorific', /(Mr|Mrs|Ms|Miss|Sir|Lady)\s([A-Z])/, '$1\u00a0$2'),
      rule('nonBreakingSpaceAfterNumeroSign', /(\u2116)\s*(\d)/, '$1\u00a0$2')
    ]),
    group('abbr', [
      rule('numeroSign', /(?:N|n)o\.\s*(\d)/, '\u2116\u00a0$1')
    ])
  ])
}

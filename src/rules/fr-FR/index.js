import {rule, group} from '../../typography-fixer';
import {currenciesRegExp} from '../../constants';
import punctuations from '../punctuations';
import fractions from '../fractions';
import symbols from '../symbols';
import units from '../units';

/**
 * The ruleset for french typography.
 *
 * This ruleset is based on typographic rules from the Imprimerie Nationale
 * used for all publishing works in France.
 *
 * Some rules can't possibly be implemented so they're simply ignored. It's the
 * case for numbers below ten which should always be written in full text and
 * not with digits. Because there's an inflection of the word `un` according
 * to the gender of its noun when used as a determinant and given that there's
 * over 100 000 common nouns in french, with so many exceptions that the
 * gender can't be guessed from the spelling, implementing this rule would
 * mean integrating a complete french dictionary and a syntactic engine. No need
 * to say this is clearly out of the scope of this package.
 *
 * However a lot of rules can be and are implemented in this ruleset.
 * It includes:
 *
 * - Replacing `Mr` by `M.` (`Mr` is the english abbreviation for mister, french
 *   uses `M.`)
 * - Replacing possessive interrogative `a-t'il` with `a-t-il`
 * - Properly formatting `c.-à-d.` abbreviation
 * - Using a superscript `o` instead of `°` for `numéro` abbreviation
 * - Removing hyphen after `anti` unless the following word starts with a `i`
 *   or already contains an hyphen
 * - Replacing hyphen between numbers such as in `1939-45` by an en-dash
 * - Replacing hyphen between words such as in `Pierre - tu le connais, hein ? -
 *   est professeur de yoga` by an en-dash
 * - Replacing single quote in `L'arbre` with a typographic one (`’`)
 * - Replacing double quotes around a sentence with `«` and `»`
 * - Collapsing multiple spaces into a single one
 * - Removing spaces before `,`, `.`, `)`, `…` and `’`
 * - Removing spaces after `’` and `(`
 * - Removing spaces around an en-dash placed between two numbers
 * - Adding spaces around an en-dash placed between two words
 * - Adding a space before `(`
 * - Adding a non-breaking space between a number and a currency symbol
 * - Adding a non-breaking space after `«` and before `»`
 * - Adding a non-breaking space between an honorific and a name
 * - Adding a thin non-breaking space before `?`, `!`, `;`, `%`, `‰`, `‱`, and
 *   `:`
 * - Adding a space after `,`, `.`, `?`, `!`, `;`, `%`, `‰`, `‱`, `)`, and `:`
 * - Replacing invalid ordinal numbers such `1ère` by their proper form
 * - Enforcing lowercase for months and days names
 * - Enforcing use of ligatures for `ae` and `oe`
 *
 * Finally, the following rulesets are also included:
 *
 * - {@link src/rules/punctuations.js~punctuations}
 * - {@link src/rules/fractions.js~fractions}
 * - {@link src/rules/symbols.js~symbols}
 * - {@link src/rules/units.js~units}
 *
 * @see http://j.poitou.free.fr/pro/html/typ/typ-intro.html
 * @see http://gargas.biomedicale.univ-paris5.fr/lt/typo.html
 * @type {Array<Object>}
 */
const frFR = group('fr-FR', [
  units,
  symbols,
  fractions,
  punctuations,
  group('punctuations', [
    rule('maleHonorific', /Mr\.?/, 'M.'),
    rule('possessiveInterrogative', /a(-|\u2011)t'il/, 'a\u2011t\u2011il'),
    rule('cad', /c\.?(-|\u2011)?[aà](-|\u2011)?d\.?/, 'c.\u2011à\u2011d.'),
    rule('numberAbbr', /(n|N)°/, '$1\u00ba'),
    rule('enDashBetweenWords', /(\D\x20)-(\x20\D)/, '$1\u2013$2'),
    rule('enDashBetweenNumbers', /(\d)\s*(?:-|\u2011)\s*(\d)/, '$1\u2013$2'),
    rule('anti', /anti(?:-|\u2011)([^i]\w+)(?!-|\u2011)\b/, 'anti$1'),
  ]),
  group('quotes', [
    rule('singleQuote', /(\w)'(\w)/, '$1\u2019$2'),
    rule('doubleQuote', /"([^"]+)"/, '\u00ab$1\u00bb'),
  ]),
  group('spaces', [
    rule('collapseMultipleSpaces', /\x20{2,}/, ' '),
    rule('noSpaceBeforePunctuation', /\s+(,|\.|\)|\u2026|\u2019)/, '$1'),
    rule('noSpaceAfterPunctuation', /(\u2019|\()\s+/, '$1'),
    rule('noSpaceAroundEnDashBetweenNumbers', /(\d)\s*\u2013\s*(\d)/, '$1\u2013$2'),
    rule('nonBreakingSpaceBeforePunctuation', /(\S)(?:\x20)?([?!;%\u2030\u2031])/, '$1\u202F$2'),
    rule('nonBreakingSpaceBeforeColon', /([^\s\d])(?:\x20)?(:)/, '$1\u202F$2'),
    rule('nonBreakingSpaceBeforeColonBetweenTwoNumbers1', /(\d)\s*(:)(\s\d)/, '$1\u202F$2$3'),
    rule('nonBreakingSpaceBeforeColonBetweenTwoNumbers2', /(\d)\s(:)(\d)/, '$1\u202F$2$3'),
    rule('nonBreakingSpaceBeforeColonAfterNumber', /(\d)\s*(:)(\D)/, '$1\u202F$2$3'),
    rule('spaceAfterPunctuation', /(;|!|\?|%|\u2026|\u2030|\u2031)([^\s\)])/, '$1 $2'),
    rule('spaceAfterPeriod', /(\.)([^\)\s-\u2011])/, '$1 $2'),
    rule('spaceAfterColon', /(\D\s?)(:)([^\s\)])/, '$1$2 $3'),
    rule('spaceAfterComma', /(\D)(,)([^\s\)])/, '$1$2 $3'),
    rule('spaceAfterParenthesis', /(\))(\w)/, '$1 $2'),
    rule('spaceBeforeParenthesis', /(\S)(\()/, '$1 $2'),
    rule('spaceBeforeCurrency', `(\\d)\x20?([${currenciesRegExp}])`, '$1\u00a0$2'),
    rule('spaceAroundEnDash', /([^\d\s])\x20*(\u2013)\x20*(\D)/, '$1\u00a0$2 $3'),
    rule('spaceAfterLeftQuote', /(\u00ab)\x20*(\S)/, '$1\u202F$2'),
    rule('spaceBeforeRightQuote', /(\S)\x20*(\u00bb)/, '$1\u202F$2'),
    rule('nonBreakingSpaceAfterHonorific', /(MM\.|M\.|Mme|Mmes|Mlle|Mlles|Dr|Me|Mgr)\x20([A-Z])/, '$1\u00a0$2'),
  ]),
  group('ordinal', [
    rule('greaterThan10', /(\d{2,})emes\b/, '$1èmes'),
    rule('firstFemalePlural', /(\d{1})[èe]res\b/, '$1res'),
    rule('lowerThan10', /((^|[^\d])\d)[èe]mes\b/, '$1es'),
    rule('firstFemale', /(\d)[èe]re\b/, '$1re'),
    rule('firstMale', /(\d)[èe]me(?!s)\b/, '$1e'),
  ]),
  group('datetime', [
    rule('daysAndMonths', /(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche|Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Aout|Septembre|Octobre|Novembre|Décembre)/, (s) => {
      return s.toLowerCase();
    }),
  ]),
  group('ligatures', [
    rule('lowerOe', /oe/, '\u0153'),
    rule('upperOe', /O[eE]/, '\u0152'),
    rule('lowerAe', /ae/, '\u00e6'),
    rule('upperAe', /A[eE]/, '\u00c6'),
  ]),
]);

export default frFR;

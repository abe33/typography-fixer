import {rule, group} from '../typography-fixer';
import {vulgarFractions} from '../constants';

/**
 * A ruleset to replace vulgar fractions with their corresponding unicode
 * character.
 *
 * The following fractions are supported: `½`, `↉`, `⅓`, `⅔`, `¼`, `¾`, `⅕`,
 * `⅖`, `⅗`, `⅘`, `⅙`, `⅚`, `⅐`, `⅛`, `⅜`, `⅝`, `⅞`, `⅑` and `⅒`.
 *
 * @type {Array<Object>}
 */
const fractions = group('fractions', vulgarFractions.map(([a, b, char]) => {
  return rule(`${a}On${b}`, `\\b${a}\\s*/\\s*${b}\\b`, char);
}));

export default fractions;

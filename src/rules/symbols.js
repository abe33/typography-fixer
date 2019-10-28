import {rule, group} from '../typography-fixer';

/**
 * A ruleset to replace common miswritten symbols.
 *
 * It includes rules for:
 *
 * - Replacing `(c)` or `(C)` with `©`
 * - Replacing `(r)` or `(R)` with `®`
 * - Replacing `TM` with `™`
 *
 * @type {Array<Object>}
 */
const symbols = group('symbols', [
  rule('copyright', /\([cC]\)/, '©'),
  rule('trademark', /\bTM\b/, '™'),
  rule('registered', /\([rR]\)/, '®'),
]);

export default symbols;

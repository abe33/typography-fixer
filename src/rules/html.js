import {rule, group} from '../typography-fixer';

/**
 * A common ruleset for HTML typographic enhancement.
 *
 * It includes rules for:
 *
 * - Wrapping double quotes in quotation marks in a span with the `dquo` class
 * - Wrapping ampersand in a span with the `amp` class
 * - Wrapping many consecutive capitals in a span with the `caps` class
 *
 * @type {Array<Object>}
 */
const html = group('common', [
  rule('quotes', /(\u00ab|\u00bb|\u201c|\u201d)/, '<span class="dquo">$1</span>'),
  rule('ampersand', /(&amp;|&)($|\s)/, '<span class="amp">$1</span>$2'),
  rule('caps', /(([A-Z]\.?){2,})/, '<span class="caps">$1</span>'),
]);

export default html;

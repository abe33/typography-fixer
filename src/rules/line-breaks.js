import {rule, group} from '../typography-fixer'

/**
 * A generic ruleset to improve line breaks.
 *
 * It includes rules for:
 *
 * - Adding a non-breaking space between a number and the word that follow
 * - Adding a non-breaking space after short words of three characters or less
 * - Adding a non-breaking space between the two last words of a paragraph
 *
 * @type {Array<Object>}
 */
const lineBreaks = group('line-breaks', [
  rule('numberBeforeWord', /(\d)\x20(\D)/, '$1\u00a0$2'),
  rule('shortWords', /\b(\w{1,3})\x20/, '$1\u00a0'),
  rule('lastParagraphWords', /(\w+)\x20(\w+\.)$/m, '$1\u00a0$2')
])

export default lineBreaks

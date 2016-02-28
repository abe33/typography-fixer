import {ignore, group} from '../typography-fixer'

/**
 * A set of rules to ignore some html blocks.
 *
 * The following set includes rules to ignore:
 *
 * - All tags definition
 * - Content of `pre`, `kbd`, `code`, `style`, `script` and `textarea` tags
 *
 * @type {Array<Object>}
 */
const htmlIgnores = group('html', [
  ignore('tag', /<[^>]+>/),
  ignore('plainTextTagContent', /<(pre|kbd|code|style|script|textarea)[^>]*>.*?<\/\1>/)
])

export default htmlIgnores

import {ignore, group} from '../typography-fixer'

let htmlIgnores

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
export default htmlIgnores = createIgnoreset()

function createIgnoreset () {
  return group('html', [
    ignore('tag', /<[^>]+>/),
    ignore('plainTextTagContent', /<(pre|kbd|code|style|script|textarea)[^>]*>.*?<\/\1>/)
  ])
}

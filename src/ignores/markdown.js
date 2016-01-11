import {ignore, group} from '../typography-fixer'

let markdown

/**
 * A set of rules to ignore some markdown blocks.
 *
 * The following set includes rules to ignore:
 *
 * - Images and links url and title
 * - Inline code blocks defined with a single backtick
 * - Code blocks defined with three backticks
 * - Preformatted block using a four spaces indent
 *
 * @type {Array<Object>}
 */
export default markdown = createIgnoreset()

function createIgnoreset () {
  return group('markdown', [
    ignore('imageAndLinkStart', /!?\[/),
    ignore('imageAndLinkEnd', /\]\([^\)]+\)/),
    ignore('imageAndLinkWithExternalDefinitionEnd', /\]\s*\[[^\]]*\]/),
    ignore('linkDefinition', /\[[^\]]+\]:.*$/m),
    ignore('codeBlock', /(```)(.|\n)*?\1/),
    ignore('preformattedBlock', /^\x20{4}.*$/m),
    ignore('codeInline', /(`{1,2}).*?\1/),
    ignore('url', /\b((?:[a-zA-Z][\w-]+:(?:\/{1,3}|[a-zA-Z0-9%])|www\d{0,3}[.]|[a-zA-Z0-9.\-]+[.][a-zA-Z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/)
  ])
}

import {ignore, group} from '../typography-fixer';

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
const markdownIgnores = group('markdown', [
  ignore('imageAndLinkStart', /!?\[/),
  ignore('imageAndLinkEnd', /\]\([^\)]+\)/),
  ignore('imageAndLinkWithExternalDefinitionEnd', /\]\s*\[[^\]]*\]/),
  ignore('linkDefinition', /\[[^\]]+\]:.*$/m),
  ignore('codeBlock', /(```)(.|\n)*?\1/),
  ignore('preformattedBlock', /^\x20{4}.*$/m),
  ignore('codeInline', /(`{1,2}).*?\1/),
  ignore('url', new RegExp(`
    \\b
    (
      (?:                     # In the context of markdown
        [a-zA-Z][\\w-]+:      # a link is whatever starts
        (?:                   # with a scheme (http/mailto)
          \\/{1,3}|           # and contains whatever is not
          [a-zA-Z0-9%]        # a link terminator:
        )|                    # - a space
        www\\d{0,3}[.]|       # - a closing parenthesis
        [a-zA-Z0-9.\\-]+[.]   # - a closing angle bracket
        [a-zA-Z]{2,4}\\/      # - any non-valid link character
      )
      (?:
        [^\\s()<>]+|
        \\((
          [^\\s()<>]+|
          (\\([^\\s()<>]+\\))
        )*\\)
      )+
      (?:\\(
        ([^\\s()<>]+|
          (\\([^\\s()<>]+\\))
        )*\\)|
        [^\\s\`!()\\[\\]{};:'".,<>?«»“”‘’]
      )
    )
  `, 'x')),
]);

export default markdownIgnores;

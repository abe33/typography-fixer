import {ignore, group} from '../typography-fixer'

export default group('markdown', [
  ignore('imageAndLinkStart', /!?\[/),
  ignore('imageAndLinkEnd', /\]\([^\)]+\)/),
  ignore('imageAndLinkWithExternalDefinitionEnd', /\]\s*\[[^\]]*\]/),
  ignore('linkDefinition', /\[[^\]]+\]:.*$/m),
  ignore('codeBlock', /(```)(.|\n)*?\1/),
  ignore('preformattedBlock', /^\x20{4}.*$/m),
  ignore('codeInline', /(`{1,2}).*?\1/),
  ignore('url', /\b((?:[a-zA-Z][\w-]+:(?:\/{1,3}|[a-zA-Z0-9%])|www\d{0,3}[.]|[a-zA-Z0-9.\-]+[.][a-zA-Z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/)
])

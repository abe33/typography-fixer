import {ignore, group} from '../typographic-fixer'

export default group('markdown', [
  ignore('imageAndLink', /!?\[[^\]]+\]\([^\)]+\)/),
  ignore('imageAndLinkWithExternalDefinition', /!?\[[^\]]+\]\s*\[[^\]]*\]/),
  ignore('linkDefinition', /\[[^\]]+\]:.*$/),
  ignore('codeBlock', /(```)(.|\n)*?\1/),
  ignore('codeInline', /(`{1,2}).*?\1/),
  ignore('url', /\b((?:[a-zA-Z][\w-]+:(?:\/{1,3}|[a-zA-Z0-9%])|www\d{0,3}[.]|[a-zA-Z0-9.\-]+[.][a-zA-Z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/)
])
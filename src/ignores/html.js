import {ignore, group} from '../typography-fixer'

export default group('html', [
  ignore('tag', /<[^>]+>/),
  ignore('plainTextTagContent', /<(pre|kbd|code|style|script|textarea)[^>]*>.*?<\/\1>/)
])

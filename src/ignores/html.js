import {ignore, group} from '../typography-fixer'

let ignoreset

export default ignoreset = createIgnoreset()

function createIgnoreset () {
  return group('html', [
    ignore('tag', /<[^>]+>/),
    ignore('plainTextTagContent', /<(pre|kbd|code|style|script|textarea)[^>]*>.*?<\/\1>/)
  ])
}

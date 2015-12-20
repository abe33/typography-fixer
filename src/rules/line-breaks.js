import {rule, group} from '../typographic-fixer'

export default group('line-breaks', [
  rule('numberBeforeWord', /(\d)\x20(\D)/, '$1\u00a0$2'),
  rule('shortWords', /\b(\w{1,3})\x20/, '$1\u00a0')
])

import {rule, group} from '../typography-fixer'
import {currenciesRegExp} from '../constants'

export default group([
  rule('nonBreakingSpaceBeforePunctuation', /(\S)(?:\x20)?([?!])/, '$1\u202F$2'),
  rule('nonBreakingSpaceAfterPunctuation', /([¿¡])\x20*(\S)/, '$1\u202F$2'),
])

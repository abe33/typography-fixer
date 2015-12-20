import {rule, group} from '../typographic-fixer'

export default group('mathematic', [
  rule('multiplication', /(\d)\s*x\s*(\d)/, '$1\u00a0\u00D7\u00a0$2'),
  rule('division', /(\d)\s*\/\s*(\d)/, '$1\u00a0÷\u00a0$2')
])

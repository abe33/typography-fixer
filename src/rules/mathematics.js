import {rule, group} from '../typographic-fixer'
import {fractions} from '../constants'

export default group('mathematic', [
  group('vulgarFractions', fractions.map(([a,b,char]) => {
    return rule(`${a}On${b}`, `\\b${a}\\s*/\\s*${b}\\b`, char)
  })),
  rule('multiplication', /(\d)\s*x\s*(\d)/, '$1\u00a0\u00d7\u00a0$2'),
  rule('division', /(\d)\s*\/\s*(\d)/, '$1\u00a0\u00f7\u00a0$2'),
  rule('subtraction', /(\d)\s*-\s*(\d)/, '$1\u00a0\u2212\u00a0$2'),
  rule('addition', /(\d)\s*\+\s*(\d)/, '$1\u00a0+\u00a0$2')
])

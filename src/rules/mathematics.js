import {rule, group} from '../typographic-fixer'

export default group('mathematic', [
  rule('vulgarFractionOneQuarter', /\b1\s*\/\s*4\b/, '\u00bc'),
  rule('vulgarFractionOneHalf', /\b1\s*\/\s*2\b/, '\u00bd'),
  rule('vulgarFractionThreeQuarter', /\b3\s*\/\s*4\b/, '\u00be'),
  rule('multiplication', /(\d)\s*x\s*(\d)/, '$1\u00a0\u00d7\u00a0$2'),
  rule('division', /(\d)\s*\/\s*(\d)/, '$1\u00a0\u00f7\u00a0$2'),
  rule('subtraction', /(\d)\s*-\s*(\d)/, '$1\u00a0\u2212\u00a0$2')
])

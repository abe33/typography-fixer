import {rule, group} from '../typography-fixer'

export default group('ligatures', [
  rule('ij', /ij/, '\u0133'),
  rule('IJ', /IJ/, '\u0132'),
  rule('ffi', /ffi/, '\ufb03'),
  rule('ffl', /ffl/, '\ufb04'),
  rule('ff', /ff/, '\ufb00'),
  rule('fi', /fi/, '\ufb01'),
  rule('fl', /fl/, '\ufb02'),
  rule('ft', /ft/, '\ufb05'),
  rule('st', /st/, '\ufb06'),
])

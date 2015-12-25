import {rule, group} from '../typography-fixer'

export default group('ligatures', [
  rule('ffi', /ffi/, '\ufb03'),
  rule('ffl', /ffl/, '\ufb04'),
  rule('ff', /ff/, '\ufb00'),
  rule('fi', /fi/, '\ufb01'),
  rule('fl', /fl/, '\ufb02'),
  rule('ft', /ft/, '\ufb05'),
  rule('st', /st/, '\ufb06'),
])

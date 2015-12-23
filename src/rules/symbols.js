import {rule, group} from '../typography-fixer'

export default group('symbols', [
  rule('copyright', /\([cC]\)/, '©'),
  rule('trademark', /\bTM\b/, '™'),
  rule('registered', /\([rR]\)/, '®')
])

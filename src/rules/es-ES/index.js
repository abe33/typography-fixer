import {rule, group} from '../../typography-fixer'
import {currenciesRegExp} from '../../constants'
import fractions from '../fractions'
import symbols from '../symbols'
import units from '../units'

let ruleset

export default ruleset = createRuleset().concat(fractions).concat(units).concat(symbols)

function createRuleset () {
  return group('es-ES', [
    group('quotes', [
      rule('singleQuote', /(\w)'(\w)/, '$1\u2019$2'),
      rule('doubleQuote', /"([^"]+)"/, '\u00ab$1\u00bb')
    ]),
    group('spaces', [
      rule('nonBreakingSpaceBeforePunctuation', /(\S)(?:\x20)?([?!])/, '$1\u202F$2'),
      rule('nonBreakingSpaceAfterPunctuation', /([¿¡])\x20*(\S)/, '$1\u202F$2'),
      rule('noSpaceBeforePunctuation', /\s+(\.|,|;|:|%|\)|\u2019|\u2026|\u2030|\u2031)/, '$1'),
      rule('noSpaceAfterPunctuation', /(\u2019|\()\s+/, '$1'),
      rule('noSpaceAroundEnDashBetweenNumbers', /(\d)\s*\u2013\s*(\d)/, '$1\u2013$2'),
      rule('spaceAroundEnDash', /([^\d\s])\x20*(\u2013)\x20*(\D)/, '$1\u00a0$2 $3'),
      rule('spaceAfterPunctuation', /(\.|;|!|\?|%|\u2026|\u2030|\u2031)([^\s\)])/, '$1 $2'),
      rule('spaceAfterColon', /(\D\s?)(:)([^\s\)])/, '$1$2 $3'),
      rule('spaceAfterComma', /(\D)(,)([^\s\)])/, '$1$2 $3'),
      rule('spaceAfterLeftQuote', /(\u00ab)\x20*(\S)/, '$1\u202F$2'),
      rule('spaceBeforeRightQuote', /(\S)\x20*(\u00bb)/, '$1\u202F$2'),
      rule('spaceAfterParenthesis', /(\))(\w)/, '$1 $2'),
      rule('spaceBeforeParenthesis', /(\S)(\()/, '$1 $2'),
      rule('spaceBeforeCurrency', `(\\d)\x20?([${currenciesRegExp}])`, '$1\u00a0$2'),
    ])
  ])

}

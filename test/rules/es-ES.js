import expect from 'expect.js'
import {currencies} from '../../src/constants'
import {fix, check} from '../../src/typography-fixer'
import rules from '../../src/rules/es-ES'

describe('es-ES rules', () => {
  describe('punctuations', () => {
    it('adds thin non-breaking spaces in questions', ()   => {
      expect(fix(rules, '¿Como te llamo?')).to.eql('¿\u202fComo te llamo\u202f?')
    })

    it('adds thin non-breaking spaces in exclamations', ()   => {
      expect(fix(rules, '¡Madre de dios!')).to.eql('¡\u202fMadre de dios\u202f!')
    })
  })
})

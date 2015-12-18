import expect from 'expect.js'
import {fix} from '../src/typographic-fixer'
import rules from '../src/fr-FR'

describe('fr-FR rules', () => {
  describe('spaces', () => {
    it('replaces consecutive spaces with a single space', () => {
      expect(fix(rules, 'Un    jour')).to.eql('Un jour')
    })

    it('replaces non-breaking spaces with the corresponding html entity', () => {
      expect(fix(rules, '17\u00a0%')).to.eql('17&nbsp;%')
    })

    let charsWithNbspBefore = ['!','?',';',':','%']
    charsWithNbspBefore.forEach((char) => {
      it(`replaces a simple space before ${char} with a non-breaking one`, () => {
        expect(fix(rules, `Foo ${char}`)).to.eql(`Foo&nbsp;${char}`)
      })
      it(`adds a non-breaking before ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}`)).to.eql(`Foo&nbsp;${char}`)
      })
    })
  })

  })
})

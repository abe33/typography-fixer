import expect from 'expect.js'
import {currencies} from '../../src/constants'
import {fix} from '../../src/typographic-fixer'
import rules from '../../src/rules/en-UK'

describe('en-UK rules', () => {
  describe('spaces', () => {
    it('replaces consecutive spaces with a single space', () => {
      expect(fix(rules, 'One    day')).to.eql('One day')
    })

    let charsWithNoSpaceBefore = [',', '.', '\u2026', '!', '?', ';', ':', '%']
    charsWithNoSpaceBefore.forEach((char) => {
      it(`removes space before ${char}`, () => {
        expect(fix(rules, `Foo ${char}`)).to.eql(`Foo${char}`)
        expect(fix(rules, `Foo  ${char}`)).to.eql(`Foo${char}`)
      })
      it(`removes a non-breaking space before ${char}`, () => {
        expect(fix(rules, `Foo\u00a0${char}`)).to.eql(`Foo${char}`)
        expect(fix(rules, `Foo\u00a0\u00a0${char}`)).to.eql(`Foo${char}`)
      })
    })

    let charsWithSpaceAfter = [',', '.', '\u2026', '!', '?', ';', ':', '%']
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`)).to.eql(`Foo${char} bar`)
      })
    })

    it('removes spaces around em dashes', () => {
      expect(fix(rules, 'foo \u2014 bar')).to.eql('foo\u2014bar')
    })
  })

  describe('punctuations', () => {
    let etcTests = [
      ['Etc...', 'Etc.'],
      ['Etc\u2026', 'Etc.'],
      ['etc...', 'etc.'],
      ['etc\u2026', 'etc.'],
    ]
    etcTests.forEach(([source, expected]) => {
      it(`replaces ${source} by ${expected}`, () => {
        expect(fix(rules, source)).to.eql(expected)
      })
    })

    it('replaces two or more ! with a single !', () => {
      expect(fix(rules, 'Foo!!')).to.eql('Foo!')
      expect(fix(rules, 'Foo!!!')).to.eql('Foo!')
      expect(fix(rules, 'Foo!!!!')).to.eql('Foo!')
    })

    it('replaces two or more ? with a single ?', () => {
      expect(fix(rules, 'Foo??')).to.eql('Foo?')
      expect(fix(rules, 'Foo???')).to.eql('Foo?')
      expect(fix(rules, 'Foo????')).to.eql('Foo?')
    })

    it('replaces triple dots with a proper ellipsis', () => {
      expect(fix(rules, 'Foo...')).to.eql('Foo\u2026')
    })
  })

  describe('quotes', () => {
    it('replaces double quotes around a sentence by quotation marks', () => {
      expect(fix(rules, 'in "Moby Dick"')).to.eql('in \u201cMoby Dick\u201d')
    })

    it('removes spaces inside quotation marks', () => {
      expect(fix(rules, 'in " Moby Dick "')).to.eql('in \u201cMoby Dick\u201d')
    })

    it('moves punctuation after a quotation mark inside it', () => {
      expect(fix(rules, 'in "Moby Dick".')).to.eql('in \u201cMoby Dick.\u201d')
      expect(fix(rules, 'in "Moby Dick",')).to.eql('in \u201cMoby Dick,\u201d')
    })
  })
})

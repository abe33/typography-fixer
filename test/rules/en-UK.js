import expect from 'expect.js'
import {currencies} from '../../src/constants'
import {fix} from '../../src/typography-fixer'
import rules from '../../src/rules/en-UK'

describe('en-UK rules', () => {
  describe('spaces', () => {
    it('replaces consecutive spaces with a single space', () => {
      expect(fix(rules, 'One    day')).to.eql('One day')
    })

    let charsWithSpaceAfter = [',', '.', '\u2026', '!', '?', ';', ':', '%']
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`)).to.eql(`Foo${char} bar`)
      })
    })

    let charsWithNoSpaceBefore = [',', '.', '\u2026', '!', '?', ';', ':', '%', '\u2019', ')']
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

    let charsWithNoSpaceAfter = ['\u2019', '(']
    charsWithNoSpaceAfter.forEach((char) => {
      it(`removes spaces after ${char}`, () => {
        expect(fix(rules, `foo ${char} bar`).indexOf(`${char}bar`)).not.to.be(-1)
        expect(fix(rules, `foo  ${char} bar`).indexOf(`${char}bar`)).not.to.be(-1)
      })

      it(`removes a non-breaking space after ${char}`, () => {
        expect(fix(rules, `foo ${char}\u00a0bar`).indexOf(`${char}bar`)).not.to.be(-1)
        expect(fix(rules, `foo ${char}\u00a0\u00a0bar`).indexOf(`${char}bar`)).not.to.be(-1)

        expect(fix(rules, `foo ${char}\u202Fbar`).indexOf(`${char}bar`)).not.to.be(-1)
        expect(fix(rules, `foo ${char}\u202F\u202Fbar`).indexOf(`${char}bar`)).not.to.be(-1)
      })
    })

    it('adds a space after a ) if the following char is not a punctuation', () => {
      expect(fix(rules, 'foo (bar)foo')).to.eql('foo (bar) foo')
      expect(fix(rules, 'foo (bar). foo')).to.eql('foo (bar). foo')
    })

    it('removes spaces around em dashes', () => {
      expect(fix(rules, 'foo \u2014 bar')).to.eql('foo\u2014bar')
    })

    it('adds spaces around en dashes between words', () => {
      expect(fix(rules, 'foo\u2013bar')).to.eql('foo\u00a0\u2013 bar')
    })

    it('removes spaces around en dashes between numbers', () => {
      expect(fix(rules, '1000 \u2013 1500')).to.eql('1000\u20131500')
    })

    it('removes spaces inside quotation marks', () => {
      expect(fix(rules, 'in \u201c Moby Dick \u201d')).to.eql('in \u201cMoby Dick\u201d')
    })

    it('does not add a space after a period used in a floating number', () => {
      expect(fix(rules, 'as.30. 37.5')).to.eql('as. 30. 37.5')
    })

    it('does not add spaces before and after a colon between two numbers', () => {
      expect(fix(rules, 'bar:12:21:56')).to.eql('bar: 12:21:56')
    })

    it('adds a non-breaking space after an honorific followed by a name', () => {
      expect(fix(rules, 'Mr Smith')).to.eql('Mr\u00a0Smith')
      expect(fix(rules, 'Ms Smith')).to.eql('Ms\u00a0Smith')
      expect(fix(rules, 'Miss Smith')).to.eql('Miss\u00a0Smith')

      expect(fix(rules, 'Mr is served')).to.eql('Mr is served')
      expect(fix(rules, 'Ms is served')).to.eql('Ms is served')
      expect(fix(rules, 'Miss is served')).to.eql('Miss is served')
    })

    it('removes a space after currency', () => {
      Object.keys(currencies).forEach((char) => {
        expect(fix(rules, `${char} 10`)).to.eql(`${char}10`)
      })
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

    it('replaces hyphen in sentences with dashes', () => {
      expect(fix(rules, '- foo - bar - foo-bar')).to.eql('- foo\u00a0\u2013 bar\u00a0\u2013 foo-bar')
    })

    it('replaces hyphen between numbers with dashes', () => {
      expect(fix(rules, '1000-1500')).to.eql('1000\u20131500')
    })
  })

  describe('quotes', () => {
    it('replaces single quotes with typographic ones', () => {
      expect(fix(rules, "Don't")).to.eql('Don\u2019t')
    })

    it('replaces double quotes around a sentence by quotation marks', () => {
      expect(fix(rules, 'in "Moby Dick"')).to.eql('in \u201cMoby Dick\u201d')
    })

    it('moves punctuation after a quotation mark inside it', () => {
      expect(fix(rules, 'in "Moby Dick".')).to.eql('in \u201cMoby Dick.\u201d')
      expect(fix(rules, 'in "Moby Dick",')).to.eql('in \u201cMoby Dick,\u201d')
    })

    it('replaces quotes by primes when placed after numbers', () => {
      expect(fix(rules, "She's 5'6\" tall")).to.eql('She\u2019s 5\u20326\u2033 tall')
      expect(fix(rules, "a 9\" nail")).to.eql('a 9\u2033 nail')
      expect(fix(rules, "I Was Crushed By A 40' Man")).to.eql('I Was Crushed By A 40\u2032 Man')
    })
  })
})

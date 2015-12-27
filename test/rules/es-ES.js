import expect from 'expect.js'
import {currencies} from '../../src/constants'
import {fix, check} from '../../src/typography-fixer'
import rules from '../../src/rules/es-ES'

describe('es-ES rules', () => {
  describe('spaces', () => {
    let charsWithSpaceAfter = [',', '.', '\u2026', ';', ':', '%']
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`)).to.eql(`Foo${char} bar`)

        expect(check(rules, `Foo${char}bar`)).to.have.length(1)
        expect(check(rules, `Foo${char} bar`)).to.be(undefined)
      })
    })

    let charsWithNoSpaceBefore = [',', '.', '\u2026', ';', ':', '%', '\u2019', ')']
    charsWithNoSpaceBefore.forEach((char) => {
      it(`removes space before ${char}`, () => {
        expect(fix(rules, `Foo ${char}`)).to.eql(`Foo${char}`)
        expect(fix(rules, `Foo  ${char}`)).to.eql(`Foo${char}`)
      })

      it(`removes a non-breaking space before ${char}`, () => {
        expect(fix(rules, `Foo\u00a0${char}`)).to.eql(`Foo${char}`)
        expect(fix(rules, `Foo\u00a0\u00a0${char}`)).to.eql(`Foo${char}`)
      })

      it(`checks only when there is a space before ${char}`, () => {
        expect(check(rules, `Foo ${char}`)).to.have.length(1)
        expect(check(rules, `Foo\u00a0${char}`)).to.have.length(1)
        expect(check(rules, `Foo${char}`)).to.be(undefined)
      })
    })

    let charsWithNoSpaceAfter = ['\u2019', '(']
    charsWithNoSpaceAfter.forEach((char) => {
      it(`removes spaces after ${char}`, () => {
        expect(fix(rules, `${char} bar`)).to.eql(`${char}bar`)
        expect(fix(rules, `${char}  bar`)).to.eql(`${char}bar`)
      })

      it(`removes a non-breaking space after ${char}`, () => {
        expect(fix(rules, `${char}\u00a0bar`)).to.eql(`${char}bar`)
        expect(fix(rules, `${char}\u00a0\u00a0bar`)).to.eql(`${char}bar`)

        expect(fix(rules, `${char}\u202Fbar`)).to.eql(`${char}bar`)
        expect(fix(rules, `${char}\u202F\u202Fbar`)).to.eql(`${char}bar`)
      })

      it(`checks only when there is a space after ${char}`, () => {
        expect(check(rules, `${char} bar`)).to.have.length(1)
        expect(check(rules, `${char}\u00a0bar`)).to.have.length(1)
        expect(check(rules, `${char}bar`)).to.be(undefined)
      })
    })

    Object.keys(currencies).forEach((char) => {
      it(`replaces a simple space before ${char} a non-breaking one`, () => {
        expect(fix(rules, `10 ${char}`)).to.eql(`10\u00a0${char}`)
      })

      it(`adds a non-breaking space before ${char} if there is no space`, () => {
        expect(fix(rules, `10${char}`)).to.eql(`10\u00a0${char}`)
      })

      it(`checks only if when there no space or a simple space before ${char}`, () => {
        expect(check(rules, `10${char}`)).to.have.length(1)
        expect(check(rules, `10 ${char}`)).to.have.length(1)
        expect(check(rules, `10\u00a0${char}`)).to.be(undefined)
      })
    })

    it('adds thin non-breaking spaces in questions', ()   => {
      expect(fix(rules, '¿Como te llamo?')).to.eql('¿\u202fComo te llamo\u202f?')

      expect(check(rules, '¿Como te llamo?')).to.have.length(2)
      expect(check(rules, '¿\u202fComo te llamo\u202f?')).to.be(undefined)
    })

    it('adds thin non-breaking spaces in exclamations', ()   => {
      expect(fix(rules, '¡Madre de dios!')).to.eql('¡\u202fMadre de dios\u202f!')

      expect(check(rules, '¡Madre de dios!')).to.have.length(2)
      expect(check(rules, '¡\u202fMadre de dios\u202f!')).to.be(undefined)
    })

    it('adds a space after a ) if the following char is not a punctuation', () => {
      expect(fix(rules, 'foo (bar)foo')).to.eql('foo (bar) foo')
      expect(fix(rules, 'foo (bar). foo')).to.eql('foo (bar). foo')

      expect(check(rules, 'foo (bar)foo')).to.have.length(1)
      expect(check(rules, 'foo (bar). foo')).to.be(undefined)
      expect(check(rules, 'foo (bar) foo')).to.be(undefined)
    })

    it('does not add spaces before and after a colon between two numbers', () => {
      expect(fix(rules, 'bar:12:21:56')).to.eql('bar: 12:21:56')

      expect(check(rules, 'bar:12:21:56')).to.have.length(1)
      expect(check(rules, 'bar: 12:21:56')).to.be(undefined)
    })

    it('adds spaces around en dashes between words', () => {
      expect(fix(rules, 'foo\u2013bar')).to.eql('foo\u00a0\u2013 bar')
      expect(fix(rules, 'foo \u2013bar')).to.eql('foo\u00a0\u2013 bar')
      expect(fix(rules, 'foo\u2013 bar')).to.eql('foo\u00a0\u2013 bar')

      expect(check(rules, 'foo\u2013bar')).to.have.length(1)
      expect(check(rules, 'foo\u00a0\u2013 bar')).to.be(undefined)
    })

    it('removes spaces around en dashes between numbers', () => {
      expect(fix(rules, '1000 \u2013 1500')).to.eql('1000\u20131500')

      expect(check(rules, '1000 \u2013 1500')).to.have.length(1)
      expect(check(rules, '1000\u20131500')).to.be(undefined)
    })

    it('does not add a space after a comma used in a floating number', () => {
      expect(fix(rules, 'as,30, 37,5')).to.eql('as, 30, 37,5')

      expect(check(rules, 'as,30, 37,5')).to.have.length(1)
    })
  })

  describe('quotes', () => {
    it('replaces single quotes with typographic ones', () => {
      expect(fix(rules, "qu'es el morir")).to.eql('qu\u2019es el morir')
    })

    it('replaces double quotes around a sentence by typographic quotes', () => {
      expect(fix(rules, 'Él me dijo, "Estoy muy feliz".')).to.eql('Él me dijo, \u00ab\u202FEstoy muy feliz\u202F\u00bb.')
      expect(fix(rules, 'Él me dijo, " Estoy muy feliz ".')).to.eql('Él me dijo, \u00ab\u202FEstoy muy feliz\u202F\u00bb.')
    })
  })
})

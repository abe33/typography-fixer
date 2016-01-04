import expect from 'expect.js'
import {currencies} from '../../../src/constants'
import {fix, check} from '../../../src/typography-fixer'
import rules from '../../../src/rules/en-UK'

describe('en-UK ruleset', () => {
  it('includes fraction rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('fractions') >= 0
    })).to.be(true)
  })

  it('includes unit rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('units') >= 0
    })).to.be(true)
  })

  it('includes symbol rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('symbols') >= 0
    })).to.be(true)
  })

  describe('spaces', () => {
    it('replaces consecutive spaces with a single space', () => {
      expect(fix(rules, 'One    day')).to.eql('One day')

      expect(check(rules, 'One    day')).to.have.length(1)
      expect(check(rules, 'One day')).to.be(undefined)
    })

    let charsWithSpaceAfter = [',', '.', '\u2026', '!', '?', ';', ':', '%', '\u2030', '\u2031']
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`)).to.eql(`Foo${char} bar`)

        expect(check(rules, `Foo${char}bar`)).to.have.length(1)
        expect(check(rules, `Foo${char} bar`)).to.be(undefined)
      })

      it(`does not add a space after ${char} if followed by a )`, () => {
        expect(fix(rules, `(Foo${char})`)).to.eql(`(Foo${char})`)

        expect(check(rules, `(Foo${char})`)).to.be(undefined)
      })
    })

    let charsWithNoSpaceBefore = [',', '.', '\u2026', '!', '?', ';', ':', '%', ')', '\u2019', '\u2030', '\u2031']
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

    it('adds a space after a ) if the following char is not a punctuation', () => {
      expect(fix(rules, 'foo (bar)foo')).to.eql('foo (bar) foo')
      expect(fix(rules, 'foo (bar). foo')).to.eql('foo (bar). foo')

      expect(check(rules, 'foo (bar)foo')).to.have.length(1)
      expect(check(rules, 'foo (bar). foo')).to.be(undefined)
      expect(check(rules, 'foo (bar) foo')).to.be(undefined)
    })

    it('removes spaces around em dashes', () => {
      expect(fix(rules, 'foo \u2014 bar')).to.eql('foo\u2014bar')
      expect(fix(rules, 'foo\u2014 bar')).to.eql('foo\u2014bar')
      expect(fix(rules, 'foo \u2014bar')).to.eql('foo\u2014bar')

      expect(check(rules, 'foo \u2014 bar')).to.have.length(1)
      expect(check(rules, 'foo\u2014bar')).to.be(undefined)
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

    it('removes spaces inside quotation marks', () => {
      expect(fix(rules, 'in \u201c Moby Dick \u201d')).to.eql('in \u201cMoby Dick\u201d')

      expect(check(rules, 'in \u201c Moby Dick \u201d')).to.have.length(2)
      expect(check(rules, 'in \u201cMoby Dick\u201d')).to.be(undefined)
    })

    it('does not add a space after a period used in a floating number', () => {
      expect(fix(rules, 'as.30. 37.5')).to.eql('as. 30. 37.5')

      expect(check(rules, 'as.30. 37.5')).to.have.length(1)
      expect(check(rules, 'as. 30. 37.5')).to.be(undefined)
    })

    it('does not add spaces before and after a colon between two numbers', () => {
      expect(fix(rules, 'bar:12:21:56')).to.eql('bar: 12:21:56')

      expect(check(rules, 'bar:12:21:56')).to.have.length(1)
      expect(check(rules, 'bar: 12:21:56')).to.be(undefined)
    })

    let honorifics = ['Mr', 'Mrs', 'Ms', 'Miss', 'Sir', 'Lady']
    honorifics.forEach((honorific) => {
      it(`adds a non-breaking space after ${honorific} followed by a name`, () => {
        expect(fix(rules, `${honorific} Smith`)).to.eql(`${honorific}\u00a0Smith`)

        expect(fix(rules, `${honorific} is served`)).to.eql(`${honorific} is served`)
      })

      it(`checks only when ${honorific} has a simple space and is followed by a name`, () => {
        expect(check(rules, `${honorific} Smith`)).to.have.length(1)

        expect(check(rules, `${honorific}\00a0Smith`)).to.be(undefined)
        expect(check(rules, `${honorific} is served`)).to.be(undefined)
      })
    })

    Object.keys(currencies).forEach((char) => {
      it(`removes a space after ${char}`, () => {
        expect(fix(rules, `${char} 10`)).to.eql(`${char}10`)
      })

      it(`checks only when there is a space after ${char}`, () => {
        expect(check(rules, `${char} 10`)).to.have.length(1)

        expect(check(rules, `${char}10`)).to.be(undefined)
      })
    })
  })

  describe('punctuations', () => {
    let etcTests = [
      ['Etc...', 'Etc.'],
      ['Etc\u2026', 'Etc.'],
      ['etc...', 'etc.'],
      ['etc\u2026', 'etc.']
    ]
    etcTests.forEach(([source, expected]) => {
      it(`replaces ${source} by ${expected}`, () => {
        expect(fix(rules, source)).to.eql(expected)
      })
    })

    it('checks etc. only when followed by an ellipsis', () => {
      expect(check(rules, 'etc.')).to.be(undefined)
      expect(check(rules, 'Etc.')).to.be(undefined)
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

    it('checks multiple punctuation chars only if there is two or more chars', () => {
      expect(check(rules, 'Foo!')).to.be(undefined)
      expect(check(rules, 'Foo?')).to.be(undefined)
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

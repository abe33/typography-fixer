import expect from 'expect.js'
import {currencies} from '../../../src/constants'
import {fix, check} from '../../../src/typography-fixer'
import rules from '../../../src/rules/fr-FR'

const fixString = fix(rules)
const checkString = check(rules)

describe('fr-FR ruleset', () => {
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

  describe('spaces', () => {
    it('replaces consecutive spaces with a single space', () => {
      expect(fixString('Un    jour')).to.eql('Un jour')

      expect(checkString('Un    jour')).to.have.length(1)
      expect(checkString('Un jour')).to.be(undefined)
    })

    let charsWithNbspBefore = ['!', '?', ';', ':', '%', '\u2030', '\u2031']
    charsWithNbspBefore.forEach((char) => {
      it(`replaces a simple space before ${char} with a non-breaking one`, () => {
        expect(fixString(`Foo ${char} bar`)).to.eql(`Foo\u202F${char} bar`)
      })

      it(`adds a non-breaking space before ${char} if there is no space`, () => {
        expect(fixString(`Foo${char}bar`)).to.eql(`Foo\u202F${char} bar`)
      })

      it(`checks only when there is simple space or no space before ${char}`, () => {
        expect(checkString(`Foo ${char}`)).to.have.length(1)
        expect(checkString(`Foo${char}`)).to.have.length(1)
        expect(checkString(`Foo\u202F${char}`)).to.be(undefined)
      })
    })

    it('adds a thin breaking space before a : with numbers before and text after', () => {
      expect(fixString('Pour 2016 : pas de prévision')).to.eql('Pour 2016\u202F: pas de prévision')
      expect(fixString('Pour 2016: pas de prévision')).to.eql('Pour 2016\u202F: pas de prévision')

      expect(fixString('Pour 2016 : 50\u202F% de chance')).to.eql('Pour 2016\u202F: 50\u202F% de chance')
      expect(fixString('Pour 2016: 50\u202F% de chance')).to.eql('Pour 2016\u202F: 50\u202F% de chance')
      expect(fixString('Pour 2016 :50\u202F% de chance')).to.eql('Pour 2016\u202F: 50\u202F% de chance')

      expect(fixString('Pour le reste : 50\u202F% de chance')).to.eql('Pour le reste\u202F: 50\u202F% de chance')
      expect(fixString('Pour le reste :50\u202F% de chance')).to.eql('Pour le reste\u202F: 50\u202F% de chance')
    })

    let charsWithSpaceBefore = ['(']
    charsWithSpaceBefore.forEach((char) => {
      it(`adds a space before ${char} if there is no space`, () => {
        expect(fixString(`Foo${char}`)).to.eql(`Foo ${char}`)
      })

      it(`checks only when there is no space before ${char}`, () => {
        expect(checkString(`Foo${char}`)).to.have.length(1)
        expect(checkString(`Foo ${char}`)).to.be(undefined)
      })
    })

    let charsWithSpaceAfter = [',', '.', '\u2026']
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fixString(`Foo${char}bar`)).to.eql(`Foo${char} bar`)
      })

      it(`does not add a space after ${char} if followed by a )`, () => {
        expect(fixString(`(Foo${char})`)).to.eql(`(Foo${char})`)

        expect(checkString(`(Foo${char})`)).to.be(undefined)
      })

      it(`checks only when there is no space after ${char}`, () => {
        expect(checkString(`Foo${char}bar`)).to.have.length(1)
        expect(checkString(`Foo${char} bar`)).to.be(undefined)
      })
    })

    it('does not remove the space after a comma between two numbers', () => {
      expect(fixString('Dans 20, 30 ou 50 ans')).to.eql('Dans 20, 30 ou 50 ans')
    })

    let charsWithSpaceBeforeAndAfter = ['!', '?', ';', ':', '%', '\u2030', '\u2031']
    charsWithSpaceBeforeAndAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fixString(`Foo\u202f${char}bar`)).to.eql(`Foo\u202f${char} bar`)
      })

      it(`does not add a space after ${char} if followed by a )`, () => {
        expect(fixString(`(Foo\u202f${char})`)).to.eql(`(Foo\u202f${char})`)

        expect(checkString(`(Foo\u202f${char})`)).to.be(undefined)
      })

      it(`checks only when there is no space after ${char}`, () => {
        expect(checkString(`Foo\u202f${char}bar`)).to.have.length(1)
        expect(checkString(`Foo\u202f${char} bar`)).to.be(undefined)
      })
    })

    it('adds a space after a ) if the following char is not a punctuation', () => {
      expect(fixString('foo (bar)foo')).to.eql('foo (bar) foo')
      expect(fixString('foo (bar). foo')).to.eql('foo (bar). foo')

      expect(checkString('foo (bar)foo')).to.have.length(1)
      expect(checkString('foo (bar). foo')).to.be(undefined)
      expect(checkString('foo (bar) foo')).to.be(undefined)
    })

    let charsWithNoSpaceBefore = [',', '.', '\)', '\u2026', '\u2019']
    charsWithNoSpaceBefore.forEach((char) => {
      it(`removes space before ${char}`, () => {
        expect(fixString(`Foo ${char}`)).to.eql(`Foo${char}`)
        expect(fixString(`Foo  ${char}`)).to.eql(`Foo${char}`)
      })

      it(`removes a non-breaking space before ${char}`, () => {
        expect(fixString(`Foo\u00a0${char}`)).to.eql(`Foo${char}`)
        expect(fixString(`Foo\u00a0\u00a0${char}`)).to.eql(`Foo${char}`)

        expect(fixString(`Foo\u202F${char}`)).to.eql(`Foo${char}`)
        expect(fixString(`Foo\u202F\u202F${char}`)).to.eql(`Foo${char}`)
      })

      it(`checks only when there is a space before ${char}`, () => {
        expect(checkString(`Foo ${char}`)).to.have.length(1)
        expect(checkString(`Foo\u00a0${char}`)).to.have.length(1)
        expect(checkString(`Foo${char}`)).to.be(undefined)
      })
    })

    it('removes the space before a comma between two numbers if there is a space after the comma', () => {
      expect(fixString('Dans 20 , 30 ou 50 ans')).to.eql('Dans 20, 30 ou 50 ans')
    })

    it('removes spaces after \u2019', () => {
      expect(fixString('foo\u2019 bar')).to.eql('foo\u2019bar')
      expect(fixString('foo\u2019\u00a0bar')).to.eql('foo\u2019bar')
      expect(fixString('foo\u2019\u202Fbar')).to.eql('foo\u2019bar')

      expect(checkString('foo\u2019 bar')).to.have.length(1)
      expect(checkString('foo\u2019bar')).to.be(undefined)
    })

    it('removes spaces after (', () => {
      expect(fixString('foo ( bar')).to.eql('foo (bar')
      expect(fixString('foo (\u00a0bar')).to.eql('foo (bar')
      expect(fixString('foo (\u202Fbar')).to.eql('foo (bar')

      expect(checkString('foo ( bar')).to.have.length(1)
      expect(checkString('foo (bar')).to.be(undefined)
    })

    Object.keys(currencies).forEach((char) => {
      it(`replaces a simple space before ${char} a non-breaking one`, () => {
        expect(fixString(`10 ${char}`)).to.eql(`10\u00a0${char}`)
      })

      it(`adds a non-breaking space before ${char} if there is no space`, () => {
        expect(fixString(`10${char}`)).to.eql(`10\u00a0${char}`)
      })

      it(`checks only if when there no space or a simple space before ${char}`, () => {
        expect(checkString(`10${char}`)).to.have.length(1)
        expect(checkString(`10 ${char}`)).to.have.length(1)
        expect(checkString(`10\u00a0${char}`)).to.be(undefined)
      })
    })

    it('adds spaces inside typographic quotes', () => {
      expect(fixString('Le \u00abChat Botté\u00bb.')).to.eql('Le \u00ab\u202FChat Botté\u202F\u00bb.')

      expect(checkString('Le \u00abChat Botté\u00bb.')).to.have.length(2)
      expect(checkString('Le \u00ab\u202FChat Botté\u202F\u00bb.')).to.be(undefined)
    })

    it('does not add a space after a comma used in a floating number', () => {
      expect(fixString('as,30, 37,5')).to.eql('as, 30, 37,5')

      expect(checkString('as,30, 37,5')).to.have.length(1)
    })

    it('does not add spaces before and after a colon between two numbers', () => {
      expect(fixString('bar:12:21:56')).to.eql('bar\u202F: 12:21:56')

      expect(checkString('bar:12:21:56')).to.have.length(2)
    })

    let honorifics = ['M.', 'MM.', 'Mme', 'Mmes', 'Mlle', 'Mlles', 'Dr', 'Mgr', 'Me']
    honorifics.forEach((honorific) => {
      it(`adds a non-breaking space after ${honorific} followed by a name`, () => {
        expect(fixString(`${honorific} Martin`)).to.eql(`${honorific}\u00a0Martin`)

        expect(fixString(`${honorific} est servi`)).to.eql(`${honorific} est servi`)
      })

      it(`checks only when ${honorific} is followed by a name and separated with a simple space`, () => {
        expect(checkString(`${honorific} Martin`)).to.have.length(1)

        expect(checkString(`${honorific}\u00a0Martin`)).to.be(undefined)
        expect(checkString(`${honorific} est servi`)).to.be(undefined)
      })
    })

    it('adds spaces around en dashes between words', () => {
      expect(fixString('foo\u2013bar')).to.eql('foo\u00a0\u2013 bar')
      expect(fixString('foo \u2013bar')).to.eql('foo\u00a0\u2013 bar')
      expect(fixString('foo\u2013 bar')).to.eql('foo\u00a0\u2013 bar')

      expect(checkString('foo\u2013bar')).to.have.length(1)
      expect(checkString('foo\u00a0\u2013 bar')).to.be(undefined)
    })

    it('removes spaces around en dashes between numbers', () => {
      expect(fixString('1000 \u2013 1500')).to.eql('1000\u20131500')
      expect(fixString('1000\u2013 1500')).to.eql('1000\u20131500')
      expect(fixString('1000 \u20131500')).to.eql('1000\u20131500')

      expect(checkString('1000 \u2013 1500')).to.have.length(1)
      expect(checkString('1000\u20131500')).to.be(undefined)
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
        expect(fixString(source)).to.eql(expected)
      })
    })

    it('checks etc. only when followed by an ellipsis', () => {
      expect(checkString('etc.')).to.be(undefined)
      expect(checkString('Etc.')).to.be(undefined)
    })

    it('replaces two or more ! with a single !', () => {
      expect(fixString('Foo !!')).to.eql('Foo\u202F!')
      expect(fixString('Foo !!!')).to.eql('Foo\u202F!')
      expect(fixString('Foo !!!!')).to.eql('Foo\u202F!')

    })

    it('replaces two or more ? with a single ?', () => {
      expect(fixString('Foo ??')).to.eql('Foo\u202F?')
      expect(fixString('Foo ???')).to.eql('Foo\u202F?')
      expect(fixString('Foo ????')).to.eql('Foo\u202F?')

    })

    it('checks multiple punctuation chars only if there is two or more chars', () => {
      expect(checkString('Foo\u202F!')).to.be(undefined)
      expect(checkString('Foo\u202F?')).to.be(undefined)
    })

    it('replace N° with N\u00ba', () => {
      expect(fixString('N°')).to.eql('N\u00ba')

      expect(checkString('N°')).to.have.length(1)
      expect(checkString('N\u00ba')).to.be(undefined)
    })

    it('replace n° with n\u00ba', () => {
      expect(fixString('n°')).to.eql('n\u00ba')

      expect(checkString('n°')).to.have.length(1)
      expect(checkString('n\u00ba')).to.be(undefined)
    })

    it('replaces triple dots with a proper ellipsis', () => {
      expect(fixString('Foo...')).to.eql('Foo\u2026')
    })

    it('replaces Mr. by M.', () => {
      expect(fixString('Mr.')).to.eql('M.')
    })

    it('replaces Mr by M.', () => {
      expect(fixString('Mr')).to.eql('M.')
    })

    it('replaces a-t\'il by a-t-il', () => {
      expect(fixString('Y a-t\'il')).to.eql('Y a-t-il')
    })

    let cadTests = [
      'cad',
      'c-a-d',
      'c.-a-d.',
      'c.-a-d',
      'c-a-d.',
      'càd',
      'c-à-d',
      'c.-à-d',
      'c-à-d.'
    ]
    cadTests.forEach((form) => {
      it(`replaces ${form} by c.-à-d.`, () => {
        expect(fixString(form)).to.eql('c.-à-d.')
      })
    })

    it('checks c.-à-d. only when an invalid form is found', () => {
      expect(checkString('c.-à-d.')).to.be(undefined)
    })

    it('replaces hyphen in sentences with dashes', () => {
      expect(fixString('- foo - bar - foo-bar')).to.eql('- foo\u00a0\u2013 bar\u00a0\u2013 foo-bar')

      expect(checkString('- foo - foo-bar')).to.have.length(1)
      expect(checkString('- foo\u00a0\u2013 foo-bar')).to.be(undefined)
    })

    it('replaces hyphen between numbers with dashes', () => {
      expect(fixString('1000-1500')).to.eql('1000\u20131500')
    })
  })

  describe('ordinal numbers', () => {
    let ordinalTests = [
      ['1ere', '1re'],
      ['1ère', '1re'],
      ['2eme', '2e'],
      ['2ème', '2e'],
      ['3eme', '3e'],
      ['3ème', '3e'],
      ['10ème', '10e'],
      ['1ères', '1res'],
      ['1eres', '1res'],
      ['2emes', '2es'],
      ['2èmes', '2es'],
      ['10emes', '10èmes']
    ]

    ordinalTests.forEach(([source, expected]) => {
      it(`replaces ${source} by ${expected}`, () => {
        expect(fixString(source)).to.eql(expected)

        expect(checkString(source)).to.have.length(1)
        expect(checkString(expected)).to.be(undefined)
      })
    })
  })

  describe('quotes', () => {
    it('replaces single quotes with typographic ones', () => {
      expect(fixString("L'arbre")).to.eql('L\u2019arbre')
    })

    it('replaces double quotes around a sentence by typographic quotes', () => {
      expect(fixString('Le "Chat Botté".')).to.eql('Le \u00ab\u202FChat Botté\u202F\u00bb.')
      expect(fixString('Le " Chat Botté ".')).to.eql('Le \u00ab\u202FChat Botté\u202F\u00bb.')
    })
  })

  describe('dates and times', () => {
    let daysAndMonths = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

    daysAndMonths.forEach((string) => {
      it(`replaces ${string} with its lower case version`, () => {
        expect(fixString(string)).to.eql(string.toLowerCase())
      })
    })
  })

  describe('ligatures', () => {
    it('replaces oe with \u0153', () => {
      expect(fixString('oeuf')).to.eql('\u0153uf')

      expect(checkString('oeuf')).to.have.length(1)
      expect(checkString('\u0153uf')).to.be(undefined)
    })

    it('replaces Oe with \u0152', () => {
      expect(fixString('Oeuf')).to.eql('\u0152uf')
      expect(fixString('OEuf')).to.eql('\u0152uf')

      expect(checkString('Oeuf')).to.have.length(1)
      expect(checkString('OEuf')).to.have.length(1)
      expect(checkString('\u0152uf')).to.be(undefined)
    })

    it('replaces ae with \u00e6', () => {
      expect(fixString('taenia')).to.eql('t\u00e6nia')

      expect(checkString('taenia')).to.have.length(1)
      expect(checkString('t\u00e6nia')).to.be(undefined)
    })

    it('replaces Ae with \u00c6', () => {
      expect(fixString('TAENIA')).to.eql('T\u00c6NIA')

      expect(checkString('TAENIA')).to.have.length(1)
      expect(checkString('T\u00c6NIA')).to.be(undefined)
    })
  })
})

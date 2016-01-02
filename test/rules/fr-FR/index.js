import expect from 'expect.js'
import {currencies} from '../../../src/constants'
import {fix, check} from '../../../src/typography-fixer'
import rules from '../../../src/rules/fr-FR'

describe('fr-FR rules', () => {
  describe('spaces', () => {
    it('replaces consecutive spaces with a single space', () => {
      expect(fix(rules, 'Un    jour')).to.eql('Un jour')

      expect(check(rules, 'Un    jour')).to.have.length(1)
      expect(check(rules, 'Un jour')).to.be(undefined)
    })

    let charsWithNbspBefore = ['!', '?', ';', ':', '%', '\u2030', '\u2031']
    charsWithNbspBefore.forEach((char) => {
      it(`replaces a simple space before ${char} with a non-breaking one`, () => {
        expect(fix(rules, `Foo ${char} bar`)).to.eql(`Foo\u202F${char} bar`)
      })

      it(`adds a non-breaking space before ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`)).to.eql(`Foo\u202F${char} bar`)
      })

      it(`checks only when there is simple space or no space before ${char}`, () => {
        expect(check(rules, `Foo ${char}`)).to.have.length(1)
        expect(check(rules, `Foo${char}`)).to.have.length(1)
        expect(check(rules, `Foo\u202F${char}`)).to.be(undefined)
      })
    })

    let charsWithSpaceBefore = ['(']
    charsWithSpaceBefore.forEach((char) => {
      it(`adds a space before ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}`)).to.eql(`Foo ${char}`)
      })

      it(`checks only when there is no space before ${char}`, () => {
        expect(check(rules, `Foo${char}`)).to.have.length(1)
        expect(check(rules, `Foo ${char}`)).to.be(undefined)
      })
    })

    let charsWithSpaceAfter = [',', '.', '\u2026']
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`)).to.eql(`Foo${char} bar`)
      })

      it(`does not add a space after ${char} if followed by a )`, () => {
        expect(fix(rules, `(Foo${char})`)).to.eql(`(Foo${char})`)

        expect(check(rules, `(Foo${char})`)).to.be(undefined)
      })

      it(`checks only when there is no space after ${char}`, () => {
        expect(check(rules, `Foo${char}bar`)).to.have.length(1)
        expect(check(rules, `Foo${char} bar`)).to.be(undefined)
      })
    })

    let charsWithSpaceBeforeAndAfter = ['!', '?', ';', ':', '%', '\u2030', '\u2031']
    charsWithSpaceBeforeAndAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fix(rules, `Foo\u202f${char}bar`)).to.eql(`Foo\u202f${char} bar`)
      })

      it(`does not add a space after ${char} if followed by a )`, () => {
        expect(fix(rules, `(Foo\u202f${char})`)).to.eql(`(Foo\u202f${char})`)

        expect(check(rules, `(Foo\u202f${char})`)).to.be(undefined)
      })

      it(`checks only when there is no space after ${char}`, () => {
        expect(check(rules, `Foo\u202f${char}bar`)).to.have.length(1)
        expect(check(rules, `Foo\u202f${char} bar`)).to.be(undefined)
      })
    })

    it('adds a space after a ) if the following char is not a punctuation', () => {
      expect(fix(rules, 'foo (bar)foo')).to.eql('foo (bar) foo')
      expect(fix(rules, 'foo (bar). foo')).to.eql('foo (bar). foo')

      expect(check(rules, 'foo (bar)foo')).to.have.length(1)
      expect(check(rules, 'foo (bar). foo')).to.be(undefined)
      expect(check(rules, 'foo (bar) foo')).to.be(undefined)
    })

    let charsWithNoSpaceBefore = [',', '.', '\)', '\u2026', '\u2019']
    charsWithNoSpaceBefore.forEach((char) => {
      it(`removes space before ${char}`, () => {
        expect(fix(rules, `Foo ${char}`)).to.eql(`Foo${char}`)
        expect(fix(rules, `Foo  ${char}`)).to.eql(`Foo${char}`)
      })

      it(`removes a non-breaking space before ${char}`, () => {
        expect(fix(rules, `Foo\u00a0${char}`)).to.eql(`Foo${char}`)
        expect(fix(rules, `Foo\u00a0\u00a0${char}`)).to.eql(`Foo${char}`)

        expect(fix(rules, `Foo\u202F${char}`)).to.eql(`Foo${char}`)
        expect(fix(rules, `Foo\u202F\u202F${char}`)).to.eql(`Foo${char}`)
      })

      it(`checks only when there is a space before ${char}`, () => {
        expect(check(rules, `Foo ${char}`)).to.have.length(1)
        expect(check(rules, `Foo\u00a0${char}`)).to.have.length(1)
        expect(check(rules, `Foo${char}`)).to.be(undefined)
      })
    })

    it('removes spaces after \u2019', () => {
      expect(fix(rules, 'foo\u2019 bar')).to.eql('foo\u2019bar')
      expect(fix(rules, 'foo\u2019\u00a0bar')).to.eql('foo\u2019bar')
      expect(fix(rules, 'foo\u2019\u202Fbar')).to.eql('foo\u2019bar')

      expect(check(rules, 'foo\u2019 bar')).to.have.length(1)
      expect(check(rules, 'foo\u2019bar')).to.be(undefined)
    })

    it('removes spaces after (', () => {
      expect(fix(rules, 'foo ( bar')).to.eql('foo (bar')
      expect(fix(rules, 'foo (\u00a0bar')).to.eql('foo (bar')
      expect(fix(rules, 'foo (\u202Fbar')).to.eql('foo (bar')

      expect(check(rules, 'foo ( bar')).to.have.length(1)
      expect(check(rules, 'foo (bar')).to.be(undefined)
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

    it('adds spaces inside typographic quotes', () => {
      expect(fix(rules, 'Le \u00abChat Botté\u00bb.')).to.eql('Le \u00ab\u202FChat Botté\u202F\u00bb.')

      expect(check(rules, 'Le \u00abChat Botté\u00bb.')).to.have.length(2)
      expect(check(rules, 'Le \u00ab\u202FChat Botté\u202F\u00bb.')).to.be(undefined)
    })

    it('does not add a space after a comma used in a floating number', () => {
      expect(fix(rules, 'as,30, 37,5')).to.eql('as, 30, 37,5')

      expect(check(rules, 'as,30, 37,5')).to.have.length(1)
    })

    it('does not add spaces before and after a colon between two numbers', () => {
      expect(fix(rules, 'bar:12:21:56')).to.eql('bar\u202F: 12:21:56')

      expect(check(rules, 'bar:12:21:56')).to.have.length(2)
    })

    let honorifics = ['M.', 'MM.', 'Mme', 'Mmes', 'Mlle', 'Mlles', 'Dr', 'Mgr', 'Me']
    honorifics.forEach((honorific) => {
      it(`adds a non-breaking space after ${honorific} followed by a name`, () => {
        expect(fix(rules, `${honorific} Martin`)).to.eql(`${honorific}\u00a0Martin`)

        expect(fix(rules, `${honorific} est servi`)).to.eql(`${honorific} est servi`)
      })

      it(`checks only when ${honorific} is followed by a name and separated with a simple space`, () => {
        expect(check(rules, `${honorific} Martin`)).to.have.length(1)

        expect(check(rules, `${honorific}\u00a0Martin`)).to.be(undefined)
        expect(check(rules, `${honorific} est servi`)).to.be(undefined)
      })
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
      expect(fix(rules, '1000\u2013 1500')).to.eql('1000\u20131500')
      expect(fix(rules, '1000 \u20131500')).to.eql('1000\u20131500')

      expect(check(rules, '1000 \u2013 1500')).to.have.length(1)
      expect(check(rules, '1000\u20131500')).to.be(undefined)
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
      expect(fix(rules, 'Foo !!')).to.eql('Foo\u202F!')
      expect(fix(rules, 'Foo !!!')).to.eql('Foo\u202F!')
      expect(fix(rules, 'Foo !!!!')).to.eql('Foo\u202F!')

    })

    it('replaces two or more ? with a single ?', () => {
      expect(fix(rules, 'Foo ??')).to.eql('Foo\u202F?')
      expect(fix(rules, 'Foo ???')).to.eql('Foo\u202F?')
      expect(fix(rules, 'Foo ????')).to.eql('Foo\u202F?')

    })

    it('checks multiple punctuation chars only if there is two or more chars', () => {
      expect(check(rules, 'Foo\u202F!')).to.be(undefined)
      expect(check(rules, 'Foo\u202F?')).to.be(undefined)
    })

    it('replace N° with N\u00ba', () => {
      expect(fix(rules, 'N°')).to.eql('N\u00ba')

      expect(check(rules, 'N°')).to.have.length(1)
      expect(check(rules, 'N\u00ba')).to.be(undefined)
    })

    it('replace n° with n\u00ba', () => {
      expect(fix(rules, 'n°')).to.eql('n\u00ba')

      expect(check(rules, 'n°')).to.have.length(1)
      expect(check(rules, 'n\u00ba')).to.be(undefined)
    })

    it('replaces triple dots with a proper ellipsis', () => {
      expect(fix(rules, 'Foo...')).to.eql('Foo\u2026')
    })

    it('replaces Mr. by M.', () => {
      expect(fix(rules, 'Mr.')).to.eql('M.')
    })

    it('replaces Mr by M.', () => {
      expect(fix(rules, 'Mr')).to.eql('M.')
    })

    it('replaces a-t\'il by a-t-il', () => {
      expect(fix(rules, 'Y a-t\'il')).to.eql('Y a-t-il')
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
        expect(fix(rules, form)).to.eql('c.-à-d.')
      })
    })

    it('checks c.-à-d. only when an invalid form is found', () => {
      expect(check(rules, 'c.-à-d.')).to.be(undefined)
    })

    it('replaces hyphen in sentences with dashes', () => {
      expect(fix(rules, '- foo - bar - foo-bar')).to.eql('- foo\u00a0\u2013 bar\u00a0\u2013 foo-bar')

      expect(check(rules, '- foo - foo-bar')).to.have.length(1)
      expect(check(rules, '- foo\u00a0\u2013 foo-bar')).to.be(undefined)
    })

    it('replaces hyphen between numbers with dashes', () => {
      expect(fix(rules, '1000-1500')).to.eql('1000\u20131500')
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
        expect(fix(rules, source)).to.eql(expected)

        expect(check(rules, source)).to.have.length(1)
        expect(check(rules, expected)).to.be(undefined)
      })
    })
  })

  describe('quotes', () => {
    it('replaces single quotes with typographic ones', () => {
      expect(fix(rules, "L'arbre")).to.eql('L\u2019arbre')
    })

    it('replaces double quotes around a sentence by typographic quotes', () => {
      expect(fix(rules, 'Le "Chat Botté".')).to.eql('Le \u00ab\u202FChat Botté\u202F\u00bb.')
      expect(fix(rules, 'Le " Chat Botté ".')).to.eql('Le \u00ab\u202FChat Botté\u202F\u00bb.')
    })
  })

  describe('dates and times', () => {
    let daysAndMonths = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

    daysAndMonths.forEach((string) => {
      it(`replaces ${string} with its lower case version`, () => {
        expect(fix(rules, string)).to.eql(string.toLowerCase())
      })
    })

    let hours = [
      ['13h37', '13\u00a0h\u00a037'],
      ['13 h 37', '13\u00a0h\u00a037'],
      ['13h37min54sec', '13\u00a0h\u00a037\u00a0min\u00a054\u00a0sec'],
      ['13h37m54s', '13\u00a0h\u00a037\u00a0m\u00a054\u00a0s'],
      ['13 h 37 min 54 sec', '13\u00a0h\u00a037\u00a0min\u00a054\u00a0sec']
    ]

    hours.forEach(([source, expected]) => {
      it(`replaces ${source} with ${expected} using non-breaking spaces`, () => {
        expect(fix(rules, source)).to.eql(expected)

        expect(check(rules, source)).to.have.length(1)
        expect(check(rules, expected)).to.be(undefined)
      })
    })
  })

  describe('ligatures', () => {
    it('replaces oe with \u0153', () => {
      expect(fix(rules, 'oeuf')).to.eql('\u0153uf')

      expect(check(rules, 'oeuf')).to.have.length(1)
      expect(check(rules, '\u0153uf')).to.be(undefined)
    })

    it('replaces Oe with \u0152', () => {
      expect(fix(rules, 'Oeuf')).to.eql('\u0152uf')
      expect(fix(rules, 'OEuf')).to.eql('\u0152uf')

      expect(check(rules, 'Oeuf')).to.have.length(1)
      expect(check(rules, 'OEuf')).to.have.length(1)
      expect(check(rules, '\u0152uf')).to.be(undefined)
    })

    it('replaces ae with \u00e6', () => {
      expect(fix(rules, 'taenia')).to.eql('t\u00e6nia')

      expect(check(rules, 'taenia')).to.have.length(1)
      expect(check(rules, 't\u00e6nia')).to.be(undefined)
    })

    it('replaces Ae with \u00c6', () => {
      expect(fix(rules, 'TAENIA')).to.eql('T\u00c6NIA')

      expect(check(rules, 'TAENIA')).to.have.length(1)
      expect(check(rules, 'T\u00c6NIA')).to.be(undefined)
    })
  })
})

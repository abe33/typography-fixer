import expect from 'expect.js'
import {currencies} from '../../src/constants'
import {fix} from '../../src/typographic-fixer'
import rules from '../../src/rules/fr-FR'

describe('fr-FR rules', () => {
  describe('spaces', () => {
    it('replaces consecutive spaces with a single space', () => {
      expect(fix(rules, 'Un    jour')).to.eql('Un jour')
    })

    let charsWithNbspBefore = ['!', '?', ';', ':', '%']
    charsWithNbspBefore.forEach((char) => {
      it(`replaces a simple space before ${char} with a non-breaking one`, () => {
        expect(fix(rules, `Foo ${char}bar`)).to.eql(`Foo\u202F${char} bar`)
      })

      it(`adds a non-breaking space before ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`)).to.eql(`Foo\u202F${char} bar`)
      })
    })

    let charsWithSpaceBefore = ['(']
    charsWithSpaceBefore.forEach((char) => {
      it(`adds a space before ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}`)).to.eql(`Foo ${char}`)
      })
    })

    let charsWithSpaceAfter = [',', '.', '\u2026', '!', '?', ';', ':', '%']
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`).indexOf(`${char} bar`)).not.to.eql(-1)
      })
    })

    it('adds a space after a ) if the following char is not a punctuation', () => {
      expect(fix(rules, 'foo (bar)foo')).to.eql('foo (bar) foo')
      expect(fix(rules, 'foo (bar). foo')).to.eql('foo (bar). foo')
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

    it('replaces a simple space before a currency with a non-breaking one', () => {
      Object.keys(currencies).forEach((char) => {
        expect(fix(rules, `10 ${char}`)).to.eql(`10\u00a0${char}`)
      })
    })

    it('adds a non-breaking space before a currency if there is no space', () => {
      Object.keys(currencies).forEach((char) => {
        expect(fix(rules, `10${char}`)).to.eql(`10\u00a0${char}`)
      })
    })

    it('adds spaces inside typographic quotes', () => {
      expect(fix(rules, 'Le \u00abChat Botté\u00bb.')).to.eql('Le \u00ab\u202FChat Botté\u202F\u00bb.')
    })

    it('does not add a space after a comma used in a floating number', () => {
      expect(fix(rules, 'as,30, 37,5')).to.eql('as, 30, 37,5')
    })

    it('does not add spaces before and after a colon between two numbers', () => {
      expect(fix(rules, 'bar:12:21:56')).to.eql('bar\u202F: 12:21:56')
    })

    it('adds a non-breaking space after an honorific followed by a name', () => {
      expect(fix(rules, 'M. Martin')).to.eql('M.\u00a0Martin')
      expect(fix(rules, 'Mme Martin')).to.eql('Mme\u00a0Martin')
      expect(fix(rules, 'Mlle Martin')).to.eql('Mlle\u00a0Martin')

      expect(fix(rules, 'M. est servi')).to.eql('M. est servi')
      expect(fix(rules, 'Mme est servie')).to.eql('Mme est servie')
      expect(fix(rules, 'Mlle est servie')).to.eql('Mlle est servie')
    })

    it('adds spaces around en dashes between words', () => {
      expect(fix(rules, 'foo\u2013bar')).to.eql('foo\u00a0\u2013 bar')
    })

    it('removes spaces around en dashes between numbers', () => {
      expect(fix(rules, '1000 \u2013 1500')).to.eql('1000\u20131500')
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
      expect(fix(rules, 'Foo !!')).to.eql('Foo\u202F!')
      expect(fix(rules, 'Foo !!!')).to.eql('Foo\u202F!')
      expect(fix(rules, 'Foo !!!!')).to.eql('Foo\u202F!')
    })

    it('replaces two or more ? with a single ?', () => {
      expect(fix(rules, 'Foo ??')).to.eql('Foo\u202F?')
      expect(fix(rules, 'Foo ???')).to.eql('Foo\u202F?')
      expect(fix(rules, 'Foo ????')).to.eql('Foo\u202F?')
    })

    it('replace N° with N\u00ba', () => {
      expect(fix(rules, 'N°')).to.eql('N\u00ba')
    })

    it('replace n° with n\u00ba', () => {
      expect(fix(rules, 'n°')).to.eql('n\u00ba')
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

    it('replaces hyphen in sentences with dashes', () => {
      expect(fix(rules, '- foo - bar - foo-bar')).to.eql('- foo\u00a0\u2013 bar\u00a0\u2013 foo-bar')
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
      ['10emes', '10èmes'],
    ]

    ordinalTests.forEach(([source, expected]) => {
      it(`replaces ${source} by ${expected}`, () => {
        expect(fix(rules, source)).to.eql(expected)
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
      ['13h37min54s', '13\u00a0h\u00a037\u00a0min\u00a054\u00a0s'],
      ['13 h 37 min 54 s', '13\u00a0h\u00a037\u00a0min\u00a054\u00a0s']
    ]

    hours.forEach(([source, expected]) => {
      it(`replaces ${source} with ${expected} using non-breaking spaces`, () => {
        expect(fix(rules, source)).to.eql(expected)
      })
    })
  })

  describe('ligatures', () => {
    it('replaces oe with \u0153', () => {
      expect(fix(rules, 'oeuf')).to.eql('\u0153uf')
    })

    it('replaces Oe with \u0152', () => {
      expect(fix(rules, 'Oeuf')).to.eql('\u0152uf')
      expect(fix(rules, 'OEuf')).to.eql('\u0152uf')
    })

    it('replaces ae with \u00e6', () => {
      expect(fix(rules, 'taenia')).to.eql('t\u00e6nia')
    })

    it('replaces Ae with \u00c6', () => {
      expect(fix(rules, 'TAENIA')).to.eql('T\u00c6NIA')
      expect(fix(rules, 'TAENIA')).to.eql('T\u00c6NIA')
    })
  })
})

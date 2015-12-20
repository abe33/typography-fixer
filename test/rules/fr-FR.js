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
        expect(fix(rules, `Foo ${char}`)).to.eql(`Foo\u00a0${char}`)
      })
      it(`adds a non-breaking space before ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}`)).to.eql(`Foo\u00a0${char}`)
      })
    })

    let charsWithNoSpaceBefore = [',', '.', '\u2026']
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

    let charsWithSpaceAfter = [',', '.', '\u2026', '!', '?', ';', ':', '%']
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}bar`).indexOf(`${char} bar`)).not.to.eql(-1)
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
      expect(fix(rules, 'Foo !!')).to.eql('Foo\u00a0!')
      expect(fix(rules, 'Foo !!!')).to.eql('Foo\u00a0!')
      expect(fix(rules, 'Foo !!!!')).to.eql('Foo\u00a0!')
    })

    it('replaces two or more ? with a single ?', () => {
      expect(fix(rules, 'Foo ??')).to.eql('Foo\u00a0?')
      expect(fix(rules, 'Foo ???')).to.eql('Foo\u00a0?')
      expect(fix(rules, 'Foo ????')).to.eql('Foo\u00a0?')
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

    it('replaces hyphen in sentences with dashes', () => {
      expect(fix(rules, '- foo - bar - foo-bar')).to.eql('- foo \u2013 bar \u2013 foo-bar')
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
      expect(fix(rules, 'Le "Chat Botté".')).to.eql('Le \u00ab\u00a0Chat Botté\u00a0\u00bb.')
      expect(fix(rules, 'Le " Chat Botté ".')).to.eql('Le \u00ab\u00a0Chat Botté\u00a0\u00bb.')
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

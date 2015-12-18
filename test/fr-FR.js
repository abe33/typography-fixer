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

    let charsWithNbspBefore = ['!', '?', ';', ':', '%']
    charsWithNbspBefore.forEach((char) => {
      it(`replaces a simple space before ${char} with a non-breaking one`, () => {
        expect(fix(rules, `Foo ${char}`)).to.eql(`Foo&nbsp;${char}`)
      })
      it(`adds a non-breaking before ${char} if there is no space`, () => {
        expect(fix(rules, `Foo${char}`)).to.eql(`Foo&nbsp;${char}`)
      })
    })
  })

  describe('punctuations', () => {
    let etcTests = [
      ['Etc...', 'Etc.'],
      ['Etc…', 'Etc.'],
      ['Etc&hellip;', 'Etc.'],
      ['etc...', 'etc.'],
      ['etc…', 'etc.'],
      ['etc&hellip;', 'etc.']
    ]
    etcTests.forEach(([source, expected]) => {
      it(`replaces ${source} by ${expected}`, () => {
        expect(fix(rules, source)).to.eql(expected)
      })
    })

    it('replaces two or more ! with a single !', () => {
      expect(fix(rules, 'Foo !!')).to.eql('Foo&nbsp;!')
      expect(fix(rules, 'Foo !!!')).to.eql('Foo&nbsp;!')
      expect(fix(rules, 'Foo !!!!')).to.eql('Foo&nbsp;!')
    })

    it('replaces two or more ? with a single ?', () => {
      expect(fix(rules, 'Foo ??')).to.eql('Foo&nbsp;?')
      expect(fix(rules, 'Foo ???')).to.eql('Foo&nbsp;?')
      expect(fix(rules, 'Foo ????')).to.eql('Foo&nbsp;?')
    })

    it('replace N° with N&#186;', () => {
      expect(fix(rules, 'N°')).to.eql('N&#186;')
    })

    it('replace n° with n&#186;', () => {
      expect(fix(rules, 'n°')).to.eql('n&#186;')
    })

    it('replaces triple dots with a proper ellipsis', () => {
      expect(fix(rules, 'Foo...')).to.eql('Foo&hellip;')
    })

    it('replaces Mr. by M.', () => {
      expect(fix(rules, 'Mr.')).to.eql('M.')
    })
  })

  describe('ordinal numbers', () => {
    let ordinalTests = [
      ['1ere', '1<sup>re</sup>'],
      ['1ère', '1<sup>re</sup>'],
      ['2eme', '2<sup>e</sup>'],
      ['2ème', '2<sup>e</sup>'],
      ['3eme', '3<sup>e</sup>'],
      ['3ème', '3<sup>e</sup>'],
      ['10ème', '10<sup>e</sup>'],
      ['1ers', '1<sup>ers</sup>'],
      ['1ères', '1<sup>res</sup>'],
      ['1eres', '1<sup>res</sup>'],
      ['2emes', '2<sup>es</sup>'],
      ['2èmes', '2<sup>es</sup>'],
      ['10emes', '10<sup>èmes</sup>'],
      ['10èmes', '10<sup>èmes</sup>']
    ]

    ordinalTests.forEach(([source, expected]) => {
      it(`replaces ${source} by ${expected}`, () => {
        expect(fix(rules, source)).to.eql(expected)
      })
    })
  })
})

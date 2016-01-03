import expect from 'expect.js'
import {fix, check} from '../../../src/typography-fixer'
import rules from '../../../src/rules/fr-FR/html'

describe('fr-FR html rules', () => {
  const abbrWithSuperText = [
    ['Mme', 'M<sup>me</sup>'],
    ['Mmes', 'M<sup>mes</sup>'],
    ['Mlle', 'M<sup>lle</sup>'],
    ['Mlles', 'M<sup>lles</sup>'],
    ['Me', 'M<sup>e</sup>'],
    ['Mgr', 'M<sup>gr</sup>'],
    ['Dr', 'D<sup>r</sup>'],
    ['cie', 'c<sup>ie</sup>'],
    ['Cie', 'C<sup>ie</sup>'],
    ['Sté', 'S<sup>té</sup>']
  ]
  abbrWithSuperText.forEach(([source, expected]) => {
    it(`replaces ${source} with ${expected}`, () => {
      expect(fix(rules, source)).to.eql(expected)

      expect(check(rules, source)).to.have.length(1)
      expect(check(rules, expected)).to.be(undefined)
    })
  })

  const ordinalNumbers = [
    ['1re', '1<sup class="ord">re</sup>'],
    ['1re', '1<sup class="ord">re</sup>'],
    ['2e', '2<sup class="ord">e</sup>'],
    ['2e', '2<sup class="ord">e</sup>'],
    ['3e', '3<sup class="ord">e</sup>'],
    ['3e', '3<sup class="ord">e</sup>'],
    ['10e', '10<sup class="ord">e</sup>'],
    ['1res', '1<sup class="ord">res</sup>'],
    ['1res', '1<sup class="ord">res</sup>'],
    ['2es', '2<sup class="ord">es</sup>'],
    ['2es', '2<sup class="ord">es</sup>'],
    ['10èmes', '10<sup class="ord">èmes</sup>']
  ]
  ordinalNumbers.forEach(([source, expected]) => {
    it(`replaces ${source} with ${expected}`, () => {
      expect(fix(rules, source)).to.eql(expected)

      expect(check(rules, source)).to.have.length(1)
      expect(check(rules, expected)).to.be(undefined)
    })
  })

  it('wraps quotation marks into a span', () => {
    expect(fix(rules, 'Le \u00ab\u202FChat Botté\u202F\u00bb.')).to.eql('Le <span class="dquo">\u00ab</span>\u202FChat Botté\u202F<span class="dquo">\u00bb</span>.')

    expect(check(rules, 'Le \u00ab\u202FChat Botté\u202F\u00bb.')).to.have.length(2)
  })

  it('wraps ampersand into a span', () => {
    expect(fix(rules, '&')).to.eql('<span class="amp">&</span>')
    expect(fix(rules, '&nbsp;')).to.eql('&nbsp;')

    expect(check(rules, '&')).to.have.length(1)
    expect(check(rules, '&nbsp;')).to.be(undefined)
  })

  it('wraps multiple capital letters in a span', () => {
    expect(fix(rules, 'foo BAR foo')).to.eql('foo <span class="caps">BAR</span> foo')
    expect(fix(rules, 'B.A.R.')).to.eql('<span class="caps">B.A.R.</span>')

    expect(check(rules, 'BAR')).to.have.length(1)
    expect(check(rules, 'B.A.R.')).to.have.length(1)
    expect(check(rules, 'Bar')).to.be(undefined)
  })
})

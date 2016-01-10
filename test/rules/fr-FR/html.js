import expect from 'expect.js'
import {fix, check} from '../../../src/typography-fixer'
import rules from '../../../src/rules/fr-FR/html'

const fixString = fix(rules)
const checkString = check(rules)

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
      expect(fixString(source)).to.eql(expected)

      expect(checkString(source)).to.have.length(1)
      expect(checkString(expected)).to.be(undefined)
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
      expect(fixString(source)).to.eql(expected)

      expect(checkString(source)).to.have.length(1)
      expect(checkString(expected)).to.be(undefined)
    })
  })

  it('wraps quotation marks into a span', () => {
    expect(fixString('Le \u00ab\u202FChat Botté\u202F\u00bb.')).to.eql('Le <span class="dquo">\u00ab</span>\u202FChat Botté\u202F<span class="dquo">\u00bb</span>.')

    expect(checkString('Le \u00ab\u202FChat Botté\u202F\u00bb.')).to.have.length(2)
  })

  it('wraps ampersand into a span', () => {
    expect(fixString('&')).to.eql('<span class="amp">&</span>')
    expect(fixString('&amp;')).to.eql('<span class="amp">&amp;</span>')
    expect(fixString('&nbsp;')).to.eql('&nbsp;')

    expect(checkString('&')).to.have.length(1)
    expect(checkString('&amp;')).to.have.length(1)
    expect(checkString('&nbsp;')).to.be(undefined)
  })

  it('wraps multiple capital letters in a span', () => {
    expect(fixString('foo BAR foo')).to.eql('foo <span class="caps">BAR</span> foo')
    expect(fixString('B.A.R.')).to.eql('<span class="caps">B.A.R.</span>')

    expect(checkString('BAR')).to.have.length(1)
    expect(checkString('B.A.R.')).to.have.length(1)
    expect(checkString('Bar')).to.be(undefined)
  })
})

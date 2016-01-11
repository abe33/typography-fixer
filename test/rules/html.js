import expect from 'expect.js'
import {fix, check} from '../../src/typography-fixer'
import rules from '../../src/rules/html'

const fixString = fix(rules)
const checkString = check(rules)

describe('html rules', () => {
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

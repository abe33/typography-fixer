import expect from 'expect.js'
import {fix} from '../../../src/typography-fixer'
import rules from '../../../src/rules/en-UK/html'

const fixString = fix(rules)

describe('en-UK html rules', () => {
  it('includes fraction rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('html.common') >= 0
    })).to.be(true)
  })

  it('wraps ordinal number suffix in a ord span', () => {
    expect(fixString('1st')).to.eql('1<span class="ord">st</span>')
    expect(fixString('2nd')).to.eql('2<span class="ord">nd</span>')
    expect(fixString('3rd')).to.eql('3<span class="ord">rd</span>')
    expect(fixString('4th')).to.eql('4<span class="ord">th</span>')
    expect(fixString('10th')).to.eql('10<span class="ord">th</span>')
    expect(fixString('21st')).to.eql('21<span class="ord">st</span>')
  })
})

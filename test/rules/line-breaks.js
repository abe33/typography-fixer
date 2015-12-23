import expect from 'expect.js'
import {fix} from '../../src/typography-fixer'
import rules from '../../src/rules/line-breaks'

describe('line-breaks rules', () => {
  it('adds a non-breaking space after each word that is shorter than four characters', () => {
    expect(fix(rules, 'a be foo door plate')).to.eql('a\u00a0be\u00a0foo\u00a0door plate')
  })

  it('adds a non-breaking space between a number and the word that follow', () => {
    expect(fix(rules, '1000 bears at 10. Foo')).to.eql('1000\u00a0bears at\u00a010. Foo')
  })
})

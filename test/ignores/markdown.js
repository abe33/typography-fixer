import expect from 'expect.js'
import {fix, rule} from '../../src/typographic-fixer'
import ignores from '../../src/ignores/markdown'

describe('markdown ignores', () => {
  let ruleObject, rules

  beforeEach(() => {
    ruleObject = rule('Foo', /\[|\(|!|:|\)|\]|foo/, 'bar')
    rules = [ruleObject].concat(ignores)
  })

  it('preserves plain urls', () => {
    expect(fix(rules, 'http://foo.com/foo.jpg')).to.eql('http://foo.com/foo.jpg')
  })

  it('preserves inline images', () => {
    expect(fix(rules, '![foo](http://foo.com/foo.jpg "foo")')).to.eql('![foo](http://foo.com/foo.jpg "foo")')
  })

  it('preserves inline links', () => {
    expect(fix(rules, '[foo](http://foo.com/foo.jpg)')).to.eql('[foo](http://foo.com/foo.jpg)')
  })

  it('preserves images with external definition', () => {
    expect(fix(rules, '![foo][foo]')).to.eql('![foo][foo]')
    expect(fix(rules, '![foo] [foo]')).to.eql('![foo] [foo]')
    expect(fix(rules, '![foo][]')).to.eql('![foo][]')
  })

  it('preserves links with external definition', () => {
    expect(fix(rules, '[foo][foo]')).to.eql('[foo][foo]')
    expect(fix(rules, '[foo] [foo]')).to.eql('[foo] [foo]')
    expect(fix(rules, '[foo][]')).to.eql('[foo][]')
  })

  it('preserves links definition', () => {
    expect(fix(rules, 'foo\n[foo]: http://foo.com/foo.jpg "foo"\nfoo')).to.eql('bar\n[foo]: http://foo.com/foo.jpg "foo"\nbar')
    expect(fix(rules, 'foo\n[foo]: http://foo.com/foo.jpg \'foo\'\nfoo')).to.eql('bar\n[foo]: http://foo.com/foo.jpg \'foo\'\nbar')
    expect(fix(rules, 'foo\n[foo]: http://foo.com/foo.jpg (foo)\nfoo')).to.eql('bar\n[foo]: http://foo.com/foo.jpg (foo)\nbar')
  })

  it('preserves content of inline code', () => {
    expect(fix(rules, 'foo `foo` foo `foo` foo')).to.eql('bar `foo` bar `foo` bar')
  })

  it('preserves content of inline code with escaped backticks', () => {
    expect(fix(rules, 'foo ``foo`foo`` foo ``foo`foo`` foo')).to.eql('bar ``foo`foo`` bar ``foo`foo`` bar')
  })

  it('preserves content of block code', () => {
    expect(fix(rules, 'foo\n```\nfoo\n```\nfoo\n```\nfoo\n```\nfoo')).to.eql('bar\n```\nfoo\n```\nbar\n```\nfoo\n```\nbar')
  })

  it('preserves content of pre-formatted blocks', () => {
    expect(fix(rules, `foo

    foo

foo`)).to.eql(`bar

    foo

bar`)
  })
})

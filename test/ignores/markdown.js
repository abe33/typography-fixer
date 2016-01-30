import expect from 'expect.js'
import {concat} from 'ramda'
import {fix, rule} from '../../src/typography-fixer'
import ignores from '../../src/ignores/markdown'

const ruleObject = rule('Foo', /\[|\(|!|:|\)|\]|foo/, 'bar')
const rules = concat([ruleObject], ignores)
const fixString = fix(rules)

describe('markdown ignores', () => {

  it('preserves plain urls', () => {
    expect(fixString('http://foo.com/foo.jpg')).to.eql('http://foo.com/foo.jpg')
  })

  it('preserves inline images', () => {
    expect(fixString('![foo](http://foo.com/foo.jpg "foo")')).to.eql('![bar](http://foo.com/foo.jpg "foo")')
  })

  it('preserves inline links', () => {
    expect(fixString('[foo](http://foo.com/foo.jpg)')).to.eql('[bar](http://foo.com/foo.jpg)')
  })

  it('preserves images with external definition', () => {
    expect(fixString('![foo][foo]')).to.eql('![bar][foo]')
    expect(fixString('![foo] [foo]')).to.eql('![bar] [foo]')
    expect(fixString('![foo][]')).to.eql('![bar][]')
  })

  it('preserves links with external definition', () => {
    expect(fixString('[foo][foo]')).to.eql('[bar][foo]')
    expect(fixString('[foo] [foo]')).to.eql('[bar] [foo]')
    expect(fixString('[foo][]')).to.eql('[bar][]')
  })

  it('preserves links definition', () => {
    expect(fixString('foo\n[foo]: http://foo.com/foo.jpg "foo"\nfoo')).to.eql('bar\n[foo]: http://foo.com/foo.jpg "foo"\nbar')
    expect(fixString('foo\n[foo]: http://foo.com/foo.jpg \'foo\'\nfoo')).to.eql('bar\n[foo]: http://foo.com/foo.jpg \'foo\'\nbar')
    expect(fixString('foo\n[foo]: http://foo.com/foo.jpg (foo)\nfoo')).to.eql('bar\n[foo]: http://foo.com/foo.jpg (foo)\nbar')
  })

  it('preserves content of inline code', () => {
    expect(fixString('foo `foo` foo `foo` foo')).to.eql('bar `foo` bar `foo` bar')
  })

  it('preserves content of inline code with escaped backticks', () => {
    expect(fixString('foo ``foo`foo`` foo ``foo`foo`` foo')).to.eql('bar ``foo`foo`` bar ``foo`foo`` bar')
  })

  it('preserves content of block code', () => {
    expect(fixString('foo\n```\nfoo\n```\nfoo\n```\nfoo\n```\nfoo')).to.eql('bar\n```\nfoo\n```\nbar\n```\nfoo\n```\nbar')
  })

  it('preserves content of pre-formatted blocks', () => {
    expect(fixString(`foo

    foo

foo`)).to.eql(`bar

    foo

bar`)
  })
})

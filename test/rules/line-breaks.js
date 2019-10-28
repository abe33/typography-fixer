import expect from 'expect.js';
import {fix} from '../../src/typography-fixer';
import rules from '../../src/rules/line-breaks';

const fixString = fix(rules);

describe('line-breaks ruleset', () => {
  it('adds a non-breaking space after each word that is shorter than four characters', () => {
    expect(fixString('a be foo door plate')).to.eql('a\u00a0be\u00a0foo\u00a0door plate');
  });

  it('adds a non-breaking space between a number and the word that follow', () => {
    expect(fixString('1000 bears at 10. Foo')).to.eql('1000\u00a0bears at\u00a010. Foo');
  });

  it('adds a non-breaking space between the two last words of a paragraph', () => {
    expect(fixString('Word word word word word.\nWord word word word word.\n\nWord word word word word.')).to.eql('Word word word word\u00a0word.\nWord word word word\u00a0word.\n\nWord word word word\u00a0word.');
  });
});

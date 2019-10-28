
import expect from 'expect.js';
import {currencies} from '../../../src/constants';
import {fix, check} from '../../../src/typography-fixer';
import rules from '../../../src/rules/es-ES';

const fixString = fix(rules);
const checkString = check(rules);

describe('es-ES ruleset', () => {
  it('includes fraction rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('fractions') >= 0;
    })).to.be(true);
  });

  it('includes unit rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('units') >= 0;
    })).to.be(true);
  });

  it('includes symbol rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('symbols') >= 0;
    })).to.be(true);
  });

  it('includes punctuations rules', () => {
    expect(rules.some((r) => {
      return r.name.indexOf('punctuations.common') >= 0;
    })).to.be(true);
  });

  describe('spaces', () => {
    let charsWithSpaceAfter = [',', '.', '\u2026', ';', ':', '%', '\u2030', '\u2031'];
    charsWithSpaceAfter.forEach((char) => {
      it(`adds a space after ${char} if there is no space`, () => {
        expect(fixString(`Foo${char}bar`)).to.eql(`Foo${char} bar`);

        expect(checkString(`Foo${char}bar`)).to.have.length(1);
        expect(checkString(`Foo${char} bar`)).to.be(undefined);
      });

      it(`does not add a space after ${char} if followed by a )`, () => {
        expect(fixString(`(Foo${char})`)).to.eql(`(Foo${char})`);

        expect(checkString(`(Foo${char})`)).to.be(undefined);
      });
    });

    let charsWithNoSpaceBefore = [',', '.', '\u2026', ';', ':', '%', ')', '\u2019', '\u2030', '\u2031'];
    charsWithNoSpaceBefore.forEach((char) => {
      it(`removes space before ${char}`, () => {
        expect(fixString(`Foo ${char}`)).to.eql(`Foo${char}`);
        expect(fixString(`Foo  ${char}`)).to.eql(`Foo${char}`);
      });

      it(`removes a non-breaking space before ${char}`, () => {
        expect(fixString(`Foo\u00a0${char}`)).to.eql(`Foo${char}`);
        expect(fixString(`Foo\u00a0\u00a0${char}`)).to.eql(`Foo${char}`);
      });

      it(`checks only when there is a space before ${char}`, () => {
        expect(checkString(`Foo ${char}`)).to.have.length(1);
        expect(checkString(`Foo\u00a0${char}`)).to.have.length(1);
        expect(checkString(`Foo${char}`)).to.be(undefined);
      });
    });

    let charsWithNoSpaceAfter = ['\u2019', '('];
    charsWithNoSpaceAfter.forEach((char) => {
      it(`removes spaces after ${char}`, () => {
        expect(fixString(`${char} bar`)).to.eql(`${char}bar`);
        expect(fixString(`${char}  bar`)).to.eql(`${char}bar`);
      });

      it(`removes a non-breaking space after ${char}`, () => {
        expect(fixString(`${char}\u00a0bar`)).to.eql(`${char}bar`);
        expect(fixString(`${char}\u00a0\u00a0bar`)).to.eql(`${char}bar`);

        expect(fixString(`${char}\u202Fbar`)).to.eql(`${char}bar`);
        expect(fixString(`${char}\u202F\u202Fbar`)).to.eql(`${char}bar`);
      });

      it(`checks only when there is a space after ${char}`, () => {
        expect(checkString(`${char} bar`)).to.have.length(1);
        expect(checkString(`${char}\u00a0bar`)).to.have.length(1);
        expect(checkString(`${char}bar`)).to.be(undefined);
      });
    });

    Object.keys(currencies).forEach((char) => {
      it(`replaces a simple space before ${char} a non-breaking one`, () => {
        expect(fixString(`10 ${char}`)).to.eql(`10\u00a0${char}`);
      });

      it(`adds a non-breaking space before ${char} if there is no space`, () => {
        expect(fixString(`10${char}`)).to.eql(`10\u00a0${char}`);
      });

      it(`checks only if when there no space or a simple space before ${char}`, () => {
        expect(checkString(`10${char}`)).to.have.length(1);
        expect(checkString(`10 ${char}`)).to.have.length(1);
        expect(checkString(`10\u00a0${char}`)).to.be(undefined);
      });
    });

    it('adds thin non-breaking spaces in questions', () => {
      expect(fixString('¿Como te llamo?')).to.eql('¿\u202fComo te llamo\u202f?');

      expect(checkString('¿Como te llamo?')).to.have.length(2);
      expect(checkString('¿\u202fComo te llamo\u202f?')).to.be(undefined);
    });

    it('adds thin non-breaking spaces in exclamations', () => {
      expect(fixString('¡Madre de dios!')).to.eql('¡\u202fMadre de dios\u202f!');

      expect(checkString('¡Madre de dios!')).to.have.length(2);
      expect(checkString('¡\u202fMadre de dios\u202f!')).to.be(undefined);
    });

    it('adds a space after a ) if the following char is not a punctuation', () => {
      expect(fixString('foo (bar)foo')).to.eql('foo (bar) foo');
      expect(fixString('foo (bar). foo')).to.eql('foo (bar). foo');

      expect(checkString('foo (bar)foo')).to.have.length(1);
      expect(checkString('foo (bar). foo')).to.be(undefined);
      expect(checkString('foo (bar) foo')).to.be(undefined);
    });

    it('does not add spaces before and after a colon between two numbers', () => {
      expect(fixString('bar:12:21:56')).to.eql('bar: 12:21:56');

      expect(checkString('bar:12:21:56')).to.have.length(1);
      expect(checkString('bar: 12:21:56')).to.be(undefined);
    });

    it('adds spaces around en dashes between words', () => {
      expect(fixString('foo\u2013bar')).to.eql('foo\u00a0\u2013 bar');
      expect(fixString('foo \u2013bar')).to.eql('foo\u00a0\u2013 bar');
      expect(fixString('foo\u2013 bar')).to.eql('foo\u00a0\u2013 bar');

      expect(checkString('foo\u2013bar')).to.have.length(1);
      expect(checkString('foo\u00a0\u2013 bar')).to.be(undefined);
    });

    it('removes spaces around en dashes between numbers', () => {
      expect(fixString('1000 \u2013 1500')).to.eql('1000\u20131500');

      expect(checkString('1000 \u2013 1500')).to.have.length(1);
      expect(checkString('1000\u20131500')).to.be(undefined);
    });

    it('does not add a space after a comma used in a floating number', () => {
      expect(fixString('as,30, 37,5')).to.eql('as, 30, 37,5');

      expect(checkString('as,30, 37,5')).to.have.length(1);
    });
  });

  describe('quotes', () => {
    it('replaces single quotes with typographic ones', () => {
      expect(fixString("qu'es el morir")).to.eql('qu\u2019es el morir');
    });

    it('replaces double quotes around a sentence by typographic quotes', () => {
      expect(fixString('Él me dijo, "Estoy muy feliz".'))
        .to.eql('Él me dijo, \u00ab\u202FEstoy muy feliz\u202F\u00bb.');
      expect(fixString('Él me dijo, " Estoy muy feliz ".'))
        .to.eql('Él me dijo, \u00ab\u202FEstoy muy feliz\u202F\u00bb.');
    });
  });

  describe('punctuations', () => {
    it('replaces two or more ¡ with a single instance', () => {
      expect(fixString('¡¡\u202FFoo')).to.eql('¡\u202FFoo');
      expect(fixString('¡¡¡\u202FFoo')).to.eql('¡\u202FFoo');
      expect(fixString('¡¡¡¡\u202FFoo')).to.eql('¡\u202FFoo');
    });

    it('replaces two or more ¿ with a single instance', () => {
      expect(fixString('¿¿\u202FFoo')).to.eql('¿\u202FFoo');
      expect(fixString('¿¿¿\u202FFoo')).to.eql('¿\u202FFoo');
      expect(fixString('¿¿¿¿\u202FFoo')).to.eql('¿\u202FFoo');
    });

    it('checks multiple punctuation chars only if there is two or more chars', () => {
      expect(checkString('¡\u202FFoo')).to.be(undefined);
      expect(checkString('¿\u202FFoo')).to.be(undefined);
    });
  });
});

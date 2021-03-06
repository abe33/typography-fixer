[![Build Status](https://travis-ci.org/abe33/typography-fixer.svg)](https://travis-ci.org/abe33/typography-fixer)

# Typography-Fixer

This module provides helper functions to check for and fix various punctuations or typographic mistakes and enforce proper use of non-breaking spaces in a text.

This is neither a spell-checker nor a hyphenation helper. While it may impact how line will breaks it don't do anything beyond adding non-breaking spaces here and there.

### What about HTML entities

Typography-Fixer doesn't use HTML entities, it relies solely on unicode characters. The main reason is that, except for XML reserved characters (`<`, `>` and `&`), no one should no longer care about special characters when using a UTF8 charset. If you don't use UTF8 (seriously?) [there's a bunch of modules for that purpose](https://www.npmjs.com/search?q=html+entities).
The only exception is for the `&amp;` entity in html enhancement rules.

## Install

```bash
npm install --save typography-fixer
```

## Usage

When using the package, the two functions you need to care about are `check` and `fix`. But the packages exposes a total of five functions available using `require('typography-fixer')`. On top of that, rulesets can be found at the `typography-fixer/lib/rules` path, while ignore sets are located at `typography-fixer/lib/ignores`.

```js
import {check, fix} from 'typography-fixer'
import englishRules from 'typography-fixer/lib/rules/en-UK'
import markdown from 'typography-fixer/lib/ignores/markdown'

const rules = englishRules.concat(markdown)

// returns an array with all the places where rules have been transgressed
// or undefined if no rules were broken.
const checkResults = check(rules, 'Some text "to verify".')

// returns the string with all rule violations fixed
// in that case it returns: 'Some text “to verify.”'
const fixedString = fix(rules, 'Some text "to verify".')
```

The `check` function takes an array of rules and ignores, and returns an array of violations to the specified rules. A result is an object with the name of the broken rule and an array representing the range of the match. If a rule matches a part of a text but its application does't change this part then the match is simply ignored.

The `fix` function also takes an array of rules and ignores, and returns the corrected string.

Note that since the `check` function operates on a string without modifying it, some fixes won't be detected are they would only be applied after a first batch of rules was applied, and other times several rules can returns violations at the same place, with some of them that won't be applied as they will become irrelevant after some replacements. One example of the latter is the rule for `etc...`, it will returns violations for both `etc` followed by an ellipsis and for an ellipsis formed with three periods.

For a complete list of all rules available please check the [API documentation](http://abe33.github.io/typography-fixer/variable/index.html)

Note that the `check` and `fix` functions are curried and when called with just a rules array they will return a new function that can then be used to perform the operation on a passed-in string.

```js
import {check, fix} from 'typography-fixer'
import englishRules from 'typography-fixer/lib/rules/en-UK'
import markdown from 'typography-fixer/lib/ignores/markdown'

const rules = englishRules.concat(markdown)

const checkString = check(rules)
const checkResults = checkString('Some text "to verify".')

const fixString = fix(rules)
const fixedString = fixString('Some text "to verify".')
```

## Rules And Ignores

`typography-fixer` works using two kind of entities, `rules` and `ignores`. These objects can be created using the `rule` and `ignore` functions exposed by the package.

- `rule(name, match, replacement)` &ndash; defines a pattern for a class of errors identified with its `name`. It returns a frozen `Object` with the given `name`, `match` and `replacement` properties. This function is just a shorthand helper to creates a rule object.

  For instance, the following code defines a rule that replaces three periods by an ellipsis:

  ```js
  rule('triplePeriods', /\.{3,}/, '\u2026'),
  ```
- `ignore(name, ignore, invertRanges)` &ndash; defines parts of a string where the rules don't apply. It returns a frozen `Object` with the given `name`, `ignore` and `invertRanges` properties. When the `invertRanges` parameter is `true` the ignore rule will ignore every part of the string that are not matched by the `ignore` expression.

  For instance, the following code defines an ignore to preserve inline code blocks in Markdown:

  ```js
  ignore('codeInline', /(`{1,2}).*?\1/),
  ```

Both functions take an expression that can be either a `RegExp` or a `String`. It'll be used to create a regular expression (so take care of escaping backslashes when passing a string).

When passing a regular expression, the `global` flag will be automatically defined for the regexes used to scan a string. The `multiline` or `ignoreCase` can be freely defined, they will be preserved in the regexes created in the rule's methods.

### Groups

Rules and ignores can be organized using the last exposed function: `group`. This function takes a name and an array of rules and returns a new array. Every rules in the new array will have a name such as `groupName.originalRuleName`.

Groups can be be nested, so the following is possible:

```js
import {group, rule} from 'typography-fixer'

// The resulting array will contains one rule with the
// name topGroup.nestedGroup.theRule
export default group('topGroup', [
  group('nestedGroup', [
    rule('theRule', /foo/, 'bar')
  ])
])
```

The result is always a frozen flat array so that we can apply every array operations on a ruleset without having to care about nesting. For instance, excluding rules is as simple as running a filter on the array.

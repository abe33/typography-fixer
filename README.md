[![Build Status](https://travis-ci.org/abe33/typography-fixer.svg)](https://travis-ci.org/abe33/typography-fixer)

# Typography-Fixer

This module provides helper functions to check for and fix various punctuations or typographic mistakes and enforce proper use of non-breaking spaces in a text.

This is neither a spell-checker nor a hyphenation helper. While it may impact how line will breaks it don't do anything beyond adding non-breaking spaces here and there.

### What about HTML entities

Typography-Fixer doesn't provide support for HTML entities, it relies solely on unicode characters. The main reason is that [there's already plenty of modules for that purpose](https://www.npmjs.com/search?q=html+entities) and a dedicated utility is much more useful that one that try to do two things at once.

## Install

```bash
npm install --save typography-fixer
```

## Usage

When consuming the package, the two functions you need to care about are `check` and `fix`. But the packages exposes a total of five methods available using `require('typography-fixer')`. On top of that, rulesets can be found at the `typography-fixer/lib/rules` path, while ignore sets are located at `typography-fixer/lib/ignores`.

```js
import {check, fix} from 'typography-fixer'
import rules from 'typography-fixer/lib/rules/en-UK'

// returns an array with all the places where rules have been transgressed
// or undefined if no rules were broken.
const results = check(rules, 'Some text "to verify".')

// returns the string with all rule violations fixed
// in that case it returns: 'Some text “to verify.”'
const results = fix(rules, 'Some text "to verify".')
```

The `check` function takes an array of rules and ignores, and returns an array of violations to the specified rules. A result is an object with the name of the broken rule and an array representing the range of the match. If a rule matches a part of a text but its application does't change this part then the match is simply ignored.

The `fix` function also takes an array of rules and ignores, and returns the corrected string.

Note that since the `check` function operates on a string without modifying it, some fixes won't be detected are they would only be applied after a first batch of rules was applied, and other times several rules can returns violations at the same place, with some of them that won't be applied as they will become irrelevant after some replacements. One example of the latter is the rule for `etc...`, it will returns violations for both `etc` followed by an ellipsis and for an ellipsis formed with three periods.

## Rules And Ignores

Internally, `typography-fixer` works on string using two kind of entities, `rules` and `ignores`. These objects can be created using the `rule` and `ignore` functions exposed by the package.

- `rule(name, expression, replacement)` - defines a kind of errors to fix. The `expression` parameter can be either a `RegExp` or a `String` that will be used to create a regular expression (so take care of escaping backslashes). It returns an `Object` with the given name, and two functions `fix` and `check`, both taking a string as argument.

  For instance, the following code defines a rule that replaces three periods by an ellipsis:

  ```js
  rule('triplePeriods', /\.{3,}/, '\u2026'),
  ```
- `ignore(name, expression)` - defines parts of a string where the rules don't apply. The `expression` parameter can be either a `RegExp` or a `String` that will be used to create a regular expression. It returns an `Object` with the given name and a `ranges` method that returns an array of the text ranges to preserve.

  For instance, the following code defines an ignore to preserve inline code blocks in Markdown:

  ```js
  ignore('codeInline', /(`{1,2}).*?\1/),
  ```

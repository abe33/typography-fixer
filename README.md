[![Build Status](https://travis-ci.org/abe33/typography-fixer.svg)](https://travis-ci.org/abe33/typography-fixer)

# Typography Fixer

This module provides helper functions to check for and fix various punctuations mistakes and enforce proper use of non-breaking spaces in a text.

## Install

```bash
npm install --save typography-fixer
```

## Usage

When consuming the package, the two functions you need to care about are `check` and `fix`.

```js
import {check, fix} from 'typography-fixer'
import rules from 'typography-fixer/lib/rules/en-UK'

// returns an array with all the places where rules have been violated
const results = check(rules, 'Some text "to verify".')

// returns the string with all rule violations fixed
// in that case it returns: 'Some text “to verify.”'
const results = fix(rules, 'Some text "to verify".')
```

The `check` function takes an array of rules and ignores, and returns an array of violations to the specified rules. A result is an object with the name of the violated rule and an array representing the range of the match.

The `fix` function also takes an array of rules and ignores, and returns the corrected string.

**Note that since the `check` function operates on a string without modifying it, some fixes won't be detected are they would only be applied after a first batch of rules applied.**

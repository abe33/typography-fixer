export function check (allRules, string) {
  if (!allRules || !string) {
    throw new Error('The check arguments are mandatory')
  }

  let {ignores, rules} = collectRules(allRules)

  if (rules.length === 0) { return undefined }

  const ranges = flatten(ignores.map((ignore) => {
    return ignore.ranges(string)
  }))

  let results = []

  for (let i = 0, len = rules.length; i < len; i++) {
    const rule = rules[i]
    results = results.concat(rule.check(string))
  }

  results = results.filter((result) => {
    return !ranges.some((range) => {
      return rangesIntersects(range, result.range)
    })
  })

  return results.length > 0 ? results : undefined
}

export function fix (allRules, string) {
  if (!allRules || !string) {
    throw new Error('The fix arguments are mandatory')
  }

  let {ignores, rules} = collectRules(allRules)

  if (rules.length === 0) { return string }

  const ranges = campactRanges(flatten(ignores.map((ignore) => {
    return ignore.ranges(string)
  })))

  const {included, excluded} = splitByRanges(string, ranges)

  for (let i = 0, len = included.length; i < len; i++) {
    for (let j = 0, len = rules.length; j < len; j++) {
      const rule = rules[j]
      included[i] = rule.fix(included[i])
    }
  }

  return alternateJoin(included, excluded)
}

export function group (name, rules) {
  let groupName

  if (Array.isArray(name)) {
    rules = name
    groupName = []
  } else {
    if (!name || !rules) {
      throw new Error('The group rules argument is mandatory')
    }
    groupName = [name]
  }

  return flatten(rules).map((rule) => {
    let newObject = {
      name: groupName.concat(rule.name).join('.')
    }

    for (const key in rule) {
      if (key === 'name') { continue }
      newObject[key] = rule[key]
    }

    return newObject
  })
}

export function rule (name, expression, replacement) {
  if (!name || !expression || !replacement) {
    throw new Error('All arguments of the rule function are mandatory')
  }

  let source

  if (expression instanceof RegExp) {
    source = expression.source
  } else {
    source = expression
  }

  return {
    name,
    check (string) {
      const searchRegExp = new RegExp(source, 'gm')
      const matchRegExp = new RegExp(source)
      const matches = []
      let match
      do {
        match = searchRegExp.exec(string)
        if (match && match[0].replace(matchRegExp, replacement) !== match[0]) {
          matches.push({
            rule: this.name,
            range: [match.index, searchRegExp.lastIndex]
          })
        }
      } while (match)

      return matches
    },
    fix (string) {
      const re = new RegExp(source, 'gm')
      return string.replace(re, replacement)
    }
  }
}

export function ignore (name, expression) {
  if (!name || !expression) {
    throw new Error('All arguments of the ignore function are mandatory')
  }

  let source

  if (expression instanceof RegExp) {
    source = expression.source
  } else {
    source = expression
  }

  return {
    name,
    ranges (string) {
      const re = new RegExp(source, 'gm')
      const ranges = []
      let match

      do {
        match = re.exec(string)
        if (match) { ranges.push([match.index, re.lastIndex]) }
      } while (match)

      return ranges
    }
  }
}

function collectRules (allRules) {
  const ignores = []
  const rules = []

  for (let i = 0, len = allRules.length; i < len; i++) {
    let rule = allRules[i]

    if (rule.ranges) {
      ignores.push(rule)
    } else {
      rules.push(rule)
    }
  }

  return {ignores, rules}
}

function rangesIntersects (rangeA, rangeB) {
  const [startA, endA] = rangeA
  const [startB, endB] = rangeB

  return (startB >= startA && startB <= endA) || (endB >= startA && endB <= endA) || (startA >= startB && startA <= endB) || (endA >= startB && endA <= endB)
}

function flatten (arr) {
  return arr.reduce((memo, el) => { return memo.concat(el) }, [])
}

function splitByRanges (string, ranges) {
  const included = []
  const excluded = []

  let start = 0
  for (let i = 0, len = ranges.length; i < len; i++) {
    const range = ranges[i]

    included.push(string.slice(start, range[0]))
    excluded.push(string.slice(range[0], range[1]))
    start = range[1]
  }
  included.push(string.slice(start, string.length))

  return {included, excluded}
}

function alternateJoin (a, b) {
  let string = ''

  for (let i = 0, len = a.length; i < len; i++) {
    string += a[i]
    if (b[i]) { string += b[i] }
  }

  return string
}

function campactRanges (ranges) {
  if (ranges.length === 0) { return [] }

  const newRanges = [ranges.shift()]

  ranges.forEach((rangeA) => {
    for (let i = 0, len = newRanges.length; i < len; i++) {
      const rangeB = newRanges[i]
      if (rangesIntersects(rangeA, rangeB)) {
        rangeB[0] = Math.min(rangeA[0], rangeB[0])
        rangeB[1] = Math.max(rangeA[1], rangeB[1])
        return
      }
    }

    newRanges.push(rangeA)
  })

  return newRanges.sort((a, b) => {
    return a[0] - b[0]
  })
}

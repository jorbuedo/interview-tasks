type BinaryPermutationChars = '0' | '1' | '*'

/**
 * There's no good way to define this type, but this one works up
 * to 999 characters. More lenght and it complains with:
 * Type instantiation is excessively deep and possibly infinite.ts(2589)
 *
 * Considering the number of results is 2^n based on the number of *, and
 * that Javascript can't count more than 2^53 - 1, it seems a reasonable
 * limit.
 */

type BinaryPermutation<S> = S extends ''
  ? unknown
  : S extends `${BinaryPermutationChars}${infer Tail}`
  ? BinaryPermutation<Tail>
  : never

/**
 * The complexity is either exponential or lineal, depending if there's
 * any * in the input:
 * f(n,m) = O(2^n) + O(m)
 * where n = number of *, and m = input lenght
 */
export const pv1 = <S extends string>(input: S & BinaryPermutation<S>) => {
  let res = ['']
  for (let index = 0, length = input.length; index < length; ++index) {
    if (input[index] === '*') {
      res = res.flatMap((s) => [s.concat('0'), s.concat('1')])
    } else {
      res = res.map((s) => s.concat(input[index]))
    }
  }
  return res
}

/**
 * This version is slightly faster as it reduces the number of string
 * modifications by appending groups of 1|0 instead of one by one.
 */
export const pv2 = <S extends string>(input: S & BinaryPermutation<S>) => {
  let res = ['']
  let streak = ''
  for (let index = 0, length = input.length; index < length; ++index) {
    if (input[index] === '*') {
      res = res.flatMap((s) => [s.concat(streak, '0'), s.concat(streak, '1')])
      streak = ''
    } else {
      streak = streak.concat(input[index])
    }
  }
  res = res.map((s) => s.concat(streak))
  return res
}

/**
 * This version performs worse of all, but depending on the circumstance
 * may be better because it can calculate each string individually, so
 * it could be parallelized.
 */
export const pv3 = <S extends string>(input: S & BinaryPermutation<S>) => {
  const count = input.split('*').length - 1
  const totalLength = Math.pow(2, count)
  const res: string[] = []
  for (let i = 0; i < totalLength; ++i) {
    let nextStr = ''
    let star = 0
    for (let j = 0; j < input.length; ++j) {
      if (input[j] !== '*') {
        nextStr += input[j]
      } else {
        nextStr += (i >> star) % 2
        star++
      }
    }
    res.push(nextStr)
  }
  return res
}

/**
 * Obligatory recursive version, same complexity but worse performance because
 * Javascript just isn't great for recursion.
 */
export const pv4 = <S extends string>(input: S & BinaryPermutation<S>) => {
  const recursive = (str: string, res: string[]) => {
    if (!str) {
      return res
    }
    const current = str.slice(0, 1)
    const next = str.slice(1)

    return recursive(
      next,
      res.flatMap((s) =>
        current === '*' ? [s.concat('0'), s.concat('1')] : [s.concat(current)]
      )
    )
  }

  return recursive(input, [''])
}

export const generateRandomInput = (length: number) => {
  return Array.from(
    { length },
    () => ['0', '1', '*'][Math.floor(Math.random() * 3)]
  ).join('')
}

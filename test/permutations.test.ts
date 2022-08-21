import { describe, expect, test } from 'vitest'
import { pv1, pv2, pv3, pv4 } from '../src/permutations'
import { input_1, snap_1, input_2, snap_2 } from './permutations.snap'

describe('Permutations v1', () => {
  test('base cases', () => {
    expect(pv1('')).toEqual([''])
    expect(pv1('1')).toEqual(['1'])
    expect(pv1('0')).toEqual(['0'])
    expect(pv1('*')).toEqual(expect.arrayContaining(['0', '1']))
  })

  test('single wildcard', () => {
    expect(pv1('*11')).toEqual(expect.arrayContaining(['011', '111']))
    expect(pv1('0*1')).toEqual(expect.arrayContaining(['001', '011']))
    expect(pv1('00*')).toEqual(expect.arrayContaining(['000', '001']))
  })

  test('multiple wildcards', () => {
    expect(pv1('*01*')).toEqual(
      expect.arrayContaining(['0010', '0011', '1010', '1011'])
    )
  })

  test('long input', () => {
    // If modified, verify the snapshot is correct with a different method
    expect(pv1(input_1)).toMatchInlineSnapshot(snap_1)
  })

  test('very long input', () => {
    // If modified, verify the snapshot is correct with a different method
    expect(pv1(input_2)).toMatchInlineSnapshot(snap_2)
  })
})

describe('Permutations v2', () => {
  test('base cases', () => {
    expect(pv2('')).toEqual([''])
    expect(pv2('1')).toEqual(['1'])
    expect(pv2('0')).toEqual(['0'])
    expect(pv2('*')).toEqual(expect.arrayContaining(['0', '1']))
  })

  test('single wildcard', () => {
    expect(pv2('*11')).toEqual(expect.arrayContaining(['011', '111']))
    expect(pv2('0*1')).toEqual(expect.arrayContaining(['001', '011']))
    expect(pv2('00*')).toEqual(expect.arrayContaining(['000', '001']))
  })

  test('multiple wildcards', () => {
    expect(pv2('*01*')).toEqual(
      expect.arrayContaining(['0010', '0011', '1010', '1011'])
    )
  })

  test('long input', () => {
    // If modified, verify the snapshot is correct with a different method
    expect(pv2(input_1)).toMatchInlineSnapshot(snap_1)
  })

  test('very long input', () => {
    // If modified, verify the snapshot is correct with a different method
    expect(pv2(input_2)).toMatchInlineSnapshot(snap_2)
  })
})

describe('Permutations v3', () => {
  test('base cases', () => {
    expect(pv3('')).toEqual([''])
    expect(pv3('1')).toEqual(['1'])
    expect(pv3('0')).toEqual(['0'])
    expect(pv3('*')).toEqual(expect.arrayContaining(['0', '1']))
  })

  test('single wildcard', () => {
    expect(pv3('*11')).toEqual(expect.arrayContaining(['011', '111']))
    expect(pv3('0*1')).toEqual(expect.arrayContaining(['001', '011']))
    expect(pv3('00*')).toEqual(expect.arrayContaining(['000', '001']))
  })

  test('multiple wildcards', () => {
    expect(pv3('*01*')).toEqual(
      expect.arrayContaining(['0010', '0011', '1010', '1011'])
    )
  })

  test('long input', () => {
    // If modified, verify the snapshot is correct with a different method
    expect(pv3(input_1).sort()).toMatchInlineSnapshot(snap_1)
  })

  test('very long input', () => {
    // If modified, verify the snapshot is correct with a different method
    expect(pv3(input_2).sort()).toMatchInlineSnapshot(snap_2)
  })
})

describe('Permutations v4', () => {
  test('base cases', () => {
    expect(pv4('')).toEqual([''])
    expect(pv4('1')).toEqual(['1'])
    expect(pv4('0')).toEqual(['0'])
    expect(pv4('*')).toEqual(expect.arrayContaining(['0', '1']))
  })

  test('single wildcard', () => {
    expect(pv4('*11')).toEqual(expect.arrayContaining(['011', '111']))
    expect(pv4('0*1')).toEqual(expect.arrayContaining(['001', '011']))
    expect(pv4('00*')).toEqual(expect.arrayContaining(['000', '001']))
  })

  test('multiple wildcards', () => {
    expect(pv4('*01*')).toEqual(
      expect.arrayContaining(['0010', '0011', '1010', '1011'])
    )
  })

  test('long input', () => {
    // If modified, verify the snapshot is correct with a different method
    expect(pv4(input_1).sort()).toMatchInlineSnapshot(snap_1)
  })

  test('very long input', () => {
    // If modified, verify the snapshot is correct with a different method
    expect(pv4(input_2).sort()).toMatchInlineSnapshot(snap_2)
  })
})

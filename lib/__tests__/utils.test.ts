import { cn } from '../utils'

describe('cn', () => {
  it('concatenates class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('merges conflicting tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('px-2', 'pl-4')).toBe('px-2 pl-4')
    expect(cn('p-2', 'px-4')).toBe('p-2 px-4')
    expect(cn('px-2', 'p-4')).toBe('p-4')
  })

  it('ignores falsey values', () => {
    expect(cn('a', '', null, undefined, false, 'b')).toBe('a b')
  })

  it('ignores duplicate values', () => {
    expect(cn('text-red-500', 'text-red-500')).toBe('text-red-500')
  })

  it('supports object style inputs', () => {
    expect(cn({ a: true, b: false }, 'c')).toBe('a c')
  })

  it('merges array inputs', () => {
    expect(cn(['a', { b: true }], ['c', ['d']], { e: false }, 'f')).toBe(
      'a b c d f'
    )
  })

  it('handles nested arrays and objects', () => {
    expect(cn(['a', ['b']], { c: true })).toBe('a b c')
  })
})

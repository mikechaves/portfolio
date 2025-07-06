import { cn } from '../utils'

describe('cn', () => {
  it('concatenates class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('merges conflicting tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('px-2', 'pl-4')).toBe('px-2 pl-4')
  })

  it('ignores falsey values', () => {
    expect(cn('a', '', null, undefined, false, 'b')).toBe('a b')
  })

  it('ignores duplicate values', () => {
    expect(cn('text-red-500', 'text-red-500')).toBe('text-red-500')
  })
})

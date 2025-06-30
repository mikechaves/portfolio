import { cn } from '../utils'

describe('cn', () => {
  it('concatenates class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('ignores falsey and duplicate values', () => {
    expect(cn('a', '', null, undefined, false, 'b')).toBe('a b')
    expect(cn('text-red-500', 'text-red-500')).toBe('text-red-500')
  })
})

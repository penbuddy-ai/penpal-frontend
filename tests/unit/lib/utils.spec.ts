import { cn } from '../../../src/lib/utils';

describe('lib/utils cn', () => {
  it('merges class names and tailwind variants', () => {
    expect(cn('p-2', 'text-sm', undefined, null, false)).toBe('p-2 text-sm');
    expect(cn('p-2', 'p-3')).toBe('p-3');
  });
});

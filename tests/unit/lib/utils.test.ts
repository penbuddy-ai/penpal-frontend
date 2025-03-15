/**
 * Unit tests for utils functions
 */
import { cn } from '../../../src/lib/utils';

describe('cn function', () => {
  test('should combine class names correctly', () => {
    // Test with simple strings
    expect(cn('class1', 'class2')).toBe('class1 class2');

    // Test with conditional classes
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');

    // Test with array of classes
    expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');

    // Test with object notation
    expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');

    // Test with Tailwind classes that should be merged
    expect(cn('p-4 bg-red-500', 'p-8')).toBe('bg-red-500 p-8');
  });
});

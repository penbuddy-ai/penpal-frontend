import { tokenUtils, validationUtils } from '../../../src/lib/auth';

describe('auth tokenUtils', () => {
  it('decodes and checks expiry safely', () => {
    // token with exp in the future: header.payload.signature (payload: {"exp": 9999999999})
    const payload = Buffer.from(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })
    ).toString('base64url');
    const token = `x.${payload}.y`;
    expect(tokenUtils.decode(token)).toHaveProperty('exp');
    expect(tokenUtils.isExpired(token)).toBe(false);
    expect(tokenUtils.getTimeToExpiry(token)).toBeGreaterThan(0);
  });

  it('handles invalid token gracefully', () => {
    const decoded = tokenUtils.decode('invalid');
    expect(decoded).toBeNull();
    expect(tokenUtils.isExpired('invalid')).toBe(true);
    expect(tokenUtils.getTimeToExpiry('invalid')).toBe(0);
  });
});

describe('auth validationUtils', () => {
  it('validates password strength and returns errors', () => {
    const weak = validationUtils.validatePassword('abc');
    expect(weak.isValid).toBe(false);
    expect(weak.errors.length).toBeGreaterThan(0);

    const strong = validationUtils.validatePassword('Aa1!aaaa');
    expect(strong.isValid).toBe(true);
  });
});

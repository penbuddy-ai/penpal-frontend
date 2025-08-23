import * as userUtils from '../../../src/lib/user-utils';

jest.mock('../../../src/store/useUserStore', () => ({
  __esModule: true,
  default: {
    getState: () => ({
      getCurrentUserId: () => 'user-123',
      isAuthenticated: true,
      user: { id: 'user-123', email: 'test@example.com' },
    }),
  },
}));

describe('user-utils', () => {
  it('getCurrentUserId returns id', () => {
    expect(userUtils.getCurrentUserId()).toBe('user-123');
  });

  it('isUserAuthenticated returns true', () => {
    expect(userUtils.isUserAuthenticated()).toBe(true);
  });

  it('getCurrentUser returns object', () => {
    expect(userUtils.getCurrentUser()).toEqual({ id: 'user-123', email: 'test@example.com' });
  });

  it('requireCurrentUserId returns id or throws', () => {
    expect(userUtils.requireCurrentUserId()).toBe('user-123');
  });
});

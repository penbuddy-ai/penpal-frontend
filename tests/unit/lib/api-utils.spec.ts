import {
  authenticatedFetch,
  authenticatedGet,
  authenticatedPost,
  authenticatedPatch,
  authenticatedDelete,
  getAuthHeaders,
} from '../../../src/lib/api-utils';

describe('api-utils', () => {
  const originalFetch = global.fetch as any;

  beforeEach(() => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
  });

  afterEach(() => {
    (global as any).fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('getAuthHeaders returns content-type only (cookies used)', () => {
    expect(getAuthHeaders()).toHaveProperty('Content-Type', 'application/json');
  });

  it('authenticatedFetch builds /users/me endpoints by default', async () => {
    await authenticatedFetch('/onboarding/status');
    expect(global.fetch).toHaveBeenCalled();
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toMatch(/\/users\/me\/onboarding\/status$/);
  });

  it('authenticatedFetch respects includeUserId=false', async () => {
    await authenticatedFetch('/public/info', {}, false);
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toMatch(/\/public\/info$/);
  });

  it('authenticatedGet/Post/Patch/Delete call through', async () => {
    await authenticatedGet('/onboarding/status');
    await authenticatedPost('/onboarding/progress', { step: 1 });
    await authenticatedPatch('/onboarding/progress', { step: 2 });
    await authenticatedDelete('/onboarding/complete');
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(4);
  });

  it('throws on non-ok responses with JSON body', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ message: 'Invalid' }),
    });
    await expect(authenticatedGet('/oops')).rejects.toThrow('Invalid');
  });
});

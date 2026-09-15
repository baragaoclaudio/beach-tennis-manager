import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, resetAuthClientState } from './http-client';
import { getAuthenticatedUser, loginAdmin } from './auth-api';

const admin = {
  id: 'admin-id',
  email: 'admin@example.com',
  role: 'ADMIN' as const
};

function jsonResponse(status: number, body: unknown = {}): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  } as Response;
}

function requestUrl(input: RequestInfo | URL): string {
  return String(input);
}

async function expectPromisePending(promise: Promise<unknown>): Promise<void> {
  let settled = false;
  void promise.then(
    () => {
      settled = true;
    },
    () => {
      settled = true;
    }
  );
  await Promise.resolve();
  expect(settled).toBe(false);
}

describe('auth HTTP client', () => {
  beforeEach(() => {
    resetAuthClientState();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    resetAuthClientState();
    vi.restoreAllMocks();
  });

  it('retries /auth/me once after a successful single refresh', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(401))
      .mockResolvedValueOnce(jsonResponse(200, { user: admin }))
      .mockResolvedValueOnce(jsonResponse(200, { user: admin }));

    await expect(getAuthenticatedUser()).resolves.toEqual(admin);

    expect(vi.mocked(fetch).mock.calls.map(([input, init]) => [requestUrl(input), init])).toEqual([
      ['/auth/me', { credentials: 'include', cache: 'no-store' }],
      ['/auth/refresh', { method: 'POST', credentials: 'include', cache: 'no-store' }],
      ['/auth/me', { credentials: 'include', cache: 'no-store' }]
    ]);
  });

  it('does not refresh again after reuse detection (409)', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(401))
      .mockResolvedValueOnce(jsonResponse(409))
      .mockResolvedValueOnce(jsonResponse(401));

    await expect(getAuthenticatedUser()).resolves.toBeNull();
    await expect(getAuthenticatedUser()).resolves.toBeNull();

    const refreshCalls = vi.mocked(fetch).mock.calls.filter(([input]) => requestUrl(input) === '/auth/refresh');
    expect(refreshCalls).toHaveLength(1);
  });

  it('shares one in-flight refresh across concurrent 401s', async () => {
    const firstMeResolvers: Array<(value: Response) => void> = [];
    let notifyBothFirstMePending: (() => void) | undefined;
    const bothFirstMePending = new Promise<void>((resolve) => {
      notifyBothFirstMePending = resolve;
    });
    let notifyRefreshStarted: (() => void) | undefined;
    const refreshStarted = new Promise<void>((resolve) => {
      notifyRefreshStarted = resolve;
    });
    let releaseRefresh: (() => void) | undefined;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });
    let meCalls = 0;
    let refreshCalls = 0;

    vi.mocked(fetch).mockImplementation((input) => {
      const url = requestUrl(input);

      if (url === '/auth/me') {
        meCalls += 1;

        if (meCalls <= 2) {
          return new Promise((resolve) => {
            firstMeResolvers.push(resolve);

            if (firstMeResolvers.length === 2) {
              notifyBothFirstMePending?.();
            }
          });
        }

        return Promise.resolve(jsonResponse(200, { user: admin }));
      }

      if (url === '/auth/refresh') {
        refreshCalls += 1;
        notifyRefreshStarted?.();
        return refreshGate.then(() => jsonResponse(200, { user: admin }));
      }

      return Promise.reject(new Error(`unexpected url ${url}`));
    });

    const pendingA = getAuthenticatedUser();
    const pendingB = getAuthenticatedUser();

    await bothFirstMePending;
    expect(firstMeResolvers).toHaveLength(2);
    expect(meCalls).toBe(2);
    expect(refreshCalls).toBe(0);
    await expectPromisePending(pendingA);
    await expectPromisePending(pendingB);

    firstMeResolvers[0](jsonResponse(401));
    firstMeResolvers[1](jsonResponse(401));

    await refreshStarted;
    expect(refreshCalls).toBe(1);
    await expectPromisePending(pendingA);
    await expectPromisePending(pendingB);

    releaseRefresh?.();

    await expect(Promise.all([pendingA, pendingB])).resolves.toEqual([admin, admin]);
    expect(refreshCalls).toBe(1);
    expect(meCalls).toBe(4);
  });

  it('does not treat login 401 as an expired access token', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(401));

    await expect(loginAdmin(admin.email, 'wrong')).rejects.toThrow('Email ou senha inválidos.');
    expect(vi.mocked(fetch).mock.calls.map(([input]) => requestUrl(input))).toEqual(['/auth/admin/login']);
  });

  it('does not send Authorization headers or persist tokens', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(401));

    await getAuthenticatedUser();

    for (const [, init] of vi.mocked(fetch).mock.calls) {
      const headers = new Headers(init?.headers);
      expect(headers.has('Authorization')).toBe(false);
    }

    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });

  it('keeps credentials include on explicit API requests', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200));

    await apiRequest('/auth/logout', { method: 'POST', retryOnUnauthorized: false });

    expect(fetch).toHaveBeenCalledWith('/auth/logout', {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store'
    });
  });
});

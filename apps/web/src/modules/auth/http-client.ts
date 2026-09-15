const LOGIN_PATH = '/auth/admin/login';
const REFRESH_PATH = '/auth/refresh';
const LOGOUT_PATH = '/auth/logout';

const cookieCredentials: RequestCredentials = 'include';

let refreshInFlight: Promise<boolean> | null = null;
let refreshBlocked = false;

export type ApiRequestInit = RequestInit & {
  retryOnUnauthorized?: boolean;
};

function withAuthCookies(init: RequestInit = {}): RequestInit {
  return {
    ...init,
    credentials: cookieCredentials,
    cache: 'no-store'
  };
}

function shouldAttemptRefresh(url: string): boolean {
  return url !== LOGIN_PATH && url !== REFRESH_PATH && url !== LOGOUT_PATH;
}

async function performRefresh(): Promise<boolean> {
  const response = await fetch(REFRESH_PATH, withAuthCookies({ method: 'POST' }));

  if (response.status === 409) {
    refreshBlocked = true;
    return false;
  }

  return response.ok;
}

export async function refreshSession(): Promise<boolean> {
  if (refreshBlocked) {
    return false;
  }

  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

export function clearRefreshBlock(): void {
  refreshBlocked = false;
}

export function resetAuthClientState(): void {
  refreshInFlight = null;
  refreshBlocked = false;
}

export async function apiRequest(url: string, init: ApiRequestInit = {}): Promise<Response> {
  const { retryOnUnauthorized = true, ...fetchInit } = init;
  const requestInit = withAuthCookies(fetchInit);
  const response = await fetch(url, requestInit);

  if (
    response.status !== 401
    || !retryOnUnauthorized
    || !shouldAttemptRefresh(url)
  ) {
    return response;
  }

  const refreshed = await refreshSession();

  if (!refreshed) {
    return response;
  }

  return fetch(url, requestInit);
}

export const ACCESS_TOKEN_COOKIE_NAME = 'btm_access';
export const REFRESH_TOKEN_COOKIE_NAME = 'btm_refresh';
export const SESSION_COOKIE_NAME = 'btm_session';

export function authCookieOptions(maxAgeSeconds: number) {
  return {
    ...authCookieClearOptions(),
    maxAge: maxAgeSeconds
  };
}

export function authCookieClearOptions() {
  return {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  };
}

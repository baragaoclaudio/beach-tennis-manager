import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ACCESS_TOKEN_TTL_SECONDS } from '../../../infrastructure/auth/jwt-access-token.js';
import { getAuthenticatedUser } from '../application/get-authenticated-user.js';
import {
  InvalidAdminCredentialsError,
  hashSessionToken,
  loginAdmin,
  REFRESH_TOKEN_TTL_SECONDS
} from '../application/login-admin.js';
import { revokePresentedRefreshToken } from '../application/revoke-refresh-token.js';
import type {
  AccessTokenService,
  OpaqueTokenGenerator,
  PasswordVerifier,
  RefreshTokenRepository,
  SessionRepository,
  UserRepository
} from '../application/ports.js';
import {
  RefreshTokenExpiredError,
  RefreshTokenNotFoundError,
  RefreshTokenReuseDetectedError,
  RefreshTokenRevokedError,
  rotateRefreshToken
} from '../application/rotate-refresh-token.js';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  authCookieClearOptions,
  authCookieOptions
} from './auth-cookies.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type AuthRoutesOptions = {
  users: UserRepository;
  sessions: SessionRepository;
  passwords: PasswordVerifier;
  accessTokens: AccessTokenService;
  refreshTokens: RefreshTokenRepository;
  opaqueTokens: OpaqueTokenGenerator;
};

export const authRoutes: FastifyPluginAsync<AuthRoutesOptions> = async (
  app,
  options
) => {
  app.post('/auth/admin/login', async (request, reply) => {
    const input = loginSchema.safeParse(request.body);

    if (!input.success) {
      return reply.code(400).send({
        error: { category: 'INVALID_INPUT', message: 'Invalid login payload' }
      });
    }

    try {
      const result = await loginAdmin(
        input.data.email,
        input.data.password,
        options
      );

      reply.setCookie(
        ACCESS_TOKEN_COOKIE_NAME,
        result.accessToken,
        authCookieOptions(ACCESS_TOKEN_TTL_SECONDS)
      );
      reply.setCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        result.refreshToken,
        authCookieOptions(REFRESH_TOKEN_TTL_SECONDS)
      );

      return reply.send({ user: result.user });
    } catch (error) {
      if (error instanceof InvalidAdminCredentialsError) {
        return reply.code(401).send({
          error: {
            category: 'AUTHENTICATION_REQUIRED',
            message: 'Invalid administrator credentials'
          }
        });
      }

      throw error;
    }
  });

  app.get('/auth/me', async (request, reply) => {
    const token = request.cookies[ACCESS_TOKEN_COOKIE_NAME];

    if (!token) {
      return reply.code(401).send({
        error: {
          category: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required'
        }
      });
    }

    const user = await getAuthenticatedUser(token, options.accessTokens, options.users);

    if (!user) {
      return reply.code(401).send({
        error: {
          category: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required'
        }
      });
    }

    return reply.send({ user });
  });

  app.post('/auth/refresh', async (request, reply) => {
    const presentedRefreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!presentedRefreshToken) {
      return reply.code(401).send({
        error: {
          category: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required'
        }
      });
    }

    try {
      const rotated = await rotateRefreshToken(presentedRefreshToken, {
        refreshTokens: options.refreshTokens,
        users: options.users,
        tokens: options.opaqueTokens
      });
      const accessToken = await options.accessTokens.issue({
        sub: rotated.user.id,
        email: rotated.user.email,
        role: rotated.user.role
      });

      reply.setCookie(
        ACCESS_TOKEN_COOKIE_NAME,
        accessToken,
        authCookieOptions(ACCESS_TOKEN_TTL_SECONDS)
      );
      reply.setCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        rotated.refreshToken,
        authCookieOptions(REFRESH_TOKEN_TTL_SECONDS)
      );

      return reply.send({ user: rotated.user });
    } catch (error) {
      if (error instanceof RefreshTokenReuseDetectedError) {
        return reply.code(409).send({
          error: {
            category: 'CONFLICT',
            message: 'Authentication required'
          }
        });
      }

      if (
        error instanceof RefreshTokenNotFoundError ||
        error instanceof RefreshTokenExpiredError ||
        error instanceof RefreshTokenRevokedError
      ) {
        return reply.code(401).send({
          error: {
            category: 'AUTHENTICATION_REQUIRED',
            message: 'Authentication required'
          }
        });
      }

      throw error;
    }
  });

  app.post('/auth/logout', async (request, reply) => {
    const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (refreshToken) {
      await revokePresentedRefreshToken(refreshToken, options.refreshTokens);
    }

    const sessionToken = request.cookies[SESSION_COOKIE_NAME];

    if (sessionToken) {
      await options.sessions.deleteByTokenHash(hashSessionToken(sessionToken));
    }

    const clearOptions = authCookieClearOptions();
    reply.clearCookie(ACCESS_TOKEN_COOKIE_NAME, clearOptions);
    reply.clearCookie(REFRESH_TOKEN_COOKIE_NAME, clearOptions);
    reply.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    return reply.code(204).send();
  });
};

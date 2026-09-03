import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import {
  getAuthenticatedUser
} from '../application/get-authenticated-user.js';
import {
  InvalidAdminCredentialsError,
  hashSessionToken,
  loginAdmin,
  ADMIN_SESSION_TTL_SECONDS
} from '../application/login-admin.js';
import type {
  PasswordVerifier,
  SessionRepository,
  UserRepository
} from '../application/ports.js';

const SESSION_COOKIE_NAME = 'btm_session';
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type AuthRoutesOptions = {
  users: UserRepository;
  sessions: SessionRepository;
  passwords: PasswordVerifier;
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

      reply.setCookie(SESSION_COOKIE_NAME, result.token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ADMIN_SESSION_TTL_SECONDS
      });

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
    const token = request.cookies[SESSION_COOKIE_NAME];

    if (!token) {
      return reply.code(401).send({
        error: {
          category: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required'
        }
      });
    }

    const user = await getAuthenticatedUser(token, options.sessions);

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

  app.post('/auth/logout', async (request, reply) => {
    const token = request.cookies[SESSION_COOKIE_NAME];

    if (token) {
      await options.sessions.deleteByTokenHash(hashSessionToken(token));
    }

    reply.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    return reply.code(204).send();
  });
};
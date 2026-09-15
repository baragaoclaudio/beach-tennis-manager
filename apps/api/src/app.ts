import './load-env.js';
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import { database } from './infrastructure/database/connection.js';
import { passwordVerifier } from './infrastructure/auth/password-verifier.js';
import { createJwtAccessTokenServiceFromEnv } from './infrastructure/auth/jwt-access-token.js';
import { opaqueRefreshTokenGenerator } from './infrastructure/auth/opaque-refresh-token.js';
import { DrizzleRefreshTokenRepository } from './infrastructure/auth/refresh-token-repository.js';
import { DrizzleSessionRepository, DrizzleUserRepository } from './infrastructure/auth/session-repository.js';
import { authRoutes } from './modules/auth/http/routes.js';

export function buildApp() {
  const app = Fastify({ logger: true });
  const users = new DrizzleUserRepository(database);
  const sessions = new DrizzleSessionRepository(database);
  const refreshTokens = new DrizzleRefreshTokenRepository(database);
  const accessTokens = createJwtAccessTokenServiceFromEnv();

  app.register(cookie);
  app.get('/health', async () => ({ status: 'ok' }));
  app.register(authRoutes, {
    users,
    sessions,
    passwords: passwordVerifier,
    accessTokens,
    refreshTokens,
    opaqueTokens: opaqueRefreshTokenGenerator
  });

  return app;
}
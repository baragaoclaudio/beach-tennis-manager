import 'dotenv/config';
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import { database } from './infrastructure/database/connection.js';
import { passwordVerifier } from './infrastructure/auth/password-verifier.js';
import { DrizzleSessionRepository, DrizzleUserRepository } from './infrastructure/auth/session-repository.js';
import { authRoutes } from './modules/auth/http/routes.js';

export function buildApp() {
  const app = Fastify({ logger: true });
  const users = new DrizzleUserRepository(database);
  const sessions = new DrizzleSessionRepository(database);

  app.register(cookie);
  app.get('/health', async () => ({ status: 'ok' }));
  app.register(authRoutes, { users, sessions, passwords: passwordVerifier });

  return app;
}
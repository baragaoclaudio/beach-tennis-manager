import 'dotenv/config';
import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import { prisma } from './infrastructure/database/prisma-client.js';
import { passwordVerifier } from './infrastructure/auth/password-verifier.js';
import { PrismaSessionRepository, PrismaUserRepository } from './infrastructure/auth/session-repository.js';
import { authRoutes } from './modules/auth/http/routes.js';

export function buildApp() {
  const app = Fastify({ logger: true });
  const users = new PrismaUserRepository(prisma);
  const sessions = new PrismaSessionRepository(prisma);

  app.register(cookie);
  app.get('/health', async () => ({ status: 'ok' }));
  app.register(authRoutes, { users, sessions, passwords: passwordVerifier });

  return app;
}
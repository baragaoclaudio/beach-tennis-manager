import Fastify from 'fastify';

const port = Number(process.env.API_PORT ?? 3333);
const host = process.env.API_HOST ?? '0.0.0.0';
const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok' }));

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
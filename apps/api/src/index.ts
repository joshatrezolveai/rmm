import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { healthRoutes } from './routes/health';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
  });

  // Register Swagger
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'CloudRMM API',
        description: 'Multi-tenant cloud-native RMM platform API',
        version: '0.1.0',
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'health', description: 'Health check endpoints' },
        { name: 'partners', description: 'Partner management' },
        { name: 'organizations', description: 'Organization management' },
        { name: 'sites', description: 'Site management' },
        { name: 'devices', description: 'Device management' },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });

  // Register routes
  await fastify.register(healthRoutes, { prefix: '/api/v1' });

  return fastify;
}

async function main() {
  try {
    const server = await buildServer();

    await server.listen({ port: PORT, host: HOST });

    console.log(`✅ API server running on http://${HOST}:${PORT}`);
    console.log(`📚 API docs available at http://${HOST}:${PORT}/docs`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

main();

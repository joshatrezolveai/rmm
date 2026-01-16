import 'dotenv/config';
import Fastify from 'fastify';
import websocket from '@fastify/websocket';

const PORT = parseInt(process.env.GATEWAY_PORT || '3002', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register WebSocket plugin
  await fastify.register(websocket);

  // Health check
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      connectedAgents: 0, // TODO: Track connected agents
    };
  });

  // WebSocket endpoint for agent connections
  fastify.register(async (fastify) => {
    fastify.get(
      '/agent/connect',
      { websocket: true },
      (connection, req) => {
        fastify.log.info('New agent connection established');

        connection.socket.on('message', (message: Buffer) => {
          try {
            const data = JSON.parse(message.toString());
            fastify.log.info({ data }, 'Received message from agent');

            // Echo back for now - will implement proper handlers later
            connection.socket.send(
              JSON.stringify({
                type: 'ack',
                timestamp: new Date().toISOString(),
              })
            );
          } catch (error) {
            fastify.log.error({ error }, 'Error processing message');
          }
        });

        connection.socket.on('close', () => {
          fastify.log.info('Agent connection closed');
        });

        connection.socket.on('error', (error) => {
          fastify.log.error({ error }, 'WebSocket error');
        });

        // Send welcome message
        connection.socket.send(
          JSON.stringify({
            type: 'welcome',
            message: 'Connected to CloudRMM Agent Gateway',
            timestamp: new Date().toISOString(),
          })
        );
      }
    );
  });

  return fastify;
}

async function main() {
  try {
    const server = await buildServer();

    await server.listen({ port: PORT, host: HOST });

    console.log(`✅ Agent Gateway running on ws://${HOST}:${PORT}`);
    console.log(`📡 WebSocket endpoint: ws://${HOST}:${PORT}/agent/connect`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

main();

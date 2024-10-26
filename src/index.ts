import express from 'express';
import basicAuth from 'express-basic-auth';
import { CONFIG } from './config.js';
import BullBoardAdapter, { BOARD_BASE_PATH } from './bull-board.js';
import MonitorAdapter from './bull-monitor.js';
import { closeQueues } from './queues.js';

const app = express();

// Basic authentication middleware
const auth = CONFIG.AUTH.ENABLED
    ? basicAuth({
        users: { [CONFIG.AUTH.USERNAME]: CONFIG.AUTH.PASSWORD },
        challenge: true,
    })
    : (_req: express.Request, _res: express.Response, next: express.NextFunction) => next();

async function startServer() {
    try {
        // Mount Bull Board
        app.use(BOARD_BASE_PATH, auth, BullBoardAdapter.getRouter());

        // Mount Bull Monitor
        app.use('/', auth, MonitorAdapter.getRouter());

        // Health check endpoint
        app.get('/health', (_req, res) => {
            res.json({ status: 'healthy' });
        });

        const server = app.listen(CONFIG.PORT, () => {
            console.log(`🚀 Queue Monitor UI running on port ${CONFIG.PORT}`);
            console.log(`📊 Bull Board available at http://localhost:${CONFIG.PORT}${BOARD_BASE_PATH}`);
            console.log(`📈 Bull Monitor available at http://localhost:${CONFIG.PORT}`);
        });

        // Graceful shutdown
        const shutdown = async (signal: string) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                console.log('HTTP server closed.');

                try {
                    await closeQueues();
                    console.log('Queue connections closed.');
                    process.exit(0);
                } catch (error) {
                    console.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
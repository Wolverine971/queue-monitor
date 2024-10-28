import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { CONFIG } from './config.js';
import { getQueue } from './queues.js';

export const BOARD_BASE_PATH = '/board';

// Create the Express adapter for Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(BOARD_BASE_PATH);

// Get all queues for Bull Board
const queues = Object.values(CONFIG.QUEUE_NAMES).map(queueName => {
    const queue = getQueue(queueName);
    return new BullMQAdapter(queue);
});

// Create Bull Board
createBullBoard({
    queues,
    serverAdapter,
});

export const bullBoardAdapter = serverAdapter;
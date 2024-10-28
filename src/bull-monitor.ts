import { BullMonitorExpress } from '@bull-monitor/express';
import { BullMQAdapter } from '@bull-monitor/root/dist/bullmq-adapter';
import { CONFIG } from './config.js';
import { getQueue } from './queues.js';

// Create Bull Monitor adapters for each queue
const bullMQQueues = Object.values(CONFIG.QUEUE_NAMES).map(queueName => {
    const queue = getQueue(queueName);
    return new BullMQAdapter(queue);
});

// Create the Bull Monitor instance
const bullMonitorExpress = new BullMonitorExpress({
    queues: bullMQQueues,
    gqlIntrospection: process.env.NODE_ENV !== 'production',
    metrics: {
        collectInterval: { minutes: 5 }, // Collect metrics every 5 minutes
        maxMetrics: 100,
        // Optionally disable metrics for specific queues
        // blacklist: ['email-queue'],
    },
});

export { bullMonitorExpress };
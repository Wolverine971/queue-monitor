import { createBullMonitor } from '@bull-monitor/root';
import { BullMQAdapter } from '@bull-monitor/root/dist/bullmq-adapter';
import { ExpressAdapter } from '@bull-monitor/express';
import { CONFIG } from './config.js';
import { getQueue } from './queues.js';

// Create Express adapter
const monitorAdapter = new ExpressAdapter();

// Create Bull Monitor adapters for each queue
const bullMQQueues = Object.values(CONFIG.QUEUE_NAMES).map(queueName => {
    const queue = getQueue(queueName);
    return new BullMQAdapter(queue);
});

// Create the monitor
const monitor = createBullMonitor({
    queues: bullMQQueues,
    adapter: monitorAdapter,
    options: {
        metrics: {
            collectInterval: 5000, // Collect metrics every 5 seconds
        },
    },
});

export default monitorAdapter;
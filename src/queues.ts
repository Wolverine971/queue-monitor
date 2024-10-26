import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { CONFIG, type QueueName } from './config.js';

// Create Redis connection
const connection = new IORedis(CONFIG.REDIS_URL!, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

// Queue cache
const queueCache = new Map<QueueName, Queue>();

// Get or create queue instance
export function getQueue(queueName: QueueName): Queue {
    if (!queueCache.has(queueName)) {
        const queue = new Queue(queueName, {
            connection: connection.duplicate(),
        });
        queueCache.set(queueName, queue);
    }
    return queueCache.get(queueName)!;
}

// Close all queues
export async function closeQueues(): Promise<void> {
    const closePromises = Array.from(queueCache.values()).map(queue => queue.close());
    await Promise.all(closePromises);
    await connection.quit();
}
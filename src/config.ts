import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

export const CONFIG = {
    PORT: process.env.PORT || 3000,
    REDIS_URL: process.env.UPSTASH_REDIS_URL,
    AUTH: {
        USERNAME: process.env.AUTH_USERNAME || 'admin',
        PASSWORD: process.env.AUTH_PASSWORD || 'admin',
        ENABLED: process.env.NODE_ENV === 'production',
    },
    QUEUE_NAMES: {
        EMAIL: 'email-queue',
        NOTIFICATION: 'notification-queue',
        DATA_PROCESSING: 'data-processing-queue',
    },
} as const;

if (!CONFIG.REDIS_URL) {
    throw new Error('UPSTASH_REDIS_URL is required in environment variables');
}

export type QueueName = typeof CONFIG.QUEUE_NAMES[keyof typeof CONFIG.QUEUE_NAMES];
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiRouter } from './routes/index.js';
export function createApp() {
    const app = express();
    app.use(cors({
        origin: env.corsOrigin,
        credentials: true
    }));
    app.use(express.json({ limit: '1mb' }));
    app.get('/health', (_req, res) => {
        res.json({ ok: true, service: 'pathwise-backend', env: env.nodeEnv });
    });
    app.use('/api', apiRouter);
    app.use((_req, res) => {
        res.status(404).json({ message: 'Not found' });
    });
    return app;
}

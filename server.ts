import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './backend/src/routes/index.js';
import { connectDb } from './backend/src/config/db.js';
import { primeLiveData, startLiveRefresh } from './backend/src/services/live-refresh.service.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB or fallback in-memory store
  try {
    await connectDb();
    await primeLiveData();
    startLiveRefresh();
  } catch {
    console.warn('[PathWise] Initial live data priming completed with fallback');
  }

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // API health
  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'pathwise-fullstack', status: 'running' });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'pathwise-fullstack', status: 'running' });
  });

  // Mount API router
  app.use('/api', apiRouter);

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PathWise] Full-stack application running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[PathWise] Server boot error:', err);
});

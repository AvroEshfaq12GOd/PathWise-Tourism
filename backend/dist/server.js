import { createApp } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { primeLiveData, startLiveRefresh } from './services/live-refresh.service.js';
async function bootstrap() {
    await connectDb();
    await primeLiveData();
    startLiveRefresh();
    const app = createApp();
    app.listen(env.port, () => {
        console.log(`PathWise backend listening on http://localhost:${env.port}`);
    });
}
bootstrap().catch((error) => {
    console.error('Failed to start backend', error);
    process.exit(1);
});

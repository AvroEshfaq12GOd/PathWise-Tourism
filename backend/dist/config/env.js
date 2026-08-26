import dotenv from 'dotenv';
dotenv.config();
function required(name) {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
export const env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 4000),
    mongoUri: required('MONGODB_URI'),
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY?.trim() ?? '',
    bestTimeApiKey: process.env.BESTTIME_API_KEY?.trim() ?? '',
    bestTimeBaseUrl: process.env.BESTTIME_BASE_URL?.trim() ?? 'https://besttime.app/api/v1',
    corsOrigin: process.env.CORS_ORIGIN?.trim() ?? 'http://localhost:5173'
};

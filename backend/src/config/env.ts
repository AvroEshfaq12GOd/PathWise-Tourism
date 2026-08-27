import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGODB_URI?.trim() ?? '',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY?.trim() ?? '',
  bestTimeApiKey: process.env.BESTTIME_API_KEY?.trim() ?? '',
  bestTimeBaseUrl: process.env.BESTTIME_BASE_URL?.trim() ?? 'https://besttime.app/api/v1',
  corsOrigin: process.env.CORS_ORIGIN?.trim() ?? '*'
};


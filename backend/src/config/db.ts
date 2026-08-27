import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!env.mongoUri) {
    console.warn('[PathWise] No MONGODB_URI provided — running in-memory mode');
    return null;
  }
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(env.mongoUri);
    console.log('[PathWise] Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.warn('[PathWise] MongoDB connection failed — running in fallback mode:', error);
    return null;
  }
}


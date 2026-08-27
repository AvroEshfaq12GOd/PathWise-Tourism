import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { AdminLogModel } from '../models/AdminLog.js';
import { inMemoryStore } from '../services/store.service.js';

export async function listAdminLogs(_req: Request, res: Response) {
  if (mongoose.connection.readyState === 1) {
    try {
      const logs = await AdminLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
      return res.json({ data: logs });
    } catch {
      // Fallback
    }
  }
  return res.json({ data: inMemoryStore.adminLogs });
}


import { Request, Response } from 'express';
import { AdminLogModel } from '../models/AdminLog.js';

export async function listAdminLogs(_req: Request, res: Response) {
  const logs = await AdminLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
  res.json({ data: logs });
}

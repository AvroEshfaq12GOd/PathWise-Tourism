import { AdminLogModel } from '../models/AdminLog.js';
export async function listAdminLogs(_req, res) {
    const logs = await AdminLogModel.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json({ data: logs });
}

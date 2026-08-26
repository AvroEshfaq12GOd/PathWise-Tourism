import { Schema, model } from 'mongoose';
const AdminLogSchema = new Schema({
    action: { type: String, required: true },
    user: { type: String, required: true },
    type: { type: String, default: 'system' },
    timeLabel: { type: String, default: '' }
}, { timestamps: true });
export const AdminLogModel = model('AdminLog', AdminLogSchema);

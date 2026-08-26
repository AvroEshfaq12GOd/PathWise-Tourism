import { Schema, model } from 'mongoose';
const IncentiveSchema = new Schema({
    name: { type: String, required: true },
    partner: { type: String, required: true },
    pointsCost: { type: Number, required: true },
    redemptions: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'paused'], default: 'active' },
    expiry: { type: String, required: true },
    isHiddenGem: { type: Boolean, default: false }
}, { timestamps: true });
export const IncentiveModel = model('Incentive', IncentiveSchema);

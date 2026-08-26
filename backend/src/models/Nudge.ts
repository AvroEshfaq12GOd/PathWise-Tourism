import { Schema, model, type InferSchemaType, Types } from 'mongoose';

const NudgeSchema = new Schema(
  {
    originalSiteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    altSiteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    reason: { type: String, required: true },
    incentive: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    travelTimeMin: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'dismissed'], default: 'pending' },
    userId: { type: String, default: '' }
  },
  { timestamps: true }
);

export type NudgeDoc = InferSchemaType<typeof NudgeSchema> & { _id: Types.ObjectId };

export const NudgeModel = model('Nudge', NudgeSchema);

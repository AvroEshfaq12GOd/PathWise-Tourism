import { Schema, model, type InferSchemaType, Types } from 'mongoose';

const AdminLogSchema = new Schema(
  {
    action: { type: String, required: true },
    user: { type: String, required: true },
    type: { type: String, default: 'system' },
    timeLabel: { type: String, default: '' }
  },
  { timestamps: true }
);

export type AdminLogDoc = InferSchemaType<typeof AdminLogSchema> & { _id: Types.ObjectId };

export const AdminLogModel = model('AdminLog', AdminLogSchema);

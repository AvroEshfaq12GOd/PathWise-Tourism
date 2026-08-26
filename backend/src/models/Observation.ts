import { Schema, model, type InferSchemaType, Types } from 'mongoose';

const ObservationSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    source: { type: String, enum: ['manual', 'sensor', 'besttime', 'weather', 'system'], required: true },
    density: { type: Number, required: true },
    sampledAt: { type: Date, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export type ObservationDoc = InferSchemaType<typeof ObservationSchema> & { _id: Types.ObjectId };

export const ObservationModel = model('Observation', ObservationSchema);

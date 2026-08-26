import { Schema, model, type InferSchemaType, Types } from 'mongoose';

const ForecastSchema = new Schema(
  {
    siteId: { type: Schema.Types.ObjectId, ref: 'Site', required: true },
    generatedAt: { type: Date, required: true },
    horizonHours: { type: Number, required: true },
    points: [
      {
        time: { type: Date, required: true },
        density: { type: Number, required: true },
        lowerBound: { type: Number, required: true },
        upperBound: { type: Number, required: true }
      }
    ],
    modelVersion: { type: String, default: 'v1' },
    mae: { type: Number, default: null }
  },
  { timestamps: true }
);

export type ForecastDoc = InferSchemaType<typeof ForecastSchema> & { _id: Types.ObjectId };

export const ForecastModel = model('Forecast', ForecastSchema);

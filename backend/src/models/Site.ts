import { Schema, model, type InferSchemaType, Types } from 'mongoose';

const SiteSchema = new Schema(
  {
    name: { type: String, required: true },
    bestTimeVenueName: { type: String, default: '' },
    bestTimeVenueAddress: { type: String, default: '' },
    category: { type: String, required: true },
    region: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    maxCapacity: { type: Number, required: true },
    threshold: { type: Number, required: true },
    criticalThreshold: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String, default: '' },
    features: [{ type: String }],
    weatherRef: { type: String, default: '' },
    currentDensity: { type: Number, default: 0 },
    currentDensityUpdatedAt: { type: Date, default: null },
    sltdaCertified: { type: Boolean, default: true },
    sltdaCategory: { type: String, default: '' },
    unescoHeritage: { type: Boolean, default: false },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export type SiteDoc = InferSchemaType<typeof SiteSchema> & { _id: Types.ObjectId };

export const SiteModel = model('Site', SiteSchema);

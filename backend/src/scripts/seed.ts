import { connectDb } from '../config/db.js';
import { SiteModel } from '../models/Site.js';
import { IncentiveModel } from '../models/Incentive.js';
import { NudgeModel } from '../models/Nudge.js';
import { AdminLogModel } from '../models/AdminLog.js';
import { ForecastModel } from '../models/Forecast.js';
import { ObservationModel } from '../models/Observation.js';
import { initialSites } from '../services/store.service.js';

async function seed() {
  await connectDb();

  await Promise.all([
    SiteModel.deleteMany({}),
    IncentiveModel.deleteMany({}),
    NudgeModel.deleteMany({}),
    AdminLogModel.deleteMany({}),
    ForecastModel.deleteMany({}),
    ObservationModel.deleteMany({})
  ]);

  const sites = await SiteModel.insertMany(initialSites);

  await IncentiveModel.insertMany([
    { name: 'Free Artisan Ceylon Tea Tasting', partner: 'Mlesna Tea Fortress & Kandy Barista', pointsCost: 450, redemptions: 1420, status: 'active', expiry: '2026-12-31' },
    { name: 'SLTDA Heritage Pass Voucher', partner: 'National Museum & Cultural Triangle', pointsCost: 1200, redemptions: 890, status: 'active', expiry: '2026-12-31' },
    { name: '15% Off Coastal Seafood Dinner', partner: 'Galle Fort Heritage Villa & Restaurant', pointsCost: 350, redemptions: 612, status: 'active', expiry: '2026-12-31' },
    { name: 'Free Botanical Garden Guide Audio', partner: 'Peradeniya Flora Trust', pointsCost: 200, redemptions: 1105, status: 'active', expiry: '2026-12-31' },
    { name: 'Safari Jeep Priority Dispersal Voucher', partner: 'Udawalawe Eco Wildlife Society', pointsCost: 600, redemptions: 340, status: 'active', expiry: '2026-12-31' }
  ]);

  await NudgeModel.insertMany([
    {
      originalSiteId: sites[0]._id,
      altSiteId: sites[1]._id,
      reason: 'Temple of the Tooth Relic is peaking at 92% capacity. Royal Botanical Gardens offers peaceful shaded walking avenues.',
      incentive: '+75 PathPoints',
      distanceKm: 5.8,
      travelTimeMin: 18,
      status: 'pending'
    },
    {
      originalSiteId: sites[2]._id,
      altSiteId: sites[7]._id,
      reason: 'Sigiriya Lion Rock queue wait is ~50 mins (88% capacity). Dambulla Golden Rock Temple is currently at optimal 40% density.',
      incentive: '+100 PathPoints',
      distanceKm: 18.5,
      travelTimeMin: 25,
      status: 'pending'
    }
  ]);

  await AdminLogModel.insertMany([
    { action: 'SLTDA official attractions catalog synchronized (35 destinations)', user: 'SLTDA Central Admin', type: 'system', timeLabel: 'Just now' },
    { action: 'Threshold calibrated for Sigiriya Rock & Sri Dalada Maligawa', user: 'AI Dispersal Controller', type: 'config', timeLabel: '1h ago' },
    { action: 'LSTM Neural Crowd model updated with weekend holiday data', user: 'AI Controller', type: 'system', timeLabel: '4h ago' }
  ]);

  console.log(`Seed complete with ${sites.length} sites`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { connectDb } from '../config/db.js';
import { SiteModel } from '../models/Site.js';
import { IncentiveModel } from '../models/Incentive.js';
import { NudgeModel } from '../models/Nudge.js';
import { AdminLogModel } from '../models/AdminLog.js';
import { ForecastModel } from '../models/Forecast.js';
import { ObservationModel } from '../models/Observation.js';
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
    const sites = await SiteModel.insertMany([
        {
            name: 'Temple of the Tooth',
            bestTimeVenueName: 'Temple of the Tooth',
            bestTimeVenueAddress: 'Temple of the Tooth, Kandy, Sri Lanka',
            category: 'Cultural',
            region: 'Central',
            lat: 7.2936,
            lng: 80.6411,
            maxCapacity: 5000,
            threshold: 85,
            criticalThreshold: 95,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1588096344356-896898822184?auto=format&fit=crop&q=80&w=800',
            features: ['Visitor trend ↑', 'Public Holiday', 'Sunny 28°C'],
            currentDensity: 92
        },
        {
            name: 'Royal Botanical Gardens',
            bestTimeVenueName: 'Royal Botanical Gardens',
            bestTimeVenueAddress: 'Royal Botanical Gardens, Peradeniya, Sri Lanka',
            category: 'Nature',
            region: 'Central',
            lat: 7.2714,
            lng: 80.5953,
            maxCapacity: 12000,
            threshold: 90,
            criticalThreshold: 95,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1625733143873-d8ebaac5a8ea?auto=format&fit=crop&q=80&w=800',
            features: ['Weekend', 'Large Area', 'Partly Cloudy'],
            currentDensity: 45
        },
        {
            name: 'Sigiriya Rock Fortress',
            bestTimeVenueName: 'Sigiriya Rock Fortress',
            bestTimeVenueAddress: 'Sigiriya Rock Fortress, Sigiriya, Sri Lanka',
            category: 'Historical',
            region: 'North Central',
            lat: 7.957,
            lng: 80.7603,
            maxCapacity: 3000,
            threshold: 80,
            criticalThreshold: 90,
            isActive: true,
            imageUrl: 'https://images.unsplash.com/photo-1565018981442-83b3b2462e08?auto=format&fit=crop&q=80&w=800',
            features: ['Morning Peak', 'Clear 31°C', 'Weekend'],
            currentDensity: 88
        }
    ]);
    await IncentiveModel.insertMany([
        { name: 'Free Iced Coffee', partner: 'Barista Kandy', pointsCost: 500, redemptions: 1240, status: 'active', expiry: '2026-12-31' },
        { name: 'Museum Pass', partner: 'National Museum', pointsCost: 1200, redemptions: 850, status: 'active', expiry: '2026-12-31' },
        { name: '10% Off Dinner', partner: 'Galle Fort Hotel', pointsCost: 300, redemptions: 432, status: 'paused', expiry: '2026-06-30' }
    ]);
    await NudgeModel.insertMany([
        {
            originalSiteId: sites[0]._id,
            altSiteId: sites[1]._id,
            reason: 'Temple of the Tooth is predicted to hit 95% capacity at 14:00.',
            incentive: '+75 PathPoints',
            distanceKm: 5.2,
            travelTimeMin: 15,
            status: 'pending'
        }
    ]);
    await AdminLogModel.insertMany([
        { action: 'Threshold updated for Sigiriya', user: 'Admin', type: 'config', timeLabel: '2h ago' },
        { action: 'LSTM Model retrained automatically', user: 'AI Controller', type: 'system', timeLabel: '1d ago' }
    ]);
    console.log('Seed complete');
    process.exit(0);
}
seed().catch((error) => {
    console.error(error);
    process.exit(1);
});

export interface InMemorySite {
  _id: string;
  name: string;
  bestTimeVenueName?: string;
  bestTimeVenueAddress?: string;
  category: string;
  region: string;
  lat: number;
  lng: number;
  maxCapacity: number;
  threshold: number;
  criticalThreshold: number;
  isActive: boolean;
  imageUrl?: string;
  features?: string[];
  weatherRef?: string;
  currentDensity?: number;
  currentDensityUpdatedAt?: string;
}

export interface InMemoryObservation {
  _id: string;
  siteId: string;
  source: string;
  density: number;
  sampledAt: string;
  metadata?: Record<string, unknown>;
}

export interface InMemoryForecast {
  _id: string;
  siteId: string;
  generatedAt: string;
  horizonHours: number;
  points: Array<{
    time: string;
    density: number;
    lowerBound: number;
    upperBound: number;
  }>;
  modelVersion: string;
  mae: number | null;
}

export interface InMemoryNudge {
  _id: string;
  originalSiteId: string;
  altSiteId: string;
  reason: string;
  incentive: string;
  distanceKm: number;
  travelTimeMin: number;
  status: 'pending' | 'accepted' | 'dismissed';
  createdAt: string;
}

export interface InMemoryIncentive {
  _id: string;
  name: string;
  partner: string;
  pointsCost: number;
  redemptions: number;
  status: 'active' | 'paused';
  expiry: string;
  isHiddenGem?: boolean;
}

export interface InMemoryAdminLog {
  _id: string;
  action: string;
  user: string;
  type?: string;
  timeLabel?: string;
  createdAt?: string;
}

const initialSites: InMemorySite[] = [
  {
    _id: '65f01a011000000000000001',
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
    currentDensity: 92,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000002',
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
    currentDensity: 45,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000003',
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
    currentDensity: 88,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000004',
    name: 'Galle Fort',
    bestTimeVenueName: 'Galle Fort',
    bestTimeVenueAddress: 'Galle Fort, Galle, Sri Lanka',
    category: 'Heritage',
    region: 'Southern',
    lat: 6.0266,
    lng: 80.217,
    maxCapacity: 8000,
    threshold: 90,
    criticalThreshold: 95,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800',
    features: ['Evening Approach', 'Coastal Breeze'],
    currentDensity: 65,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000005',
    name: 'Nine Arches Bridge',
    bestTimeVenueName: 'Nine Arches Bridge',
    bestTimeVenueAddress: 'Demodara, Ella, Sri Lanka',
    category: 'Landmark',
    region: 'Uva',
    lat: 6.8767,
    lng: 81.0608,
    maxCapacity: 1500,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1546708973-c3184eeb0b03?auto=format&fit=crop&q=80&w=800',
    features: ['Train Schedule', 'Misty 22°C'],
    currentDensity: 78,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000006',
    name: 'Mirissa Beach',
    bestTimeVenueName: 'Mirissa Beach',
    bestTimeVenueAddress: 'Mirissa, Sri Lanka',
    category: 'Nature',
    region: 'Southern',
    lat: 5.9483,
    lng: 80.4536,
    maxCapacity: 4000,
    threshold: 90,
    criticalThreshold: 95,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&q=80&w=800',
    features: ['Weekend', 'Sunny 30°C'],
    currentDensity: 55,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000007',
    name: 'Yala National Park',
    bestTimeVenueName: 'Yala National Park',
    bestTimeVenueAddress: 'Yala, Sri Lanka',
    category: 'Nature',
    region: 'Southern',
    lat: 6.367,
    lng: 81.517,
    maxCapacity: 500,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1610309995116-248552123985?auto=format&fit=crop&q=80&w=800',
    features: ['Morning Safari', 'Clear 32°C'],
    currentDensity: 95,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000008',
    name: 'Dambulla Cave Temple',
    bestTimeVenueName: 'Dambulla Cave Temple',
    bestTimeVenueAddress: 'Dambulla, Sri Lanka',
    category: 'Cultural',
    region: 'Central',
    lat: 7.8566,
    lng: 80.6485,
    maxCapacity: 2000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1624806992066-5ffcb7ca1e73?auto=format&fit=crop&q=80&w=800',
    features: ['Afternoon Lull', 'Partly Cloudy'],
    currentDensity: 40,
    currentDensityUpdatedAt: new Date().toISOString()
  }
];

export class InMemoryStore {
  sites: InMemorySite[] = [...initialSites];
  observations: InMemoryObservation[] = [];
  forecasts: InMemoryForecast[] = [];
  nudges: InMemoryNudge[] = [];
  incentives: InMemoryIncentive[] = [
    {
      _id: '65f02a011000000000000001',
      name: 'Free Iced Coffee',
      partner: 'Barista Kandy',
      pointsCost: 500,
      redemptions: 1240,
      status: 'active',
      expiry: '2026-12-31'
    },
    {
      _id: '65f02a011000000000000002',
      name: 'Museum Pass',
      partner: 'National Museum',
      pointsCost: 1200,
      redemptions: 850,
      status: 'active',
      expiry: '2026-12-31'
    },
    {
      _id: '65f02a011000000000000003',
      name: '10% Off Dinner',
      partner: 'Galle Fort Hotel',
      pointsCost: 300,
      redemptions: 432,
      status: 'paused',
      expiry: '2026-06-30'
    }
  ];
  adminLogs: InMemoryAdminLog[] = [
    {
      _id: '65f03a011000000000000001',
      action: 'Threshold updated for Sigiriya',
      user: 'Admin',
      type: 'config',
      timeLabel: '2h ago',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '65f03a011000000000000002',
      action: 'LSTM Model retrained automatically',
      user: 'AI Controller',
      type: 'system',
      timeLabel: '1d ago',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  constructor() {
    this.seedInitial();
  }

  seedInitial() {
    const now = Date.now();
    for (const site of this.sites) {
      // Create past observations
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now - i * 60 * 60 * 1000).toISOString();
        const drift = (Math.sin(i) * 6);
        const density = Math.max(10, Math.min(100, Math.round((site.currentDensity ?? 50) + drift)));
        this.observations.push({
          _id: `obs_${site._id}_${i}`,
          siteId: site._id,
          source: 'system',
          density,
          sampledAt: time,
          metadata: {
            weather: { temp: 28, condition: 'Sunny' }
          }
        });
      }

      // Create forecast
      const points = [];
      let last = site.currentDensity ?? 60;
      for (let i = 1; i <= 4; i++) {
        const time = new Date(now + i * 60 * 60 * 1000).toISOString();
        last = Math.max(10, Math.min(100, Math.round(last + (site.currentDensity && site.currentDensity > 80 ? 3 : -2))));
        points.push({
          time,
          density: last,
          lowerBound: Math.max(0, last - 6),
          upperBound: Math.min(100, last + 6)
        });
      }

      this.forecasts.push({
        _id: `fc_${site._id}`,
        siteId: site._id,
        generatedAt: new Date().toISOString(),
        horizonHours: 4,
        points,
        modelVersion: 'pathwise-lstm-v2.1',
        mae: 6.2
      });
    }

    this.nudges.push({
      _id: '65f04a011000000000000001',
      originalSiteId: this.sites[0]._id,
      altSiteId: this.sites[1]._id,
      reason: 'Temple of the Tooth is predicted to hit 95% capacity at 14:00.',
      incentive: '+75 PathPoints',
      distanceKm: 5.2,
      travelTimeMin: 15,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  }
}

export const inMemoryStore = new InMemoryStore();

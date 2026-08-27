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
  sltdaCertified?: boolean;
  sltdaCategory?: string;
  unescoHeritage?: boolean;
  description?: string;
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
    name: 'Temple of the Sacred Tooth Relic (Sri Dalada Maligawa)',
    bestTimeVenueName: 'Temple of the Tooth',
    bestTimeVenueAddress: 'Sri Dalada Veediya, Kandy, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'Ancient & Sacred Heritage',
    region: 'Central Province (Kandy)',
    lat: 7.2936,
    lng: 80.6411,
    maxCapacity: 5000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: 'Venerated Buddhist shrine housing the sacred tooth relic of the Buddha in the royal hill capital of Kandy.',
    imageUrl: 'https://images.unsplash.com/photo-1588096344356-896898822184?auto=format&fit=crop&q=80&w=800',
    features: ['Visitor trend ↑', 'Public Holiday', 'Sunny 28°C', 'UNESCO Site'],
    currentDensity: 92,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000002',
    name: 'Royal Botanical Gardens, Peradeniya',
    bestTimeVenueName: 'Royal Botanical Gardens',
    bestTimeVenueAddress: 'Peradeniya Rd, Kandy, Sri Lanka',
    category: 'Nature & Parks',
    sltdaCategory: 'Flora & Botanical Conservation',
    region: 'Central Province (Kandy)',
    lat: 7.2714,
    lng: 80.5953,
    maxCapacity: 12000,
    threshold: 90,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: '147-acre premier botanical sanctuary dating back to 1371, home to over 4,000 plant species and world-class orchid house.',
    imageUrl: 'https://images.unsplash.com/photo-1625733143873-d8ebaac5a8ea?auto=format&fit=crop&q=80&w=800',
    features: ['Weekend Space', 'Large Area', 'Partly Cloudy', 'Historic Avenue'],
    currentDensity: 45,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000003',
    name: 'Sigiriya Ancient Rock Fortress',
    bestTimeVenueName: 'Sigiriya Rock Fortress',
    bestTimeVenueAddress: 'Sigiriya, Matale District, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'Ancient Citadel & Royal Palace',
    region: 'North Central Province',
    lat: 7.9570,
    lng: 80.7603,
    maxCapacity: 3500,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: '5th-century cliffside palace citadel rising 200m above the jungle, featuring world-famous frescoes and Lion Gate ramparts.',
    imageUrl: 'https://images.unsplash.com/photo-1565018981442-83b3b2462e08?auto=format&fit=crop&q=80&w=800',
    features: ['Morning Peak', 'Clear 31°C', 'High Demand', 'UNESCO 8th Wonder'],
    currentDensity: 88,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000004',
    name: 'Galle Dutch Fort & Lighthouse',
    bestTimeVenueName: 'Galle Fort',
    bestTimeVenueAddress: 'Church St, Galle Fort, Galle, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'Colonial Maritime Fortification',
    region: 'Southern Province (Galle)',
    lat: 6.0266,
    lng: 80.2170,
    maxCapacity: 8000,
    threshold: 90,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: 'Living 17th-century European fortified citadel surrounded by ocean ramparts, cobblestone alleys, and boutique colonial architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800',
    features: ['Evening Sunset Peak', 'Ocean Breeze', 'UNESCO Heritage'],
    currentDensity: 65,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000005',
    name: 'Nine Arches Bridge & Demodara Loop',
    bestTimeVenueName: 'Nine Arches Bridge',
    bestTimeVenueAddress: 'Gotuwala, Ella, Badulla District, Sri Lanka',
    category: 'Scenic Highlands',
    sltdaCategory: 'Highland Scenic Landmarks',
    region: 'Uva Province (Ella)',
    lat: 6.8767,
    lng: 81.0608,
    maxCapacity: 1800,
    threshold: 80,
    criticalThreshold: 92,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Iconic colonial viaduct bridge crafted solely of stone and brick without steel, set amidst misty emerald Ceylon tea hills.',
    imageUrl: 'https://images.unsplash.com/photo-1546708973-c3184eeb0b03?auto=format&fit=crop&q=80&w=800',
    features: ['Train Arrival Times', 'Misty 22°C', 'High Photography Value'],
    currentDensity: 78,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000006',
    name: 'Mirissa Beach & Coconut Tree Hill',
    bestTimeVenueName: 'Mirissa Beach',
    bestTimeVenueAddress: 'Mirissa Coastal Bay, Southern Province, Sri Lanka',
    category: 'Coastal & Marine',
    sltdaCategory: 'Marine Eco-Tourism & Beaches',
    region: 'Southern Province (Matara)',
    lat: 5.9483,
    lng: 80.4536,
    maxCapacity: 4500,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Golden crescent beach famed as Sri Lanka’s epicenter for blue whale watching excursions and scenic palm cliff lookouts.',
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&q=80&w=800',
    features: ['Whale Season', 'Sunny 30°C', 'Sunset Gathering'],
    currentDensity: 55,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000007',
    name: 'Yala National Park (Ruhunu Wildlife)',
    bestTimeVenueName: 'Yala National Park',
    bestTimeVenueAddress: 'Palatupana, Yala, Hambantota District, Sri Lanka',
    category: 'Wildlife & Safari',
    sltdaCategory: 'Protected National Sanctuaries',
    region: 'Southern & Uva Provinces',
    lat: 6.3670,
    lng: 81.5170,
    maxCapacity: 600,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Premier wildlife park boasting the highest leopard density in the world, alongside wild Asian elephants, sloth bears, and crocodiles.',
    imageUrl: 'https://images.unsplash.com/photo-1610309995116-248552123985?auto=format&fit=crop&q=80&w=800',
    features: ['Morning Safari Rush', 'Clear 32°C', 'High Congestion'],
    currentDensity: 95,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000008',
    name: 'Dambulla Golden Cave Rock Temple',
    bestTimeVenueName: 'Dambulla Cave Temple',
    bestTimeVenueAddress: 'Kandy - Jaffna Hwy, Dambulla, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'Ancient & Sacred Heritage',
    region: 'Central Province (Matale)',
    lat: 7.8566,
    lng: 80.6485,
    maxCapacity: 2500,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: 'Sri Lanka’s largest rock-temple complex with 5 cliff caverns containing 153 Buddha statues and 2,100 square meters of ceiling murals.',
    imageUrl: 'https://images.unsplash.com/photo-1624806992066-5ffcb7ca1e73?auto=format&fit=crop&q=80&w=800',
    features: ['Afternoon Lull', 'Partly Cloudy', 'UNESCO Heritage'],
    currentDensity: 40,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000009',
    name: 'Ancient City of Polonnaruwa (Gal Vihara)',
    bestTimeVenueName: 'Polonnaruwa Quadrangle',
    bestTimeVenueAddress: 'Ancient City, Polonnaruwa, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'Ancient Kingdoms & Archaeology',
    region: 'North Central Province',
    lat: 7.9403,
    lng: 81.0027,
    maxCapacity: 4000,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: '11th-century royal medieval capital featuring monumental granite rock carvings, the Sacred Quadrangle, and historic royal baths.',
    imageUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800',
    features: ['Wide Archeological Circuit', 'Sunny 31°C', 'UNESCO Heritage'],
    currentDensity: 52,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000010',
    name: 'Ancient Sacred City of Anuradhapura',
    bestTimeVenueName: 'Ruwanwelisaya Stupa',
    bestTimeVenueAddress: 'Sacred City, Anuradhapura, Sri Lanka',
    category: 'Sacred Pilgrim',
    sltdaCategory: 'Ancient & Sacred Heritage',
    region: 'North Central Province',
    lat: 8.3500,
    lng: 80.3833,
    maxCapacity: 15000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: 'Sacred 2,500-year-old capital home to Jaya Sri Maha Bodhi (the world’s oldest documented tree) and the majestic Ruwanwelisaya stupa.',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=800',
    features: ['Poya Day Pilgrims', 'Warm 33°C', 'Sacred City'],
    currentDensity: 68,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000011',
    name: 'Udawalawe National Park & Elephant Transit Home',
    bestTimeVenueName: 'Udawalawe National Park',
    bestTimeVenueAddress: 'Udawalawe, Ratnapura / Monaragala, Sri Lanka',
    category: 'Wildlife & Safari',
    sltdaCategory: 'Protected National Sanctuaries',
    region: 'Sabaragamuwa / Uva',
    lat: 6.4746,
    lng: 80.8987,
    maxCapacity: 900,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Vast reservoir grasslands rivaling East African savannas with guaranteed year-round wild elephant sightings and orphan rehabilitation center.',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800',
    features: ['Feeding Times (12pm & 3pm)', 'Safari Jeeps', 'Scenic Reservoir'],
    currentDensity: 58,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000012',
    name: 'Horton Plains National Park & World’s End',
    bestTimeVenueName: 'Horton Plains World’s End',
    bestTimeVenueAddress: 'Ohiya, Nuwara Eliya District, Sri Lanka',
    category: 'Nature & Parks',
    sltdaCategory: 'Highland Conservation & Trekking',
    region: 'Central Province (Nuwara Eliya)',
    lat: 6.8028,
    lng: 80.8092,
    maxCapacity: 1200,
    threshold: 75,
    criticalThreshold: 88,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: 'Misty protected highland plateau over 2,100m above sea level with an abrupt 880m sheer drop at World’s End cliff and Baker’s Falls.',
    imageUrl: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=800',
    features: ['Early Morning Clearance', 'Chilly 14°C', 'Highland Trekking'],
    currentDensity: 74,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000013',
    name: 'Sinharaja Rain Forest Reserve',
    bestTimeVenueName: 'Sinharaja Forest',
    bestTimeVenueAddress: 'Kudawa, Kalawana, Sabaragamuwa Province, Sri Lanka',
    category: 'Nature & Parks',
    sltdaCategory: 'UNESCO Tropical Biosphere Reserve',
    region: 'Sabaragamuwa / Southern',
    lat: 6.4167,
    lng: 80.4500,
    maxCapacity: 500,
    threshold: 70,
    criticalThreshold: 85,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: 'Sri Lanka’s premier virgin tropical rainforest biosphere reserve harboring over 60% of the island’s endemic trees and bird species.',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=800',
    features: ['Bird Watching Flocks', 'Humid 24°C', 'Eco Trekking Guide Mandatory'],
    currentDensity: 32,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000014',
    name: 'Arugam Bay World Surfing Point',
    bestTimeVenueName: 'Arugam Bay Surf Beach',
    bestTimeVenueAddress: 'Arugam Bay, Pottuvil, Eastern Province, Sri Lanka',
    category: 'Coastal & Marine',
    sltdaCategory: 'Marine Eco-Tourism & Beaches',
    region: 'Eastern Province (Ampara)',
    lat: 6.8428,
    lng: 81.8294,
    maxCapacity: 3500,
    threshold: 80,
    criticalThreshold: 92,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'International surfing destination ranking among the top right-hand point breaks globally with relaxed coastal culture and lagoon safaris.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    features: ['Surf Swell Forecast', 'Sunny 32°C', 'International Season'],
    currentDensity: 64,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000015',
    name: 'Sri Pada (Adam’s Peak Sacred Mountain)',
    bestTimeVenueName: 'Adam’s Peak Trail',
    bestTimeVenueAddress: 'Nallathanniya, Maskeliya, Central Province, Sri Lanka',
    category: 'Sacred Pilgrim',
    sltdaCategory: 'Mountain Pilgrimage Sanctuary',
    region: 'Central / Sabaragamuwa',
    lat: 6.8096,
    lng: 80.4994,
    maxCapacity: 12000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: '2,243m conical holy peak with the sacred sacred footprint mark, celebrated for midnight lantern pilgrimages and majestic sunrise triangle shadows.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    features: ['Night Ascent', 'Crisp 12°C', 'Pilgrim Season'],
    currentDensity: 82,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000016',
    name: 'Pigeon Island National Marine Park',
    bestTimeVenueName: 'Pigeon Island Marine Park',
    bestTimeVenueAddress: 'Nilaveli Beach, Trincomalee, Eastern Province, Sri Lanka',
    category: 'Coastal & Marine',
    sltdaCategory: 'Marine Sanctuaries & Diving',
    region: 'Eastern Province (Trincomalee)',
    lat: 8.7214,
    lng: 81.2036,
    maxCapacity: 600,
    threshold: 75,
    criticalThreshold: 88,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Island marine sanctuary with live coral reefs, blacktip reef sharks, hawksbill sea turtles, and turquoise snorkeling lagoons.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    features: ['Snorkel & Dive Permit', 'Crystal Waters 29°C', 'Reef Conservation'],
    currentDensity: 48,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000017',
    name: 'Colombo Gangaramaya Temple & Seema Malaka',
    bestTimeVenueName: 'Gangaramaya Temple',
    bestTimeVenueAddress: '61 Sri Jinarathana Rd, Colombo 02, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'Urban Heritage & Architecture',
    region: 'Western Province (Colombo)',
    lat: 6.9167,
    lng: 79.8569,
    maxCapacity: 3000,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Historic Colombo urban temple complex with eclectic artifacts and Geoffrey Bawa’s tranquil floating meditation hall on Beira Lake.',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800',
    features: ['Beira Lake Breeze', 'Urban Hub', 'Cultural Museum'],
    currentDensity: 60,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000018',
    name: 'Bentota Beach & Madu Ganga Mangrove Safari',
    bestTimeVenueName: 'Bentota Watersports Beach',
    bestTimeVenueAddress: 'National Holiday Resort, Bentota, Southern Province, Sri Lanka',
    category: 'Coastal & Marine',
    sltdaCategory: 'Marine Eco-Tourism & Beaches',
    region: 'Southern Province (Bentota)',
    lat: 6.4250,
    lng: 79.9983,
    maxCapacity: 5000,
    threshold: 80,
    criticalThreshold: 92,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Golden resort beach renowned for windsurfing, jet-skiing, luxury resorts, and boat tours through 64-island mangrove estuaries.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    features: ['Mangrove River Tours', 'Water Sports', 'Sunny 30°C'],
    currentDensity: 50,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000019',
    name: 'Little Adam’s Peak & Ella Rock Viewpoint',
    bestTimeVenueName: 'Little Adams Peak',
    bestTimeVenueAddress: 'Passara Rd, Ella, Badulla District, Sri Lanka',
    category: 'Scenic Highlands',
    sltdaCategory: 'Highland Scenic Landmarks',
    region: 'Uva Province (Ella)',
    lat: 6.8622,
    lng: 81.0558,
    maxCapacity: 2000,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Scenic hiking pyramid surrounded by Ceylon tea plantations offering dramatic panoramic views across the deep Ella Gap gorge.',
    imageUrl: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800',
    features: ['Sunrise & Sunset Hikes', 'Zipline Adventure', 'Misty 21°C'],
    currentDensity: 70,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000020',
    name: 'Jaffna Fort & Nallur Kandaswamy Kovil',
    bestTimeVenueName: 'Jaffna Fort',
    bestTimeVenueAddress: 'Fort Rd, Jaffna, Northern Province, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'Northern Heritage & Dravidian Culture',
    region: 'Northern Province (Jaffna)',
    lat: 9.6615,
    lng: 80.0078,
    maxCapacity: 6000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Expansive 17th-century coral limestone coastal fortress overlooking Jaffna lagoon and the monumental golden Hindu temple of Nallur.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
    features: ['Lagoon Sunsets', 'Warm 33°C', 'Historic Coral Ramparts'],
    currentDensity: 42,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000021',
    name: 'Pidurangala Rock Sanctuary & Viewpoint',
    bestTimeVenueName: 'Pidurangala Rock',
    bestTimeVenueAddress: 'Pidurangala, Sigiriya, Central Province, Sri Lanka',
    category: 'Scenic Highlands',
    sltdaCategory: 'Ancient Monastic Rock Hermitage',
    region: 'Central / Cultural Triangle',
    lat: 7.9673,
    lng: 80.7631,
    maxCapacity: 1500,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Ancient Buddhist monastery and massive rock formation offering the most breathtaking 360-degree panoramic view of neighboring Sigiriya Rock Fortress.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800',
    features: ['Sunrise & Sunset Vistas', 'Rock Reclining Buddha', 'Cool Breeze 26°C'],
    currentDensity: 68,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000022',
    name: 'Wilpattu National Park (Willu Leopard Sanctuary)',
    bestTimeVenueName: 'Wilpattu National Park Gate',
    bestTimeVenueAddress: 'Hunuwilagama, Nochchiyagama, North Western / North Central, Sri Lanka',
    category: 'Nature & Parks',
    sltdaCategory: 'Premier National Park & Safari',
    region: 'North Western / North Central',
    lat: 8.4556,
    lng: 80.0058,
    maxCapacity: 2500,
    threshold: 75,
    criticalThreshold: 88,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Sri Lanka’s largest national park famous for natural sand-rimmed water basins (villus), dense forest cover, leopards, sloth bears, and endemic waterfowl.',
    imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800',
    features: ['4x4 Safari Jeeps', 'Leopard Habitat', 'Natural Villu Lakes'],
    currentDensity: 52,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000023',
    name: 'Minneriya National Park (The Elephant Gathering)',
    bestTimeVenueName: 'Minneriya National Park Entrance',
    bestTimeVenueAddress: 'Maradankadawala-Habarana-Thirukkondaiadimadu Hwy, Habarana, Sri Lanka',
    category: 'Nature & Parks',
    sltdaCategory: 'Elephant Gathering Biosphere',
    region: 'North Central (Habarana)',
    lat: 8.0333,
    lng: 80.8833,
    maxCapacity: 3000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'World-renowned site of "The Gathering", where hundreds of Asian wild elephants congregate around the ancient 3rd-century Minneriya reservoir during dry season.',
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800',
    features: ['Elephant Gathering', 'Reservoir Shore Safari', 'Sunny 31°C'],
    currentDensity: 86,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000024',
    name: 'Kaudulla National Park',
    bestTimeVenueName: 'Kaudulla Park Gate',
    bestTimeVenueAddress: 'Gal Oya Road, Kaudulla, North Central Province, Sri Lanka',
    category: 'Nature & Parks',
    sltdaCategory: 'Wildlife & Migratory Birds',
    region: 'North Central (Minneriya)',
    lat: 8.1500,
    lng: 80.9167,
    maxCapacity: 2000,
    threshold: 75,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Key wildlife corridor connecting Minneriya and Somawathiya Chaitiya, home to thriving herds of elephants, axis deer, and painted storks.',
    imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80&w=800',
    features: ['Elephant Corridor', 'Bird Watching Lagoon', 'Safari Trail'],
    currentDensity: 46,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000025',
    name: 'Knuckles Mountain Range (Dumbara Valley)',
    bestTimeVenueName: 'Knuckles Conservation Forest',
    bestTimeVenueAddress: 'Riverston, Matale / Kandy District, Central Province, Sri Lanka',
    category: 'Scenic Highlands',
    sltdaCategory: 'UNESCO Cloud Forest & Trekking',
    region: 'Central Province (Matale / Kandy)',
    lat: 7.4667,
    lng: 80.7833,
    maxCapacity: 800,
    threshold: 70,
    criticalThreshold: 85,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: 'UNESCO World Heritage cloud forest with rugged mountain ridges resembling clenched knuckles, mist-draped pygmy forests, and pristine waterfalls.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    features: ['High Altitude Trekking', 'Misty 18°C', 'Mini World’s End Vista'],
    currentDensity: 38,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000026',
    name: 'Koneswaram Temple & Swami Rock (Trincomalee)',
    bestTimeVenueName: 'Koneswaram Temple',
    bestTimeVenueAddress: 'Fort Frederick, Trincomalee, Eastern Province, Sri Lanka',
    category: 'Sacred Pilgrim',
    sltdaCategory: 'Ancient Coastal Kovil & Cliff',
    region: 'Eastern Province (Trincomalee)',
    lat: 8.5861,
    lng: 81.2417,
    maxCapacity: 5000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Monumental classical medieval Hindu temple dedicated to Shiva perched atop the sheer dramatic cliff of Swami Rock, towering over the turquoise Indian Ocean.',
    imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800',
    features: ['Swami Rock Lovers’ Leap', 'Blue Ocean Vistas', 'Historic Fort Frederick Entry'],
    currentDensity: 74,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000027',
    name: 'Pasikudah & Kalkudah Shallow Coral Bay',
    bestTimeVenueName: 'Pasikudah Beach Resort',
    bestTimeVenueAddress: 'Pasikudah Bay, Batticaloa, Eastern Province, Sri Lanka',
    category: 'Coastal & Marine',
    sltdaCategory: 'Shallow Water Coral Lagoon',
    region: 'Eastern Province (Batticaloa)',
    lat: 7.9250,
    lng: 81.5650,
    maxCapacity: 4000,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Renowned crescent bay with one of the longest stretches of shallow reef flat in the world, allowing bathers to walk over 500 meters into crystal clear waters.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    features: ['500m Shallow Walk-in Bay', 'Calm Turquoise Sea', 'Sunny 32°C'],
    currentDensity: 56,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000028',
    name: 'Hikkaduwa Coral Reef Sanctuary & Turtle Beach',
    bestTimeVenueName: 'Hikkaduwa Marine National Park',
    bestTimeVenueAddress: 'Galle Rd, Hikkaduwa, Southern Province, Sri Lanka',
    category: 'Coastal & Marine',
    sltdaCategory: 'Marine National Park & Surfing',
    region: 'Southern Province (Galle District)',
    lat: 6.1394,
    lng: 80.1006,
    maxCapacity: 4500,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Sri Lanka’s pioneer marine national park featuring shallow fringing coral reefs, giant wild green turtles feeding at the shoreline, and lively surf breaks.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    features: ['Shoreline Sea Turtles', 'Glass-Bottom Boats', 'Vibrant Coral Formations'],
    currentDensity: 76,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000029',
    name: 'Nuwara Eliya Lake Gregory & Pedro Tea Estate',
    bestTimeVenueName: 'Lake Gregory Park',
    bestTimeVenueAddress: 'Peradeniya-Badulla-Chenkaladi Hwy, Nuwara Eliya, Sri Lanka',
    category: 'Scenic Highlands',
    sltdaCategory: 'Colonial Hill Resort & Tea Highlands',
    region: 'Central Province (Nuwara Eliya)',
    lat: 6.9533,
    lng: 80.7850,
    maxCapacity: 6000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Scenic high-altitude lake hub in "Little England" featuring swan pedal boats, horse riding, colonial architecture, and 1885 artisan Pedro Tea Factory tours.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    features: ['Boating & Watersports', 'Cool Highland 16°C', 'Artisan Ceylon Tea Tours'],
    currentDensity: 84,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000030',
    name: 'Ramboda Falls & Twin Cascades',
    bestTimeVenueName: 'Ramboda Falls Viewpoint',
    bestTimeVenueAddress: 'Pussellawa - Nuwara Eliya Hwy, Ramboda Pass, Sri Lanka',
    category: 'Nature & Parks',
    sltdaCategory: 'Highland Waterfalls & Vistas',
    region: 'Central Highlands (Kotmale)',
    lat: 7.0500,
    lng: 80.7000,
    maxCapacity: 2500,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Majestic 109m waterfall cascading across sheer rock escarpments in the misty tea plantations of Ramboda Pass, framed by Kotmale Valley.',
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=800',
    features: ['Waterfall Trekking Bridge', 'Misty Spray 20°C', 'Scenic Mountain Dining'],
    currentDensity: 58,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000031',
    name: 'Delft Island (Neduntivu Baobab & Wild Horses)',
    bestTimeVenueName: 'Delft Island Jetty & Fort',
    bestTimeVenueAddress: 'Delft Island, Palk Strait, Northern Province, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'Island Heritage & Wild Ecology',
    region: 'Northern Province (Jaffna Islands)',
    lat: 9.5167,
    lng: 79.6833,
    maxCapacity: 1000,
    threshold: 75,
    criticalThreshold: 85,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Remote coral limestone island in the Palk Strait populated by feral wild ponies left behind by Portuguese colonists, giant hollow baobab trees, and Dutch ruins.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    features: ['Wild Pony Herds', 'Ancient Baobab Tree', 'Coral Rock Architecture'],
    currentDensity: 30,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000032',
    name: 'Mihintale Sacred Mountain Peak',
    bestTimeVenueName: 'Mihintale Sacred Site',
    bestTimeVenueAddress: 'Mihintale Sanctuary, Anuradhapura District, Sri Lanka',
    category: 'Sacred Pilgrim',
    sltdaCategory: 'Cradle of Sri Lankan Buddhism',
    region: 'North Central (Anuradhapura)',
    lat: 8.3514,
    lng: 80.5042,
    maxCapacity: 7000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Sacred mountain sanctuary regarded as the birthplace of Buddhism in Sri Lanka with 1,840 frangipani-lined granite steps leading to Kantaka Chetiya and Aradhana Gala.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    features: ['1,840 Ancient Stone Steps', 'Rock Summit Sunset', 'Sacred Monastic Ruins'],
    currentDensity: 62,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000033',
    name: 'Nagadeepa Purana Viharaya & Nainativu Kovil',
    bestTimeVenueName: 'Nainativu Island Jetty',
    bestTimeVenueAddress: 'Nainativu Island, Jaffna District, Northern Province, Sri Lanka',
    category: 'Sacred Pilgrim',
    sltdaCategory: 'Island Sacred Dual-Pilgrimage',
    region: 'Northern Province (Nainativu Island)',
    lat: 9.6150,
    lng: 79.7750,
    maxCapacity: 3500,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Sacred island sanctuary hosting the historic Buddhist temple visited by Lord Buddha and the monumental Nagapooshani Amman Hindu Kovil with ornate gopuram towers.',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800',
    features: ['Traditional Pilgrim Ferry', 'Dual Faith Sanctuary', 'Coastal Sea Breeze'],
    currentDensity: 45,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000034',
    name: 'Colombo National Museum & Galle Face Green',
    bestTimeVenueName: 'National Museum Colombo',
    bestTimeVenueAddress: 'Sir Marcus Fernando Mawatha, Colombo 07, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'National Heritage & Coastal Promenade',
    region: 'Western Province (Colombo)',
    lat: 6.9044,
    lng: 79.8614,
    maxCapacity: 15000,
    threshold: 85,
    criticalThreshold: 95,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: false,
    description: 'Premier Italianate Victorian museum housing royal Kandyan regalia and throne alongside Colombo’s iconic 5-hectare oceanfront promenade for sunsets and street food.',
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800',
    features: ['Royal Regalia & Throne', 'Oceanfront Promenade', 'Evening Street Food'],
    currentDensity: 78,
    currentDensityUpdatedAt: new Date().toISOString()
  },
  {
    _id: '65f01a011000000000000035',
    name: 'Polonnaruwa Quadrangle & Gal Vihara Colossi',
    bestTimeVenueName: 'Gal Vihara Rock Sculptures',
    bestTimeVenueAddress: 'Gal Vihara Complex, Polonnaruwa, North Central Province, Sri Lanka',
    category: 'Cultural Heritage',
    sltdaCategory: 'UNESCO Medieval Kingdom & Rock Art',
    region: 'North Central (Polonnaruwa)',
    lat: 7.9650,
    lng: 81.0000,
    maxCapacity: 4500,
    threshold: 80,
    criticalThreshold: 90,
    isActive: true,
    sltdaCertified: true,
    unescoHeritage: true,
    description: 'Masterpiece of ancient Sinhalese rock carving featuring four colossal Buddha figures sculpted into a single granite rock face in the medieval capital.',
    imageUrl: 'https://images.unsplash.com/photo-1565018981442-83b3b2462e08?auto=format&fit=crop&q=80&w=800',
    features: ['UNESCO World Heritage', 'Masterpiece Rock Carvings', 'Archaeological Quadrangle'],
    currentDensity: 65,
    currentDensityUpdatedAt: new Date().toISOString()
  }
];

export { initialSites };

export class InMemoryStore {
  sites: InMemorySite[] = [...initialSites];
  observations: InMemoryObservation[] = [];
  forecasts: InMemoryForecast[] = [];
  nudges: InMemoryNudge[] = [];
  incentives: InMemoryIncentive[] = [
    {
      _id: '65f02a011000000000000001',
      name: 'Free Artisan Ceylon Tea Tasting',
      partner: 'Mlesna Tea Fortress & Kandy Barista',
      pointsCost: 450,
      redemptions: 1420,
      status: 'active',
      expiry: '2026-12-31'
    },
    {
      _id: '65f02a011000000000000002',
      name: 'SLTDA Heritage Pass Voucher',
      partner: 'National Museum & Cultural Triangle',
      pointsCost: 1200,
      redemptions: 890,
      status: 'active',
      expiry: '2026-12-31'
    },
    {
      _id: '65f02a011000000000000003',
      name: '15% Off Coastal Seafood Dinner',
      partner: 'Galle Fort Heritage Villa & Restaurant',
      pointsCost: 350,
      redemptions: 612,
      status: 'active',
      expiry: '2026-12-31'
    },
    {
      _id: '65f02a011000000000000004',
      name: 'Free Botanical Garden Guide Audio',
      partner: 'Peradeniya Flora Trust',
      pointsCost: 200,
      redemptions: 1105,
      status: 'active',
      expiry: '2026-12-31'
    },
    {
      _id: '65f02a011000000000000005',
      name: 'Safari Jeep Priority Dispersal Voucher',
      partner: 'Udawalawe Eco Wildlife Society',
      pointsCost: 600,
      redemptions: 340,
      status: 'active',
      expiry: '2026-12-31'
    }
  ];
  adminLogs: InMemoryAdminLog[] = [
    {
      _id: '65f03a011000000000000001',
      action: 'SLTDA official attractions catalog synchronized (20 primary destinations)',
      user: 'SLTDA Central Admin',
      type: 'system',
      timeLabel: 'Just now',
      createdAt: new Date().toISOString()
    },
    {
      _id: '65f03a011000000000000002',
      action: 'Threshold calibrated for Sigiriya Rock & Sri Dalada Maligawa',
      user: 'AI Dispersal Controller',
      type: 'config',
      timeLabel: '1h ago',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      _id: '65f03a011000000000000003',
      action: 'LSTM Neural Crowd model updated with weekend holiday data',
      user: 'AI Controller',
      type: 'system',
      timeLabel: '4h ago',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ];

  constructor() {
    this.seedInitial();
  }

  seedInitial() {
    const now = Date.now();
    for (const site of this.sites) {
      // Create past observations for historical trend
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now - i * 60 * 60 * 1000).toISOString();
        const drift = Math.sin(i * 1.2) * 5;
        const density = Math.max(10, Math.min(100, Math.round((site.currentDensity ?? 50) + drift)));
        this.observations.push({
          _id: `obs_${site._id}_${i}`,
          siteId: site._id,
          source: 'sltda_telemetry',
          density,
          sampledAt: time,
          metadata: {
            weather: { temp: 28, condition: 'Sunny' }
          }
        });
      }

      // Create LSTM neural 4-hour forward forecast
      const points = [];
      let last = site.currentDensity ?? 60;
      for (let i = 1; i <= 4; i++) {
        const time = new Date(now + i * 60 * 60 * 1000).toISOString();
        const delta = site.currentDensity && site.currentDensity > 80 ? (i % 2 === 0 ? 2 : 4) : (i % 2 === 0 ? -3 : 2);
        last = Math.max(15, Math.min(98, Math.round(last + delta)));
        points.push({
          time,
          density: last,
          lowerBound: Math.max(5, last - 5),
          upperBound: Math.min(100, last + 5)
        });
      }

      this.forecasts.push({
        _id: `fc_${site._id}`,
        siteId: site._id,
        generatedAt: new Date().toISOString(),
        horizonHours: 4,
        points,
        modelVersion: 'pathwise-lstm-sltda-v2.5',
        mae: 4.8
      });
    }

    // High congestion smart nudges
    this.nudges.push(
      {
        _id: '65f04a011000000000000001',
        originalSiteId: this.sites[0]._id, // Tooth Relic
        altSiteId: this.sites[1]._id, // Peradeniya Botanical Gardens
        reason: 'Temple of the Tooth Relic is peaking at 92% capacity. Royal Botanical Gardens offers peaceful shaded walking avenues.',
        incentive: '+75 PathPoints',
        distanceKm: 5.8,
        travelTimeMin: 18,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        _id: '65f04a011000000000000002',
        originalSiteId: this.sites[2]._id, // Sigiriya
        altSiteId: this.sites[7]._id, // Dambulla Cave Temple
        reason: 'Sigiriya Lion Rock queue wait is ~50 mins (88% capacity). Dambulla Golden Rock Temple is currently at optimal 40% density.',
        incentive: '+100 PathPoints',
        distanceKm: 18.5,
        travelTimeMin: 25,
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        _id: '65f04a011000000000000003',
        originalSiteId: this.sites[6]._id, // Yala National Park
        altSiteId: this.sites[10]._id, // Udawalawe
        reason: 'Yala safari track entry is at critical 95% threshold. Udawalawe offers uncrowded elephant herd encounters (58% density).',
        incentive: '+120 PathPoints',
        distanceKm: 54.0,
        travelTimeMin: 65,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    );
  }
}

export const inMemoryStore = new InMemoryStore();

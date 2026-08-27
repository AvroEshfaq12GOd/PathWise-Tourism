import { LiveSite } from './api';
import { getSriLankaTime } from './sriLankaContext';
import { SITE_OPERATING_PROFILES } from './operatingHours';

export interface PeakWindowInfo {
  startHour: number; // 24h format e.g. 6 or 16
  endHour: number;   // 24h format e.g. 9 or 19
  label: string;     // e.g. "06:00 AM – 09:30 AM"
  periodName: string; // e.g. "Morning Safari Rush" | "Evening Sunset & Wildlife Gathering"
  description: string; // Context on why this window gets crowded
  intensity: 'Critical' | 'High' | 'Moderate';
  isCurrentlyActive: boolean;
  isUpcomingToday: boolean;
}

export interface SitePeakCrowdMetric {
  siteId: string;
  siteName: string;
  region: string;
  category: string;
  maxCapacity: number;
  currentDensity: number;
  currentVisitors: number;
  todayPeakDensity: number;
  todayPeakVisitors: number;
  yesterdayPeakDensity: number;
  historicAveragePeak: number;
  
  // Dual Peak Windows in a day
  hasTwoPeaks: boolean;
  peakWindows: PeakWindowInfo[];
  primaryPeakWindow: PeakWindowInfo;
  secondaryPeakWindow?: PeakWindowInfo;
  activePeakWindow: PeakWindowInfo | null;
  nextUpcomingPeakWindow: PeakWindowInfo | null;
  peakWindowsSummary: string; // e.g. "2 Peaks: 06:00 AM – 09:30 AM & 04:00 PM – 06:30 PM"
  recommendedOffPeakWindow: string; // e.g. "11:30 AM – 02:30 PM (Midday Quiet Hours)"

  // Legacy / Primary peak hours for backwards-compatibility
  peakHourStart: number; // 24h format e.g. 16
  peakHourEnd: number; // 24h format e.g. 19
  peakWindowLabel: string; // e.g. "04:30 PM – 07:30 PM" or dual peak summary

  peakStatus: 'IN_PEAK_NOW' | 'APPROACHING_PEAK' | 'POST_PEAK' | 'UPCOMING_LATER' | 'OFF_PEAK' | 'CLOSED';
  minutesToPeak: number | null; // null if past or now
  surgeRiskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'OPTIMAL';
  threshold: number;
  criticalThreshold: number;
  isBreachedNow: boolean;
  willBreachAtPeak: boolean;
  recommendedAction: string;
  suggestedAlternativeSite: string;
  hourlyCurve: Array<{
    hour: number;
    timeLabel: string;
    density: number;
    visitors: number;
    isPeak: boolean;
    isCurrent: boolean;
    peakNumber?: 1 | 2;
  }>;
}

export interface PeakProfileConfig {
  startHour: number;
  endHour: number;
  primaryPeriodName?: string;
  primaryDescription?: string;
  primaryIntensity?: 'Critical' | 'High' | 'Moderate';

  // 2nd peak in the same day
  secondaryStartHour?: number;
  secondaryEndHour?: number;
  secondaryPeriodName?: string;
  secondaryDescription?: string;
  secondaryIntensity?: 'Critical' | 'High' | 'Moderate';

  recommendedOffPeak?: string;
  peakMultiplier: number;
  altSite: string;
  action: string;
}

// Destination-specific real-world peak behaviors across Sri Lanka (incorporating 2 daily peaks where applicable)
export const SITE_PEAK_PROFILES: Record<string, PeakProfileConfig> = {
  // Beaches & Coastal Spots (Morning Surf/Boats + Sunset Coastal Dining & Gathering)
  mirissa: {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Morning Whale & Dolphin Departures',
    primaryDescription: 'Harbor pier boat departures and early morning surfing crowds.',
    primaryIntensity: 'High',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Beach & Coconut Tree Hill',
    secondaryDescription: 'Sunset photographers and evening beachfront dining gathering.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '11:00 AM – 03:00 PM (Quiet Beachfront Hours)',
    peakMultiplier: 1.45,
    altSite: 'Polhena Coral Reef & Weligama Bay',
    action: 'Balance sunset beach overcrowding; promote Polhena snorkeling and Weligama sunset surf.'
  },
  'mirissa-beach': {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Morning Whale & Dolphin Departures',
    primaryDescription: 'Boat safari launches and dawn reef walks.',
    primaryIntensity: 'High',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Beach & Coconut Tree Hill',
    secondaryDescription: 'Heavy rush on Coconut Tree Hill vantage point and evening cafes.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '11:00 AM – 03:00 PM (Quiet Beachfront Hours)',
    peakMultiplier: 1.45,
    altSite: 'Polhena Coral Reef & Madiha Beach',
    action: 'Promote Madiha Beach sunset point and Coconut Tree Hill early morning access.'
  },
  unawatuna: {
    startHour: 8,
    endHour: 11,
    primaryPeriodName: 'Morning Water Sports & Diving',
    primaryDescription: 'Scuba and paddleboard group launches in the main bay.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Gathering & Nightlife Prep',
    secondaryDescription: 'Sunset beach strolls, seaside taverns, and Peace Pagoda traffic.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '12:00 PM – 03:30 PM (Midday Sun Window)',
    peakMultiplier: 1.4,
    altSite: 'Jungle Beach & Rumassala Sanctuary',
    action: 'Direct overflow to Jungle Beach and Rumassala Japanese Peace Pagoda.'
  },
  weligama: {
    startHour: 7,
    endHour: 10,
    primaryPeriodName: 'Morning Beginner Surf Wave Rush',
    primaryDescription: 'Surf schools and board rentals queue along the main sandy break.',
    primaryIntensity: 'High',
    secondaryStartHour: 16,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Sunset Golden Hour Surf Session',
    secondaryDescription: 'Late afternoon swell riders and beachfront sunset spectators.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '11:30 AM – 03:00 PM (Low Tide Calmer Window)',
    peakMultiplier: 1.38,
    altSite: 'Midigama Surf Break & Ahangama Beach',
    action: 'Distribute surf lesson groups across Midigama and Kabalana beaches.'
  },
  bentota: {
    startHour: 9,
    endHour: 12,
    primaryPeriodName: 'Morning Jet Ski & Water Sports',
    primaryDescription: 'Bentota river mouth jet ski tours and lagoon cruises.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Coastal Promenade',
    secondaryDescription: 'Wide sandbar strolls and resort sunset drinks.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '01:00 PM – 03:30 PM (Calm Lagoon Window)',
    peakMultiplier: 1.35,
    altSite: 'Madu River Safari & Moragalla Beach',
    action: 'Encourage Madu River boat safaris during midday and Moragalla reef walks at low tide.'
  },
  hikkaduwa: {
    startHour: 8,
    endHour: 11,
    primaryPeriodName: 'Morning Sea Turtle Feeding & Snorkeling',
    primaryDescription: 'Shallow coral sanctuary turtle encounters and glass-bottom boats.',
    primaryIntensity: 'High',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Reggae Beach & Dining',
    secondaryDescription: 'Narigama sunset surfers and beachfront seafood street.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '12:00 PM – 03:30 PM (Midday Quiet Hours)',
    peakMultiplier: 1.4,
    altSite: 'Dodanduwa Lagoon & Narigama Beach',
    action: 'Protect shallow coral reef sanctuary and guide sunset crowds to Narigama wide beach.'
  },
  'arugam-bay': {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Dawn Point Break Surf Line-Up',
    primaryDescription: 'Main Point right-hand wave peak with international surfers.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Elephant Rock & Main Point',
    secondaryDescription: 'Sunset beach bonfires, lagoon viewpoints, and evening dining.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '11:00 AM – 03:00 PM (Midday Siesta Hours)',
    peakMultiplier: 1.45,
    altSite: 'Peanut Farm Beach & Elephant Rock',
    action: 'Stagger Main Point surf line-up and route sunset viewers to Elephant Rock lagoon.'
  },
  pasikudah: {
    startHour: 7,
    endHour: 10,
    primaryPeriodName: 'Morning Calm Reef Swimming',
    primaryDescription: 'Crystal clear shallow reef swimming before afternoon wind.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 16,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Sunset Shallow Bay Strolls',
    secondaryDescription: 'Family strolls along the 2km shallow coral bay.',
    secondaryIntensity: 'Moderate',
    recommendedOffPeak: '11:00 AM – 03:00 PM (Shaded Pool Window)',
    peakMultiplier: 1.3,
    altSite: 'Kalkudah Beach & Batticaloa Lagoon',
    action: 'Disperse swimmers along Kalkudah pristine bay.'
  },
  nilaveli: {
    startHour: 7,
    endHour: 10,
    primaryPeriodName: 'Pigeon Island Boat Departure Peak',
    primaryDescription: 'Boat transfers to Pigeon Island National Marine Park.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Late Afternoon Beach Stroll',
    secondaryDescription: 'Return boat arrivals and soft sand swimming.',
    secondaryIntensity: 'Moderate',
    recommendedOffPeak: '11:30 AM – 02:30 PM (Open Beachfront)',
    peakMultiplier: 1.35,
    altSite: 'Uppuveli Beach & Pigeon Island National Park',
    action: 'Schedule morning boat departures to Pigeon Island before afternoon sea breezes.'
  },
  'galle-face': {
    startHour: 6,
    endHour: 8,
    primaryPeriodName: 'Morning Jogging & Breeze Walks',
    primaryDescription: 'Early Colombo fitness walkers and ocean breeze runners.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 17,
    secondaryEndHour: 21,
    secondaryPeriodName: 'Evening Sunset, Kites & Street Food',
    secondaryDescription: 'Huge Colombo community gathering, street food stalls, and kite flying.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '09:00 AM – 04:00 PM (Low Traffic Window)',
    peakMultiplier: 1.5,
    altSite: 'Port City Promenade & Viharamahadevi Park',
    action: 'Direct evening family strolls to Port City Promenade and Colombo Fort heritage walk.'
  },

  // Ancient Rock Fortresses & Climbs (Dawn Ascent + Sunset Golden Hour)
  sigiriya: {
    startHour: 7,
    endHour: 10,
    primaryPeriodName: 'Morning Ascent (Beat Midday Sun)',
    primaryDescription: 'Summit staircase queue surge before the exposed black rock heats up.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Late Afternoon Water Gardens & Climb',
    secondaryDescription: 'Tour bus arrivals for afternoon light on the ancient frescos.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '11:30 AM – 02:30 PM (Museum & Frescoes Focus)',
    peakMultiplier: 1.4,
    altSite: 'Pidurangala Rock & Dambulla Cave Temple',
    action: 'Activate +200 PathPoint Pidurangala diversion & stagger summit iron staircase ascent.'
  },
  pidurangala: {
    startHour: 5,
    endHour: 8,
    primaryPeriodName: 'Dawn Sunrise & Sigiriya Silhouette',
    primaryDescription: 'Peak headlamp trek up the boulder scramble for sunrise photos.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 16,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Sunset Golden Hour Overlook',
    secondaryDescription: 'Spectacular sunset illumination on the Sigiriya Rock fortress.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '10:00 AM – 03:00 PM (Shaded Cave Temple Walk)',
    peakMultiplier: 1.45,
    altSite: 'Sigiriya Rock & Minneriya Safari',
    action: 'Guide sunrise climbers with trail safety illumination and caution boulder scramble zone.'
  },
  yapahuwa: {
    startHour: 7,
    endHour: 10,
    primaryPeriodName: 'Morning Steep Staircase Ascent',
    primaryDescription: 'Early climb before blazing sun hits the steep ornamental steps.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 15,
    secondaryEndHour: 17,
    secondaryPeriodName: 'Late Afternoon Heritage Walk',
    secondaryDescription: 'Archaeological museum visitors and peaceful sunset views.',
    secondaryIntensity: 'Moderate',
    recommendedOffPeak: '11:00 AM – 02:00 PM (Museum & Valley Grounds)',
    peakMultiplier: 1.25,
    altSite: 'Panduwasnuwara & Ridi Viharaya',
    action: 'Recommend early morning staircase climb before midday stone heat.'
  },

  // Historic Fortresses & Old Towns
  'galle-fort': {
    startHour: 9,
    endHour: 11,
    primaryPeriodName: 'Morning Heritage Walk & Boutiques',
    primaryDescription: 'Cobblestone walking tours, colonial churches, and boutique shopping.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Rampart Walk & Lighthouse',
    secondaryDescription: 'Rampart perimeter stroll, Flag Rock cliff jumpers, and sunset diners.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '12:00 PM – 03:30 PM (Air-Conditioned Museums & Cafes)',
    peakMultiplier: 1.45,
    altSite: 'Unawatuna Peace Pagoda & Koggala Lake',
    action: 'Direct sunset vehicle overflow to rampart perimeter car parks; suggest Rumassala Pagoda.'
  },
  'jaffna-fort': {
    startHour: 8,
    endHour: 10,
    primaryPeriodName: 'Morning Moat & Star Fort Tour',
    primaryDescription: 'Cool morning exploration of Dutch-era coral stone ramparts.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Lagoon Sunset & Coastal Breeze',
    secondaryDescription: 'Locals and travelers gathering along the lagoon-facing parapets.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '11:00 AM – 03:30 PM (Indoor Cultural Center)',
    peakMultiplier: 1.3,
    altSite: 'Nallur Kandaswamy Temple & Casuarina Beach',
    action: 'Promote late afternoon coastal breezes on the star-shaped moat ramparts.'
  },

  // Wildlife Safaris (2 Classic Safari Windows: Morning Gate Rush + Afternoon Gathering)
  'yala-safari': {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Dawn Safari Gate Rush (Block 1)',
    primaryDescription: '60+ safari jeeps queueing at Palatupana gate for early leopard tracks.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Afternoon Leopard & Waterhole Drive',
    secondaryDescription: 'Late afternoon jeep circuits around rock outcrops and lagoons.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '10:00 AM – 02:30 PM (Park Gates Closed to Vehicles)',
    peakMultiplier: 1.5,
    altSite: 'Lunugamvehera National Park & Bundala Wetland',
    action: 'Enforce 60-jeep Block 1 gate quota; route safari operators to Lunugamvehera corridor.'
  },
  udawalawe: {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Morning Reservoir Elephant Safari',
    primaryDescription: 'Early morning game drives around Udawalawe reservoir edge.',
    primaryIntensity: 'High',
    secondaryStartHour: 14,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Transit Home Milk Feeding & Evening Safari',
    secondaryDescription: 'Elephant Transit Home 15:00 feeding surge followed by sunset safari.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '10:30 AM – 01:30 PM (Visitor Information Center)',
    peakMultiplier: 1.45,
    altSite: 'Udawalawe Elephant Transit Home & Maduwanwela Walawwa',
    action: 'Guide afternoon visitors toward reservoir bank elephant herds and Transit Home 15:00 feeding.'
  },
  minneriya: {
    startHour: 6,
    endHour: 8,
    primaryPeriodName: 'Early Morning Birding & Deer Safari',
    primaryDescription: 'Quiet morning photography and bird watching around the tank.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'The Great Elephant Gathering Surge',
    secondaryDescription: 'Over 200+ wild elephants emerge on the dry lakebed grassland.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '09:00 AM – 02:30 PM (Midday Animal Resting Hours)',
    peakMultiplier: 1.5,
    altSite: 'Kaudulla National Park & Hurulu Eco Park',
    action: 'Coordinate with Kaudulla for real-time elephant gathering distribution.'
  },
  kaudulla: {
    startHour: 6,
    endHour: 8,
    primaryPeriodName: 'Morning Park Opening Drive',
    primaryDescription: 'Early bird and wildlife tracking in the forest buffer.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Afternoon Tank Herd Convergence',
    secondaryDescription: 'Large elephant family herds gathering near the open reservoir water.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '09:00 AM – 02:00 PM (Low Traffic Window)',
    peakMultiplier: 1.4,
    altSite: 'Minneriya National Park & Ritigala Nature Reserve',
    action: 'Direct afternoon safari jeep convoys across the expansive grass plains.'
  },
  wilpattu: {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Dawn Safari Villu Circuit',
    primaryDescription: 'Morning search for Sri Lankan leopards and sloth bears near natural lakes.',
    primaryIntensity: 'High',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Evening Villu Waterhole Safari',
    secondaryDescription: 'Late afternoon game drive as animals drink at Kumbuk Villu.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '10:30 AM – 02:30 PM (Midday Wildlife Siesta)',
    peakMultiplier: 1.35,
    altSite: 'Kudiramalai Point & Mannar Island',
    action: 'Distribute safari vehicles evenly among the natural freshwater villus.'
  },

  // Sacred Cultural Temples & Shrines (Morning Pooja/Thevava + Evening Pooja/Oil Lamp Offering)
  'temple-tooth': {
    startHour: 5,
    endHour: 8,
    primaryPeriodName: 'Dawn Thevava (Morning Pooja Ceremony)',
    primaryDescription: 'Devotees queue with lotus blossoms for the sacred 05:30 AM relics chamber opening.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 17,
    secondaryEndHour: 20,
    secondaryPeriodName: 'Evening Drumming & Oil Lamp Thevava',
    secondaryDescription: 'Atmospheric 18:30 PM ceremonial drumming, offering rituals, and lake reflection.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '10:00 AM – 03:30 PM (Audience Hall & World Buddhist Museum)',
    peakMultiplier: 1.5,
    altSite: 'Bahirawakanda Vihara Buddha & Udawatta Kele Sanctuary',
    action: 'Distribute evening Pooja entry batches and promote Udawatta Kele forest walk vouchers.'
  },
  anuradhapura: {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Dawn Jaya Sri Maha Bodhi Pilgrimage',
    primaryDescription: 'Morning white-clad devotees offering milk rice and chanting at the sacred Bo tree.',
    primaryIntensity: 'High',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Ruwanwelisaya Illumination',
    secondaryDescription: 'Cool evening circumambulation and lighting of thousands of clay oil lamps.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '11:00 AM – 03:00 PM (Archaeological Museum & Shaded Stupas)',
    peakMultiplier: 1.35,
    altSite: 'Mihintale Sacred Rock & Isurumuniya',
    action: 'Encourage early morning Ruwanwelisaya circumambulation before stone pavement heats up.'
  },
  dambulla: {
    startHour: 7,
    endHour: 10,
    primaryPeriodName: 'Morning Cave Shrine Tour',
    primaryDescription: 'Early climb up the granite slope before midday rock radiant heat.',
    primaryIntensity: 'High',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Afternoon Fresco Viewing & Sunset Terrace',
    secondaryDescription: 'Tour groups exploring the 5 gilded Buddha cave temples.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '11:30 AM – 02:30 PM (Golden Temple Base Museum)',
    peakMultiplier: 1.3,
    altSite: 'Nalanda Gedige & Ibbankatuwa Megalithic Site',
    action: 'Stagger cave shrine entry footwear queues to maintain ventilation and fresco preservation.'
  },
  kataragama: {
    startHour: 6,
    endHour: 8,
    primaryPeriodName: 'Morning Fruit Offering Pooja',
    primaryDescription: 'Pilgrims offering fruit trays at Maha Devale after Menik Ganga bath.',
    primaryIntensity: 'High',
    secondaryStartHour: 18,
    secondaryEndHour: 21,
    secondaryPeriodName: 'Night Maha Devale & Fire Walking Pooja',
    secondaryDescription: 'Spectacular evening drumming, curtain opening ceremonies, and kavadi dancers.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '10:00 AM – 04:00 PM (Kiri Vehera & Sacred Gardens)',
    peakMultiplier: 1.6,
    altSite: 'Sella Kataragama & Kiri Vehera',
    action: 'Manage night Maha Devale kavadi procession corridors and distribute Menik Ganga bath guidance.'
  },
  gangaramaya: {
    startHour: 9,
    endHour: 11,
    primaryPeriodName: 'Morning Temple Museum & Relic Hall',
    primaryDescription: 'Visitors viewing vintage artifacts, ivory carvings, and sacred relic chambers.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 17,
    secondaryEndHour: 20,
    secondaryPeriodName: 'Sunset Seema Malaka on Beira Lake',
    secondaryDescription: 'Peaceful sunset meditation and oil lamp lighting across the lake pavilion.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '12:00 PM – 03:30 PM (Quiet Temple Courtyard)',
    peakMultiplier: 1.35,
    altSite: 'Seema Malaka Lake Pavilion & Independence Square',
    action: 'Encourage Seema Malaka sunset visits across the Beira Lake footbridge.'
  },
  mihintale: {
    startHour: 6,
    endHour: 8,
    primaryPeriodName: 'Dawn Stupa Climb',
    primaryDescription: 'Cool morning ascent of the 1,840 granite steps.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Aradhana Gala Rock View',
    secondaryDescription: 'Sunset vistas over the sacred Rajarata plain and Mahaseya stupa.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '10:00 AM – 03:00 PM (Ancient Hospital Ruins & Kaludiya Pokuna)',
    peakMultiplier: 1.4,
    altSite: 'Aukana Buddha Statue & Kaludiya Pokuna',
    action: 'Promote sunset stupa climb overlooking the Rajarata plain.'
  },
  'nallur-temple': {
    startHour: 5,
    endHour: 8,
    primaryPeriodName: 'Dawn Thirumanjanam Pooja',
    primaryDescription: 'Traditional early morning kovil rituals and bell chiming.',
    primaryIntensity: 'High',
    secondaryStartHour: 16,
    secondaryEndHour: 20,
    secondaryPeriodName: 'Evening Ther Chariot & Deeparadhana',
    secondaryDescription: 'Night ceremonial procession with silver chariot and nadaswaram music.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '10:00 AM – 03:30 PM (Outer Perimeter Stroll)',
    peakMultiplier: 1.5,
    altSite: 'Jaffna Public Library & Keerimalai Sacred Springs',
    action: 'Organize evening Ther procession corridor and bare-chest traditional protocol guidance.'
  },

  // Highland Treks & Scenic Spots (Morning Train/Sunrise + Afternoon Train/Sunset)
  'sri-pada': {
    startHour: 2,
    endHour: 6,
    primaryPeriodName: 'Dawn Summit Sunrise & Shadow Peak',
    primaryDescription: 'Thousands of pilgrims reach the summit for the Ira Sevaya triangular shadow.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 16,
    secondaryEndHour: 19,
    secondaryPeriodName: 'Sunset Ascent Commencement',
    secondaryDescription: 'Evening climbers starting night trail under illuminated pathways.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '09:00 AM – 02:00 PM (Daylight Quiet Descent)',
    peakMultiplier: 1.7,
    altSite: 'Peak Wilderness Sanctuary & Laxapana Falls',
    action: 'Manage summit staircase queues for the dawn sunrise shadow triangle.'
  },
  horton: {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Morning World’s End Vista (Pre-Cloud Rush)',
    primaryDescription: 'Visitors race to World’s End cliff before mist rolls in at 09:30 AM.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 13,
    secondaryEndHour: 15,
    secondaryPeriodName: 'Baker’s Falls & Chimney Loop',
    secondaryDescription: 'Midday circuit hikers completing the 9km cloud forest loop.',
    secondaryIntensity: 'Moderate',
    recommendedOffPeak: '10:30 AM – 12:30 PM (Baker’s Falls Trail Section)',
    peakMultiplier: 1.45,
    altSite: 'Single Tree Hill & Moon Plains Nuwara Eliya',
    action: 'Enforce World’s End precipice barrier queue limits before 10:00 AM cloud cover arrives.'
  },
  'nine-arches': {
    startHour: 9,
    endHour: 12,
    primaryPeriodName: 'Morning Blue Express Train Crossing',
    primaryDescription: 'Massive crowd gathers on tracks and viewpoints for the 09:30 & 11:15 trains.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Afternoon Scenic Train & Golden Hour',
    secondaryDescription: 'Tea estate photography and afternoon train crossing at 15:30 & 17:15.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '06:30 AM – 08:30 AM & 12:30 PM – 02:30 PM',
    peakMultiplier: 1.45,
    altSite: 'Little Adam’s Peak & Demodara Loop Overlook',
    action: 'Issue safety track-clearing alert before the 11:30 and 15:15 blue train crossings.'
  },
  'little-adams-peak': {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Dawn Sunrise Hike Over Ella Gap',
    primaryDescription: 'Golden morning light illuminating Ella Rock and Rawana Falls valley.',
    primaryIntensity: 'High',
    secondaryStartHour: 16,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Sunset Valley Vista & Zipline',
    secondaryDescription: 'Sunset hikers and Flying Ravana adventure zipline participants.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '11:00 AM – 03:00 PM (Shaded Tea Estate Cafes)',
    peakMultiplier: 1.35,
    altSite: 'Ella Rock & Ravana Pool Club',
    action: 'Promote early morning sunrise hike overlooking Ella Gap.'
  },
  'ella-rock': {
    startHour: 6,
    endHour: 9,
    primaryPeriodName: 'Early Morning Mountain Trek',
    primaryDescription: 'Railway track and pine forest trek before afternoon cloud and heat.',
    primaryIntensity: 'High',
    secondaryStartHour: 15,
    secondaryEndHour: 17,
    secondaryPeriodName: 'Late Afternoon Ella Gap Vista',
    secondaryDescription: 'Experienced hikers capturing late afternoon light across the valley.',
    secondaryIntensity: 'Moderate',
    recommendedOffPeak: '10:00 AM – 02:00 PM (Trailside Tea Stalls)',
    peakMultiplier: 1.35,
    altSite: 'Little Adam’s Peak & Bambaragala Peak',
    action: 'Encourage early morning railway track trek to beat midday heat.'
  },
  'lake-gregory': {
    startHour: 9,
    endHour: 12,
    primaryPeriodName: 'Morning Water Sports & Speedboats',
    primaryDescription: 'Cool highland morning swan boats, jet skis, and horse rides.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Sunset Promenade, Carnival & Dining',
    secondaryDescription: 'Family picnic crowds, carnival rides, and evening food stalls.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '12:30 PM – 02:30 PM (Midday Tea Time)',
    peakMultiplier: 1.35,
    altSite: 'Victoria Park Nuwara Eliya & Galway’s Land',
    action: 'Distribute swan boat and pony ride queues along the lakeside promenade.'
  },

  // Waterfalls (Midday Swim + Sunset Overlook)
  'diyaluma-falls': {
    startHour: 10,
    endHour: 13,
    primaryPeriodName: 'Midday Natural Infinity Pool Swim',
    primaryDescription: 'Warm sun bathing and upper waterfall cascade pool swimming.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 15,
    secondaryEndHour: 17,
    secondaryPeriodName: 'Late Afternoon Valley Overlook',
    secondaryDescription: 'Scenic photography before descending the steep forest trail.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '07:30 AM – 09:30 AM (Early Calm Dip)',
    peakMultiplier: 1.35,
    altSite: 'Ravana Falls & Bambarakanda Falls',
    action: 'Monitor upper natural infinity pool capacity with local safety guides.'
  },
  'ravana-falls': {
    startHour: 10,
    endHour: 13,
    primaryPeriodName: 'Midday Roadside Scenic Stop',
    primaryDescription: 'Tourists stopping along the Ella-Wellawaya highway for photos and fresh king coconuts.',
    primaryIntensity: 'High',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Late Afternoon Valley Cascade View',
    secondaryDescription: 'Tour buses returning from Yala safaris making scenic rest stops.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '07:00 AM – 09:30 AM (Quiet Waterfall Spray)',
    peakMultiplier: 1.35,
    altSite: 'Nil Diya Pokuna & Ella Spice Garden',
    action: 'Direct roadside parking safely off the Ella-Wellawaya main pass.'
  },

  // Botanical Gardens, Tea Factories & Elephant Transit
  peradeniya: {
    startHour: 9,
    endHour: 12,
    primaryPeriodName: 'Morning Orchid House & Royal Palm Avenue',
    primaryDescription: 'Guided garden tours, photography groups, and Orchid House queue.',
    primaryIntensity: 'High',
    secondaryStartHour: 14,
    secondaryEndHour: 17,
    secondaryPeriodName: 'Afternoon Great Lawn Picnics',
    secondaryDescription: 'Family gatherings under the Giant Java Fig tree and Mahaweli river bank.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '12:00 PM – 02:00 PM (Shaded Bamboo Forest Walk)',
    peakMultiplier: 1.25,
    altSite: 'Ambekke Woodcarving Temple & Gadaladeniya',
    action: 'Encourage Great Lawn picnic dispersal & highlight Orchid House quiet hours.'
  },
  'royal-botanical': {
    startHour: 9,
    endHour: 12,
    primaryPeriodName: 'Morning Orchid House & Royal Palm Avenue',
    primaryDescription: 'Guided garden tours and botany students in floral pavilions.',
    primaryIntensity: 'High',
    secondaryStartHour: 14,
    secondaryEndHour: 17,
    secondaryPeriodName: 'Afternoon Great Lawn Picnics',
    secondaryDescription: 'Family gatherings and romantic strolls along spice gardens.',
    secondaryIntensity: 'High',
    recommendedOffPeak: '12:00 PM – 02:00 PM (Shaded Bamboo Forest Walk)',
    peakMultiplier: 1.25,
    altSite: 'Ambekke Woodcarving Temple & Gadaladeniya',
    action: 'Encourage Great Lawn picnic dispersal & highlight Orchid House quiet hours.'
  },
  pinnawala: {
    startHour: 9,
    endHour: 12,
    primaryPeriodName: 'Morning River Bathing & Feeding (10:00 AM)',
    primaryDescription: 'The entire elephant herd walks down to the Maha Oya river for morning bathing.',
    primaryIntensity: 'Critical',
    secondaryStartHour: 13,
    secondaryEndHour: 16,
    secondaryPeriodName: 'Afternoon River Bathing (02:00 PM)',
    secondaryDescription: 'Second river bath session and baby elephant milk bottle feedings.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '08:30 AM – 09:30 AM & 12:00 PM – 01:30 PM',
    peakMultiplier: 1.45,
    altSite: 'Millennium Elephant Foundation & Ranweli Spice Garden',
    action: 'Manage Maha Oya river bathing pavilion capacity before the 10:00 AM herd walk.'
  },
  colombo: {
    startHour: 10,
    endHour: 13,
    primaryPeriodName: 'Morning National Museum & Fort Tour',
    primaryDescription: 'Air-conditioned museum galleries, colonial Fort walk, and Pettah bazaars.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 17,
    secondaryEndHour: 20,
    secondaryPeriodName: 'Evening Galle Face Green & Port City Promenade',
    secondaryDescription: 'Sunset seaside promenade, Isso Vadai street food, and skyline views.',
    secondaryIntensity: 'Critical',
    recommendedOffPeak: '02:00 PM – 04:30 PM (Air-Conditioned Galleries)',
    peakMultiplier: 1.25,
    altSite: 'National Museum of Natural History & Independence Memorial',
    action: 'Offer air-conditioned gallery audio guides during midday Colombo heat.'
  }
};

/**
 * Intelligent heuristic to determine realistic peak window based on category & site characteristics
 */
export function getIntelligentPeakProfile(site: LiveSite): PeakProfileConfig {
  const cleanId = (site.id || '').toLowerCase();
  const cleanName = (site.name || '').toLowerCase();
  const cleanCat = (site.category || '').toLowerCase();

  // 1. Direct match by site ID
  if (SITE_PEAK_PROFILES[cleanId]) {
    return SITE_PEAK_PROFILES[cleanId];
  }

  // 2. Direct match by partial ID or name key
  for (const [key, profile] of Object.entries(SITE_PEAK_PROFILES)) {
    if (cleanId.includes(key) || cleanName.includes(key)) {
      return profile;
    }
  }

  // 3. Category & Keyword Heuristics for Sri Lanka context with 2 daily peaks

  // A. Beaches & Coastal (Morning Surf/Boats + Sunset Gathering)
  if (
    cleanCat.includes('beach') ||
    cleanCat.includes('coastal') ||
    cleanName.includes('beach') ||
    cleanName.includes('bay') ||
    cleanName.includes('surf') ||
    cleanName.includes('reef') ||
    cleanName.includes('coast')
  ) {
    return {
      startHour: 7,
      endHour: 10,
      primaryPeriodName: 'Morning Surf & Snorkeling Wave',
      primaryDescription: 'Early calm sea conditions for snorkeling, diving, and morning surf.',
      primaryIntensity: 'High',
      secondaryStartHour: 16,
      secondaryEndHour: 19,
      secondaryPeriodName: 'Sunset Gathering & Seafood Dining',
      secondaryDescription: 'Sunset crowd gathering for golden hour ocean views and dining.',
      secondaryIntensity: 'Critical',
      recommendedOffPeak: '11:30 AM – 03:00 PM (Quiet Shaded Hours)',
      peakMultiplier: 1.4,
      altSite: 'Nearby Coastal Cove or Quiet Lagoon',
      action: 'Promote sunset scenic points and morning quiet swim hours.'
    };
  }

  // B. Wildlife, Safaris & National Parks (Morning Safari + Late Afternoon Safari)
  if (
    cleanCat.includes('wildlife') ||
    cleanCat.includes('safari') ||
    cleanCat.includes('national park') ||
    cleanName.includes('safari') ||
    cleanName.includes('park') ||
    cleanName.includes('sanctuary') ||
    cleanName.includes('elephant')
  ) {
    return {
      startHour: 6,
      endHour: 9,
      primaryPeriodName: 'Dawn Safari & Gate Queue',
      primaryDescription: 'Early morning game drives as predators and birdlife are most active.',
      primaryIntensity: 'Critical',
      secondaryStartHour: 15,
      secondaryEndHour: 18,
      secondaryPeriodName: 'Afternoon Waterhole & Sunset Safari',
      secondaryDescription: 'Late afternoon elephant herds and wildlife converging at watering holes.',
      secondaryIntensity: 'Critical',
      recommendedOffPeak: '10:00 AM – 02:30 PM (Midday Animal Rest Period)',
      peakMultiplier: 1.45,
      altSite: 'Adjacent Buffer Zone or Nature Reserve',
      action: 'Stagger jeep departures and enforce radio dispatch quotas.'
    };
  }

  // C. Living Temples, Sacred Shrines & Kovils (Morning Pooja + Evening Pooja)
  if (
    cleanCat.includes('temple') ||
    cleanCat.includes('sacred') ||
    cleanCat.includes('religious') ||
    cleanCat.includes('pilgrim') ||
    cleanName.includes('temple') ||
    cleanName.includes('kovil') ||
    cleanName.includes('devale') ||
    cleanName.includes('vihar') ||
    cleanName.includes('stupa') ||
    cleanName.includes('dagoba') ||
    cleanName.includes('maligawa')
  ) {
    return {
      startHour: 6,
      endHour: 9,
      primaryPeriodName: 'Morning Pooja & Offering Ceremony',
      primaryDescription: 'Devotees offering fresh lotus flowers and participating in morning rites.',
      primaryIntensity: 'High',
      secondaryStartHour: 17,
      secondaryEndHour: 20,
      secondaryPeriodName: 'Evening Oil Lamp & Drumming Pooja',
      secondaryDescription: 'Atmospheric evening ceremony with clay lamps and traditional drumming.',
      secondaryIntensity: 'Critical',
      recommendedOffPeak: '10:30 AM – 03:30 PM (Quiet Shrine Grounds)',
      peakMultiplier: 1.45,
      altSite: 'Nearby Heritage Shrine or Sacred Grove',
      action: 'Distribute ceremonial pooja entry batches and offer footwear assistance.'
    };
  }

  // D. Ancient Rock Climbing & Fortresses (Early Morning + Late Afternoon Sunset)
  if (
    cleanName.includes('rock') ||
    cleanName.includes('fortress') ||
    cleanName.includes('sigiriya') ||
    cleanName.includes('pidurangala') ||
    cleanName.includes('climb')
  ) {
    return {
      startHour: 7,
      endHour: 10,
      primaryPeriodName: 'Morning Climb (Avoid Blazing Sun)',
      primaryDescription: 'Climbers ascend before stone stairs and summit heat up.',
      primaryIntensity: 'Critical',
      secondaryStartHour: 15,
      secondaryEndHour: 18,
      secondaryPeriodName: 'Late Afternoon Golden Hour Ascent',
      secondaryDescription: 'Spectacular sunset illumination and cooler breezes.',
      secondaryIntensity: 'High',
      recommendedOffPeak: '11:00 AM – 02:30 PM (Archaeological Museum & Caves)',
      peakMultiplier: 1.35,
      altSite: 'Nearby Valley Trail or Cave Complex',
      action: 'Encourage early morning ascent before stone steps heat up in direct sun.'
    };
  }

  // E. Highlands, Mountain Peaks & Viewpoints (Morning Sunrise + Afternoon Vista)
  if (
    cleanCat.includes('highland') ||
    cleanCat.includes('mountain') ||
    cleanName.includes('peak') ||
    cleanName.includes('viewpoint') ||
    cleanName.includes('gap') ||
    cleanName.includes('plains')
  ) {
    return {
      startHour: 6,
      endHour: 9,
      primaryPeriodName: 'Morning Sunrise & Clear Valley View',
      primaryDescription: 'Optimal visibility before mountain clouds and mist roll in.',
      primaryIntensity: 'High',
      secondaryStartHour: 15,
      secondaryEndHour: 18,
      secondaryPeriodName: 'Late Afternoon Sunset Ridge Hike',
      secondaryDescription: 'Sunset viewpoints and cooler mountain evening air.',
      secondaryIntensity: 'High',
      recommendedOffPeak: '10:30 AM – 02:30 PM (Tea Estate Cafes & Lower Trails)',
      peakMultiplier: 1.35,
      altSite: 'Alternative Mountain Viewpoint',
      action: 'Encourage sunrise climbs to experience optimal cloud-free visibility.'
    };
  }

  // F. Waterfalls (Midday Swim + Sunset Overlook)
  if (
    cleanCat.includes('waterfall') ||
    cleanName.includes('falls') ||
    cleanName.includes('waterfall') ||
    cleanName.includes('ella')
  ) {
    return {
      startHour: 10,
      endHour: 13,
      primaryPeriodName: 'Midday Natural Pool Swim',
      primaryDescription: 'Warm sun bathing and waterfall splash pools.',
      primaryIntensity: 'High',
      secondaryStartHour: 15,
      secondaryEndHour: 17,
      secondaryPeriodName: 'Afternoon Scenic Photography',
      secondaryDescription: 'Late afternoon mist photography and scenic viewpoints.',
      secondaryIntensity: 'High',
      recommendedOffPeak: '07:30 AM – 09:30 AM (Quiet Early Visit)',
      peakMultiplier: 1.35,
      altSite: 'Nearby Cascade & Forest Trail',
      action: 'Maintain trail safety monitors and distribute swimming pools evenly.'
    };
  }

  // G. Botanical Gardens & Tea Estates
  if (
    cleanCat.includes('nature') ||
    cleanName.includes('botanical') ||
    cleanName.includes('garden') ||
    cleanName.includes('estate') ||
    cleanName.includes('tea')
  ) {
    return {
      startHour: 9,
      endHour: 12,
      primaryPeriodName: 'Morning Guided Pavilion Tours',
      primaryDescription: 'Fresh morning flower blooms, tea processing demo, and herb gardens.',
      primaryIntensity: 'High',
      secondaryStartHour: 14,
      secondaryEndHour: 17,
      secondaryPeriodName: 'Afternoon Estate Lawn Picnics',
      secondaryDescription: 'Family walks and afternoon tea tastings.',
      secondaryIntensity: 'High',
      recommendedOffPeak: '12:00 PM – 02:00 PM (Shaded Indoor Pavilions)',
      peakMultiplier: 1.25,
      altSite: 'Nearby Scenic Plantation Walk',
      action: 'Encourage lawn dispersal and visit indoor exhibition halls during peak.'
    };
  }

  // Default Standard Daylight Profile with 2 gentle peaks
  return {
    startHour: 9,
    endHour: 12,
    primaryPeriodName: 'Morning Visitor Inflow',
    primaryDescription: 'Tour groups and early ticket desk entries.',
    primaryIntensity: 'Moderate',
    secondaryStartHour: 15,
    secondaryEndHour: 18,
    secondaryPeriodName: 'Afternoon Return Wave',
    secondaryDescription: 'Late afternoon visits before evening closing.',
    secondaryIntensity: 'Moderate',
    recommendedOffPeak: '12:30 PM – 02:30 PM (Midday Window)',
    peakMultiplier: 1.3,
    altSite: 'Nearby Regional Attraction',
    action: 'Monitor visitor throughput and recommend off-peak time slots.'
  };
}

/**
 * Format hour number into standard 12-hour AM/PM label
 */
function formatHourRange(start: number, end: number): string {
  const sH = start % 12 === 0 ? 12 : start % 12;
  const sAmpm = start >= 12 ? 'PM' : 'AM';
  const eH = end % 12 === 0 ? 12 : end % 12;
  const eAmpm = end >= 12 ? 'PM' : 'AM';
  return `${sH.toString().padStart(2, '0')}:00 ${sAmpm} – ${eH.toString().padStart(2, '0')}:00 ${eAmpm}`;
}

/**
 * Calculates accurate real-time daily peak analytics for any given live site with 2 daily peak hours
 */
export function calculateSitePeakMetric(site: LiveSite): SitePeakCrowdMetric {
  const sl = getSriLankaTime();
  const currentDecimalHour = sl.hour + sl.minute / 60;
  const siteConfig = SITE_OPERATING_PROFILES[site.id] || SITE_OPERATING_PROFILES[site.name.toLowerCase()];
  const profile = getIntelligentPeakProfile(site);

  const isNightActive = siteConfig?.isNightPeak ?? false;
  const openHour = siteConfig?.opensAt ?? 7;
  const closeHour = siteConfig?.closesAt ?? 18;

  const hasTwoPeaks = Boolean(profile.secondaryStartHour !== undefined && profile.secondaryEndHour !== undefined);

  // Peak 1 Info
  const peak1Label = formatHourRange(profile.startHour, profile.endHour);
  const peak1Active = currentDecimalHour >= profile.startHour && currentDecimalHour <= profile.endHour;
  const peak1Upcoming = currentDecimalHour < profile.startHour;

  const primaryPeakWindow: PeakWindowInfo = {
    startHour: profile.startHour,
    endHour: profile.endHour,
    label: peak1Label,
    periodName: profile.primaryPeriodName || 'Morning Peak Period',
    description: profile.primaryDescription || 'Peak visitor influx and active session.',
    intensity: profile.primaryIntensity || 'High',
    isCurrentlyActive: peak1Active,
    isUpcomingToday: peak1Upcoming
  };

  // Peak 2 Info (if applicable)
  let secondaryPeakWindow: PeakWindowInfo | undefined = undefined;
  if (hasTwoPeaks && profile.secondaryStartHour !== undefined && profile.secondaryEndHour !== undefined) {
    const peak2Label = formatHourRange(profile.secondaryStartHour, profile.secondaryEndHour);
    const peak2Active = currentDecimalHour >= profile.secondaryStartHour && currentDecimalHour <= profile.secondaryEndHour;
    const peak2Upcoming = currentDecimalHour < profile.secondaryStartHour;

    secondaryPeakWindow = {
      startHour: profile.secondaryStartHour,
      endHour: profile.secondaryEndHour,
      label: peak2Label,
      periodName: profile.secondaryPeriodName || 'Afternoon/Evening Peak Period',
      description: profile.secondaryDescription || 'Secondary visitor surge and sunset gathering.',
      intensity: profile.secondaryIntensity || 'High',
      isCurrentlyActive: peak2Active,
      isUpcomingToday: peak2Upcoming
    };
  }

  const peakWindows: PeakWindowInfo[] = [primaryPeakWindow];
  if (secondaryPeakWindow) {
    peakWindows.push(secondaryPeakWindow);
  }

  // Active Peak Window
  const activePeakWindow = peakWindows.find((w) => w.isCurrentlyActive) || null;
  // Next Upcoming Peak Window
  const nextUpcomingPeakWindow = peakWindows.find((w) => w.isUpcomingToday) || null;

  // Build 24-hour bimodal curve (reflecting both peak hours in a day!)
  const hourlyCurve = Array.from({ length: 24 }, (_, h) => {
    let base = 15;

    // Check if open at hour h
    let isOpenAtH = false;
    if (isNightActive || siteConfig?.is24Hours) {
      isOpenAtH = true;
    } else {
      isOpenAtH = h >= openHour && h < closeHour;
    }

    if (!isOpenAtH) {
      base = 0;
    } else {
      // Primary peak curve component
      const midPeak1 = (profile.startHour + profile.endHour) / 2;
      const distFromPeak1 = Math.abs(h - midPeak1);
      const curveFactor1 = Math.max(0, 1 - distFromPeak1 / 3.8);

      // Secondary peak curve component (if dual peaks exist)
      let curveFactor2 = 0;
      if (hasTwoPeaks && profile.secondaryStartHour !== undefined && profile.secondaryEndHour !== undefined) {
        const midPeak2 = (profile.secondaryStartHour + profile.secondaryEndHour) / 2;
        const distFromPeak2 = Math.abs(h - midPeak2);
        curveFactor2 = Math.max(0, 1 - distFromPeak2 / 3.8);
      }

      const totalCurveFactor = Math.min(1.2, Math.max(curveFactor1, curveFactor2 * 1.05));
      
      // Calculate scaled peak based on site max capacity and current density
      const siteBaseDensity = Math.max(20, site.currentDensity * 0.75);
      base = Math.round(siteBaseDensity + totalCurveFactor * (site.currentDensity * 0.5 + 15));

      // Holiday / Poya multiplier if active
      if (sl.isPoyaDay) {
        base = Math.round(base * 1.2);
      }
    }

    const isPeak1 = h >= profile.startHour && h <= profile.endHour && isOpenAtH;
    const isPeak2 = Boolean(
      hasTwoPeaks &&
      profile.secondaryStartHour !== undefined &&
      profile.secondaryEndHour !== undefined &&
      h >= profile.secondaryStartHour &&
      h <= profile.secondaryEndHour &&
      isOpenAtH
    );
    const isPeak = isPeak1 || isPeak2;
    const peakNumber: 1 | 2 | undefined = isPeak1 ? 1 : isPeak2 ? 2 : undefined;

    const cappedDensity = Math.min(100, Math.max(0, base));
    const visitors = Math.round((cappedDensity / 100) * site.maxCapacity);
    const isCurrent = h === sl.hour;

    const displayH = h % 12 === 0 ? 12 : h % 12;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const timeLabel = `${displayH.toString().padStart(2, '0')}:00 ${ampm}`;

    return {
      hour: h,
      timeLabel,
      density: cappedDensity,
      visitors,
      isPeak,
      isCurrent,
      peakNumber
    };
  });

  // Calculate today's peak density from the curve
  const validHours = hourlyCurve.filter((p) => p.density > 0);
  const maxPoint = validHours.length > 0
    ? validHours.reduce((prev, curr) => (curr.density > prev.density ? curr : prev), validHours[0])
    : { density: site.currentDensity, visitors: Math.round((site.currentDensity / 100) * site.maxCapacity) };

  const todayPeakDensity = Math.max(site.currentDensity, maxPoint.density);
  const todayPeakVisitors = Math.round((todayPeakDensity / 100) * site.maxCapacity);
  const yesterdayPeakDensity = Math.max(25, Math.round(todayPeakDensity * 0.93 - 3));
  const historicAveragePeak = Math.max(30, Math.round(todayPeakDensity * 0.88));

  // Determine current peak status
  let peakStatus: SitePeakCrowdMetric['peakStatus'] = 'OFF_PEAK';
  let minutesToPeak: number | null = null;

  const isOpenNow = site.isOpen ?? (siteConfig?.is24Hours || (currentDecimalHour >= openHour && currentDecimalHour < closeHour));

  if (!isOpenNow && !isNightActive && !siteConfig?.is24Hours) {
    peakStatus = 'CLOSED';
  } else if (activePeakWindow) {
    peakStatus = 'IN_PEAK_NOW';
  } else if (nextUpcomingPeakWindow) {
    const diffHours = nextUpcomingPeakWindow.startHour - currentDecimalHour;
    minutesToPeak = Math.max(0, Math.round(diffHours * 60));
    if (diffHours <= 1.5) {
      peakStatus = 'APPROACHING_PEAK';
    } else {
      peakStatus = 'UPCOMING_LATER';
    }
  } else {
    // Both peaks have passed for today
    peakStatus = 'POST_PEAK';
  }

  // Surge risk level
  let surgeRiskLevel: SitePeakCrowdMetric['surgeRiskLevel'] = 'OPTIMAL';
  if (todayPeakDensity >= site.criticalThreshold || todayPeakDensity >= 85) {
    surgeRiskLevel = 'CRITICAL';
  } else if (todayPeakDensity >= site.threshold || todayPeakDensity >= 70) {
    surgeRiskLevel = 'HIGH';
  } else if (todayPeakDensity >= 45) {
    surgeRiskLevel = 'MODERATE';
  }

  // Summary labels
  let peakWindowsSummary = primaryPeakWindow.label;
  if (secondaryPeakWindow) {
    peakWindowsSummary = `2 Peaks: ${primaryPeakWindow.label} & ${secondaryPeakWindow.label}`;
  }

  const peakWindowLabel = secondaryPeakWindow
    ? `${primaryPeakWindow.label} / ${secondaryPeakWindow.label}`
    : primaryPeakWindow.label;

  const recommendedOffPeakWindow =
    profile.recommendedOffPeak ||
    (hasTwoPeaks && profile.secondaryStartHour
      ? `${(profile.endHour + 1).toString().padStart(2, '0')}:00 – ${(profile.secondaryStartHour - 1).toString().padStart(2, '0')}:00 (Midday Off-Peak)`
      : '11:30 AM – 03:00 PM (Quiet Window)');

  return {
    siteId: site.id,
    siteName: site.name,
    region: site.region,
    category: site.category,
    maxCapacity: site.maxCapacity,
    currentDensity: site.currentDensity,
    currentVisitors: Math.round((site.currentDensity / 100) * site.maxCapacity),
    todayPeakDensity,
    todayPeakVisitors,
    yesterdayPeakDensity,
    historicAveragePeak,
    hasTwoPeaks,
    peakWindows,
    primaryPeakWindow,
    secondaryPeakWindow,
    activePeakWindow,
    nextUpcomingPeakWindow,
    peakWindowsSummary,
    recommendedOffPeakWindow,
    peakHourStart: profile.startHour,
    peakHourEnd: profile.endHour,
    peakWindowLabel,
    peakStatus,
    minutesToPeak,
    surgeRiskLevel,
    threshold: site.threshold,
    criticalThreshold: site.criticalThreshold,
    isBreachedNow: site.currentDensity >= site.threshold,
    willBreachAtPeak: todayPeakDensity >= site.threshold,
    recommendedAction: profile.action,
    suggestedAlternativeSite: profile.altSite,
    hourlyCurve
  };
}

/**
 * Calculates national aggregated summary of peak crowd metrics for operations reports
 */
export function calculateNationalPeakSummary(sites: LiveSite[]) {
  const metrics = sites.map((s) => calculateSitePeakMetric(s));
  const sitesInPeakNow = metrics.filter((m) => m.peakStatus === 'IN_PEAK_NOW');
  const sitesApproachingPeak = metrics.filter((m) => m.peakStatus === 'APPROACHING_PEAK');
  const criticalBreachSites = metrics.filter((m) => m.surgeRiskLevel === 'CRITICAL' || m.isBreachedNow);
  const totalMonitoredCapacity = metrics.reduce((acc, m) => acc + m.maxCapacity, 0);
  const totalCurrentVisitors = metrics.reduce((acc, m) => acc + m.currentVisitors, 0);
  const totalForecastedPeakVisitors = metrics.reduce((acc, m) => acc + m.todayPeakVisitors, 0);
  const avgPeakDensity = Math.round(
    metrics.reduce((acc, m) => acc + m.todayPeakDensity, 0) / (metrics.length || 1)
  );

  return {
    metrics,
    sitesInPeakNow,
    sitesApproachingPeak,
    criticalBreachSites,
    totalMonitoredCapacity,
    totalCurrentVisitors,
    totalForecastedPeakVisitors,
    avgPeakDensity,
    activeSitesCount: sites.length
  };
}

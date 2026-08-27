export interface OrganizedPathWaypoint {
  order: number;
  name: string;
  durationMin: number;
  distanceMeters: number;
  highlight: string;
  tip?: string;
}

export interface OrganizedPathCircuit {
  circuitName: string;
  totalDurationMin: number;
  totalDistanceKm: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  description: string;
  waypoints: OrganizedPathWaypoint[];
}

export interface TransitOption {
  mode: 'train' | 'car' | 'tuktuk' | 'walk' | 'bus';
  label: string;
  duration: string;
  costEstimate: string;
  scenicRating: number; // 1-5
  details: string;
  routeHighlight: string;
}

export interface FestivalEvent {
  title: string;
  type: 'Cultural Festival' | 'Religious Poya' | 'Wildlife Season' | 'Night Procession' | 'Local Market' | 'Daily Ceremony';
  seasonDate: string;
  status: 'Active Now' | 'Seasonal Peak' | 'Daily Ceremony' | 'Upcoming';
  impactOnCrowd: 'Extreme Surge (+40%)' | 'Moderate (+20%)' | 'Normal Flow';
  description: string;
  recommendedViewTime: string;
}

export interface SiteDeepDetails {
  siteId: string;
  siteName: string;
  tagline: string;
  historicalEra?: string;
  unescoYear?: string;
  dressCode?: string;
  entryFeeLocal?: string;
  entryFeeForeign?: string;
  bestVisitingWindow: string;
  weatherAdvice: string;
  organizedCircuit: OrganizedPathCircuit;
  transitOptions: TransitOption[];
  festivalsAndEvents: FestivalEvent[];
  nearbyAlternativeId?: string;
  ecoGuidelines: string[];
}

export const SITE_DEEP_DETAILS: Record<string, SiteDeepDetails> = {
  's1': {
    siteId: 's1',
    siteName: 'Temple of the Tooth (Sri Dalada Maligawa)',
    tagline: 'Sacred Custodian of the Sacred Tooth Relic of the Buddha',
    historicalEra: 'Kandyan Kingdom (16th–18th Century)',
    unescoYear: '1988',
    dressCode: 'White or light-colored attire covering shoulders & knees. Footwear removed at gate.',
    entryFeeLocal: 'Free (Donation)',
    entryFeeForeign: 'LKR 2,000 (~$6 USD)',
    bestVisitingWindow: '05:30 AM (Dawn Thevava) or 06:30 PM (Evening Hewisi Drumming)',
    weatherAdvice: 'Kandy microclimate often has late afternoon mist or light drizzle; morning hours are crisply clear.',
    organizedCircuit: {
      circuitName: 'Sacred Sanctum & World Heritage Circuit',
      totalDurationMin: 90,
      totalDistanceKm: 1.2,
      difficulty: 'Easy',
      description: 'Follow the traditional pilgrim path through the ornate stone gateways into the Inner Sanctum, followed by the Royal Palace and Museum grounds.',
      waypoints: [
        {
          order: 1,
          name: 'Queen’s Bath (Ulpange) & Kandy Lake Promenade',
          durationMin: 15,
          distanceMeters: 250,
          highlight: 'Serene lakeside reflection of the gilded Golden Canopy & Octagon.',
          tip: 'Leave large backpacks at the secure clock-room outside the main gate.'
        },
        {
          order: 2,
          name: 'Maha Wahalkada (Grand Entrance) & Moonstone',
          durationMin: 15,
          distanceMeters: 150,
          highlight: 'Intricately carved Kandyan guardstones, elephant balustrades, and makara thorana.',
          tip: 'Remove footwear here and receive an entry flower offering (Nil Manel or Lotus).'
        },
        {
          order: 3,
          name: 'Hewisi Drumming Courtyard (Digge)',
          durationMin: 20,
          distanceMeters: 100,
          highlight: 'Traditional Kandyan drummers & trumpeters performing during ceremonial pooja.',
          tip: 'Position yourself near the wooden columns during 06:30 PM drumming for the best acoustic experience.'
        },
        {
          order: 4,
          name: 'Upper Chamber (Vedahitina Maligawa) Inner Shrine',
          durationMin: 25,
          distanceMeters: 80,
          highlight: 'The sacred Seven Gilded Caskets (Karanduwa) containing the Sacred Tooth Relic.',
          tip: 'Maintain silence; photography is strictly prohibited inside the innermost relic doorway.'
        },
        {
          order: 5,
          name: 'Aluth Maligawa (New Palace) & International Buddhist Museum',
          durationMin: 15,
          distanceMeters: 400,
          highlight: 'Life-sized Buddha statues gifted from 20+ Buddhist nations across Asia.',
          tip: 'Exit through the rear Royal Gardens for a panoramic view of the Udawatta Kele forest canopy.'
        }
      ]
    },
    transitOptions: [
      {
        mode: 'train',
        label: 'Scenic Colombo-Kandy Intercity Train',
        duration: '2h 35m',
        costEstimate: 'LKR 600 - 1,500',
        scenicRating: 5,
        details: 'Departs Colombo Fort station at 07:00 AM. Passes through Kadugannawa pass and rolling mist hills.',
        routeHighlight: 'Kadugannawa Rock Tunnel & Rambukkana mountain curves'
      },
      {
        mode: 'car',
        label: 'Central Expressway (E04) & Kandy Road (A1)',
        duration: '2h 50m',
        costEstimate: 'LKR 14,000 (Private AC Taxi)',
        scenicRating: 4,
        details: 'Fastest vehicular route via Mirigama expressway interchange into Peradeniya highway.',
        routeHighlight: 'Kadugannawa incline view & tea roadside stalls'
      },
      {
        mode: 'tuktuk',
        label: 'Local Kandy City Tuk-Tuk',
        duration: '10m from Kandy Station',
        costEstimate: 'LKR 400 - 600',
        scenicRating: 4,
        details: 'Scenic cruise around the perimeter of Kandy Lake right to the Queen\'s Hotel junction.',
        routeHighlight: 'Lake Round perimeter drive'
      }
    ],
    festivalsAndEvents: [
      {
        title: 'Kandy Esala Perahera (The Festival of the Sacred Tooth)',
        type: 'Night Procession',
        seasonDate: 'July / August (Nikini Full Moon Lunar Cycle)',
        status: 'Upcoming',
        impactOnCrowd: 'Extreme Surge (+40%)',
        description: 'Asia’s most magnificent cultural pageant featuring 100+ caparisoned tuskers, 1,000+ Kandyan fire acrobats, whip crackers, and traditional Hewisi drummers parading the city after sunset.',
        recommendedViewTime: '06:30 PM – 11:30 PM along Dalada Veediya'
      },
      {
        title: 'Daily Thevava Ceremonies (Three Ritual Poojas)',
        type: 'Daily Ceremony',
        seasonDate: 'Daily, 365 Days a Year',
        status: 'Active Now',
        impactOnCrowd: 'Moderate (+20%)',
        description: 'Centuries-old unbroken traditional rituals with sacred conch blowing, drumming, and offerings of fragrant medicinal herbs and milk rice.',
        recommendedViewTime: 'Dawn (05:30 AM), Midday (09:30 AM), Night (06:30 PM)'
      },
      {
        title: 'Unduvap & Vesak Full Moon Poya Poojas',
        type: 'Religious Poya',
        seasonDate: 'Monthly Full Moon Days',
        status: 'Active Now',
        impactOnCrowd: 'Extreme Surge (+40%)',
        description: 'White-clad pilgrims flock from across the island for all-day meditation, sacred chanting, and oil lamp lighting around Kandy Lake.',
        recommendedViewTime: '06:00 AM – 09:00 PM'
      }
    ],
    nearbyAlternativeId: 's2',
    ecoGuidelines: [
      'Strict zero-single-use-plastic policy around the Temple perimeter.',
      'Place lotus flower stems into designated compost bins.',
      'Maintain respectful quietness during chanting sessions.'
    ]
  },

  's2': {
    siteId: 's2',
    siteName: 'Royal Botanical Gardens (Peradeniya)',
    tagline: '147 Acres of Exotic Tropical Flora and Historic Royal Plantations',
    historicalEra: 'Royal Kandyan Park (1371) / British Botanical Institution (1821)',
    dressCode: 'Comfortable casual walking attire and sun protection.',
    entryFeeLocal: 'LKR 200',
    entryFeeForeign: 'LKR 3,000 (~$10 USD)',
    bestVisitingWindow: '08:00 AM – 11:00 AM (Cool morning birdsong) or 03:30 PM – 05:30 PM (Golden hour)',
    weatherAdvice: 'Lush mountain humidity; pleasant tree shade throughout the 4,000+ plant collection.',
    organizedCircuit: {
      circuitName: 'Grand Botanic & Orchid Pavilion Circuit',
      totalDurationMin: 120,
      totalDistanceKm: 3.5,
      difficulty: 'Easy',
      description: 'Stroll through the world-famous Royal Palm Avenues, Giant Javan Fig Tree lawn, and the National Orchid House.',
      waypoints: [
        {
          order: 1,
          name: 'Main Gates & Royal Palm Avenue (Roystonea Regia)',
          durationMin: 20,
          distanceMeters: 500,
          highlight: 'Cathedral of 100-year-old towering Cuban Royal Palm trees flanking the central promenade.',
          tip: 'Grab a physical botanical map at the ticket counter.'
        },
        {
          order: 2,
          name: 'National Orchid House & Spice Garden',
          durationMin: 35,
          distanceMeters: 400,
          highlight: 'Over 300 rare species of indigenous orchids including the Queen of the Orchids and Ceylon Cinnamon trees.',
          tip: 'Best lighting for macro floral photography between 09:00 AM and 11:00 AM.'
        },
        {
          order: 3,
          name: 'Great Lawn & Giant Javan Fig Tree (Ficus benjamina)',
          durationMin: 30,
          distanceMeters: 600,
          highlight: 'A single umbrella tree whose massive canopy covers over 2,400 square meters.',
          tip: 'Perfect spot for barefoot grounding and shaded rest.'
        },
        {
          order: 4,
          name: 'Suspension Bridge & Mahaweli River Loop',
          durationMin: 20,
          distanceMeters: 800,
          highlight: 'Rushing waters of Sri Lanka\'s longest river fringed by giant Burmese bamboo groves.',
          tip: 'Look up into the bamboo clumps to spot fruit bat colonies roosting peacefully.'
        },
        {
          order: 5,
          name: 'Memorial Tree Avenue & Lake of Ceylon',
          durationMin: 15,
          distanceMeters: 500,
          highlight: 'Trees planted by world leaders including King George V, Mahatma Gandhi, and Yuri Gagarin.',
          tip: 'The pond is shaped precisely like the tear-drop map of Sri Lanka.'
        }
      ]
    },
    transitOptions: [
      {
        mode: 'tuktuk',
        label: 'Tuk-Tuk from Kandy Center',
        duration: '15m (6 km)',
        costEstimate: 'LKR 700 - 900',
        scenicRating: 4,
        details: 'Drive down Colombo-Kandy Road (A1) across the historic Peradeniya bridge.',
        routeHighlight: 'Peradeniya University clocktower & Mahaweli riverbank'
      },
      {
        mode: 'bus',
        label: 'Route 652 / Colombo-Kandy Red Bus',
        duration: '20m',
        costEstimate: 'LKR 50',
        scenicRating: 3,
        details: 'Frequent departures every 5 minutes from Kandy Goods Shed Bus Stand.',
        routeHighlight: 'Drop-off directly in front of the botanical ticket turnstile'
      }
    ],
    festivalsAndEvents: [
      {
        title: 'Spring Blossom Peak & Orchid Showcase',
        type: 'Cultural Festival',
        seasonDate: 'March – May (Pre-Monsoon Bloom)',
        status: 'Active Now',
        impactOnCrowd: 'Moderate (+20%)',
        description: 'Peak blooming season for exotic orchids, flowering Amherstia nobilis (Pride of Burma), and canopy vines.',
        recommendedViewTime: '08:30 AM – 11:30 AM'
      },
      {
        title: 'Kandy Perahera Daytime Tourist Overflow',
        type: 'Cultural Festival',
        seasonDate: 'July / August',
        status: 'Upcoming',
        impactOnCrowd: 'Extreme Surge (+40%)',
        description: 'Tourists enjoy daytime strolls in the cool gardens before travelling 6km into Kandy city for the evening Perahera procession.',
        recommendedViewTime: '08:00 AM – 01:00 PM'
      }
    ],
    ecoGuidelines: [
      'Do not pluck, scratch, or take cuttings of any rare botanical specimens.',
      'Plastics with single-use caps are inspected and tagged at entrance.',
      'Drones are strictly forbidden without prior Department of National Botanic Gardens permit.'
    ]
  },

  's3': {
    siteId: 's3',
    siteName: 'Sigiriya Rock Fortress (Lion Rock)',
    tagline: 'Ancient 5th-Century Sky Palace & UNESCO Wonder of the World',
    historicalEra: 'King Kashyapa Reign (477–495 AD)',
    unescoYear: '1982',
    dressCode: 'Sturdy walking shoes, lightweight cotton clothing, hat & sunblock.',
    entryFeeLocal: 'LKR 100',
    entryFeeForeign: 'USD $36 (~LKR 11,000)',
    bestVisitingWindow: '06:30 AM – 08:30 AM (Cool morning ascent) or 03:30 PM – 05:30 PM (Sunset descent)',
    weatherAdvice: 'Midday rock surface can exceed 38°C in direct sun. Start climbing before 08:00 AM.',
    organizedCircuit: {
      circuitName: 'Royal Kashyapa Citadel & Summit Staircase Trail',
      totalDurationMin: 150,
      totalDistanceKm: 2.8,
      difficulty: 'Moderate',
      description: 'Climb 1,200 steps from the water moats through the boulder caves, mirror wall frescoes, and colossal lion paws to the sky summit.',
      waypoints: [
        {
          order: 1,
          name: 'Outer Moat & Symmetrical Water Gardens',
          durationMin: 20,
          distanceMeters: 400,
          highlight: 'Ancient 5th-century hydraulic fountains that still spray water during rainy season.',
          tip: 'Turn back for the iconic postcard frame of the entire monolith rising above the lotus ponds.'
        },
        {
          order: 2,
          name: 'Boulder Gardens & Cobra Hood Cave',
          durationMin: 25,
          distanceMeters: 350,
          highlight: 'Monolithic granite overhangs that served as Buddhist hermit monk rock shelters in the 3rd century BC.',
          tip: 'Look for the drip ledges (Kataraya) carved into the rock roofs.'
        },
        {
          order: 3,
          name: 'Spiral Staircase to Cloud Frescoes (Sigiriya Damsels)',
          durationMin: 20,
          distanceMeters: 150,
          highlight: 'Vivid, world-renowned 1,500-year-old portraits of celestial celestial nymphs painted with natural earth pigments.',
          tip: 'Strictly NO flash photography to preserve the ancient plaster pigments.'
        },
        {
          order: 4,
          name: 'Mirror Wall & Ancient Sinhala Graffiti Walkway',
          durationMin: 20,
          distanceMeters: 100,
          highlight: 'Polished lime plaster wall containing 1,000+ poems written by visitors from the 6th to 14th centuries.',
          tip: 'Do not touch or lean on the mirror glaze.'
        },
        {
          order: 5,
          name: 'Lion’s Paw Terrace (Simhagiri Plateau)',
          durationMin: 20,
          distanceMeters: 200,
          highlight: 'Gigantic carved brick lion paws framing the dramatic vertical iron staircase to the sky.',
          tip: 'Rest and hydrate here before the final 200-step summit push.'
        },
        {
          order: 6,
          name: 'Summit Sky Palace & Royal Bathing Pool (Ahasa Maligawa)',
          durationMin: 35,
          distanceMeters: 300,
          highlight: 'Panoramic 360° horizon across emerald jungles, Pidurangala Rock, and the King\'s carved stone throne.',
          tip: 'Feel the refreshing mountain crossbreeze and inspect the deep water cistern cut into solid granite.'
        }
      ]
    },
    transitOptions: [
      {
        mode: 'car',
        label: 'Colombo / Dambulla Highway Drive',
        duration: '3h 30m from Colombo / 25m from Dambulla',
        costEstimate: 'LKR 18,000 (Private Driver)',
        scenicRating: 4,
        details: 'Take Central Expressway to Kurunegala, then A6 through Dambulla towards Sigiriya road.',
        routeHighlight: 'Lush coconut estates and view of Dambulla Golden Temple'
      },
      {
        mode: 'tuktuk',
        label: 'Tuk-Tuk from Dambulla or Habarana',
        duration: '25m (15 km)',
        costEstimate: 'LKR 1,200 - 1,800',
        scenicRating: 5,
        details: 'Scenic countryside ride along tank bunds (wewa) and elephant corridor woodlands.',
        routeHighlight: 'Passing wild lotus lakes with water buffalo herds'
      }
    ],
    festivalsAndEvents: [
      {
        title: 'Sigiriya Dawn Ascent & Equinox Alignment',
        type: 'Cultural Festival',
        seasonDate: 'Year-Round (Best Oct – April)',
        status: 'Active Now',
        impactOnCrowd: 'Moderate (+20%)',
        description: 'First entry gates open at 06:30 AM. Catch the rising sun breaking over the mist canopy of Pidurangala.',
        recommendedViewTime: '06:30 AM – 08:30 AM'
      },
      {
        title: 'Poson Poya Pilgrimage Wave (Cultural Triangle)',
        type: 'Religious Poya',
        seasonDate: 'June Full Moon',
        status: 'Upcoming',
        impactOnCrowd: 'Extreme Surge (+40%)',
        description: 'Pilgrim travelers combining Dambulla Cave Temple, Sigiriya, and Mihintale holy grounds.',
        recommendedViewTime: 'Early Morning (06:30 AM)'
      }
    ],
    ecoGuidelines: [
      'Do not bring loud music players; respect the nesting colonies of rock hornets and peregrine falcons.',
      'Stay strictly on marked stone pathways and iron stairs.',
      'Carry your own reusable metal water flask (plastic bottles must be sealed or untagged).'
    ]
  },

  's4': {
    siteId: 's4',
    siteName: 'Galle Dutch Fort & Ramparts',
    tagline: 'Living 17th-Century Colonial Fortress and Sunset Promenade',
    historicalEra: 'Portuguese (1588) / Dutch VOC (1663–1796) / British',
    unescoYear: '1988',
    dressCode: 'Casual beachwear, sunhat, walking sandals, evening smart casual.',
    entryFeeLocal: 'Free (Public Heritage City)',
    entryFeeForeign: 'Free Access to Streets & Ramparts',
    bestVisitingWindow: '07:00 AM – 09:30 AM (Quiet colonial streets) or 04:30 PM – 07:30 PM (Sunset & night promenade)',
    weatherAdvice: 'Breezy Indian Ocean sea breeze. Afternoon rains pass quickly over the peninsula.',
    organizedCircuit: {
      circuitName: 'Bastions, Lighthouse & Ocean Ramparts Walk',
      totalDurationMin: 100,
      totalDistanceKm: 2.4,
      difficulty: 'Easy',
      description: 'A continuous coastal loop along the massive coral-stone ramparts overlooking crashing turquoise surf, Dutch churches, and artisan gems.',
      waypoints: [
        {
          order: 1,
          name: 'Main Gate (1873) & Sun Bastion',
          durationMin: 15,
          distanceMeters: 300,
          highlight: 'Massive Dutch rampart stone walls overlooking the Galle International Cricket Stadium.',
          tip: 'Look for the VOC (Vereenigde Oostindische Compagnie) coat of arms carved above the old inner gate.'
        },
        {
          order: 2,
          name: 'Moon & Star Bastions (Clock Tower Walk)',
          durationMin: 20,
          distanceMeters: 400,
          highlight: '1883 stone clock tower built in honor of Dr. P.D. Anthonisz, overlooking the Indian ocean bay.',
          tip: 'Great elevated panoramic photography point.'
        },
        {
          order: 3,
          name: 'Dutch Reformed Church (Groote Kerk, 1755)',
          durationMin: 15,
          distanceMeters: 250,
          highlight: 'Floor paved with 250-year-old gravestones of Dutch governors and organ loft.',
          tip: 'Modest attire appreciated when entering church grounds.'
        },
        {
          order: 4,
          name: 'Flag Rock Bastion (Sunset Diving Point)',
          durationMin: 20,
          distanceMeters: 350,
          highlight: 'Traditional local cliff divers leaping into the churning waves between jagged coral reefs.',
          tip: 'Prime location for the golden Indian Ocean sunset over the horizon.'
        },
        {
          order: 5,
          name: 'Galle Lighthouse (1939) & Point Utrecht Bastion',
          durationMin: 20,
          distanceMeters: 400,
          highlight: 'White 26.5m lighthouse framed by swaying palm fronds and safe swimming lagoon.',
          tip: 'Ideal evening cooling breeze; street vendors serve fresh coconut water and roast corn.'
        },
        {
          order: 6,
          name: 'Pedlar Street & Leyn Baan Gem & Artisan Lane',
          durationMin: 25,
          distanceMeters: 500,
          highlight: 'Colonial Dutch villas converted into Ceylon tea salons, sapphire ateliers, and gelato parlors.',
          tip: 'Try homemade passion-fruit sorbet or Ceylon spice iced tea.'
        }
      ]
    },
    transitOptions: [
      {
        mode: 'train',
        label: 'Coastal Line Scenic Express (Colombo - Galle - Matara)',
        duration: '1h 55m',
        costEstimate: 'LKR 450 - 1,200',
        scenicRating: 5,
        details: 'Rides literally a few meters from the Indian Ocean coastline with crashing waves visible from the windows.',
        routeHighlight: 'Bentota, Hikkaduwa, and Galle harbor coastline tracks'
      },
      {
        mode: 'car',
        label: 'Southern Expressway (E01)',
        duration: '1h 15m from Colombo / Kottawa',
        costEstimate: 'LKR 9,000 (Taxi)',
        scenicRating: 3,
        details: 'Smooth 4-lane expressway with direct Pinnaduwa / Galle exit.',
        routeHighlight: 'Rubber plantations & low-country greenery'
      }
    ],
    festivalsAndEvents: [
      {
        title: 'Galle Literary Festival (FGLF)',
        type: 'Cultural Festival',
        seasonDate: 'January / February',
        status: 'Seasonal Peak',
        impactOnCrowd: 'Extreme Surge (+40%)',
        description: 'World-renowned celebration of international literature, poetry, art, culinary masterclasses, and music inside the fort ramparts.',
        recommendedViewTime: 'All Day & Late Night'
      },
      {
        title: 'Sunset Rampart Evening Drumming & Cannon Salute',
        type: 'Daily Ceremony',
        seasonDate: 'Daily Evenings',
        status: 'Active Now',
        impactOnCrowd: 'Moderate (+20%)',
        description: 'Hundreds gather along Flag Rock and Lighthouse bastions to watch the fiery tropical sunset while savoring spicy Isso Vadai (shrimp cakes).',
        recommendedViewTime: '05:30 PM – 07:00 PM'
      }
    ],
    ecoGuidelines: [
      'Do not throw plastic bottles or food wrappers over the ramparts into the marine sanctuary.',
      'Support verified local craftspeople and fair-trade lace makers on Church Street.',
      'Conserve water; historic fort infrastructure relies on delicate coastal supplies.'
    ]
  },

  's5': {
    siteId: 's5',
    siteName: 'Yala National Park (Ruhuna)',
    tagline: 'World’s Highest Density of Wild Sri Lankan Leopards & Elephants',
    historicalEra: 'Protected Wildlife Sanctuary since 1900 / National Park 1938',
    dressCode: 'Neutral khaki/earth tone clothing, dust scarf, telephoto camera lens, binoculars.',
    entryFeeLocal: 'LKR 300',
    entryFeeForeign: 'LKR 12,000 (~$35 USD inclusive of jeep service & service charges)',
    bestVisitingWindow: '06:00 AM – 09:30 AM (Dawn Safari) or 03:00 PM – 06:00 PM (Dusk Safari)',
    weatherAdvice: 'Dry-zone climate; warm and arid with dusty game tracks. Safaris strictly daylight only (Park gates close at 18:00).',
    organizedCircuit: {
      circuitName: 'Block 1 Ruhuna Leopard & Waterhole Safari Route',
      totalDurationMin: 210,
      totalDistanceKm: 28.0,
      difficulty: 'Easy',
      description: '4x4 Open Safari Jeep traverse through thorn scrub, rocky outcrops, and coastal saline lagoons.',
      waypoints: [
        {
          order: 1,
          name: 'Palatupana Main Gate Entrance & Briefing',
          durationMin: 15,
          distanceMeters: 500,
          highlight: 'Ticket verification and assignment of Department of Wildlife Conservation (DWC) wildlife tracker.',
          tip: 'Ensure your camera battery is 100% charged before passing through the gate.'
        },
        {
          order: 2,
          name: 'Kotigala (Leopard Rock) & Jamburagala Granite Outcrop',
          durationMin: 60,
          distanceMeters: 8000,
          highlight: 'Sun-warmed granite rocks where Sri Lankan leopards (Panthera pardus kotiya) bask during early dawn.',
          tip: 'Keep total silence when a leopard is spotted; engines are turned off.'
        },
        {
          order: 3,
          name: 'Buthuwa Lagoon & Coastal Beach Dunes',
          durationMin: 45,
          distanceMeters: 6000,
          highlight: 'Wild Asian elephant herds bathing, marsh mugger crocodiles, and flocks of painted storks.',
          tip: 'You are permitted to briefly step down onto the designated beach break point near the 2004 Tsunami Memorial.'
        },
        {
          order: 4,
          name: 'Menik River Canopy (Kumbukkan Oya Riverbanks)',
          durationMin: 45,
          distanceMeters: 7500,
          highlight: 'Towering Kumbuk trees where sloth bears forage for wild bee honeycombs and wood apple fruits.',
          tip: 'Look closely in tree forks for roosting Brown Fish Owls.'
        },
        {
          order: 5,
          name: 'Sithulpawwa Ancient Monastic Outpost Exit Trail',
          durationMin: 30,
          distanceMeters: 6000,
          highlight: 'A 2,200-year-old rock monastery where wild elephants peacefully share the courtyard.',
          tip: 'Exit before 18:00 to comply with strict park closure regulations.'
        }
      ]
    },
    transitOptions: [
      {
        mode: 'car',
        label: '4x4 Safari Jeep Transfer from Tissamaharama / Hambantota',
        duration: '35m to Park Gate',
        costEstimate: 'LKR 12,000 - 18,000 per Jeep (seats 6)',
        scenicRating: 5,
        details: 'Jeep picks up directly from your hotel lobby at 05:00 AM for sunrise queue.',
        routeHighlight: 'Tissa Wewa tank bund & morning flying foxes'
      }
    ],
    festivalsAndEvents: [
      {
        title: 'Annual Dry Season Elephant & Leopard Concentration',
        type: 'Wildlife Season',
        seasonDate: 'July – September (Dry Season)',
        status: 'Active Now',
        impactOnCrowd: 'Extreme Surge (+40%)',
        description: 'Animals congregate around diminishing waterholes, creating world-class wildlife viewing opportunities.',
        recommendedViewTime: '06:00 AM – 09:00 AM'
      },
      {
        title: 'Kataragama Festival Sacred Trekker Passage',
        type: 'Cultural Festival',
        seasonDate: 'July / August',
        status: 'Active Now',
        impactOnCrowd: 'Moderate (+20%)',
        description: 'Pada Yatra pilgrims trekking on foot from Jaffna through Yala East jungle tracks to Kataragama shrine.',
        recommendedViewTime: 'Morning jungle tracks'
      }
    ],
    ecoGuidelines: [
      'Never step out of the safari jeep except at authorized DWC beach stops.',
      'Strictly NO feeding or throwing food to wild elephants or monkeys.',
      'Zero single-use polythene; all lunch boxes must be non-disposable.'
    ]
  },

  's6': {
    siteId: 's6',
    siteName: 'Nine Arches Bridge (Demodara)',
    tagline: 'The Bridge in the Sky – Colonial Engineering Masterpiece in Cloud Tea Hills',
    historicalEra: 'British Ceylon Railway (Constructed 1921)',
    dressCode: 'Walking sneakers, rain jacket (Ella weather shifts rapidly), camera tripod.',
    entryFeeLocal: 'Free (Public Railway Landmark)',
    entryFeeForeign: 'Free Access',
    bestVisitingWindow: '06:30 AM – 09:00 AM (Morning train pass & sunrise mist) or 04:30 PM – 06:00 PM (Golden evening train)',
    weatherAdvice: 'Misty mountain drizzle common; cool 18°C – 22°C highland climate.',
    organizedCircuit: {
      circuitName: 'Tea Estate Trail & Bridge Overlook Path',
      totalDurationMin: 60,
      totalDistanceKm: 1.6,
      difficulty: 'Easy',
      description: 'Walk through dense bamboo groves and lush organic tea plantations to the curving 91-meter stone viaduct.',
      waypoints: [
        {
          order: 1,
          name: 'Ella-Passara Road Trailhead (Art Cafe Junction)',
          durationMin: 15,
          distanceMeters: 450,
          highlight: 'Shaded jungle footpath descending through organic Ceylon tea bushes and banana palms.',
          tip: 'Watch for occasional damp steps if it rained overnight.'
        },
        {
          order: 2,
          name: 'Upper Tea Plantation Overlook',
          durationMin: 15,
          distanceMeters: 300,
          highlight: 'The iconic high-angle viewpoint framing all nine solid stone arches against the valley.',
          tip: 'Best spot for wide-angle landscape camera framing.'
        },
        {
          order: 3,
          name: 'Railway Track Promenade & Tunnel Entrance',
          durationMin: 20,
          distanceMeters: 200,
          highlight: 'Walk safely along the edge of the historic ballast tracks (step aside when train whistle sounds).',
          tip: 'Main train passing schedule: ~06:30 AM, ~09:20 AM, ~11:50 AM, ~03:30 PM, ~05:30 PM.'
        },
        {
          order: 4,
          name: 'Valley Base River & Giant Bamboo Grove',
          durationMin: 10,
          distanceMeters: 300,
          highlight: 'Looking directly up 24 meters into the massive mortar and brick arches built without a single piece of steel.',
          tip: 'Fresh King Coconut vendors located at the lower footbridge.'
        }
      ]
    },
    transitOptions: [
      {
        mode: 'tuktuk',
        label: 'Tuk-Tuk from Ella Town Center',
        duration: '10m (2.8 km)',
        costEstimate: 'LKR 500 - 700',
        scenicRating: 5,
        details: 'Winds up through Passara road to the walking trailhead path.',
        routeHighlight: 'Ella Gap mountain vista & tea estates'
      },
      {
        mode: 'walk',
        label: 'Scenic Hike along the Train Tracks from Ella Railway Station',
        duration: '35m (2.5 km walk)',
        costEstimate: 'Free',
        scenicRating: 5,
        details: 'Walk past station platform 2 directly onto the tracks through pine forests.',
        routeHighlight: 'Kithalella forest track & mountain cliff views'
      }
    ],
    festivalsAndEvents: [
      {
        title: 'Morning Blue Express Train Crossings (Kandy-Ella Scenic Train)',
        type: 'Daily Ceremony',
        seasonDate: 'Daily Schedules',
        status: 'Active Now',
        impactOnCrowd: 'Extreme Surge (+40%)',
        description: 'Hundreds of travelers gather on the tea slopes as the iconic bright blue diesel locomotive crawls across the curving stone viaduct.',
        recommendedViewTime: '09:15 AM – 09:45 AM & 03:20 PM – 03:45 PM'
      },
      {
        title: 'Ella Tea Harvest Season & Highland Fog Awakening',
        type: 'Cultural Festival',
        seasonDate: 'Year-Round (Crispest May – September)',
        status: 'Active Now',
        impactOnCrowd: 'Normal Flow',
        description: 'Watch local tea pluckers with traditional woven baskets harvesting two leaves and a bud across the surrounding hills.',
        recommendedViewTime: '07:00 AM – 10:00 AM'
      }
    ],
    ecoGuidelines: [
      'Step off the tracks immediately when the train horn sounds in the distance.',
      'Do not litter plastic bottles or snack wrappers into the tea bushes below.',
      'Respect the privacy of local tea plucking families living near the trail.'
    ]
  },

  's7': {
    siteId: 's7',
    siteName: 'Colombo National Museum',
    tagline: 'Sri Lanka’s Premier Repository of Crown Jewels, Ancient Regalia & Art',
    historicalEra: 'Founded 1877 by Sir William Henry Gregory (British Ceylon)',
    dressCode: 'Respectful indoor casual attire; air-conditioned galleries.',
    entryFeeLocal: 'LKR 100',
    entryFeeForeign: 'LKR 1,500 (~$5 USD)',
    bestVisitingWindow: '09:00 AM – 11:30 AM (Opening hours: 09:00 AM – 05:00 PM strictly)',
    weatherAdvice: 'Indoor air-conditioned halls; ideal retreat during hot midday sun or tropical downpours.',
    organizedCircuit: {
      circuitName: 'Royal Regalia & Ancient Civilizations Gallery Route',
      totalDurationMin: 90,
      totalDistanceKm: 1.1,
      difficulty: 'Easy',
      description: 'A curated two-story historical journey through Sri Lanka\'s Anuradhapura, Polonnaruwa, and Kandyan royal eras.',
      waypoints: [
        {
          order: 1,
          name: 'Grand Italianate Facade & Sir William Gregory Statue',
          durationMin: 10,
          distanceMeters: 100,
          highlight: 'Stunning white Victorian neoclassical architecture set in manicured banyan lawns.',
          tip: 'Purchase your ticket at the counter right of the grand portico.'
        },
        {
          order: 2,
          name: 'Stone Sculpture Hall & Toluvila Buddha (4th Century)',
          durationMin: 20,
          distanceMeters: 200,
          highlight: 'Flawlessly sculpted limestone Buddha statue in meditative Dhyana Mudra posture.',
          tip: 'Examine the intricate Bodhisattva Avalokiteshvara bronze statues nearby.'
        },
        {
          order: 3,
          name: 'Kandyan Royal Throne & Crown Jewels (Gallery 4)',
          durationMin: 25,
          distanceMeters: 250,
          highlight: 'The gilded wooden throne, gold crown, and royal sceptre of Sri Wickrama Rajasinghe, the last King of Kandy.',
          tip: 'Returned by King George V to the nation of Ceylon in 1934.'
        },
        {
          order: 4,
          name: 'Ola Leaf Manuscripts & Traditional Weapons Pavilion',
          durationMin: 20,
          distanceMeters: 250,
          highlight: 'Ancient Buddhist palm-leaf scriptures written in Pali and Sinhala with ornate silver styluses.',
          tip: 'See the Kastane curved daggers embedded with rubies and dragon heads.'
        },
        {
          order: 5,
          name: 'Natural History Wing & Giant Blue Whale Skeleton',
          durationMin: 15,
          distanceMeters: 300,
          highlight: 'Full articulated skeleton of an Indian Ocean Blue Whale suspended in the central atrium.',
          tip: 'Fabulous educational wing for families and science enthusiasts.'
        }
      ]
    },
    transitOptions: [
      {
        mode: 'tuktuk',
        label: 'Tuk-Tuk from Colombo Fort or Galle Face',
        duration: '10m (3.5 km)',
        costEstimate: 'LKR 400 - 550',
        scenicRating: 4,
        details: 'Drive through Cinnamon Gardens past Viharamahadevi Park and Nelum Pokuna theatre.',
        routeHighlight: 'Albert Crescent green banyan canopy'
      },
      {
        mode: 'walk',
        label: 'Stroll from Viharamahadevi Park / Town Hall',
        duration: '8m walk (600m)',
        costEstimate: 'Free',
        scenicRating: 4,
        details: 'Pleasant walk through Colombo\'s leafiest municipal boulevard.',
        routeHighlight: 'Town Hall White House architecture & flowering flame trees'
      }
    ],
    festivalsAndEvents: [
      {
        title: 'National Heritage & Colombo Art Biennial Showcases',
        type: 'Cultural Festival',
        seasonDate: 'Regular Seasonal Exhibits',
        status: 'Active Now',
        impactOnCrowd: 'Normal Flow',
        description: 'Special curations highlighting repatriated Ceylon bronzes and conservation of palm-leaf medicine treatises.',
        recommendedViewTime: '10:00 AM – 02:00 PM'
      },
      {
        title: 'Evening Transition to Galle Face Green & Gangaramaya',
        type: 'Cultural Festival',
        seasonDate: 'Daily Evening Post-Closure',
        status: 'Active Now',
        impactOnCrowd: 'Moderate (+20%)',
        description: 'Because museum gates close promptly at 05:00 PM, tourists transition seamlessly to Gangaramaya Temple (open till 8 PM) or Galle Face Green promenade.',
        recommendedViewTime: '05:30 PM onward'
      }
    ],
    ecoGuidelines: [
      'No touching of open stone artifacts or glass display vitrines.',
      'No flash photography; respect copyright tags on historical manuscripts.',
      'Bags larger than 30x30cm must be checked into the security cloakroom.'
    ]
  }
};

/**
 * Fallback generator for any other site
 */
export function getSiteDeepDetails(siteId: string, siteName: string, region: string, category: string): SiteDeepDetails {
  if (SITE_DEEP_DETAILS[siteId]) {
    return SITE_DEEP_DETAILS[siteId];
  }

  // Generative profile based on category & region
  const isTemple = category.toLowerCase().includes('cultur') || category.toLowerCase().includes('temple');
  const isNature = category.toLowerCase().includes('nature') || category.toLowerCase().includes('park') || category.toLowerCase().includes('beach');

  return {
    siteId,
    siteName,
    tagline: `Premier Monitored Destination in the ${region} Province`,
    historicalEra: isTemple ? 'Classical Sri Lankan Buddhist Heritage' : 'Scenic Natural Protected Zone',
    unescoYear: undefined,
    dressCode: isTemple ? 'White/light attire covering shoulders & knees. Footwear removed at sacred grounds.' : 'Comfortable outdoor walking gear & sun protection.',
    entryFeeLocal: 'LKR 100 - 300',
    entryFeeForeign: 'LKR 1,500 - 4,500',
    bestVisitingWindow: '07:30 AM – 10:30 AM or 04:00 PM – 06:00 PM',
    weatherAdvice: 'Check live microclimate before starting your journey.',
    organizedCircuit: {
      circuitName: `${siteName} Guided Exploration Trail`,
      totalDurationMin: 75,
      totalDistanceKm: 1.8,
      difficulty: 'Easy',
      description: `Explore the key scenic highlights, heritage viewpoints, and photographic landmarks of ${siteName}.`,
      waypoints: [
        {
          order: 1,
          name: `${siteName} Main Reception & Orientation`,
          durationMin: 15,
          distanceMeters: 300,
          highlight: 'Site overview map and visitor information point.',
          tip: 'Obtain route information and check current visitor flow.'
        },
        {
          order: 2,
          name: 'Central Heritage & Scenic Highlight',
          durationMin: 35,
          distanceMeters: 800,
          highlight: `The primary iconic attraction and panoramic viewpoint of ${siteName}.`,
          tip: 'Ideal lighting for photography during early morning or late afternoon.'
        },
        {
          order: 3,
          name: 'Nature Walkway & Heritage Discovery Trail',
          durationMin: 25,
          distanceMeters: 700,
          highlight: 'Serene loop back through local flora, tea gardens, or historic architecture.',
          tip: 'Support local artisan stalls and eco-refreshment vendors.'
        }
      ]
    },
    transitOptions: [
      {
        mode: 'car',
        label: 'Direct Highway / Main Route Drive',
        duration: 'Estimated 45m – 2h depending on origin',
        costEstimate: 'Varies by vehicle type',
        scenicRating: 4,
        details: `Accessible via provincial roads with designated parking near ${siteName}.`,
        routeHighlight: `${region} scenic rural landscapes`
      },
      {
        mode: 'tuktuk',
        label: 'Local Tuk-Tuk Transfer',
        duration: '15m – 30m from nearest transit station',
        costEstimate: 'LKR 400 – 1,000',
        scenicRating: 4,
        details: 'Convenient point-to-point transfer with experienced local driver.',
        routeHighlight: 'Authentic Sri Lankan roadside scenery'
      }
    ],
    festivalsAndEvents: [
      {
        title: `${region} Seasonal Cultural & Religious Celebrations`,
        type: 'Cultural Festival',
        seasonDate: 'Full Moon Poya & Regional Festivals',
        status: 'Active Now',
        impactOnCrowd: 'Moderate (+20%)',
        description: `Local festivities and community ceremonies celebrated in the ${region} district.`,
        recommendedViewTime: 'Morning or Evening'
      }
    ],
    ecoGuidelines: [
      'Take only photos, leave only footprints. Zero plastic littering.',
      'Respect local cultural customs and heritage guidelines.',
      'Follow marked paths and ranger guidance.'
    ]
  };
}

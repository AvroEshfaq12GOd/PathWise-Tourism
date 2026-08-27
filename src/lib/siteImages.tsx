import React, { useState } from 'react';

/**
 * High quality curated image mappings for all 35+ Tourist Attractions in Sri Lanka.
 * Automatically checks local /images/ path, uploaded image filenames, and provides high-res fallback.
 */
export const SITE_IMAGE_MAP: Record<string, { localPaths: string[]; cdnFallback: string }> = {
  // 1. Temple of the Tooth
  'temple-of-tooth': {
    localPaths: ['/images/temple-of-tooth.jpg', '/images/Temple of the tooh relic.jpg', '/images/templeoftooth.jpg', '/images/kandy.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1588096344356-896898822184?auto=format&fit=crop&q=80&w=800'
  },
  // 2. Royal Botanical Gardens, Peradeniya
  'botanical-garden': {
    localPaths: ['/images/botanical-garden.jpg', '/images/Botanical garden.jpg', '/images/botanicalgarden.jpg', '/images/peradeniya.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1625733143873-d8ebaac5a8ea?auto=format&fit=crop&q=80&w=800'
  },
  // 3. Sigiriya Rock Fortress
  'sigiriya': {
    localPaths: ['/images/sigiriya.jpg', '/images/Sigiriya.jpg', '/images/sigiriya-rock.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1565018981442-83b3b2462e08?auto=format&fit=crop&q=80&w=800'
  },
  // 4. Galle Fort
  'galle-fort': {
    localPaths: ['/images/galle-fort.jpg', '/images/Galle fort.jpg', '/images/gallefort.jpg', '/images/galle.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800'
  },
  // 5. Nine Arches Bridge
  'nine-arches': {
    localPaths: ['/images/nine-arches.jpg', '/images/Nine arches.jpg', '/images/ninearches.jpg', '/images/ella-bridge.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1546708973-c3184eeb0b03?auto=format&fit=crop&q=80&w=800'
  },
  // 6. Mirissa Beach
  'mirissa-beach': {
    localPaths: ['/images/mirissa-beach.jpg', '/images/Mirissa beach.jpg', '/images/mirissabeach.jpg', '/images/mirissa.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&q=80&w=800'
  },
  // 7. Yala National Park
  'yala': {
    localPaths: ['/images/yala.jpg', '/images/Yala.jpg', '/images/yala-safari.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1610309995116-248552123985?auto=format&fit=crop&q=80&w=800'
  },
  // 8. Dambulla Cave Temple
  'dambulla-cave': {
    localPaths: ['/images/dambulla-cave.jpg', '/images/Dambulla cave.jpg', '/images/dambullacave.jpg', '/images/dambulla.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1624806992066-5ffcb7ca1e73?auto=format&fit=crop&q=80&w=800'
  },
  // 9. Ancient Polonnaruwa
  'polonnaruwa': {
    localPaths: ['/images/polonnaruwa.jpg', '/images/Polannaruwa.jpg', '/images/polannaruwa.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=800'
  },
  // 10. Anuradhapura
  'anuradhapura': {
    localPaths: ['/images/anuradhapura.jpg', '/images/Anuradhapura.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=800'
  },
  // 11. Udawalawe National Park
  'udawalawe': {
    localPaths: ['/images/udawalawe.jpg', '/images/Udawalawe.jpg', '/images/udawalawe-elephants.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800'
  },
  // 12. Horton Plains & World's End
  'horton-plains': {
    localPaths: ['/images/horton-plains.jpg', '/images/horton plains.jpg', '/images/hortonplains.jpg', '/images/worlds-end.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&q=80&w=800'
  },
  // 13. Sinharaja Rainforest
  'sinharaja': {
    localPaths: ['/images/sinharaja.jpg', '/images/Sinharaja.jpg', '/images/sinharaja-forest.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=800'
  },
  // 14. Arugam Bay
  'arugam-bay': {
    localPaths: ['/images/arugam-bay.jpg', '/images/arugam bay.jpg', '/images/arugambay.jpg', '/images/arugam.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
  },
  // 15. Sri Pada (Adam's Peak)
  'sri-pada': {
    localPaths: ['/images/sri-pada.jpg', '/images/Sri Pada.jpg', '/images/sripada.jpg', '/images/adams-peak.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
  },
  // 16. Pigeon Island
  'pigeon-island': {
    localPaths: ['/images/pigeon-island.jpg', '/images/pigeonisland.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800'
  },
  // 17. Gangaramaya Temple
  'gangaramaya': {
    localPaths: ['/images/gangaramaya.jpg', '/images/Gangaramaya.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800'
  },
  // 18. Bentota Beach
  'bentota': {
    localPaths: ['/images/bentota.jpg', '/images/Bentota.jpg', '/images/bentota-beach.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
  },
  // 19. Little Adam's Peak & Ella
  'little-adams-peak': {
    localPaths: ['/images/little-adams-peak.jpg', '/images/Nine arches.jpg', '/images/ella.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&q=80&w=800'
  },
  // 20. Jaffna Fort / Tower / Nallur
  'jaffna': {
    localPaths: ['/images/jaffna-tower.jpg', '/images/Jaffna tower.jpg', '/images/jaffna.jpg', '/images/jaffna-fort.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800'
  },
  // 21. Pidurangala Rock
  'pidurangala': {
    localPaths: ['/images/piduruthalagala.jpg', '/images/Piduruthalagala.jpg', '/images/pidurangala.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800'
  },
  // 22. Wilpattu National Park
  'wilpattu': {
    localPaths: ['/images/wilpattu.jpg', '/images/Wilpattu.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=800'
  },
  // 23. Minneriya Elephant Gathering
  'minneriya': {
    localPaths: ['/images/minneriya.jpg', '/images/Minneriya.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800'
  },
  // 24. Kaudulla National Park
  'kaudulla': {
    localPaths: ['/images/kaudulla.jpg', '/images/Kaudulla.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&q=80&w=800'
  },
  // 25. Knuckles Mountain Range
  'knuckles': {
    localPaths: ['/images/knuckles.jpg', '/images/Knuckles.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
  },
  // 26. Koneswaram Temple & Swami Rock
  'koneswaram': {
    localPaths: ['/images/koneswaram.jpg', '/images/Koneswaram.jpg', '/images/trincomalee.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800'
  },
  // 27. Pasikudah Coral Bay
  'pasikudah': {
    localPaths: ['/images/pasikudah.jpg', '/images/Pasikudah.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800'
  },
  // 28. Hikkaduwa Coral Reef
  'hikkaduwa': {
    localPaths: ['/images/hikkaduwa.jpg', '/images/Hikkaduwa.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800'
  },
  // 29. Gregory Lake & Nuwara Eliya
  'gregory-lake': {
    localPaths: ['/images/gregory-lake.jpg', '/images/Gregory Lake.jpg', '/images/gregorylake.jpg', '/images/nuwara-eliya.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
  },
  // 30. Ramboda Falls
  'ramboda': {
    localPaths: ['/images/ramboda.jpg', '/images/Ramboda.jpg', '/images/ramboda-falls.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=800'
  },
  // 31. Delft Island
  'delft-island': {
    localPaths: ['/images/delft-island.jpg', '/images/Delft Island.jpg', '/images/delftisland.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800'
  },
  // 32. Mihintale Sacred Peak
  'mihintale': {
    localPaths: ['/images/mihintale.jpg', '/images/Mihintale.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800'
  },
  // 33. Nagadeepa & Nainativu
  'nagadeepa': {
    localPaths: ['/images/nagadeepa.jpg', '/images/Nagadeepa.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800'
  },
  // 34. Colombo Museum
  'colombo-museum': {
    localPaths: ['/images/colombo-museum.jpg', '/images/Colombo Museum.jpg', '/images/colombomuseum.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=800'
  },
  // 35. Gal Vihara Colossi
  'galviharaya': {
    localPaths: ['/images/galviharaya.jpg', '/images/Galviharaya.jpg', '/images/gal-vihara.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1565018981442-83b3b2462e08?auto=format&fit=crop&q=80&w=800'
  },
  // 36. Kataragama
  'kataragama': {
    localPaths: ['/images/kataragama.jpg', '/images/Kataragama.jpg'],
    cdnFallback: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&q=80&w=800'
  }
};

/**
 * Finds the best image for a site name or ID.
 */
export function getSiteImageConfig(siteNameOrId: string): { primary: string; fallback: string } {
  const norm = (siteNameOrId || '').toLowerCase();

  if (norm.includes('tooth') || norm.includes('dalada')) return { primary: '/images/temple-of-tooth.jpg', fallback: SITE_IMAGE_MAP['temple-of-tooth'].cdnFallback };
  if (norm.includes('botanical') || norm.includes('peradeniya')) return { primary: '/images/botanical-garden.jpg', fallback: SITE_IMAGE_MAP['botanical-garden'].cdnFallback };
  if (norm.includes('sigiriya')) return { primary: '/images/sigiriya.jpg', fallback: SITE_IMAGE_MAP['sigiriya'].cdnFallback };
  if (norm.includes('galle')) return { primary: '/images/galle-fort.jpg', fallback: SITE_IMAGE_MAP['galle-fort'].cdnFallback };
  if (norm.includes('nine arch') || norm.includes('demodara')) return { primary: '/images/nine-arches.jpg', fallback: SITE_IMAGE_MAP['nine-arches'].cdnFallback };
  if (norm.includes('mirissa')) return { primary: '/images/mirissa-beach.jpg', fallback: SITE_IMAGE_MAP['mirissa-beach'].cdnFallback };
  if (norm.includes('yala')) return { primary: '/images/yala.jpg', fallback: SITE_IMAGE_MAP['yala'].cdnFallback };
  if (norm.includes('dambulla')) return { primary: '/images/dambulla-cave.jpg', fallback: SITE_IMAGE_MAP['dambulla-cave'].cdnFallback };
  if (norm.includes('gal vihara') || norm.includes('galviharaya')) return { primary: '/images/galviharaya.jpg', fallback: SITE_IMAGE_MAP['galviharaya'].cdnFallback };
  if (norm.includes('polonnaruwa') || norm.includes('polannaruwa')) return { primary: '/images/polonnaruwa.jpg', fallback: SITE_IMAGE_MAP['polonnaruwa'].cdnFallback };
  if (norm.includes('anuradhapura')) return { primary: '/images/anuradhapura.jpg', fallback: SITE_IMAGE_MAP['anuradhapura'].cdnFallback };
  if (norm.includes('udawalawe')) return { primary: '/images/udawalawe.jpg', fallback: SITE_IMAGE_MAP['udawalawe'].cdnFallback };
  if (norm.includes('horton') || norm.includes('world’s end') || norm.includes("world's end")) return { primary: '/images/horton-plains.jpg', fallback: SITE_IMAGE_MAP['horton-plains'].cdnFallback };
  if (norm.includes('sinharaja')) return { primary: '/images/sinharaja.jpg', fallback: SITE_IMAGE_MAP['sinharaja'].cdnFallback };
  if (norm.includes('arugam')) return { primary: '/images/arugam-bay.jpg', fallback: SITE_IMAGE_MAP['arugam-bay'].cdnFallback };
  if (norm.includes('sri pada') || norm.includes("adam's peak") || norm.includes('adams peak')) return { primary: '/images/sri-pada.jpg', fallback: SITE_IMAGE_MAP['sri-pada'].cdnFallback };
  if (norm.includes('pigeon island')) return { primary: '/images/pigeon-island.jpg', fallback: SITE_IMAGE_MAP['pigeon-island'].cdnFallback };
  if (norm.includes('gangaramaya')) return { primary: '/images/gangaramaya.jpg', fallback: SITE_IMAGE_MAP['gangaramaya'].cdnFallback };
  if (norm.includes('bentota') || norm.includes('madu')) return { primary: '/images/bentota.jpg', fallback: SITE_IMAGE_MAP['bentota'].cdnFallback };
  if (norm.includes('little adam') || norm.includes('ella rock')) return { primary: '/images/little-adams-peak.jpg', fallback: SITE_IMAGE_MAP['little-adams-peak'].cdnFallback };
  if (norm.includes('jaffna') || norm.includes('nallur')) return { primary: '/images/jaffna-tower.jpg', fallback: SITE_IMAGE_MAP['jaffna'].cdnFallback };
  if (norm.includes('pidurangala') || norm.includes('piduruthalagala')) return { primary: '/images/piduruthalagala.jpg', fallback: SITE_IMAGE_MAP['pidurangala'].cdnFallback };
  if (norm.includes('wilpattu')) return { primary: '/images/wilpattu.jpg', fallback: SITE_IMAGE_MAP['wilpattu'].cdnFallback };
  if (norm.includes('minneriya')) return { primary: '/images/minneriya.jpg', fallback: SITE_IMAGE_MAP['minneriya'].cdnFallback };
  if (norm.includes('kaudulla')) return { primary: '/images/kaudulla.jpg', fallback: SITE_IMAGE_MAP['kaudulla'].cdnFallback };
  if (norm.includes('knuckles') || norm.includes('dumbara')) return { primary: '/images/knuckles.jpg', fallback: SITE_IMAGE_MAP['knuckles'].cdnFallback };
  if (norm.includes('koneswaram') || norm.includes('swami rock')) return { primary: '/images/koneswaram.jpg', fallback: SITE_IMAGE_MAP['koneswaram'].cdnFallback };
  if (norm.includes('pasikudah') || norm.includes('kalkudah')) return { primary: '/images/pasikudah.jpg', fallback: SITE_IMAGE_MAP['pasikudah'].cdnFallback };
  if (norm.includes('hikkaduwa')) return { primary: '/images/hikkaduwa.jpg', fallback: SITE_IMAGE_MAP['hikkaduwa'].cdnFallback };
  if (norm.includes('gregory') || norm.includes('nuwara eliya') || norm.includes('pedro')) return { primary: '/images/gregory-lake.jpg', fallback: SITE_IMAGE_MAP['gregory-lake'].cdnFallback };
  if (norm.includes('ramboda')) return { primary: '/images/ramboda.jpg', fallback: SITE_IMAGE_MAP['ramboda'].cdnFallback };
  if (norm.includes('delft') || norm.includes('neduntivu')) return { primary: '/images/delft-island.jpg', fallback: SITE_IMAGE_MAP['delft-island'].cdnFallback };
  if (norm.includes('mihintale')) return { primary: '/images/mihintale.jpg', fallback: SITE_IMAGE_MAP['mihintale'].cdnFallback };
  if (norm.includes('nagadeepa') || norm.includes('nainativu')) return { primary: '/images/nagadeepa.jpg', fallback: SITE_IMAGE_MAP['nagadeepa'].cdnFallback };
  if (norm.includes('museum') || norm.includes('galle face')) return { primary: '/images/colombo-museum.jpg', fallback: SITE_IMAGE_MAP['colombo-museum'].cdnFallback };
  if (norm.includes('kataragama')) return { primary: '/images/kataragama.jpg', fallback: SITE_IMAGE_MAP['kataragama'].cdnFallback };

  return {
    primary: '/images/sigiriya.jpg',
    fallback: 'https://images.unsplash.com/photo-1565018981442-83b3b2462e08?auto=format&fit=crop&q=80&w=800'
  };
}

interface SiteImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  siteName?: string;
  src?: string;
  alt: string;
}

/**
 * Resilient Site Image component that handles local assets and cloud fallbacks seamlessly.
 */
export const SiteImage: React.FC<SiteImageProps> = ({ siteName, src, alt, className, ...props }) => {
  const config = getSiteImageConfig(siteName || alt || src || '');
  // Prefer local uploaded image file from /public/images/
  const initialSrc = (src && src.startsWith('/images/')) ? src : config.primary;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(config.fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      referrerPolicy="no-referrer"
      className={className}
      {...props}
    />
  );
};

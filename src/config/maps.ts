export const GOOGLE_MAPS_API_KEY: string =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
  'AIzaSyAIH4ZpzwkRuq1o5sWzEcinU_T1zcthWlU';

export const DEFAULT_MAP_CENTER = {
  lat: 7.2906,
  lng: 80.6337 // Kandy & Central Sri Lanka
};

export const DEFAULT_MAP_ZOOM = 11;

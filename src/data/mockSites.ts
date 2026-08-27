import { generateLSTMData, TimeSeriesPoint } from './lstmSim';

export interface Site {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  currentDensity: number;
  trend: 'up' | 'down' | 'stable';
  forecastData: TimeSeriesPoint[];
  weather: {temp: number;condition: string;};
  features: string[];
  imageUrl: string;
  // Admin fields
  maxCapacity: number;
  region: string;
  isActive: boolean;
  threshold: number;
  criticalThreshold: number;
}

export const mockSites: Site[] = [
{
  id: 's1',
  name: 'Temple of the Tooth',
  category: 'Cultural',
  lat: 7.2936,
  lng: 80.6411,
  currentDensity: 92,
  trend: 'up',
  forecastData: generateLSTMData(85, 'up'),
  weather: { temp: 28, condition: 'Sunny' },
  features: ['Visitor trend ↑', 'Public Holiday', 'Sunny 28°C'],
  imageUrl: '/images/temple-of-tooth.jpg',
  maxCapacity: 5000,
  region: 'Central',
  isActive: true,
  threshold: 85,
  criticalThreshold: 95
},
{
  id: 's2',
  name: 'Royal Botanical Gardens',
  category: 'Nature',
  lat: 7.2714,
  lng: 80.5953,
  currentDensity: 45,
  trend: 'stable',
  forecastData: generateLSTMData(40, 'stable'),
  weather: { temp: 27, condition: 'Partly Cloudy' },
  features: ['Weekend', 'Large Area', 'Partly Cloudy'],
  imageUrl: '/images/botanical-garden.jpg',
  maxCapacity: 12000,
  region: 'Central',
  isActive: true,
  threshold: 90,
  criticalThreshold: 95
},
{
  id: 's3',
  name: 'Sigiriya Rock Fortress',
  category: 'Historical',
  lat: 7.957,
  lng: 80.7603,
  currentDensity: 88,
  trend: 'up',
  forecastData: generateLSTMData(80, 'up'),
  weather: { temp: 31, condition: 'Clear' },
  features: ['Morning Peak', 'Clear 31°C', 'Weekend'],
  imageUrl: '/images/sigiriya.jpg',
  maxCapacity: 3000,
  region: 'North Central',
  isActive: true,
  threshold: 80,
  criticalThreshold: 90
},
{
  id: 's4',
  name: 'Galle Fort',
  category: 'Heritage',
  lat: 6.0266,
  lng: 80.217,
  currentDensity: 65,
  trend: 'down',
  forecastData: generateLSTMData(70, 'down'),
  weather: { temp: 29, condition: 'Breezy' },
  features: ['Evening Approach', 'Coastal Breeze'],
  imageUrl: '/images/galle-fort.jpg',
  maxCapacity: 8000,
  region: 'Southern',
  isActive: true,
  threshold: 90,
  criticalThreshold: 95
},
{
  id: 's5',
  name: 'Nine Arches Bridge',
  category: 'Landmark',
  lat: 6.8767,
  lng: 81.0608,
  currentDensity: 78,
  trend: 'up',
  forecastData: generateLSTMData(70, 'up'),
  weather: { temp: 22, condition: 'Misty' },
  features: ['Train Schedule', 'Misty 22°C'],
  imageUrl: '/images/nine-arches.jpg',
  maxCapacity: 1500,
  region: 'Uva',
  isActive: true,
  threshold: 85,
  criticalThreshold: 95
},
{
  id: 's6',
  name: 'Mirissa Beach',
  category: 'Nature',
  lat: 5.9483,
  lng: 80.4536,
  currentDensity: 55,
  trend: 'stable',
  forecastData: generateLSTMData(50, 'stable'),
  weather: { temp: 30, condition: 'Sunny' },
  features: ['Weekend', 'Sunny 30°C'],
  imageUrl: '/images/mirissa-beach.jpg',
  maxCapacity: 4000,
  region: 'Southern',
  isActive: true,
  threshold: 90,
  criticalThreshold: 95
},
{
  id: 's7',
  name: 'Yala National Park',
  category: 'Nature',
  lat: 6.367,
  lng: 81.517,
  currentDensity: 95,
  trend: 'up',
  forecastData: generateLSTMData(90, 'up'),
  weather: { temp: 32, condition: 'Clear' },
  features: ['Morning Safari', 'Clear 32°C'],
  imageUrl: '/images/yala.jpg',
  maxCapacity: 500, // Jeeps
  region: 'Southern',
  isActive: true,
  threshold: 80,
  criticalThreshold: 90
},
{
  id: 's8',
  name: 'Dambulla Cave Temple',
  category: 'Cultural',
  lat: 7.8566,
  lng: 80.6485,
  currentDensity: 40,
  trend: 'down',
  forecastData: generateLSTMData(45, 'down'),
  weather: { temp: 29, condition: 'Partly Cloudy' },
  features: ['Afternoon Lull', 'Partly Cloudy'],
  imageUrl: '/images/dambulla-cave.jpg',
  maxCapacity: 2000,
  region: 'Central',
  isActive: true,
  threshold: 85,
  criticalThreshold: 95
}];

export type VehicleId =
  | 'car'
  | 'bus'
  | 'tram'
  | 'subway'
  | 'train'
  | 'bicycle'
  | 'scooter'
  | 'motorbike'
  | 'walk'
  | 'ferry';

export type VehicleItem = {
  id: VehicleId;
  label: string;
  icon: any; // Ionicons glyph name
  category: 'public' | 'private';
};

export const DEFAULT_VEHICLES: VehicleItem[] = [
  { id: 'car', label: 'Car', icon: 'car', category: 'private' },
  { id: 'bicycle', label: 'Bicycle', icon: 'bicycle', category: 'private' },
  { id: 'scooter', label: 'Scooter', icon: 'scooter', category: 'private' },
  { id: 'motorbike', label: 'Motorbike', icon: 'speedometer', category: 'private' },
  { id: 'walk', label: 'Walking', icon: 'walk', category: 'private' },
  { id: 'bus', label: 'Bus', icon: 'bus', category: 'public' },
  { id: 'tram', label: 'Tram', icon: 'subway', category: 'public' },
  { id: 'subway', label: 'Subway', icon: 'train', category: 'public' },
  { id: 'train', label: 'Train', icon: 'train-outline', category: 'public' },
  { id: 'ferry', label: 'Ferry', icon: 'boat', category: 'public' },
];

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // metros
  moving_time: number; // segundos
  elapsed_time: number; // segundos
  total_elevation_gain: number; // metros
  type: string;
  sport_type: string;
  start_date_local: string;
  average_speed: number; // m/s
  max_speed: number; // m/s
  average_watts?: number;
  kudos_count: number;
}

export type ActivityType = 'all' | 'MountainBikeRide' | 'Ride' | 'Walk' | 'Run';

export type DateFilter = 
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last4weeks'
  | 'lastMonth'
  | 'last3months'
  | 'last6months'
  | 'thisYear'
  | 'lastYear'
  | 'allTime'
  | 'custom';

export type DistanceFilter = 'all' | 'short' | 'medium' | 'long' | 'veryLong';
export type SpeedFilter = 'all' | 'below15' | '15to20' | '20to25' | 'above25';
export type ElevationFilter = 'all' | 'flat' | 'moderate' | 'mountainous' | 'extreme';

export interface FilterState {
  dateFilter: DateFilter;
  customDateStart?: Date;
  customDateEnd?: Date;
  activityType: ActivityType;
  distanceFilter: DistanceFilter;
  speedFilter: SpeedFilter;
  elevationFilter: ElevationFilter;
}

export interface DashboardStats {
  totalDistance: number;
  totalTime: number;
  totalElevation: number;
  totalActivities: number;
  averageSpeed: number;
  maxSpeed: number;
  averageDistancePerActivity: number;
  averagePower: number;
  averageElevationPerActivity: number;
  totalKudos: number;
}

export interface PersonalRecord {
  title: string;
  value: string;
  activityName: string;
  date: string;
  icon: string;
}

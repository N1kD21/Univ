export interface DemographicData {
  platform: 'facebook' | 'tiktok';
  userId: string;
  demographics: {
    age?: number;
    gender?: 'male' | 'female' | 'non-binary';
    location?: {
      country: string;
      city: string;
    };
    followers?: number;
  };
}

export interface Dream {
  _id: string;
  description: string;
  imageUrl: string;
  mood: string;
  moodScore: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  createdAt: string;
}

export interface SkyMood {
  mood: 'positive' | 'negative' | 'neutral';
  color: string;
} 
export type Exercise = {
  id: string;
  title: string;
  cue?: string;
  instruction?: string;
  image: string;
  duration: number;
  restAfter?: number;
  side?: 'left' | 'right' | 'both';
};

export type Workout = {
  id: string;
  title: string;
  subtitle?: string;
  fps?: number;
  width?: number;
  height?: number;
  introDuration?: number;
  exercises: Exercise[];
};

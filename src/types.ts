export type Exercise = {
  id: string;
  title: string;
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
  introImage?: string;
  introLines?: string[];
  letsBeginImage?: string;
  outroImage?: string;
  exercises: Exercise[];
};

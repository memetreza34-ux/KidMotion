export type Exercise = {
  id: string;
  title: string;
  instruction?: string;
  image: string;
  voice?: string;
  duration: number;
  restAfter?: number;
  side?: 'left' | 'right' | 'both';
};

export type IntroCue = {
  text: string;
  start: number;
  end: number;
};

export type Workout = {
  id: string;
  title: string;
  subtitle?: string;
  fps?: number;
  width?: number;
  height?: number;
  introDuration?: number;
  safetyDuration?: number;
  letsBeginDuration?: number;
  outroDuration?: number;
  introImage?: string;
  introCues?: IntroCue[];
  introVoice?: string;
  safetyVoice?: string;
  letsBeginImage?: string;
  letsBeginVoice?: string;
  outroImage?: string;
  outroVoice?: string;
  exercises: Exercise[];
};

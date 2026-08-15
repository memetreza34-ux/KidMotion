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
  introTitle?: string;
  introSubtitle?: string;
  introBadge?: string;
  introCues?: IntroCue[];
  introVoice?: string;
  safetyImage?: string;
  safetyVoice?: string;
  letsBeginImage?: string;
  letsBeginVoice?: string;
  outroImage?: string;
  outroVoice?: string;
  bgMusic?: string;
  exercises: Exercise[];
};

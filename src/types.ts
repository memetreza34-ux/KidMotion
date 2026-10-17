export type Exercise = {
  id: string;
  title: string;
  instruction?: string;
  image: string;
  readyImage?: string;
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
  introGreetingText?: string;
  introCues?: IntroCue[];
  introVoice?: string;
  safetyImage?: string;
  letsBeginImage?: string;
  outroImage?: string;
  bgMusic?: string;
  exercises: Exercise[];
};


export type LearningSceneRole =
  | 'HOOK' | 'PROMISE' | 'SETUP' | 'QUESTION' | 'CONTEXT' | 'TEACH'
  | 'DISCOVER' | 'EXAMPLE' | 'COMPARE' | 'REPEAT' | 'CHANT'
  | 'PRACTICE' | 'PAUSE' | 'REVEAL' | 'APPLY' | 'RECAP' | 'CLOSING_QUESTION';

export type LearningScene = {
  id: string;
  role?: LearningSceneRole;
  image?: string;
  duration: number;
  overlayText?: string;
  overlayPosition?: 'top' | 'center' | 'bottom';
  question?: string;
  choices?: string[];
  answer?: string;
  showPracticeOverlay?: boolean;
  showRevealOverlay?: boolean;
};

export type LearningVideoData = {
  id: string;
  title: string;
  fps?: number;
  width?: number;
  height?: number;
  voice?: string;
  bgMusic?: string;
  scenes: LearningScene[];
};

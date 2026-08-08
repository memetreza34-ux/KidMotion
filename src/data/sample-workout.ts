import type {Workout} from '../types';

export const sampleWorkout: Workout = {
  id: 'jungle-starter',
  title: 'Jungle Move Adventure',
  subtitle: 'Copy the poses and complete the mission!',
  fps: 30,
  width: 1920,
  height: 1080,
  introDuration: 4,
  exercises: [
    {
      id: 'tree-pose',
      title: 'TREE POSE',
      instruction: 'Stand tall and hold your balance!',
      image: 'poses/tree-pose.png',
      duration: 20,
      restAfter: 5,
    },
    {
      id: 'frog-squat',
      title: 'FROG SQUAT',
      instruction: 'Sit low like a frog!',
      image: 'poses/frog-squat.png',
      duration: 20,
      restAfter: 5,
    },
    {
      id: 'star-pose',
      title: 'STAR POSE',
      instruction: 'Stretch wide and hold!',
      image: 'poses/star-pose.png',
      duration: 20,
      restAfter: 5,
    },
  ],
};

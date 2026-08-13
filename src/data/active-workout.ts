import type {Workout} from '../types';

const imageAsset = (name: string) => `00-bildprompts/00-ALLE-BILDER-HIER-REIN/${name}`;
const voiceAsset = (name: string) => `00-audio/${name}`;

// ACTIVE REMOTION EPISODE: KM-001
// Keep this file aligned with content/episodes/KM-001-football-balance-training/data.json.
export const activeWorkout: Workout = {
  id: 'KM-001-football-balance-training',
  title: '5 MIN FOOTBALL TRAINING',
  subtitle: 'Balance • Control • Strong Positions',
  fps: 30,
  width: 1920,
  height: 1080,
  introDuration: 12,
  safetyDuration: 5,
  letsBeginDuration: 3,
  outroDuration: 5,
  introImage: imageAsset('Bild 01.png'),
  introVoice: voiceAsset('Voice 01.mp3'),
  introCues: [
    {text: 'HI, KIDMOTION FRIENDS!', start: 0, end: 2.3},
    {text: 'FOOTBALL TRAINING TODAY', start: 2.3, end: 5.4},
    {text: 'BALANCE • CONTROL • STRONG POSITIONS', start: 5.4, end: 8.6},
    {text: 'FIND SOME SPACE & FOLLOW ALONG', start: 8.6, end: 12},
  ],
  safetyImage: imageAsset('Bild 02.png'),
  safetyVoice: voiceAsset('Voice 02.mp3'),
  letsBeginImage: imageAsset('Bild 03.png'),
  letsBeginVoice: voiceAsset('Voice 03.mp3'),
  outroImage: imageAsset('Bild 16.png'),
  outroVoice: voiceAsset('Voice 16.mp3'),
  exercises: [
    {id:'04', title:'FOOTBALL READY HOLD', instruction:'Bend your knees and stay ready.', image:imageAsset('Bild 04.png'), voice:voiceAsset('Voice 04.mp3'), duration:20, restAfter:5},
    {id:'05', title:'GOALKEEPER SQUAT HOLD', instruction:'Stay low and keep your chest up.', image:imageAsset('Bild 05.png'), voice:voiceAsset('Voice 05.mp3'), duration:20, restAfter:5},
    {id:'06', title:'KNEE-UP BALANCE', instruction:'Lift one knee and stand tall.', image:imageAsset('Bild 06.png'), voice:voiceAsset('Voice 06.mp3'), duration:20, restAfter:5},
    {id:'07', title:'SINGLE-LEG BALANCE', instruction:'Stand on one leg and stay steady.', image:imageAsset('Bild 07.png'), voice:voiceAsset('Voice 07.mp3'), duration:20, restAfter:5},
    {id:'08', title:'SIDE LEG HOLD', instruction:'Lift one leg gently to the side.', image:imageAsset('Bild 08.png'), voice:voiceAsset('Voice 08.mp3'), duration:20, restAfter:5},
    {id:'09', title:'STANDING SIDE STRETCH', instruction:'Reach up and lean gently to the side.', image:imageAsset('Bild 09.png'), voice:voiceAsset('Voice 09.mp3'), duration:20, restAfter:5},
    {id:'10', title:'CALF RAISE HOLD', instruction:'Lift your heels and stay tall.', image:imageAsset('Bild 10.png'), voice:voiceAsset('Voice 10.mp3'), duration:20, restAfter:5},
    {id:'11', title:'WIDE SQUAT HOLD', instruction:'Sit low and keep your chest up.', image:imageAsset('Bild 11.png'), voice:voiceAsset('Voice 11.mp3'), duration:20, restAfter:5},
    {id:'12', title:'SIDE LUNGE HOLD', instruction:'Bend one knee and keep the other leg long.', image:imageAsset('Bild 12.png'), voice:voiceAsset('Voice 12.mp3'), duration:20, restAfter:5},
    {id:'13', title:'FORWARD LUNGE HOLD', instruction:'Step forward and keep your body tall.', image:imageAsset('Bild 13.png'), voice:voiceAsset('Voice 13.mp3'), duration:20, restAfter:5},
    {id:'14', title:'REACH-UP HOLD', instruction:'Stretch both arms high and stand tall.', image:imageAsset('Bild 14.png'), voice:voiceAsset('Voice 14.mp3'), duration:20, restAfter:5},
    {id:'15', title:'VICTORY BALANCE', instruction:'Lift one knee and hold strong.', image:imageAsset('Bild 15.png'), voice:voiceAsset('Voice 15.mp3'), duration:20, restAfter:0},
  ],
};

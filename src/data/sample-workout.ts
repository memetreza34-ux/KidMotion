import type {Workout} from '../types';

const asset = (name: string) => `00-bildprompts/00-ALLE-BILDER-HIER-REIN/${name}`;

export const sampleWorkout: Workout = {
  id: 'KM-001-football-balance-training',
  title: '5 MIN FOOTBALL TRAINING',
  subtitle: 'Balance • Control • Strong Positions',
  fps: 30,
  width: 1920,
  height: 1080,
  introDuration: 12,
  introImage: asset('Bild 01.png'),
  introLines: [
    'HI, KIDMOTION FRIENDS!',
    'FOOTBALL TRAINING TODAY',
    'BALANCE • CONTROL • STRONG POSITIONS',
    'FIND SOME SPACE & FOLLOW ALONG',
  ],
  letsBeginImage: asset('Bild 03.png'),
  outroImage: asset('Bild 16.png'),
  exercises: [
    {id:'04', title:'FOOTBALL READY HOLD', instruction:'Bend your knees and stay ready.', image:asset('Bild 04.png'), duration:20, restAfter:5},
    {id:'05', title:'GOALKEEPER SQUAT HOLD', instruction:'Stay low and keep your chest up.', image:asset('Bild 05.png'), duration:20, restAfter:5},
    {id:'06', title:'KNEE-UP BALANCE', instruction:'Lift one knee and stand tall.', image:asset('Bild 06.png'), duration:20, restAfter:5},
    {id:'07', title:'SINGLE-LEG BALANCE', instruction:'Stand on one leg and stay steady.', image:asset('Bild 07.png'), duration:20, restAfter:5},
    {id:'08', title:'SIDE LEG HOLD', instruction:'Lift one leg gently to the side.', image:asset('Bild 08.png'), duration:20, restAfter:5},
    {id:'09', title:'STANDING SIDE STRETCH', instruction:'Reach up and lean gently to the side.', image:asset('Bild 09.png'), duration:20, restAfter:5},
    {id:'10', title:'CALF RAISE HOLD', instruction:'Lift your heels and stay tall.', image:asset('Bild 10.png'), duration:20, restAfter:5},
    {id:'11', title:'WIDE SQUAT HOLD', instruction:'Sit low and keep your chest up.', image:asset('Bild 11.png'), duration:20, restAfter:5},
    {id:'12', title:'SIDE LUNGE HOLD', instruction:'Bend one knee and keep the other leg long.', image:asset('Bild 12.png'), duration:20, restAfter:5},
    {id:'13', title:'FORWARD LUNGE HOLD', instruction:'Step forward and keep your body tall.', image:asset('Bild 13.png'), duration:20, restAfter:5},
    {id:'14', title:'REACH-UP HOLD', instruction:'Stretch both arms high and stand tall.', image:asset('Bild 14.png'), duration:20, restAfter:5},
    {id:'15', title:'VICTORY BALANCE', instruction:'Lift one knee and hold strong.', image:asset('Bild 15.png'), duration:20, restAfter:0},
  ],
};

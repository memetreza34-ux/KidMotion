import {spawnSync} from 'node:child_process';

const args=process.argv.slice(2);
const getArg=(name)=>{
  const item=args.find((arg)=>arg.startsWith(`--${name}=`));
  return item?item.slice(name.length+3):'';
};
const format=getArg('format').toLowerCase();

if(!format){
  console.error('Missing --format. Choose one: workout | learning | learn-and-move');
  console.error('Example: npm run kidmotion:new -- --format=learning --topic="Learn the alphabet"');
  process.exit(1);
}

const npmNode=process.execPath;
let script='';
if(format==='workout') script='scripts/new-workout-episode.mjs';
else if(format==='learning') script='scripts/new-learning-episode.mjs';
else if(format==='learn-and-move') script='scripts/new-workout-episode.mjs';
else{
  console.error(`Unknown format: ${format}. Choose workout | learning | learn-and-move`);
  process.exit(1);
}

const forwarded=args.filter((arg)=>!arg.startsWith('--format='));
if(format==='learn-and-move') forwarded.push('--content-format=learn-and-move');
const result=spawnSync(npmNode,[script,...forwarded],{stdio:'inherit'});
process.exit(result.status||0);

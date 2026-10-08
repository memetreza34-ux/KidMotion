import fs from 'node:fs';
import path from 'node:path';

export const loadLearningEngine=(root=process.cwd())=>{
  const file=path.join(root,'config','learning-engine.json');
  if(!fs.existsSync(file)) throw new Error('Missing config/learning-engine.json');
  return JSON.parse(fs.readFileSync(file,'utf8'));
};

export const normalizeAgeBand=(value,engine)=>{
  const raw=String(value||engine.defaultAgeBand||'5-8').trim();
  return Object.prototype.hasOwnProperty.call(engine.ageBands||{},raw)?raw:null;
};

export const normalizeLearningMode=(value,engine)=>{
  const raw=String(value||'').trim().toUpperCase().replace(/[- ]+/g,'_');
  return Object.prototype.hasOwnProperty.call(engine.learningModes||{},raw)?raw:null;
};

export const defaultRolesForMode=(mode,engine)=>{
  return [...(engine.learningModes?.[mode]?.defaultRoles||[])];
};

export const requiredRolesForMode=(mode,engine)=>{
  return [...(engine.learningModes?.[mode]?.requiredRoles||[])];
};

export const expandRoles=(baseRoles,requestedCount)=>{
  const count=Number(requestedCount||0);
  if(!Number.isFinite(count)||count<=0||count===baseRoles.length) return [...baseRoles];
  if(count<baseRoles.length) return [...baseRoles];
  const roles=[...baseRoles];
  const insertBefore=Math.max(1,roles.lastIndexOf('RECAP'));
  while(roles.length<count){
    roles.splice(insertBefore,0,'EXAMPLE');
  }
  return roles;
};

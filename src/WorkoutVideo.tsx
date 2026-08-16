import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import type {Workout} from './types';
import {ExerciseScene} from './components/ExerciseScene';
import {RestScreen} from './components/RestScreen';
import {IntroScreen} from './components/IntroScreen';
import {GreatJobScreen} from './components/GreatJobScreen';
import {SafetyDisclaimerScreen} from './components/SafetyDisclaimerScreen';
import {LetsBeginScreen} from './components/LetsBeginScreen';

const Voice: React.FC<{src?: string}> = ({src}) => (src ? <Audio src={staticFile(src)} /> : null);

export const workoutDurationInFrames = (workout: Workout) => {
  const fps = workout.fps ?? 30;
  const intro = (workout.introDuration ?? 0) * fps;
  const safety = (workout.safetyDuration ?? 4) * fps;
  const letsBegin = (workout.letsBeginDuration ?? 2) * fps;
  const outro = (workout.outroDuration ?? 4) * fps;
  const exerciseFrames = workout.exercises.reduce((total, exercise) => total + (exercise.duration + (exercise.restAfter ?? 0)) * fps, 0);
  return intro + safety + letsBegin + exerciseFrames + outro;
};

export const WorkoutVideo: React.FC<{workout: Workout}> = ({workout}) => {
  const fps = workout.fps ?? 30;
  const introFrames = (workout.introDuration ?? 0) * fps;
  const safetyFrames = (workout.safetyDuration ?? 4) * fps;
  const letsBeginFrames = (workout.letsBeginDuration ?? 2) * fps;
  const outroFrames = (workout.outroDuration ?? 4) * fps;
  let cursor = introFrames;

  return (
    <AbsoluteFill style={{background: '#eef8ff'}}>
      {workout.bgMusic ? <Audio src={staticFile(workout.bgMusic)} volume={0.15} /> : null}
      
      {(workout.introDuration ?? 0) > 0 ? (
        <Sequence from={0} durationInFrames={introFrames}>
          <IntroScreen image={workout.introImage} title={workout.introTitle ?? workout.title} subtitle={workout.introSubtitle ?? workout.subtitle} badge={workout.introBadge ?? 'KIDMOTION'} />
          <Voice src={workout.introVoice} />
        </Sequence>
      ) : null}

      <Sequence from={cursor} durationInFrames={safetyFrames}>
        <SafetyDisclaimerScreen image={workout.safetyImage} />
        <Voice src={workout.safetyVoice} />
      </Sequence>
      {(() => { cursor += safetyFrames; return null; })()}

      <Sequence from={cursor} durationInFrames={letsBeginFrames}>
        <LetsBeginScreen image={workout.letsBeginImage} />
        <Voice src={workout.letsBeginVoice} />
      </Sequence>
      {(() => { cursor += letsBeginFrames; return null; })()}

      {workout.exercises.map((exercise, index) => {
        const exerciseStart = cursor;
        const exerciseFrames = exercise.duration * fps;
        cursor += exerciseFrames;
        const restSeconds = exercise.restAfter ?? 0;
        const restStart = cursor;
        const restFrames = restSeconds * fps;
        cursor += restFrames;
        const nextExercise = workout.exercises[index + 1];

        return (
          <React.Fragment key={exercise.id}>
            <Sequence from={exerciseStart} durationInFrames={exerciseFrames}>
              <ExerciseScene exercise={exercise} />
            </Sequence>
            {restSeconds > 0 ? (
              <Sequence from={restStart} durationInFrames={restFrames}>
                <RestScreen durationInSeconds={restSeconds} image={nextExercise?.image ?? exercise.image} />
              </Sequence>
            ) : null}
          </React.Fragment>
        );
      })}

      <Sequence from={cursor} durationInFrames={outroFrames}>
        <GreatJobScreen image={workout.outroImage} subtitle="WORKOUT COMPLETE" />
      </Sequence>
    </AbsoluteFill>
  );
};

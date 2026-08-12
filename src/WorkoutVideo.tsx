import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import type {Workout} from './types';
import {ExerciseScene} from './components/ExerciseScene';
import {RestScreen} from './components/RestScreen';
import {IntroScreen} from './components/IntroScreen';
import {GreatJobScreen} from './components/GreatJobScreen';
import {SafetyDisclaimerScreen} from './components/SafetyDisclaimerScreen';
import {LetsBeginScreen} from './components/LetsBeginScreen';

const OUTRO_SECONDS = 5;
const DISCLAIMER_SECONDS = 5;
const LETS_BEGIN_SECONDS = 3;

const Voice: React.FC<{src?: string}> = ({src}) => (src ? <Audio src={staticFile(src)} /> : null);

export const workoutDurationInFrames = (workout: Workout) => {
  const fps = workout.fps ?? 30;
  const intro = (workout.introDuration ?? 0) * fps;
  const exerciseFrames = workout.exercises.reduce((total, exercise) => {
    return total + (exercise.duration + (exercise.restAfter ?? 0)) * fps;
  }, 0);
  return intro + (DISCLAIMER_SECONDS + LETS_BEGIN_SECONDS) * fps + exerciseFrames + OUTRO_SECONDS * fps;
};

export const WorkoutVideo: React.FC<{workout: Workout}> = ({workout}) => {
  const fps = workout.fps ?? 30;
  const introFrames = (workout.introDuration ?? 0) * fps;
  let cursor = introFrames;

  return (
    <AbsoluteFill style={{background: '#eef8ff'}}>
      {(workout.introDuration ?? 0) > 0 ? (
        <Sequence from={0} durationInFrames={introFrames}>
          <IntroScreen image={workout.introImage} cues={workout.introCues} />
          <Voice src={workout.introVoice} />
        </Sequence>
      ) : null}

      <Sequence from={cursor} durationInFrames={DISCLAIMER_SECONDS * fps}>
        <SafetyDisclaimerScreen />
        <Voice src={workout.safetyVoice} />
      </Sequence>

      {(() => {
        cursor += DISCLAIMER_SECONDS * fps;
        return null;
      })()}

      <Sequence from={cursor} durationInFrames={LETS_BEGIN_SECONDS * fps}>
        <LetsBeginScreen image={workout.letsBeginImage} />
        <Voice src={workout.letsBeginVoice} />
      </Sequence>

      {(() => {
        cursor += LETS_BEGIN_SECONDS * fps;
        return null;
      })()}

      {workout.exercises.map((exercise, index) => {
        const exerciseStart = cursor;
        const exerciseFrames = exercise.duration * fps;
        cursor += exerciseFrames;
        const restSeconds = exercise.restAfter ?? 0;
        const restStart = cursor;
        const restFrames = restSeconds * fps;
        cursor += restFrames;

        return (
          <React.Fragment key={exercise.id}>
            <Sequence from={exerciseStart} durationInFrames={exerciseFrames}>
              <ExerciseScene exercise={exercise} />
              <Voice src={exercise.voice} />
            </Sequence>
            {restSeconds > 0 ? (
              <Sequence from={restStart} durationInFrames={restFrames}>
                <RestScreen durationInSeconds={restSeconds} nextTitle={workout.exercises[index + 1]?.title} />
              </Sequence>
            ) : null}
          </React.Fragment>
        );
      })}

      <Sequence from={cursor} durationInFrames={OUTRO_SECONDS * fps}>
        <GreatJobScreen image={workout.outroImage} subtitle="WORKOUT COMPLETE" />
        <Voice src={workout.outroVoice} />
      </Sequence>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {Workout} from './types';
import {ExerciseScene} from './components/ExerciseScene';
import {RestScreen} from './components/RestScreen';
import {IntroScreen} from './components/IntroScreen';
import {GreatJobScreen} from './components/GreatJobScreen';
import {SafetyDisclaimerScreen} from './components/SafetyDisclaimerScreen';

const OUTRO_SECONDS = 4;
const DISCLAIMER_SECONDS = 5;

export const workoutDurationInFrames = (workout: Workout) => {
  const fps = workout.fps ?? 30;
  const intro = (workout.introDuration ?? 0) * fps;
  const exerciseFrames = workout.exercises.reduce((total, exercise) => {
    return total + (exercise.duration + (exercise.restAfter ?? 0)) * fps;
  }, 0);
  return intro + exerciseFrames + (OUTRO_SECONDS + DISCLAIMER_SECONDS) * fps;
};

export const WorkoutVideo: React.FC<{workout: Workout}> = ({workout}) => {
  const fps = workout.fps ?? 30;
  let cursor = (workout.introDuration ?? 0) * fps;

  return (
    <AbsoluteFill style={{background: '#eef8ff'}}>
      {(workout.introDuration ?? 0) > 0 ? (
        <Sequence from={0} durationInFrames={(workout.introDuration ?? 0) * fps}>
          <IntroScreen title={workout.title} subtitle={workout.subtitle} />
        </Sequence>
      ) : null}

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
        <GreatJobScreen subtitle="Workout complete!" />
      </Sequence>

      <Sequence from={cursor + OUTRO_SECONDS * fps} durationInFrames={DISCLAIMER_SECONDS * fps}>
        <SafetyDisclaimerScreen />
      </Sequence>
    </AbsoluteFill>
  );
};

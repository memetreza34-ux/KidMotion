import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {Workout} from './types';
import {ExerciseScene} from './components/ExerciseScene';
import {RestScreen} from './components/RestScreen';

export const workoutDurationInFrames = (workout: Workout) => {
  const fps = workout.fps ?? 30;
  const intro = (workout.introDuration ?? 0) * fps;
  const exerciseFrames = workout.exercises.reduce((total, exercise) => {
    return total + (exercise.duration + (exercise.restAfter ?? 0)) * fps;
  }, 0);
  return intro + exerciseFrames;
};

export const WorkoutVideo: React.FC<{workout: Workout}> = ({workout}) => {
  const fps = workout.fps ?? 30;
  let cursor = (workout.introDuration ?? 0) * fps;

  return (
    <AbsoluteFill style={{background: '#eef8ff'}}>
      {(workout.introDuration ?? 0) > 0 ? (
        <Sequence from={0} durationInFrames={(workout.introDuration ?? 0) * fps}>
          <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif'}}>
            <div style={{fontSize: 88, fontWeight: 900, textAlign: 'center'}}>{workout.title}</div>
            {workout.subtitle ? <div style={{fontSize: 36, fontWeight: 700, marginTop: 24}}>{workout.subtitle}</div> : null}
          </AbsoluteFill>
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
    </AbsoluteFill>
  );
};

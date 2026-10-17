import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import type {Workout} from './types';
import {ExerciseScene} from './components/ExerciseScene';
import {RestScreen} from './components/RestScreen';
import {IntroScreen} from './components/IntroScreen';
import {GreatJobScreen} from './components/GreatJobScreen';
import {SafetyDisclaimerScreen} from './components/SafetyDisclaimerScreen';
import {LetsBeginScreen} from './components/LetsBeginScreen';

const OpeningVoice: React.FC<{src?: string}> = ({src}) => (src ? <Audio src={staticFile(src)} /> : null);

export const workoutDurationInFrames = (workout: Workout) => {
  const fps = workout.fps ?? 30;
  const intro = (workout.introDuration ?? 0) * fps;
  const safety = (workout.safetyDuration ?? 4) * fps;
  const letsBegin = (workout.letsBeginDuration ?? 2) * fps;
  const outro = (workout.outroDuration ?? 4) * fps;
  const exerciseFrames = workout.exercises.reduce(
    (total, exercise) => total + (exercise.duration + (exercise.restAfter ?? 0)) * fps,
    0,
  );
  return intro + safety + letsBegin + exerciseFrames + outro;
};

export const WorkoutVideo: React.FC<{workout: Workout}> = ({workout}) => {
  const fps = workout.fps ?? 30;
  const introFrames = (workout.introDuration ?? 0) * fps;
  const safetyFrames = (workout.safetyDuration ?? 4) * fps;
  const letsBeginFrames = (workout.letsBeginDuration ?? 2) * fps;
  const openingFrames = introFrames + safetyFrames + letsBeginFrames;
  const outroFrames = (workout.outroDuration ?? 4) * fps;
  const totalFrames = workoutDurationInFrames(workout);
  let cursor = introFrames;

  return (
    <AbsoluteFill style={{background: '#eef8ff'}}>
      {workout.bgMusic ? (
        <Audio
          src={staticFile(workout.bgMusic)}
          loop
          loopVolumeCurveBehavior="extend"
          volume={(f) => {
            const afterOpening = interpolate(
              f,
              [openingFrames, openingFrames + Math.round(fps * 0.8)],
              [0.07, 0.22],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            );
            const outroFade = interpolate(
              f,
              [Math.max(0, totalFrames - Math.round(fps * 2)), totalFrames - 1],
              [1, 0.45],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            );
            const base = f < openingFrames ? 0.07 : afterOpening;
            return base * outroFade;
          }}
        />
      ) : null}

      {workout.introVoice ? (
        <Sequence from={0} durationInFrames={openingFrames}>
          <OpeningVoice src={workout.introVoice} />
        </Sequence>
      ) : null}

      {(workout.introDuration ?? 0) > 0 ? (
        <Sequence from={0} durationInFrames={introFrames}>
          <IntroScreen
            image={workout.introImage}
            title={workout.introTitle ?? workout.title}
            subtitle={workout.introSubtitle ?? workout.subtitle}
            badge={workout.introBadge ?? 'KIDMOTION'}
            greetingText={workout.introGreetingText}
          />
        </Sequence>
      ) : null}

      <Sequence from={cursor} durationInFrames={safetyFrames}>
        <SafetyDisclaimerScreen image={workout.safetyImage} />
      </Sequence>
      {(() => {
        cursor += safetyFrames;
        return null;
      })()}

      <Sequence from={cursor} durationInFrames={letsBeginFrames}>
        <LetsBeginScreen image={workout.letsBeginImage} />
      </Sequence>
      {(() => {
        cursor += letsBeginFrames;
        return null;
      })()}

      {workout.exercises.map((exercise) => {
        const exerciseStart = cursor;
        const exerciseFrames = exercise.duration * fps;
        cursor += exerciseFrames;

        const readySeconds = exercise.restAfter ?? 0;
        const readyStart = cursor;
        const readyFrames = readySeconds * fps;
        cursor += readyFrames;

        return (
          <React.Fragment key={exercise.id}>
            <Sequence from={exerciseStart} durationInFrames={exerciseFrames}>
              <ExerciseScene exercise={exercise} />
            </Sequence>

            {readySeconds > 0 ? (
              <Sequence from={readyStart} durationInFrames={readyFrames}>
                <RestScreen durationInSeconds={readySeconds} image={exercise.readyImage ?? exercise.image} />
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

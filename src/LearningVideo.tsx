import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile} from 'remotion';
import type {LearningScene, LearningVideoData} from './types';

export const learningDurationInFrames = (video: LearningVideoData) => {
  const fps = video.fps ?? 30;
  return video.scenes.reduce((sum, scene) => sum + Math.round(scene.duration * fps), 0);
};

const TeachingOverlay: React.FC<{scene: LearningScene}> = ({scene}) => {
  const practice = scene.role === 'PRACTICE' && scene.showPracticeOverlay && scene.question;
  const reveal = scene.role === 'REVEAL' && scene.showRevealOverlay && scene.answer;
  const mainText = practice ? scene.question : reveal ? scene.answer : scene.overlayText;
  if (!mainText) return null;

  const justifyContent =
    scene.overlayPosition === 'top' ? 'flex-start' :
    scene.overlayPosition === 'center' ? 'center' : 'flex-end';

  return (
    <AbsoluteFill style={{justifyContent, padding: 80, pointerEvents: 'none'}}>
      <div
        style={{
          alignSelf: 'center',
          maxWidth: '82%',
          padding: '18px 28px',
          borderRadius: 24,
          background: 'rgba(10,31,68,0.84)',
          color: 'white',
          fontSize: 60,
          fontWeight: 800,
          lineHeight: 1.08,
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {mainText}
      </div>
    </AbsoluteFill>
  );
};

const LearningSceneFrame: React.FC<{scene: LearningScene}> = ({scene}) => (
  <AbsoluteFill style={{backgroundColor: '#eef6ff'}}>
    {scene.image ? <Img src={staticFile(scene.image)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
    <TeachingOverlay scene={scene} />
  </AbsoluteFill>
);

export const LearningVideo: React.FC<{video: LearningVideoData}> = ({video}) => {
  const fps = video.fps ?? 30;
  let cursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#eef6ff'}}>
      {video.bgMusic ? <Audio src={staticFile(video.bgMusic)} loop volume={0.08} /> : null}
      {video.voice ? <Audio src={staticFile(video.voice)} volume={1} /> : null}

      {video.scenes.map((scene) => {
        const frames = Math.max(1, Math.round(scene.duration * fps));
        const from = cursor;
        cursor += frames;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={frames}>
            <LearningSceneFrame scene={scene} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile} from 'remotion';
import type {LearningVideoData} from './types';

export const learningDurationInFrames = (video: LearningVideoData) => {
  const fps = video.fps ?? 30;
  return video.scenes.reduce((sum, scene) => sum + Math.round(scene.duration * fps), 0);
};

const LearningSceneFrame: React.FC<{
  image?: string;
  overlayText?: string;
  overlayPosition?: 'top' | 'center' | 'bottom';
}> = ({image, overlayText, overlayPosition = 'bottom'}) => {
  const justifyContent =
    overlayPosition === 'top' ? 'flex-start' :
    overlayPosition === 'center' ? 'center' : 'flex-end';

  return (
    <AbsoluteFill style={{backgroundColor: '#eef6ff'}}>
      {image ? <Img src={staticFile(image)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
      {overlayText ? (
        <AbsoluteFill style={{justifyContent, padding: 80, pointerEvents: 'none'}}>
          <div
            style={{
              alignSelf: 'center',
              maxWidth: '82%',
              padding: '18px 28px',
              borderRadius: 24,
              background: 'rgba(10,31,68,0.82)',
              color: 'white',
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.08,
              textAlign: 'center',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {overlayText}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

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
            <LearningSceneFrame
              image={scene.image}
              overlayText={scene.overlayText}
              overlayPosition={scene.overlayPosition}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

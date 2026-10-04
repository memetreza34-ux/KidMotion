import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

type IntroScreenProps = {
  image?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
};

export const IntroScreen: React.FC<IntroScreenProps> = ({image}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    {image ? <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
  </AbsoluteFill>
);

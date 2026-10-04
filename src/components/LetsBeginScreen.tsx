import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export const LetsBeginScreen: React.FC<{image?: string}> = ({image}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    {image ? <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
  </AbsoluteFill>
);

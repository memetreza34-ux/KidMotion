import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {brand} from '../brand';

export const LetsBeginScreen: React.FC<{image?: string}> = ({image}) => {
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: brand.colors.softBlue}}>
      {image ? <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
    </AbsoluteFill>
  );
};

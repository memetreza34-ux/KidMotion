import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

type IntroScreenProps = {
  image?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  greetingText?: string;
};

/**
 * In the new greeting-overlay-frame-zero-v1 policy, Google Flow supplies ONLY the
 * image; Remotion is responsible for the single HELLO! label, from frame zero.
 * This is intentionally not an episode-title card, and it never animates in late.
 */
export const IntroScreen: React.FC<IntroScreenProps> = ({image, greetingText}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    {image ? <Img src={staticFile(image)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /> : null}
    {greetingText ? (
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '8%', pointerEvents: 'none'}}>
        <div data-testid="intro-greeting-from-frame-zero" style={{
          display: 'inline-block',
          color: '#ffffff',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 112,
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: 3,
          padding: '25px 46px',
          backgroundColor: 'rgba(13, 46, 78, 0.93)',
          borderRadius: 36,
          border: '5px solid rgba(255,255,255,0.9)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
          textShadow: '0 3px 5px rgba(0,0,0,0.35)',
          whiteSpace: 'nowrap',
        }}>{greetingText}</div>
      </AbsoluteFill>
    ) : null}
  </AbsoluteFill>
);

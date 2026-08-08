import React from 'react';
import {brand} from '../brand';

export const SafetyDisclaimerScreen: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: brand.colors.cream,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 150px',
        fontFamily: brand.typography.fontFamily,
        textAlign: 'center',
      }}
    >
      <div style={{maxWidth: 1320}}>
        <div style={{fontSize: 62, fontWeight: 900, color: brand.colors.navy}}>SAFETY FIRST</div>
        <div style={{marginTop: 28, fontSize: 32, lineHeight: 1.45, fontWeight: 700, color: brand.colors.dark}}>
          Move in a safe, clear space and stop if anything hurts or feels uncomfortable.
          Children should have appropriate adult supervision when needed.
        </div>
        <div style={{marginTop: 28, fontSize: 24, lineHeight: 1.45, fontWeight: 600, color: brand.colors.navy, opacity: 0.78}}>
          KidMotion provides general movement and entertainment content and is not medical advice.
        </div>
      </div>
    </div>
  );
};

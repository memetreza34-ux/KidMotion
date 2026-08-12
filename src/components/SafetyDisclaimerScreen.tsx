import React from 'react';
import {brand} from '../brand';

export const SafetyDisclaimerScreen: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, ${brand.colors.cream} 0%, ${brand.colors.softBlue} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 150px',
        fontFamily: brand.typography.fontFamily,
        textAlign: 'center',
      }}
    >
      <div style={{maxWidth: 1320}}>
        <div style={{fontSize: 68, fontWeight: 950, color: brand.colors.navy}}>SAFETY FIRST</div>
        <div style={{marginTop: 30, fontSize: 38, lineHeight: 1.35, fontWeight: 800, color: brand.colors.dark}}>
          Make sure you have enough space to move.
          <br />
          Stop if anything hurts or feels uncomfortable.
        </div>
      </div>
    </div>
  );
};

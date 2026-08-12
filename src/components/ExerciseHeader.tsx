import React from 'react';
import {brand} from '../brand';

export const ExerciseHeader: React.FC<{
  title: string;
  instruction?: string;
}> = ({title, instruction}) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 56,
          bottom: 84,
          maxWidth: 760,
          padding: '16px 24px',
          borderRadius: 22,
          background: 'rgba(23,52,91,0.84)',
          color: brand.colors.white,
          fontFamily: brand.typography.fontFamily,
          fontSize: 44,
          lineHeight: 1.05,
          fontWeight: 900,
          letterSpacing: 0.5,
          textShadow: '0 3px 10px rgba(0,0,0,0.28)',
        }}
      >
        {title.toUpperCase()}
      </div>

      {instruction ? (
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 56,
            width: 520,
            minHeight: 122,
            padding: '26px 34px',
            borderRadius: 58,
            background: 'rgba(255,255,255,0.96)',
            border: `6px solid ${brand.colors.turquoise}`,
            boxShadow: '0 14px 34px rgba(23,52,91,0.18)',
            color: brand.colors.navy,
            fontFamily: brand.typography.fontFamily,
            fontSize: 28,
            lineHeight: 1.22,
            fontWeight: 800,
            textAlign: 'center',
          }}
        >
          {instruction}
        </div>
      ) : null}
    </>
  );
};

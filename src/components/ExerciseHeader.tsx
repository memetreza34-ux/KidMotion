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
          left: 58,
          bottom: 88,
          maxWidth: 820,
          color: brand.colors.white,
          fontFamily: brand.typography.fontFamily,
          fontSize: 48,
          lineHeight: 1.02,
          fontWeight: 950,
          letterSpacing: 0.4,
          WebkitTextStroke: `4px ${brand.colors.navy}`,
          paintOrder: 'stroke fill',
          textShadow: '0 7px 16px rgba(23,52,91,0.32)',
        }}
      >
        {title.toUpperCase()}
      </div>

      {instruction ? (
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 54,
            width: 540,
            minHeight: 150,
            fontFamily: brand.typography.fontFamily,
          }}
        >
          <div style={{position: 'absolute', left: 44, top: 2, width: 142, height: 96, borderRadius: 999, background: brand.colors.white, border: `5px solid ${brand.colors.turquoise}`}} />
          <div style={{position: 'absolute', left: 170, top: -18, width: 174, height: 116, borderRadius: 999, background: brand.colors.white, border: `5px solid ${brand.colors.turquoise}`}} />
          <div style={{position: 'absolute', right: 38, top: 12, width: 144, height: 92, borderRadius: 999, background: brand.colors.white, border: `5px solid ${brand.colors.turquoise}`}} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 48,
              minHeight: 108,
              padding: '28px 34px 24px',
              borderRadius: '54px 58px 50px 62px',
              background: 'rgba(255,255,255,0.98)',
              border: `5px solid ${brand.colors.turquoise}`,
              boxShadow: '0 14px 34px rgba(23,52,91,0.18)',
              color: brand.colors.navy,
              fontSize: 29,
              lineHeight: 1.2,
              fontWeight: 850,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {instruction}
          </div>
        </div>
      ) : null}
    </>
  );
};

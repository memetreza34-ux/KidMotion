import React from 'react';
import {brand} from '../brand';

const titleShadow = [
  '-3px -3px 0 #17345B',
  '0 -3px 0 #17345B',
  '3px -3px 0 #17345B',
  '-3px 0 0 #17345B',
  '3px 0 0 #17345B',
  '-3px 3px 0 #17345B',
  '0 3px 0 #17345B',
  '3px 3px 0 #17345B',
  '0 9px 20px rgba(23,52,91,0.30)',
].join(', ');

export const ExerciseHeader: React.FC<{
  title: string;
  instruction?: string;
}> = ({title, instruction}) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 62,
          bottom: 92,
          maxWidth: 790,
          fontFamily: brand.typography.fontFamily,
          color: brand.colors.white,
          fontSize: 48,
          lineHeight: 1.02,
          fontWeight: 950,
          letterSpacing: 0.7,
          textShadow: titleShadow,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
          <div style={{width: 56, height: 9, borderRadius: 999, background: brand.colors.lime}} />
          <div style={{width: 26, height: 9, borderRadius: 999, background: brand.colors.turquoise}} />
        </div>
        {title.toUpperCase()}
      </div>

      {instruction ? (
        <div style={{position: 'absolute', top: 42, right: 46, width: 550, height: 194}}>
          <svg
            width="550"
            height="194"
            viewBox="0 0 550 194"
            style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 14px 24px rgba(23,52,91,0.18))'}}
          >
            <path
              d="M82 164 C45 164 25 146 27 119 C29 94 50 79 76 80 C84 48 113 31 145 39 C166 15 205 15 228 38 C256 14 299 18 318 48 C347 27 390 40 403 72 C439 67 476 87 481 118 C486 147 463 165 428 165 Z"
              fill="rgba(255,255,255,0.98)"
              stroke={brand.colors.turquoise}
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </svg>

          <div
            style={{
              position: 'absolute',
              left: 67,
              right: 62,
              top: 65,
              bottom: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: brand.colors.navy,
              fontFamily: brand.typography.fontFamily,
              fontSize: 29,
              lineHeight: 1.18,
              fontWeight: 850,
              textAlign: 'center',
            }}
          >
            {instruction}
          </div>
        </div>
      ) : null}
    </>
  );
};

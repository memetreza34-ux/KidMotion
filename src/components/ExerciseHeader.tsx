import React from 'react';
import {brand} from '../brand';

export const ExerciseHeader: React.FC<{
  title: string;
  cue?: string;
  instruction?: string;
}> = ({title, cue, instruction}) => {
  return (
    <div style={{position: 'absolute', top: 44, left: 56, right: 260}}>
      <div style={{fontFamily: brand.typography.fontFamily, fontSize: 54, fontWeight: 900, color: brand.colors.navy, letterSpacing: 1}}>
        {title.toUpperCase()}
      </div>
      {cue ? (
        <div style={{marginTop: 10, display: 'inline-block', padding: '8px 18px', borderRadius: brand.radius.pill, background: brand.colors.lime, color: brand.colors.dark, fontFamily: brand.typography.fontFamily, fontWeight: 800, fontSize: 24}}>
          {cue.toUpperCase()}
        </div>
      ) : null}
      {instruction ? (
        <div style={{marginTop: 14, fontFamily: brand.typography.fontFamily, fontSize: 26, fontWeight: 700, color: brand.colors.dark}}>
          {instruction}
        </div>
      ) : null}
    </div>
  );
};

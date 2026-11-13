import React from 'react';

type P = {size?: number; color?: string; style?: React.CSSProperties};

export const IconCheck: React.FC<P> = ({size = 32, color = '#fff', style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCross: React.FC<P> = ({size = 32, color = '#fff', style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" />
  </svg>
);

export const IconLock: React.FC<P> = ({size = 32, color = '#fff', style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <rect x="4.5" y="10.5" width="15" height="11" rx="3" fill={color} />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke={color} strokeWidth={2.6} />
  </svg>
);

export const IconWarn: React.FC<P> = ({size = 32, color = '#fff', style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M12 3.5L22 20.5H2z" fill={color} strokeLinejoin="round" />
    <path d="M12 10v5" stroke="#22252B" strokeWidth={2.4} strokeLinecap="round" />
    <circle cx="12" cy="17.8" r="1.3" fill="#22252B" />
  </svg>
);

export const IconEye: React.FC<P> = ({size = 32, color = '#fff', style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" fill="none" stroke={color} strokeWidth={2.2} />
    <circle cx="12" cy="12" r="3.2" fill={color} />
  </svg>
);

export const IconSignalLow: React.FC<P> = ({size = 32, color = '#fff', style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={3 + i * 5} y={18 - (i + 1) * 4} width="3.4" height={(i + 1) * 4} rx="1" fill={color} opacity={i === 0 ? 1 : 0.3} />
    ))}
  </svg>
);

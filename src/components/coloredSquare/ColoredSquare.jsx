import React from 'react';
import { getBorderColor } from './helpers';

export const ColoredSquare = ({ color }) => (
  <div
    style={{
      display: 'inline-block',
      background: color,
      height: '10px',
      width: '10px',
      border: `1px solid ${getBorderColor(color, '#28292F')}`,
    }}
  />
);

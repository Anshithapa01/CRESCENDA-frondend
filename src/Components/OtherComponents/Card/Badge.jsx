// Badge.jsx
import React from 'react';

const Badge = ({ text, color }) => (
  <span className={`px-2 py-1 rounded-lg text-xs font-bold ${color}`}>
    {text}
  </span>
);

export default Badge;

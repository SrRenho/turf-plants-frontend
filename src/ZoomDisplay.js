import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useZoomDisplay } from './GameUIContext';


export default function ZoomDisplay() {
    const { zoom } = useZoomDisplay();

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      fontFamily: 'sans-serif',
      fontSize: '1rem',
    }}>
      <FaSearch />
      <span>{Math.round(zoom)}%</span>
    </div>
  );
}
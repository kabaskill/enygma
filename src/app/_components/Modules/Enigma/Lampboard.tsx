import { useMessageStore } from '~/store';
import { constants } from '~/store/constants';
import React from 'react';

export default function Lampboard() {
  const { activeLamp } = useMessageStore();
  
  // Combine all keyboard rows for the lampboard
  const allKeys = [
    ...constants.KEYBOARD.row1.split(''),
    ...constants.KEYBOARD.row2.split(''),
    ...constants.KEYBOARD.row3.split(''),
  ];
  
  return (
    <div className="lampboard">
      <div className="lamp-grid">
        {allKeys.map(key => (
          <div 
            key={key} 
            className={`lamp ${activeLamp?.toUpperCase() === key ? 'active' : ''}`}
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
}
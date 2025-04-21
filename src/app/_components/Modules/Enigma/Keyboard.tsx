import { useMessageStore } from '~/store';
import { constants } from '~/store/constants';
import React, { useCallback } from 'react';

export default function Keyboard() {
  const { input, setText, processChar } = useMessageStore();
  
  const handleKeyPress = useCallback((key: string) => {
    // Add key to input
    const newInput = input + key;
    setText(newInput);
    
    // Also process this character immediately for the lampboard
    processChar(key, newInput.length - 1);
  }, [input, setText, processChar]);
  
  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {constants.KEYBOARD.row1.split('').map(key => (
          <button 
            key={key} 
            className="key" 
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      
      <div className="keyboard-row">
        {constants.KEYBOARD.row2.split('').map(key => (
          <button 
            key={key} 
            className="key" 
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      
      <div className="keyboard-row">
        {constants.KEYBOARD.row3.split('').map(key => (
          <button 
            key={key} 
            className="key" 
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
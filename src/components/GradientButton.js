import React, { useState } from 'react';
import './GradientButton.css';

const GradientButton = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    alert('👍️');
    setTimeout(() => setClicked(false), 200);
  };

  return (
    <button
      className={`gradient-button ${clicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      🤍 UwU 🤍
    </button>
  );
};

export default GradientButton;
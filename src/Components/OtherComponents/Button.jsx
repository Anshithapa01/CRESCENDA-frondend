import React from 'react';

const Button = ({ text, onClick, width }) => {
  return (
    <button
      className={`bg-orange-500 text-white py-2 px-4 rounded-lg shadow-md ${width}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;

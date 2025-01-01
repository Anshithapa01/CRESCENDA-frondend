import React, { useEffect } from 'react';

const Alert = ({ message, status, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const statusStyles = {
    success: {
      bgColor: 'bg-green-500',
      textColor: 'text-green-800',
      icon: '✔️',
    },
    error: {
      bgColor: 'bg-red-500',
      textColor: 'text-red-800',
      icon: '⚠️',
    },
  };

  const { bgColor, textColor, icon } = statusStyles[status] || statusStyles.error;

  return (
    <div
      className={`fixed z-50 ${bgColor} fixed top-4 left-1/2 transform -translate-x-1/2 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm flex-grow">{message}</span>
      <button
        onClick={onClose}
        className={`ml-4 bg-white ${textColor} rounded-full p-2 focus:outline-none hover:bg-gray-200`}
        aria-label="Close alert"
      >
        ✕
      </button>
    </div>
  );
};

export default Alert;

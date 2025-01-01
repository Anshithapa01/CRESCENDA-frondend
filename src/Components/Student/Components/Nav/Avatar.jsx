import React from 'react';

const Avatar = ({ children }) => {
  
  return (
    <div className="relative bg-[#083344] rounded-full w-12 h-12 flex items-center justify-center text-white font-bold ">
      {children}
    </div>
  );
};

export default Avatar;
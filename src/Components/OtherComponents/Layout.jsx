import React from 'react';

const Layout = ({ children, imageSrc, imageAlt, infoText }) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-orange-100 flex justify-center items-center">
        <div className="w-3/4 flex flex-col p-10">
          {children}
        </div>
      </div>
      <div className="w-1/2 relative bg-gray-200 flex justify-center items-center">
        <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 text-center text-red-700 font-bold p-10">
          {infoText}
        </div>
      </div>
    </div>
  );
};

export default Layout;

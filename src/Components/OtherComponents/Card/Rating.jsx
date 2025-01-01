import React from 'react';

const Rating = ({ rating, reviews }) => {
  return (
    rating > 0 ? (
      <div className="flex items-center">
        <span className="text-yellow-500 font-bold">{'★'.repeat(Math.floor(rating))}</span>
        <span className="text-gray-400 ml-1">({reviews})</span>
      </div>
    ) : null // Render nothing if rating is 0 or not provided
  );
};

export default Rating;

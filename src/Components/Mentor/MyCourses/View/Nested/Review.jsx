import React from 'react';
import { sampleReviews } from '../../../../Student/TempData/Course';

const Review = () => {
    const reviews=sampleReviews;
  return (
    <div className="container max-w-screen-xl p-10 ">
      <h3 className="text-xl font-bold mb-4">Review</h3>
      {reviews.map((review, index) => (
        <div key={index} className="mb-4 flex items-start">
          <img
            src={review.image}
            alt={`${review.name}'s profile`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h4 className="font-semibold">{review.name}</h4>
            <p className="text-xs text-gray-500">{review.date}</p>
            <p className="mt-1">{review.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


export default Review;

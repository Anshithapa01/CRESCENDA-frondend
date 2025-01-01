// FeaturedCourseCard.jsx
import React, { useEffect, useState } from 'react';

const FeaturedCourseCard = ({ course }) => {
  const [featured,setFeatured]=useState([])
  useEffect(()=>{
    setFeatured(course[0]?.draft)
  },[course])
  return(
  
  <div className="relative bg-yellow-200 rounded-lg overflow-hidden shadow-lg">
    <img
      src={featured?.thumbnailUrl}
      alt={featured?.courseName}
      className="h-[870px] w-full object-cover opacity-80"
    />
    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 text-white">
      <h2 className="text-2xl font-bold mb-1">{featured?.courseName}</h2>
      <p className="text-lg">{featured?.mentorName}</p>
      <p className="mt-2 text-sm">{featured?.courseDescription}</p>
      <div className="flex items-center mt-3 space-x-2">
        <span className="text-lg font-bold">{featured?.sellingPrice}</span>
        <span className="line-through text-gray-400">{featured?.coursePrice}</span>
      </div>
      <div className="mt-2 text-sm">{course?.rating} ★ {course?.reviews} Reviews</div>
    </div>
  </div>
);
}
export default FeaturedCourseCard;

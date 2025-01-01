import React, { useEffect } from "react";

const Description = ({ course }) => {
    useEffect(()=>{
        console.log(course);
        
    },[course])
  return (
    <div>
        <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Course Description</h2>
            <p className="text-gray-700">{course?.courseDescription || "No description available."}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Course Prerequisite</h2>
            <p className="text-gray-700">{course?.coursePrerequisite || "No description available."}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Author Note</h2>
            <p className="text-gray-700">{course?.authorNote || "No description available."}</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Special Note</h2>
            <p className="text-gray-700">{course?.specialNote || "No description available."}</p>
        </div>
    </div>
  );
};

export default Description;

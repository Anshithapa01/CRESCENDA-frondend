import React from 'react';
import { useParams } from 'react-router-dom';
import { coursesData } from '../../../../Student/TempData/Course';

const Description = () => {
  const { id } = useParams();
  const course = coursesData.find(course => course.id === parseInt(id));
  if (!course) {
    return <div className="container mx-auto p-6">Course not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">   

     {/* Main Content */}
      <div className="space-y-6">
        {/* Course Description Section */}
        <section>
          <h2 className="text-2xl font-semibold">{course.course_name}</h2>
          <p className="mt-2 text-gray-700">
           {course.course_description}
          </p>
        </section>

        {/* Author Note Section */}
        <section>
          <h3 className="text-xl font-semibold mt-4">Author Note</h3>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
              <li>{course.author_note}</li>
          </ul>
          </section>

        {/* Chapter and About Chapter Section */}
        <section>
          <h3 className="text-xl font-semibold mt-4">Language</h3>
          <p className="mt-1 text-gray-700">{course.language}</p>
          <h3 className="text-xl font-semibold mt-4">Level</h3>
          <p className="mt-1 text-gray-700">{course.level}</p>
          <h4 className="text-lg font-medium mt-4">Course Prerequisite</h4>
          <p className="mt-2 text-gray-700">
            {course.course_prerequisite}
          </p>
        </section>

        {/* Special Note */}
        <section>
          <p className="mt-6 text-red-600 font-medium">Special Note</p>
          <p className="mt-1 text-gray-700">{course.special_note}</p>
        </section>
      </div>
    </div>
  );
};

export default Description;

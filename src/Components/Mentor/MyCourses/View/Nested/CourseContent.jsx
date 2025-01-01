import React, { useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useOutletContext, useParams } from 'react-router-dom';
import { coursesData } from '../../../../Student/TempData/Course';

const CourseContent = () => {
  const [openChapterIndex, setOpenChapterIndex] = useState(null);
  const { id } = useParams();
  const course = coursesData.find(course => course.id === parseInt(id));
  const { selectedVideo, setSelectedVideo } = useOutletContext();
  if (!course) {
    return <div className="container mx-auto p-6">Course not found</div>;
  }

  const handleChapterToggle = (index) => {
    setOpenChapterIndex(openChapterIndex === index ? null : index);
  };

  const handleVideoSelect = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  return (
    <div>
      {course.sampleChapters.map((chapter, index) => (
        <div key={chapter.position} className="mt-4">
          <button
            onClick={() => handleChapterToggle(index)}
            className="w-full flex justify-between items-center text-xl font-bold px-4 py-2 bg-gray-100 rounded-lg"
          >
            {chapter.name}
            <span>{openChapterIndex === index ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}</span>
          </button>
          {openChapterIndex === index && (
            <ul className="list-disc ml-8 mt-2">
              {chapter.materials.map((material) => (
                <li key={material.position} className="text-gray-700 my-2">
                  {material.type === 'video' ? (
                    <button
                      className="text-blue-500 underline"
                      onClick={() => handleVideoSelect(material.item)}
                    >
                      {material.name} • Video
                    </button>
                  ) : (
                    <span>{material.name} • PDF</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseContent;

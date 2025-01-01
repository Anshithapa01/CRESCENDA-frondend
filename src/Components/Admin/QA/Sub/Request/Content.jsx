import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Content = ({ course, materials, activeChapter, fetchMaterials, setActiveChapter, handleMaterialClick, handleViewReview }) => {
    const location = useLocation();
    useEffect(()=>{
      console.log(course);
      
    },[course])
  return (
    <div>
      {course?.chapters?.map((chapter) => (
        <div key={chapter.chapterId} className="mt-4 bg-gray-200 rounded-lg shadow-md">
          <div
            onClick={() => {
              setActiveChapter(chapter.chapterId === activeChapter ? null : chapter.chapterId);
              fetchMaterials(chapter.chapterId);
            }}
            className="p-4 flex justify-between items-center cursor-pointer"
          >
            <span className="text-xl font-bold">{chapter.chapterName}</span>
          </div>
          {activeChapter === chapter.chapterId && (
            <div className="bg-white p-4 space-y-4">
              {materials[chapter.chapterId]?.length > 0 ? (
                materials[chapter.chapterId].map((material) => (
                  <div
                    key={material.materialId}
                    className="flex justify-between items-center bg-gray-100 rounded-md p-3"
                    onClick={() => handleMaterialClick(material)}
                  >
                    <span>{material.materialName}</span>
                    { ((course?.status !=='pending' && course?.status !=='draft') && !location.pathname.startsWith("/purchased") || location.pathname.startsWith("/admin") ) &&(
                        <div className="flex space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewReview(material);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          View Review
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No materials available for this chapter.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Content;

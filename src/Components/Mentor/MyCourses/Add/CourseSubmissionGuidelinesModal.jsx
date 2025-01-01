import React, { useState } from 'react';

const CourseSubmissionGuidelinesModal = ({ showModal, onClose,onCancel }) => {
  const [isChecked, setIsChecked] = useState(false);

  if (!showModal) return null;

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Course Submission Guidelines for Mentors</h2>
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto max-h-96">
          <p className="text-gray-800 mb-2">
            As a mentor on the Crescenda LMS platform, it is essential to ensure that the content you provide meets the highest standards. Following these guidelines will ensure a positive experience for both the learners and the platform.
          </p>
          <ol className="list-decimal list-inside text-gray-800 space-y-2">
            <li><strong>Video Quality:</strong> All videos must be HD resolution (720p or higher) with clear, visible content.</li>
            <li><strong>Audio Quality:</strong> Audio must be clear and crisp without any background noise or distractions.</li>
            <li><strong>Language and Clarity:</strong> Use professional language, avoiding slang or informal terms.</li>
            <li><strong>Course Content:</strong> The course must be original and free of plagiarism.</li>
            <li><strong>Minimum Number of Chapters and Materials:</strong> The course must have a minimum of 3 chapters. Each chapter must contain at least 2 materials (e.g., videos or documents).</li>
            <li><strong>No Offensive Material:</strong> No offensive, discriminatory, or inappropriate content is allowed.</li>
            <li><strong>Compliance and Accuracy:</strong> Follow all legal guidelines and avoid false information.</li>
            <li><strong>Professionalism:</strong> Maintain a professional demeanor, including appropriate dress in instructional videos.</li>
            <li><strong>No Self-Promotion:</strong> Avoid excessive promotion of personal products or services.</li>
          </ol>
          <p className="mt-4 text-gray-800 font-semibold">Strict Compliance</p>
          <p className="text-gray-800">
            It is essential that all courses comply with the guidelines outlined above. Failure to adhere to these rules may result in immediate action by the QA team or platform administrators.
          </p>
          <p className="mt-2 text-red-600 font-semibold">Important Note:</p>
          <p className="text-red-600">
            Any content that violates these guidelines—especially offensive or misleading material—will result in immediate account suspension or permanent blocking without warning.
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <input
            type="checkbox"
            id="agreeCheckbox"
            className="mr-2"
            onChange={handleCheckboxChange}
            checked={isChecked}
          />
          <label htmlFor="agreeCheckbox" className="text-gray-800">I have read and agree to the guidelines</label>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded ${isChecked ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!isChecked}
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSubmissionGuidelinesModal;

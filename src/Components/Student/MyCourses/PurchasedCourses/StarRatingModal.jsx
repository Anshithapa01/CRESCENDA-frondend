import React from "react";

const StarRatingModal = ({ title, modalData, formErrors, onChange, onSave, onCancel }) => {
  const handleStarClick = (index) => {
    onChange('rating', index + 1); // Update rating
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              onClick={() => handleStarClick(index)}
              xmlns="http://www.w3.org/2000/svg"
              fill={index < modalData.rating ? "yellow" : "gray"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-10 h-10 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.135 6.564a1 1 0 00.95.69h6.905c.969 0 1.371 1.24.588 1.81l-5.597 4.066a1 1 0 00-.364 1.118l2.135 6.564c.3.921-.755 1.688-1.54 1.118l-5.597-4.066a1 1 0 00-1.176 0l-5.597 4.066c-.785.57-1.84-.197-1.54-1.118l2.135-6.564a1 1 0 00-.364-1.118L2.502 11.99c-.784-.57-.38-1.81.588-1.81h6.905a1 1 0 00.95-.69l2.135-6.564z"
              />
            </svg>
          ))}
        </div>
        {formErrors.rating && <p className="text-red-500 text-sm">{formErrors.rating}</p>}
        <textarea
          placeholder="Leave a comment (optional)"
          value={modalData.reviewText}
          onChange={(e) => onChange("reviewText", e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />
        <div className="flex justify-end">
          <button onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
            Cancel
          </button>
          <button onClick={onSave} className="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarRatingModal;

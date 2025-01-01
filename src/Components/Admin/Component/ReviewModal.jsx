import React from "react";

const ReviewModal = ({ selectedReview, onCancel }) => {
  if (!selectedReview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Review Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Material Name</label>
            <input
              type="text"
              value={selectedReview.materialName || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Status</label>
            <input
              type="text"
              value={selectedReview.status || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1">Comment</label>
            <textarea
              value={selectedReview.comment || ""}
              readOnly
              className="w-full p-2 border border-gray-300 rounded h-24"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

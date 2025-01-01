const ConfirmationModal = ({ type, showModal, onClose, onConfirm }) => {
    if (!showModal) return null;
  
    const isDelete = type === 'delete';
    const modalTitle = isDelete ? 'Are you sure you want to delete this item?' : 'Are you sure you want to publish this item?';
    const confirmButtonText = isDelete ? 'Delete' : 'Publish';
    const confirmButtonColor = isDelete ? 'bg-red-500' : 'bg-red-500';
    const warningText = isDelete ? 'This action cannot be undone. All data will be deleted.' : 'This action cannot be undone';
  
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold text-center mb-4">{modalTitle}</h2>
          <div className="flex items-center justify-center mb-4">
            <span className="text-6xl text-red-600">&#9888;</span>
          </div>
          <p className="text-center text-red-600 font-semibold mb-4">{warningText}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`${confirmButtonColor} text-white px-4 py-2 rounded hover:bg-red-600`}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default ConfirmationModal
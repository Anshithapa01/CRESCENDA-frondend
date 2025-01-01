import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../Config/apiConfig";

const ReplyModal = ({ parentId, rootId, courseId, onClose,isChanged,setIsChanged }) => {
  const [replyText, setReplyText] = useState("");
  const auth = useSelector((store) => store.auth);

  const handleSave = async () => {
    if (!replyText.trim()) {
      alert("Reply text cannot be empty."); 
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/ratings/comments`,
        null,
        {
          params: {
            courseId: courseId,
            studentId: auth.user.studentId,
            parentId: parentId,
            rootId: rootId,
            reviewText: replyText,
          },
          headers: { Authorization: `Bearer ${auth.jwtUser}` },
        }
      );
      setIsChanged && setIsChanged(!isChanged)
      console.log("Comment added:", response.data);
      setReplyText("");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  return (
    <div className="mt-4 bg-gray-100 rounded p-4 border shadow-md">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write your reply..."
        className="w-full border rounded p-2"
      />
      <div className="flex justify-end mt-2 space-x-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReplyModal;

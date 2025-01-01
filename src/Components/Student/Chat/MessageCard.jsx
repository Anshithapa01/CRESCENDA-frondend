import React, { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Menu, MenuItem } from "@mui/material";

// Utility function to format the date and time
const formatTimestamp = (timestamp) => {
  const messageDate = new Date(timestamp);

    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } 

const MessageCard = ({
  msg,
  isReqUserMessage,
  setMessages,
  setShowAlert,
  setAlert,
  username,
  stompClient,
  setContent,
  setMssgId,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const isLink = (text) => {
    const regex = /https?:\/\/[^\s]+/g;
    return regex.test(text);
  };

  const renderContent = () => {
    if (isLink(msg.content)) {
      return (
        <a
          href={msg.content}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 italic break-words overflow-hidden"
        >
          {msg.content}
        </a>
      );
    }
    return <p>{msg.content}</p>;
  };

  const handleDeleteMessage = async () => {
    try {
      const payload = {
        messageId: msg.id,
        recipientUsername: username,
      };
      console.log(payload);

      stompClient.publish({
        destination: "/app/delete-message",
        body: JSON.stringify(payload),
      });
      setMessages((prevMessages) =>
        prevMessages.filter((messg) => messg.id !== msg.id)
      );
      setAnchorEl(null);
      setAlert({ message: "Message deleted successfully!", status: "success" });
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting message:", error);
      setAlert({
        message: "Failed to delete message. Please try again.",
        status: "error",
      });
      setShowAlert(true);
    }
  };

  const handleEditMessage = () => {
    setMssgId(msg.id);
    setContent(msg.content);
    setAnchorEl(null);
  };

  const handleDoubleClick = (event) => {
    const now = new Date();
    const messageTime = new Date(msg.timestamp);
    const timeDifference = now - messageTime;

    if (timeDifference <= 15 * 60 * 1000) {
      !isReqUserMessage && setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className={`py-2 px-2 rounded-md max-w-[50%] ${
        isReqUserMessage ? "self-start bg-white" : "self-end bg-orange-300"
      }`}
      onDoubleClick={handleDoubleClick}
    >
      {msg.content && renderContent(msg.content)}
      {msg.fileUrl && (
        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
          {msg.fileUrl.includes("image") ? (
            <img src={msg.fileUrl} alt="Uploaded file" />
          ) : (
            <button className="italic text-orange-600">
              <FileDownloadIcon />
              Download File
            </button>
          )}
        </a>
      )}
      {/* Display timestamp */}
      <p className="text-gray-500 text-xs mt-1 text-right">
        {formatTimestamp(msg.timestamp)}
      </p>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          handleClose();
          anchorEl?.focus();
        }}
      >
        <MenuItem onClick={handleDeleteMessage}>Delete</MenuItem>
        <MenuItem onClick={handleEditMessage}>Edit</MenuItem>
      </Menu>
    </div>
  );
};

export default MessageCard;

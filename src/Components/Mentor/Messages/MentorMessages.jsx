import React, { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEmojiSmile, BsMicFill, BsThreeDotsVertical } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import SendIcon from '@mui/icons-material/Send';
// import "./MentorMessages.css";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import MessageCard from "../../Student/Chat/MessageCard";
import ChatCard from "../../Student/Chat/ChatCard";
import Avatar from "../../Student/Components/Nav/Avatar";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import Alert from "../../OtherComponents/Alert";
import { fetchAllChats } from "../../../Utility/Chats";
import { fetchChatMessages, uploadFile } from "../../../Utility/Messages";
// import { connectToWebSocket, disconnectWebSocket, sendMessage } from "../../../Config/WebSocketConfig";

const MentorMessages = () => {
  const [query, setQuery] = useState("");
  const auth = useSelector((store) => store.mentorAuth);
  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [stompClient, setStompClient] = useState();
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [mssgId, setMssgId] = useState(0);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });
  const [showFileInputModal, setShowFileInputModal] = useState(false);
  const MAX_FILE_SIZE_MB = 500;
  const chatContainerRef = useRef(null);
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
  
    useEffect(() => {
      scrollToBottom(); // Scroll to bottom without animation
    }, [messages]);

  const handleVideoCall = () => {
    if (!currentChat) return;
    const roomID = `room_${currentChat.id}`; // Generate a unique room ID based on the chat ID
    navigate(`/messages/videocall?roomID=${roomID}`);
    const newContent=window.location.protocol + '//' + 
    window.location.host + window.location.pathname +
     '?roomID=' +
     roomID
     console.log(newContent);
     
    setContent(newContent);
    sendMessage(newContent)
  };
  const handleAttachmentClick = () => {
    setShowFileInputModal(!showFileInputModal);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setAlert({
          message: `File size exceeds the limit of ${MAX_FILE_SIZE_MB} MB.`,
          status: "error",
        });
        setShowAlert(true);
        return;
      }
      setFile(selectedFile);
    }
  };

  const uploadFileToCloudinary = async () => {
    if (!file) {
      setAlert({ message: "Please select a file to upload.", status: "error" });
      setShowAlert(true);
      return;
    }
    const preset = "random_preset";
  
    try {
      const response = await uploadFile(file, preset,setUploadProgress);
      setUploadedUrl(response.secure_url);
      setAlert({ message: "File uploaded successfully!", status: "success" });
      setShowAlert(true);
      setShowFileInputModal(false);
      setUploadProgress(0);
      setFile(null);
      sendMessage(response.secure_url);
    } catch (error) {
      console.error("Error uploading file:", error);
      setAlert({
        message: "Failed to upload file. Please try again.",
        status: "error",
      });
      setShowAlert(true);
    }
  };
  

  const setupStompClient = (username) => {
    const stompClient = new Client({
      brokerURL: "ws://localhost:5454/ws",
      connectHeaders: {
        Authorization: `Bearer ${auth.jwt}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onStompError: (frame) => {
        console.error("Broker reported error:", frame.headers["message"]);
      },
    });

    stompClient.onConnect = () => {
      console.log("WebSocket connected");

      stompClient.subscribe(`/user/${username}/private`, (data) => {
        console.log("Message received:", data);
        onMessageReceived(data);
      });
    };
    stompClient.activate();
    setStompClient(stompClient);
  };

  const sendMessage = async(url) => {
    let isVideoCallLink=false;
    try {
      if(url){
        isVideoCallLink= url.startsWith("http://localhost:5173/messages/videocall?");
      }
      if (mssgId != 0) {
        const payload = {
          chatId: currentChat.id,
          messageId: mssgId,
          content: content,
          recipientUsername: currentChat.mentorStudent.studentUsername,
        };
        console.log(payload);
        stompClient.publish({
          destination: "/app/edit-message",
          body: JSON.stringify(payload),
        });
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === mssgId ? { ...msg, content: content } : msg
          )
        );
        setAlert({
          message: "Message updated successfully!",
          status: "success",
        });
        setShowAlert(true);
      } else {
      const payload = {
        chatId: currentChat.id,
        content:isVideoCallLink?url:content,
        senderRole: "MENTOR",
        fileUrl: isVideoCallLink?'':url,
        timestamp: new Date().toISOString(),
        recipientUsername: currentChat.mentorStudent.studentUsername,
      };
      console.log("Publishing message:", JSON.stringify(payload));
      stompClient.publish({
        destination: "/app/private-message",
        body: JSON.stringify(payload),
      });
      const newMessage = {
        id: Date.now(), 
        content:isVideoCallLink?url:content,
        senderRole: "MENTOR",
        fileUrl: isVideoCallLink?'':url,
        timestamp: new Date().toISOString(), 
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
      setContent("");
      await fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onMessageReceived = async (data) => {
    const message = JSON.parse(data.body);
    console.log("message", message);
  
    if (message.type === "DELETE") {
      // Remove the deleted message
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== message.payload)
      );
    } else if (message.type === "EDIT") {
      // Update the edited message
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === message.payload.id
            ? { ...msg, content: message.payload.content }
            : msg
        )
      );
    } else {
      // Add new message
      setMessages((prevMessages) => [...prevMessages, message]);
    }
  
    setContent("");
    await fetchChats();
  };
  

  const handleEmojiClick = (emojiData) => {
    setContent((prevContent) => prevContent + emojiData.emoji);
  };

  useEffect(() => {
      if (auth.user && auth.jwt) fetchChats();
    }, [auth.user, messages]);

  const fetchChats = async () => {
    try {
      const response = await fetchAllChats(auth.jwt, auth.user?.mentorId);
      const sortedChats = response.sort(
        (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
      );
      setChats(sortedChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  

  const openChat = async (chat) => {
    setCurrentChat({
      id: chat.id,
      mentorStudent: chat.mentorStudent,
    });
    setupStompClient(chat.mentorStudent.mentorUsername);
  
    try {
      const response = await fetchChatMessages(auth.jwt, chat.id);
      const sortedMessages = response.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sortedMessages);
      console.log(sortedMessages);
      
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const getDateLabel = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    const isSameDay = (date1, date2) =>
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();

    if (isSameDay(messageDate, today)) {
      return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(messageDate, yesterday)) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString();
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const dateLabel = getDateLabel(message.timestamp);

    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(message);
    return acc;
  }, {});
  
  return (
    <div className="flex justify-center h-screen p-5 shadow-2xl w-full">
      <div className="flex flex-col justify-center rounded-2xl w-3/4 h-full bg-slate-50">
        <div className="w-full flex items-center">
          {showAlert && (
            <Alert
              message={alert.message}
              status={alert.status}
              onClose={() => {
                setShowAlert(false);
                setAlert({ message: "", status: "" });
              }}
            />
          )}
        </div>
        <div className="w-full flex relative justify-between items-center px-3">
          <input
            className="border-none outline-none pl-10 py-2 w-3/4 m-5 ml-10 rounded-md"
            placeholder="Search Students..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <AiOutlineSearch className="left-16 w-5 absolute" />
        </div>
        <div className="flex w-full h-full justify-center overflow-hidden">
          <div className="left w-1/3 h-full bg-slate-200 rounded-bl-2xl overflow-y-auto">
            <div className="bg-white h-full px-3">
              {chats.map((chat) => (
                <div key={chat.id} className="cursor-pointer">
                  <hr />
                  <ChatCard
                    isStudent={"false"}
                    chat={chat}
                    onClick={() => openChat(chat)}
                  />
                </div>
              ))}
            </div>
          </div>
          {!currentChat ? (
            <div className="w-2/3 flex flex-col items-center justify-center rounded-br-2xl h-full">
              <div className="text-center">
                <h1 className="text-4xl text-gray-600">No Chat Selected</h1>
                <p className="my-9">Select a chat to view messages.</p>
              </div>
            </div>
          ) : (
            <div className="w-[70%] relative bg-orange-50">
              <div className="header absolute top-0 w-full bg-orange-600">
                <div className="flex justify-between">
                  <div className="py-3 space-x-4 flex items-center px-3">
                    <Avatar>
                      {currentChat.mentorStudent?.mentorFirstName[0].toUpperCase()}
                    </Avatar>
                    <p className="text-white">
                      Chat with {currentChat.mentorStudent.studentFirstName}
                    </p>
                  </div>
                  <div className="py-3 flex space-x-4 items-center px-3">
                    <AiOutlineSearch />
                    <BsThreeDotsVertical
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions((prev) => !prev);
                      }}
                    />
                    {showOptions && (
                      <div className="absolute right-0 top-12 bg-white shadow-lg rounded-md p-2">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={handleVideoCall}
                        >
                          Start Video Call
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-10 h-full overflow-y-scroll"
              style={{ height: "calc(100% - 100px)" }}
              ref={chatContainerRef}>
                <div className="space-y-1 flex flex-col justify-center mt-20 py-2">
                  {Object.entries(groupedMessages).map(
                    ([dateLabel, messages]) => (
                      <>
                        <div className="text-center text-gray-500 text-sm my-2">
                          {dateLabel}
                        </div>
                  {messages.map((msg, index) => (
                    <MessageCard
                      key={index}
                      msg={msg}
                      setMessages={setMessages}
                      isReqUserMessage={msg.senderRole === "STUDENT"}
                      setAlert={setAlert}
                      username={currentChat.mentorStudent.studentUsername}
                      setShowAlert={setShowAlert}
                      stompClient={stompClient}
                      setContent={setContent}
                      setMssgId={setMssgId}
                    />
                  ))}                 
                  </>
                    )
                  )}
                </div>
              </div>
              <div className="footer bg-slate-50 absolute bottom-0 w-full py-3 text-2xl">
                <div className="flex justify-between items-center px-5 relative">
                  <div className="flex justify-between w-[12%]">
                    <BsEmojiSmile
                      className="cursor-pointer size-5"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 left-0 h-[20rem] overflow-hidden rounded-xl shadow-lg">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                    <ImAttachment
                      className="cursor-pointer size-5"
                      onClick={handleAttachmentClick}
                    />

                    {showFileInputModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg w-1/4 p-3">
                          <button
                            className="text-red-500 font-bold float-right text-sm"
                            onClick={() => setShowFileInputModal(false)}
                          >
                            Close
                          </button>
                          <h4 className="text-sm font-semibold mb-2">
                            Upload File
                          </h4>
                          <input
                            type="file"
                            id="fileInput"
                            onChange={handleFileChange}
                            className="mb-2 text-sm"
                          />
                          <button
                            onClick={uploadFileToCloudinary}
                            className="bg-blue-500 text-white py-2 px-3 rounded text-sm"
                          >
                            Upload
                          </button>
                          {uploadProgress > 0 && (
                            <div className="mt-3">
                              <div className="text-xs mb-2">
                                Upload Progress: {uploadProgress}%
                              </div>
                              <div className="bg-gray-200 h-2 rounded-full">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    className="py-2 outline-none border-none text-sm bg-white pl-4 rounded-md w-[80%]"
                    type="text"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type message..."
                    value={content}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />
                  <SendIcon className='cursor-pointer size-5'/>
                  {/* <BsMicFill className="cursor-pointer size-5" /> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorMessages;

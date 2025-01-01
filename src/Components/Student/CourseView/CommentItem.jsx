import axios from "axios";
import { API_AUTH_BASE_URL, API_BASE_URL } from "../../../Config/apiConfig";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ReplyModal from "./ReplyModal";
import Avatar from "../Components/Nav/Avatar";
import { useNavigate } from "react-router-dom";

// Renamed the component from Comment to CommentItem
const CommentItem = ({ comment,courseId,isChanged,setIsChanged }) => {
    const [replies, setReplies] = useState([]);
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const auth = useSelector((store) => store.auth);
    const isAdmin =location.pathname.startsWith('/admin')
    const navigate=useNavigate();
    const fetchComment=()=>{
        console.log('fetch comment',replies); 
        axios
        .get(`${API_AUTH_BASE_URL}/ratings/comments/${comment.ratingId}`)
        .then((response) => {
            console.log(response.data, comment);    
            setReplies(response.data); // Assuming the response data is an array of comments
        })
        .catch((error) => {
            console.error("Error fetching replies:", error);
        });
    }
    useEffect(() => {    
        if (comment.ratingId) {
            fetchComment();
        }
    }, [comment.ratingId, auth.jwtUser]);

    return (
        <div className="ml-4 border-b pb-4">
            <div className="flex items-center pt-3">
                <Avatar>{comment.studentName[0].toUpperCase()}</Avatar>
                <p>
                    <span className="font-semibold">{comment.studentName}: </span>
                    <span className="font-bold italic">@{comment.parentName}: </span>{comment.reviewText}
                </p>
            </div>
            <div className="ml-4">
                {replies?.map((reply) => (
                    <CommentItem key={reply.ratingId} comment={reply} />
                ))}
            </div>
            {!isAdmin && (
                <button
                    className="text-blue-500 hover:underline mt-2"
                    onClick={() =>{
                        !isAdmin && auth.jwtUser==null ? navigate('/login'):
                         setIsReplyOpen(!isReplyOpen)}}
                >
                    Reply
                </button>
            )}
            {isReplyOpen && (
                <ReplyModal
                parentId={comment.ratingId}
                rootId={comment.rootId || comment.ratingId}
                courseId={courseId} // Pass the course ID
                onClose={() =>{setIsReplyOpen(false)}}
                isChanged={isChanged}
                setIsChanged={setIsChanged}
              />
              
            )}
        </div>
    );
};

export default CommentItem;

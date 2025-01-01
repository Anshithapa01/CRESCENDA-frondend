import React, { useState, useEffect } from "react";
import Avatar from "../../../../Student/Components/Nav/Avatar";
import ReplyModal from "../../../../Student/CourseView/ReplyModal";
import axios from "axios";
import { API_AUTH_BASE_URL, API_BASE_URL } from "../../../../../Config/apiConfig";
import { useSelector } from "react-redux";
import CommentItem from "../../../../Student/CourseView/CommentItem";
import { useNavigate } from "react-router-dom";

const Review = ({ courseId, review, index }) => {
  const [comments, setComments] = useState([]);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isChanged,setIsChanged]=useState(false)
  const auth = useSelector((store) => store.auth);  
  const isAdmin =location.pathname.startsWith('/admin')
  const navigate=useNavigate();

  useEffect(()=>{
    console.log(isChanged);
    fetchRating()  
  },[isChanged])

  const fetchRating=()=>{
    axios
        .get(`${API_AUTH_BASE_URL}/ratings/comments/${review.ratingId}`)
        .then((response) => {
          console.log('comments',response.data);
            setComments(response.data); 
        })
        .catch((error) => {
            console.error("Error fetching comments:", error);
        });
  }
  useEffect(() => {
    fetchRating();
}, [review.ratingId]);

  return (
    <div
      key={index}
      className={`flex items-start space-x-6 ${
        isReplyOpen ? "mb-20" : "mb-4" 
      }`}
    >
      <Avatar>{review.studentName[0].toUpperCase()}</Avatar>
      <div className="flex-1">
        <p className="text-sm font-semibold">{review.studentName}</p>
        <span className="text-yellow-500 font-bold">
          {"★".repeat(Math.floor(review.rating))}
        </span>
        <p className="text-sm text-gray-600">{review.reviewText}</p>
        <div className="ml-4">
          {comments.map((comment) => (
            <CommentItem key={comment.ratingId} courseId={courseId}
             comment={comment} isChanged={isChanged} setIsChanged={setIsChanged}/>
          ))}
        </div>
        {!isAdmin &&(
          <button
            className="text-orange-500 hover:text-orange-600 mt-2"
            onClick={() => {
              !isAdmin && auth.jwtUser==null ? navigate('/login'):
              setIsReplyOpen(!isReplyOpen)}}
          >
            Reply
          </button>
        )
        }
        {isReplyOpen && (
          <ReplyModal 
          parentId={review.ratingId}
          rootId={null}
          courseId={courseId} // Pass the course ID
          onClose={() =>{fetchRating(); setIsReplyOpen(false)}}
        />
        
        )}
      </div>
    </div>
  );
};

export default Review;

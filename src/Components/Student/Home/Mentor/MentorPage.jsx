import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MENTOR_AUTH_BASE_URL, MENTOR_BASE_URL } from "../../../../Config/apiConfig";
import { useSelector } from "react-redux";
import axios from "axios";
import Rating from "../../../OtherComponents/Card/Rating";
import Badge from "../../../OtherComponents/Card/Badge";
import Alert from "../../../OtherComponents/Alert";

const MentorPage = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const auth=useSelector(store=>store.auth)
  const navigate=useNavigate()

  useEffect(() => {
    const getMentor = async () => {
      try {
        const response = await axios.get(`${MENTOR_AUTH_BASE_URL}/${mentorId}`);
          console.log(response.data);
          
        setMentor(response.data);
      } catch (error) {
        console.log(error);
        setAlert({message:'Failed to load mentor details.',status:'error'});
        setShowAlert(true)
      } finally {
        setLoading(false);
      }
    };
    getMentor();
  }, [mentorId,auth]);

  if (loading) return <div>Loading...</div>;

  if (!mentor) return <div>Mentor not found.</div>;

  const handleCardClick = (draftId) => {
    navigate(`/course/${draftId}`);
  };

  return (
    <div className="container mx-auto p-20">
      <div className='w-full flex items-center'>
        {showAlert && (
          <Alert  
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      </div>
      <div className="flex">
        {/* Main content */}
        <div className="flex-1">
          <div >
            <p>Instructor</p>
            <h1 className="text-4xl font-bold">{`${mentor.firstName} ${mentor.lastName}`}</h1>
            <p className="text-gray-600 text-xl mt-2">{mentor.headLine}</p>
          </div>
  
          {/* About Mentor */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">About Mentor</h2>
            <p>{mentor.bio}</p>
          </div>
  
          {/* Areas of Expertise */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Areas of Expertise</h2>
            <ul className="list-disc ml-5">
              <li>{mentor.areasOfExpertise}</li>
            </ul>
          </div>
  
          {/* More Courses */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">More Courses by {mentor.firstName}</h2>
            <div className="grid grid-cols-4 gap-4">
              {mentor.drafts?.map((course) => (
                <div
                  onClick={() => handleCardClick(course.draftId)}
                  className="bg-white rounded-lg shadow-lg p-4 transform transition duration-300 hover:scale-105"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.courseName}
                    className="rounded-t-lg w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge text={course.level} color="bg-green-100 text-green-700" />
                    </div>
                    <div className="group relative">
                      <h3 className="text-lg font-semibold truncate w-40">
                        {course.courseName}
                      </h3>
                      <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-gray-500 text-white text-xs rounded-md px-2 py-1 shadow-lg transition-opacity duration-200 w-max -top-8 left-1/2 transform -translate-x-1/2">
                        {course.courseName}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{course.mentorName}</p>
                    <p className="text-sm mt-1 truncate">{course.courseDescription}</p>
                    <Rating rating={course.rating} reviews={course.reviews} />
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-lg font-bold text-black">{course.sellingPrice}</span>
                      <span className="line-through text-gray-400">{course.coursePrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Aside content */}
        <aside className="w-64 ml-5">
          <div>
            <img
              src={mentor.image ||'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
              alt={`${mentor.firstName} ${mentor.lastName}`}
              className="w-32 h-32 rounded-full mx-auto"
            />
            <div className="pt-5 text-center">
            {mentor.websiteLink && (
                <button className="w-28 h-8 bg-gray-300 rounded-lg m-1">
                <a href={mentor.websiteLink} target="_blank" rel="noopener noreferrer">Website</a>
                </button>
            )}
            <br />
            {mentor.linkedInLink && (
                <button className="w-28 h-8 bg-gray-300 rounded-lg m-1">
                <a href={mentor.linkedInLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </button>
            )}
            <br />
            {mentor.youtubeLink && (
                <button className="w-28 h-8 bg-gray-300 rounded-lg m-1">
                <a href={mentor.youtubeLink} target="_blank" rel="noopener noreferrer">YouTube</a>
                </button>
            )}
            <br />
            {mentor.facebookLink && (
                <button className="w-28 h-8 bg-gray-300 rounded-lg m-1">
                <a href={mentor.facebookLink} target="_blank" rel="noopener noreferrer">Facebook</a>
                </button>
            )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
  
  
};

export default MentorPage;

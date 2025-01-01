import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ADMIN_AUTH_BASE_URL, ADMIN_BASE_URL, API_AUTH_BASE_URL, API_BASE_URL, MENTOR_AUTH_BASE_URL, MENTOR_BASE_URL } from "../../../Config/apiConfig";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Avatar from "../Components/Nav/Avatar";
import Review from "../../Admin/QA/Sub/Request/Review";
import Alert from "../../OtherComponents/Alert";
import StarRatingModal from "../MyCourses/PurchasedCourses/StarRatingModal";

const CoursePage = () => {
  const [course, setCourse] = useState(null); // Store course details
  const [materials, setMaterials] = useState({}); // Store materials for chapters
  const [expandedChapter, setExpandedChapter] = useState(null); // Track expanded chapter
  const [isWishlisted, setIsWishlisted] = useState(false); // Wishlist state
  const [courseId, setCourseId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const auth = useSelector((store) => store.auth);
  const [ratings, setRatings] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const { id } = useParams();
  const navigate = useNavigate();

  
  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        `${API_AUTH_BASE_URL}/ratings/course/${courseId}`);

      const filteredRatings = response.data.filter(
        (rating) => rating.rootId ===null && rating.parentId === null
      );
      setRatings(filteredRatings);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };
  useEffect(() => {   
    if(courseId)
      fetchRatings();
  }, [courseId]);

  useEffect(() => {
    const fetchCourseId = async () => {
      try {
        const response = await axios.get(
          `${ADMIN_AUTH_BASE_URL}/courses/draft/${id}/course-id`)
        setCourseId(response.data);
      } catch (error) {
        console.error("Failed to fetch course ID:", error);
      }
    };
  
    fetchCourseId();
  }, [id]);

  

  // Fetch course details
  useEffect(() => {
    axios
      .get(`${MENTOR_AUTH_BASE_URL}/draft/${id}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => console.error("Error fetching course data:", error));
  }, [id, auth.jwt]);

  useEffect(() => {
    if (auth.jwt && courseId && auth.user?.studentId) {
      fetchWishlistStatus();
    }
  }, [id, courseId, auth.jwt, auth.user?.studentId]);
  

  // Fetch wishlist status
  useEffect(() => { 
    const fetchWishlistStatus = async () => {
      
      try {
        console.log(courseId);      
        const response = await axios.get(
          `${API_BASE_URL}/wishlist/status/${courseId}/${auth.user?.studentId}`,
          { headers: { Authorization: `Bearer ${auth.jwtUser}` } }
        );
        console.log(response.data);
        
        setIsWishlisted(response.data.isWishlisted); 
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    };
    if (auth.jwtUser && courseId && auth.user?.studentId) {
      fetchWishlistStatus();
    }
    
    const fetchEnrollmentStatus = async () => {
      try {    
        const response = await axios.get(
          `${API_BASE_URL}/enrollments/status/${courseId}/${auth.user?.studentId}`,
          { headers: { Authorization: `Bearer ${auth.jwtUser}` } }
        );
        console.log('status',response.data);
        setIsEnrolled(response.data.isEnrolled);
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      }
    };
    if (courseId && auth.user?.studentId) {
      fetchEnrollmentStatus();
    }
  }, [id,courseId, auth.jwt, auth.user?.studentId,isWishlisted]);

  const handleBuyNow = async () => {
    try {
      // Step 1: Create Order from Backend
      const { data } = await axios.post(
        `${API_BASE_URL}/create-order`,
        { amount: course.sellingPrice, userId: auth.user.studentId }, // Pass user and course details
        { headers: { Authorization: `Bearer ${auth.jwtUser}` } }
      );
  
      // Step 2: Initialize Razorpay
      const options = {
        key: "rzp_test_y8yagsN9W3YyKJ", // Replace with your Razorpay key
        amount: data.amount,
        currency: data.currency,
        name: "Crescenda",
        description: "Course Payment",
        image: "/logo.png", // Add your logo
        order_id: data.id,
        handler: async (response) => {
          // Step 4: Verify Payment on Backend
          try {
            await axios.post(
              `${API_BASE_URL}/verify-payment`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                courseId: courseId, // Pass the course ID
                studentId: auth.user.studentId, // Pass the student ID
                amount: course.sellingPrice,
              },
              { headers: { Authorization: `Bearer ${auth.jwtUser}` } }
            );
            setAlert({message:'Payment successful!',status:'success'});
            setShowAlert(true)
          } catch (err) {
            console.error("Payment verification failed:", err);
            setAlert({message:'Payment verification failed. Please contact support.',status:'error'});
            setShowAlert(true)
          }
        },
        prefill: {
          name: `${auth.user.firstName} ${auth.user.lastName}`,
          email: auth.user.emailId,
          contact: auth.user.phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment initialization:", error);
      setAlert({message:'Failed to initiate payment. Please try again.',status:'error'});
      setShowAlert(true)
    }
  };
  

  // Toggle wishlist
  const toggleWishlist = async () => {
    if(auth.jwtUser){
      try {
        await axios.post(
          `${API_BASE_URL}/wishlist/toggle`,
          { courseId: courseId, studentId: auth.user?.studentId },
          { headers: { Authorization: `Bearer ${auth.jwtUser}` } }
        );
        setIsWishlisted(!isWishlisted); // Update wishlist state
      } catch (error) {
        console.error("Failed to toggle wishlist:", error);
        setAlert({message:'Failed to update wishlist. Please try again.',status:'error'});
        setShowAlert(true)
      }
    }else{
      navigate('/login');
    }
  };

  // Fetch chapter materials
  const fetchMaterials = async (chapterId) => {
    if (materials[chapterId]) return; // Avoid duplicate fetch
    try {
      const response = await axios.get(
        `${MENTOR_AUTH_BASE_URL}/draft/chapter/material/${chapterId}`);
      setMaterials((prev) => ({ ...prev, [chapterId]: response.data }));
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // Handle dropdown toggle
  const toggleChapter = (chapterId) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null); // Collapse if already expanded
    } else {
      setExpandedChapter(chapterId); // Expand new chapter
      fetchMaterials(chapterId); // Fetch materials
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 p-4 lg:p-8">
      
      {/* Left Section */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
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
        {course ? (
          <>
            {/* Video Section */}
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                alt={course.courseName}
                className="w-full h-64 object-cover"
                src={course.thumbnailUrl}
              />
            </div>

            {/* Course Title */}
            <p className="text-sm text-gray-500 ">
              {course.subCategory.catetoryName}/{course.subCategory.subcategoryName}
            </p>
            <h1 className="text-2xl font-bold mb-2">{course.courseName}</h1>
            <p 
              onClick={() => navigate(`/detailsmentor/${course.mentorId}`)}
              className="text-sm text-gray-700 mb-4 cursor-pointer"
            >
              {course.mentorName}
            </p>

            {/* About Section */}
            <h2 className="text-lg font-semibold mb-2">About Course</h2>
            <p className="text-gray-700 leading-6">{course.courseDescription}</p>
            <h2 className="text-lg font-semibold mb-2">Course Prerequisite</h2>
            <p className="text-gray-700 leading-6">{course.coursePrerequisite}</p>
            <h2 className="text-lg font-semibold mb-2">Author Note</h2>
            <p className="text-gray-700 leading-6">{course.authorNote}</p>
            <h2 className="text-lg font-semibold mb-2">Special Note</h2>
            <p className="text-gray-700 leading-6">{course.specialNote}</p>

            {/* Reviews Section */}
            <h2 className="text-lg font-semibold mt-8 mb-2">Reviews</h2>
            {courseId && ratings.length > 0 ? (
              <div className="space-y-4"> 
                {ratings.map((review, index) => (
                  <Review key={index} courseId={courseId} review={review} index={index} />
                ))}
              </div>) : (
              <p>No reviews available.</p>
            )}
          </>
        ) : (
          <p>Loading course details...</p>
        )}
      </div>

      {/* Right Section */}
      <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-6 lg:ml-8 mt-8 lg:mt-0">
        {course ? (
          <>
            {/* Pricing */}
            {course?.type === "Paid" ? (
              <div className="pl-5">
                <h2 className="text-xl font-bold text-black">
                  ${course.sellingPrice}
                </h2>
                <p className="text-gray-500 line-through">${course.coursePrice}</p>
                <button
                  onClick={() => {
                    if(auth.jwtUser){
                        if (isEnrolled) {
                        navigate(`/purchased/${id}`);
                      } else {
                        handleBuyNow();
                      }
                    }else{
                      navigate('/login')
                    }
                  }}
                  className={`px-4 py-2 rounded ${
                    isEnrolled ? "bg-green-500 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  {isEnrolled ? "Start" : "Buy"}
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`${
                    isWishlisted ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                  } px-4 py-2 rounded-lg mt-4 ml-2`}
                >
                  {isWishlisted ? "Remove Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            ) : (
              <div className="pl-5">
                <div className="bg-green-500 w-20 rounded-lg">
                  <p className="p-1 text-center text-white">Free</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4">
                  Start
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`${
                    isWishlisted ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
                  } px-4 py-2 rounded-lg mt-4 ml-2`}
                >
                  {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            )}

            <div className="flex mt-6 pl-5 p-1">
              <MenuBookIcon />
              <p className="pl-2">{course.chaptersCount} Chapters</p>
            </div>
            <div className="flex pl-5 p-1">
              <PlayCircleOutlineIcon />
              <p className="pl-2"> {course.materialsCount} Lectures</p>
            </div>
            <div className="flex pl-5 p-1">
              <VolumeUpIcon />
              <p className="pl-2"> {course.language} </p>
            </div>

            {/* Chapters Section */}
            <h2 className="text-lg font-semibold mt-16 mb-2 ">Chapters</h2>
            <ul className="space-y-2">
              {course.chapters.map((chapter) => (
                <li
                  key={chapter.chapterId}
                  className="bg-gray-100 rounded-lg px-4 py-2"
                >
                  {/* Chapter Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleChapter(chapter.chapterId)}
                  >
                    <p>{chapter.chapterName}</p>
                  </div>

                  {/* Chapter Materials */}
                  {expandedChapter === chapter.chapterId && materials[chapter.chapterId] && (
                    <ul className="mt-2 pl-4 space-y-2">
                      {materials[chapter.chapterId].map((material) => (
                        <li
                          key={material.materialId}
                          className="bg-gray-200 rounded-md px-3 py-1 text-sm"
                        >
                          {material.materialName}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Loading course details...</p>
        )}
      </div>
    </div>
  );
};

export default CoursePage;

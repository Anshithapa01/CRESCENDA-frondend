import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../../../OtherComponents/Card/CourseCard";
import { API_BASE_URL } from "../../../../Config/apiConfig";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../../../OtherComponents/Modal";
import StarRatingModal from "./StarRatingModal";
import Alert from "../../../OtherComponents/Alert";

const PurchasedCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ rating: '', reviewText: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  
  const auth = useSelector((store) => store.auth);
  const navigate = useNavigate();

  // Function to handle changes in modal fields
  const handleModalChange = (field, value) => {
    setModalData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    // Clear field-specific error on change
    if (formErrors[field]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [field]: '',
      }));
    }
  };

  // Function to validate the form
  const validateForm = () => {
    const errors = {};
    if (!modalData.rating) {
      errors.rating = 'Rating is required.';
    }
    return errors;
  };

  // Function to handle submitting the rating
  const handleModalSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    // Prepare the payload to send in the POST request
    const payload = {
      rating: modalData.rating,
      reviewText: modalData.reviewText,
      studentId: auth.user?.studentId,
      courseId: modalData.courseId, // Ensure to pass the correct course ID
    };
    console.log(payload);
    
    try {
      const queryString = new URLSearchParams(payload).toString();
      await axios.post(`${API_BASE_URL}/ratings?${queryString}`, null, {
        headers: { Authorization: `Bearer ${auth.jwtUser}` },
      });
      setAlert({message:'Rating submitted successfully!',status:'success'});
      setShowAlert(true)
      setShowModal(false);
      fetchPurchasedCourses()
    } catch (error) {
      console.error('Error submitting rating:', error);
      setAlert({message:'Failed to submit rating. Please try again.',status:'error'});
      setShowAlert(true)
    }
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setModalData({ rating: '', reviewText: '' }); // Reset data when modal closes
  };

  const fetchPurchasedCourses = async () => {
    try {
      if (!auth?.user?.studentId || !auth.jwtUser) {
        return;
      }
      const response = await axios.get(
        `${API_BASE_URL}/enrollments/purchased/${auth.user.studentId}`,
        {
          headers: { Authorization: `Bearer ${auth.jwtUser}` },
        }
      );
      setPurchasedCourses(response.data);
    } catch (error) {
      console.error("Error fetching purchased courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchPurchasedCourses();
  }, [auth]);

  if (loading) {
    return <p>Loading wishlist...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      {purchasedCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-6">No courses Purchased yet.</p>
          <button
            onClick={() => navigate('/search')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse More Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {purchasedCourses.map((purchasedCourse) => (
            <CourseCard
              key={purchasedCourse.enrollmentId}
              course={purchasedCourse.course}
              onClick={() => navigate(`/purchased/${purchasedCourse.course.draft.draftId}`)}
              onLeaveRating={() => {
                setModalData({
                  rating: '',
                  reviewText: '',
                  courseId: purchasedCourse.course.courseId// Pass the course ID
                });
                setShowModal(true); // Open modal for rating
              }}
            />
          ))}
        </div>
      )}

      {showModal && (
        <StarRatingModal
        title="Leave a Rating"
        modalData={modalData}
        formErrors={formErrors}
        onChange={handleModalChange}
        onSave={handleModalSave}
        onCancel={handleModalClose}
      />
      )}
    </div>
  );
};

export default PurchasedCourses;

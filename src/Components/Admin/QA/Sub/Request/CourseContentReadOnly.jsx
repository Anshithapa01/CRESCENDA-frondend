import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Added useLocation
import { useSelector } from "react-redux";
import {
  ADMIN_BASE_URL,
  API_AUTH_BASE_URL,
  API_BASE_URL,
  MENTOR_BASE_URL,
  QA_BASE_URL,
} from "../../../../../Config/apiConfig";
import ReviewModal from "../../../Component/ReviewModal";
import Review from "./Review";
import Content from "./Content";
import Description from "./Description";
import Certificate from "../../../../Student/MyCourses/PurchasedCourses/Certificate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import StarRatingModal from "../../../../Student/MyCourses/PurchasedCourses/StarRatingModal";
import Alert from "../../../../OtherComponents/Alert";

const CourseContentReadOnly = () => {
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState({});
  const [activeChapter, setActiveChapter] = useState(null);
  const [materialQualities, setMaterialQualities] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("content");
  const [attemptsLeft, setAttemptsLeft] = useState(null); // Track attempts left
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [modalData, setModalData] = useState({ rating: '', reviewText: '' });
  const [formErrors, setFormErrors] = useState({});
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const [pass, setPass] = useState(false);
  const [date, setDate] = useState("");

  const location = useLocation(); // To determine the current route
  const isAdmin =location.pathname.startsWith('/admin')
  const jwt = location.pathname.startsWith("/mentor/courses")
    ? useSelector((store) => store.mentorAuth.jwt)
    : location.pathname.startsWith("/qa")
    ? useSelector((store) => store.qaAuth.qaJwt)
    :location.pathname.startsWith("/admin")
    ? useSelector((store)=>store.adminAuth.adminJwt)
    : useSelector((store)=>store.auth.jwtUser)

  const studentId = location.pathname.startsWith("/purchased")
    ? useSelector((store) => store.auth.user?.studentId)
    : null;
  const studentName = location.pathname.startsWith("/purchased")
    ? useSelector(
        (store) => store.auth.user?.firstName + " " + store.auth.user?.lastName
      )
    : null;
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState(null);
  const { id } = useParams();

  useEffect(()=>{
    console.log(course);
  },[course])
  

  const hasReviewed = ratings.some((review) => review.studentId === studentId);
    const handleModalClose = () => {
      setIsModalOpen(false);
      setModalData({ rating: 0, reviewText: '' });
      setFormErrors({});
    };
  
    // Handle modal data change
    const handleModalChange = (field, value) => {
      setModalData((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleModalSave = async() => {
      // Validate form inputs
      const errors = {};
      if (!modalData.rating) errors.rating = 'Rating is required.';
      if (!modalData.reviewText.trim()) errors.reviewText = 'Review cannot be empty.';
  
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      console.log('Saved review:', modalData);
      const payload = {
        rating: modalData.rating,
        reviewText: modalData.reviewText,
        studentId: studentId,
        courseId: courseId, 
      };
      console.log(payload);
      try {
        const queryString = new URLSearchParams(payload).toString();
        await axios.post(`${API_BASE_URL}/ratings?${queryString}`, null, {
          headers: { Authorization: `Bearer ${auth.jwtUser}` },
        });
        setAlert({message:'Rating submitted successfully!',status:'success'});
        setShowAlert(true)
        fetchRatings()
      } catch (error) {
        console.error('Error submitting rating:', error);
        setAlert({message:'Failed to submit rating. Please try again.',status:'error'});
        setShowAlert(true)
      }
      // Close modal after save
      handleModalClose();
    };

  const isActiveRoute =
    location.pathname.startsWith("/mentor/courses/active") ||
    location.pathname.startsWith("/admin/courses/all") ||
    location.pathname.startsWith("/purchased"); // Check the route
  const isStudent = location.pathname.startsWith("/purchased");

  useEffect(() => {
    axios
      .get(`${MENTOR_BASE_URL}/draft/${id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then((response) => setCourse(response.data))
      .catch((error) => console.error("Error fetching course data:", error));
  }, [id]);

  const getQuiz = () => {
    setShowModal(true);
  };

  const fetchRatings = async () => {
    try {
      const response = await axios.get(
        `${API_AUTH_BASE_URL}/ratings/course/${courseId}`);
      const filteredRatings = response.data.filter(
        (rating) => rating.rootId ===null && rating.parentId === null
      );
      setRatings(filteredRatings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };
  
  useEffect(() => {
    if (courseId) fetchRatings();
  }, [courseId]);

  useEffect(() => {
    const fetchCourseId = async () => {
      try {
        const response = await axios.get(
          `${ADMIN_BASE_URL}/courses/draft/${id}/course-id`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        setCourseId(response.data);
      } catch (error) {
        console.error("Failed to fetch course ID:", error);
      }
    };

    fetchCourseId();
  }, [id]);

  useEffect(() => {
    const checkAttempts = async () => {
      try {
        const response = await axios.get(
          `${QA_BASE_URL}/quiz/attempts/${id}/${studentId}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        const { passDate, attemptCount, hasPassed } = response.data; // Destructure new fields

        if (hasPassed) {
          setAttemptsLeft(0); // If any attempt has "pass" status, set attemptsLeft to 0
          setDate(passDate);
          setPass(true);
        } else {
          setAttemptsLeft(3 - attemptCount); // Otherwise, calculate remaining attempts
        }
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    };

    if (studentId) checkAttempts();
  }, [studentId]);

  const handleNavigateToQuiz = () => {
    if (attemptsLeft > 0) {
      setShowModal(false); // Close modal
      navigate(`/purchased/${id}/quiz`); // Navigate to the quiz view
    } else {
      setAlert({message:"No attempts left. You cannot access this quiz.",status:'error'});
      setShowAlert(true)
    }
  };

  useEffect(() => {
    const fetchMaterialQualities = async () => {
      try {
        const response = await axios.get(
          `${QA_BASE_URL}/material/reviews/all`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        setMaterialQualities(response.data);
      } catch (error) {
        console.error("Error fetching material qualities:", error);
      }
    };

    fetchMaterialQualities();
  }, []);

  const fetchMaterials = async (chapterId) => {
    if (materials[chapterId]) return;
    try {
      const response = await axios.get(
        `${MENTOR_BASE_URL}/draft/chapter/material/${chapterId}`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setMaterials((prev) => ({ ...prev, [chapterId]: response.data }));
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleViewReview = (material) => {
    const review = materialQualities.find(
      (quality) => quality.materialId === material.materialId
    );
    const updatedReview = {
      ...review,
      materialName: material.materialName,
    };
    setSelectedReview(updatedReview);
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
  };

  const handleDownload = async () => {
    try {
      const certificateElement = document.getElementById("certificate");
      const canvas = await html2canvas(certificateElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 277, 190);
      pdf.save("certificate.pdf");
      navigate(`/purchased/${id}`);
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  return (
    <div className="container mx-auto p-10 max-w-screen-xl">
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
      <div className="flex justify-between">
        <div>
          <p className="text-gray-600 pb-2">
            {course?.subCategory?.catetoryName}/
            {course?.subCategory?.subcategoryName}
          </p>
          <h1 className="text-3xl font-bold">
            {course?.courseName || "Course Title"}
          </h1>
          <div className="flex">
            <p
            onClick={() => navigate(`/detailsmentor/${course.mentorId}`)}
             className="text-red-600 pb-5 cursor-pointer">  
              {course?.mentorName || "Mentor Name"}
            </p>
            {!isStudent && (
              <>
                {course?.sellingPrice ? (
                  <div className="flex">
                    <p className="text-green-600 pl-5">
                      {course?.sellingPrice || "Mentor Name"}
                    </p>
                    <p className="text-gray-600 line-through pl-1">
                      {course?.coursePrice || "Mentor Name"}
                    </p>
                  </div>
                ) : (
                  <p className="text-green-600 pl-5">Free</p>
                )}
              </>
            )}
          </div>
        </div>
        <div className="w-64 h-auto">
              <img
                alt={course?.courseName}
                className="rounded-lg "
                src={course?.thumbnailUrl}
              />
            </div>
      </div>

      {/* Material Preview */}
      {selectedMaterial && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          <h2 className="text-xl font-bold">
            Selected Material: {selectedMaterial.materialName}
          </h2>
          <div className="mt-4">
            {selectedMaterial.materialUrl.endsWith(".pdf") ? (
              <iframe
                src={selectedMaterial.materialUrl}
                title={selectedMaterial.materialName}
                width="100%"
                height="600px"
              ></iframe>
            ) : selectedMaterial.materialUrl.endsWith(".docx") ||
              selectedMaterial.materialUrl.endsWith(".doc") ? (
              <iframe
                src={`https://docs.google.com/gview?url=${selectedMaterial.materialUrl}&embedded=true`}
                title={selectedMaterial.materialName}
                width="100%"
                height="600px"
              ></iframe>
            ) : selectedMaterial.materialUrl.endsWith(".mp4") ||
              selectedMaterial.materialUrl.includes("video") ? (
              <video
                controls
                src={selectedMaterial.materialUrl}
                className="w-full"
              ></video>
            ) : (
              <a
                href={selectedMaterial.materialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View Document
              </a>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b mb-6">
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => setActiveTab("content")}
            className={`pb-2 text-lg font-medium ${
              activeTab === "content"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Course Content
          </button>
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-2 text-lg font-medium ${
              activeTab === "description"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Description
          </button>
          {/* Only show the Review tab if on the active route */}
          {isActiveRoute && (
            <button
              onClick={() => setActiveTab("review")}
              className={`pb-2 text-lg font-medium ${
                activeTab === "review"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              Reviews
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "content" && (
        <Content
          course={course}
          materials={materials}
          activeChapter={activeChapter}
          fetchMaterials={fetchMaterials}
          setActiveChapter={setActiveChapter}
          handleMaterialClick={handleMaterialClick}
          handleViewReview={handleViewReview}
        />
      )}
      {activeTab === "description" && <Description course={course} />}
      {activeTab === "review" &&
        isActiveRoute &&
        (courseId && ratings?.length > 0 ? (
          <>
          {ratings.map((review, index) => (
            <Review key={index} courseId={courseId} review={review} index={index} />
          ))}
          {!isAdmin &&(
            <>
              {!hasReviewed &&(
              <div className="mt-6">
                <button
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                  onClick={()=>setIsModalOpen(true)}
                >
                  Add Review
                </button>
              </div>
            )}
            </>

          )}
          </>
          
        ) : (
          <p>No reviews available.</p>
        ))}
      {pass ? (
        <>
          <button
            onClick={handleDownload}
            className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
          >
            Download Certificate
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            if (location.pathname.startsWith("/purchased")) {
              getQuiz();
            } else {
              const targetPath = location.pathname.startsWith("/admin")
                ? `/admin/qa/request/${id}/quiz`
                : location.pathname.startsWith("/mentor/courses/all")
                ? `/mentor/courses/all/${id}/view/quiz`
                : location.pathname.startsWith("/mentor/courses/active")
                ? `/mentor/courses/active/${id}/view/quiz`
                : "/fallback-path";
              navigate(targetPath);
            }
          }}
          className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
        >
          View Assessment
        </button>
      )}

      <div className="w-full flex justify-center pt-5">
        <button
          onClick={() => {
            location.pathname.startsWith("/admin/courses/all")?
            navigate("/admin/courses/all"):
            location.pathname.startsWith("/mentor/courses")?
            navigate("/mentor/courses"):
            navigate("/myCourses/purchased")
          }

          }
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {selectedReview && (
        <ReviewModal
          selectedReview={selectedReview}
          onCancel={() => setSelectedReview(null)}
        />
      )}

      <div>
        <Certificate
          studentName={studentName}
          courseName={course?.courseName}
          date={date}
          mentorName={course?.mentorName}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Assessment Attempts</h2>
            <p className="mt-4">
              You have{" "}
              <span className="font-bold text-red-500">{attemptsLeft}</span>{" "}
              attempts left for this quiz.
            </p>
            <p>Please read carefully and proceed responsibly.</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleNavigateToQuiz}
                className={`px-4 py-2 rounded ${
                  attemptsLeft > 0
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-400 text-gray-800"
                }`}
                disabled={attemptsLeft === 0}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
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

export default CourseContentReadOnly;

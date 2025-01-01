import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Modal from '../../OtherComponents/Modal';
import Alert from '../../OtherComponents/Alert';
import { fetchDraftTask, fetchFirstPendingDraft, getMaterialQualities, startTask, submitCourse } from '../../../Utility/Task';
import { fetchCourseMaterials } from '../../../Utility/Chapters';
import { fetchCourseQuizzes } from '../../../Utility/Quiz';

const CourseTable = () => {
  const [course, setCourse] = useState(null);
  const auth = useSelector((store) => store.qaAuth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    courseName: "",
    status: "",
    feedback: "",
    qaExpertUid: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [materials, setMaterials] = useState([]);
  const [materialQualities, setMaterialQualities] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const navigate=useNavigate()

  const fetchPendingDraft = async () => {
    try {
      const course = await fetchFirstPendingDraft(auth.qaJwt, auth.user.qaId);
      setCourse(course);
    } catch (error) {
      console.error("Error fetching pending draft:", error);
      setCourse(null);
    }
  };
  useEffect(() => {
    if (auth?.user?.qaId) {
      fetchPendingDraft();
    }
  }, [auth?.user?.qaId, auth.jwt, refresh]);
  

  useEffect(() => {
    const fetchMaterialQualities = async () => {
      try {
        const qualities = await getMaterialQualities(auth.qaJwt);
        setMaterialQualities(qualities);
      } catch (error) {
        console.error("Error fetching material qualities:", error);
      }
    };
  
    fetchMaterialQualities();
  }, [auth.qaJwt]);
  

  const validateSubmissionForm = (values) => {
    const errors = {};
    if (!values.status) errors.status = "Status is required.";
    if (!values.feedback) errors.feedback = "Feedback is required.";
    if (!values.qaExpertUid) errors.qaExpertUid = "Lead UID is required.";
    return errors;
  };

  const findMaterials = async (courseId) => {
    try {
      const allMaterials = await fetchCourseMaterials(auth.qaJwt, courseId);
      setMaterials(allMaterials);
      return allMaterials;
    } catch (error) {
      console.error("Error fetching material qualities:", error);
    }
  };
  
  
  const handleSubmit = async () => {
    const allMaterials =await findMaterials(course.draftId)
      const unreviewedMaterials = allMaterials.filter(
        (material) => !materialQualities.some((quality) => quality.materialId === material.materialId)
      );
  
      if (unreviewedMaterials.length > 0) {
      setAlert({message:'Please complete reviews for all materials before submitting.',status:'error'});
      setShowAlert(true)
        return;
      }
      try {
        const quizzes = await fetchCourseQuizzes(auth.qaJwt, course.draftId);
        if (quizzes.length < 5) {
          setAlert({ message: 'Please ensure there are at least 5 quiz questions before submitting.', status: 'error' });
          setShowAlert(true);
          return;
        }
        setSubmissionData({
          courseName: course?.courseName || "",
          status: "",
          feedback: "",
          qaExpertUid: "",
        });
        setFormErrors({});
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
  };

  const handleFieldChange = (field, value) => {
    setSubmissionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSubmit = async () => {
    const errors = validateSubmissionForm(submissionData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  const qaExpertId = auth?.user?.qaId;
  const requestData = {
    ...submissionData,
    qaExpertId,
  };
  
  try {
    await submitCourse(auth.qaJwt, course.draftId, requestData);
    setAlert({ message: 'Course successfully submitted!', status: 'success' });
    setShowAlert(true);
    setRefresh((prev) => !prev);
    setIsModalOpen(false);
    navigate("/qa/dashboard");
  } catch (error) {
    setAlert({
      message: error.response.data || 'Failed to submit the course. Please try again.',
      status: "error",
    });   
    setShowAlert(true);
    console.error(error);
    }
  }  


  if (!course) {
    return (
    <div className='flex flex-col items-center'>
      <h1 className='font-bold text-3xl pt-5'>Courses</h1>
      <p className="m-5 text-center">No pending drafts found.</p>
    </div>)
  }

  const startHandler = async () => { 
    try {
      const draftTask = await fetchDraftTask(auth.qaJwt, course.draftId);
      console.log('draftTask', draftTask);
  
      if (draftTask) {
        const taskId = draftTask.taskId;
        console.log('auth', auth);
        console.log({ qaExpertUID: auth.user.qaId });
  
        await startTask(auth.qaJwt, taskId, auth.user.qaId);
        navigate(`/qa/all/${course.draftId}`, { state: { course } });
      }
    } catch (error) {
      setAlert({
        message: error.response.data || 'Failed. Please try again.',
        status: "error",
      });   
      setShowAlert(true);
      console.error(error);
      setTimeout(() => {         
        fetchPendingDraft();
      }, 3000);
      }
  };
  


  return (
    <div className="m-5 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {showAlert && (
          <Alert 
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      <h1 className='font-bold text-3xl pt-5 self-center pb-10'>Courses</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thumbnail
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chapters
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Materials
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created at
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <img
                src={course.thumbnailUrl || '/default-thumbnail.jpg'}
                alt="Course Thumbnail"
                className="w-16 h-10 rounded"
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{course.courseName}</td>
            <td className="px-6 py-4 whitespace-normal w-96 break-words">{course.courseDescription}</td>
            <td className="px-6 py-4 whitespace-nowrap">{course.chaptersCount || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap">{course.materialsCount || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap">{new Date(course.addedDate).toLocaleString()}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
              onClick={startHandler}
               className="bg-green-500 text-white px-4 py-1 rounded-full mr-2 hover:bg-green-600">
                Start
              </button>
              <button
              onClick={handleSubmit}
               className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600">
                Submit
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {isModalOpen && (
        <Modal
          title="Submit Course"
          fields={[
            { label: "Course Name", name: "courseName", type: "text", readOnly: true },
            {
              label: "Status",
              name: "status",
              type: "select",
              options: [
                { name: "approved", label: "Approved" },
                { name: "rejected", label: "Rejected" },
                { name: "need improvement", label: "Need Improvement" },
              ],
            },
            { label: "Feedback", name: "feedback", type: "textarea" },
            { label: "Lead UID", name: "qaExpertUid", type: "text" },
          ]}
          values={submissionData}
          onChange={handleFieldChange}
          onSave={handleModalSubmit}
          onCancel={() => setIsModalOpen(false)}
          formErrors={formErrors}
        />
      )}
    </div>
  );
};

export default CourseTable;

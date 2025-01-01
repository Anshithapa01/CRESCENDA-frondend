import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "../../../OtherComponents/Modal";
import Alert from "../../../OtherComponents/Alert";
import { getCourseDraft } from "../../../../Utility/Course";
import { getMaterialQualities, saveMaterialReview } from "../../../../Utility/Task";
import { getMaterials } from "../../../../Utility/Material";

const CourseContent = () => {
  const [course, setCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalValues, setModalValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [materials, setMaterials] = useState({}); // Store materials for each chapter
  const [activeChapter, setActiveChapter] = useState(null);
  const [materialQualities, setMaterialQualities] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});

  const auth = useSelector((store) => store.mentorAuth);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch course data
  useEffect(() => {
    const fetchCourseDraft = async () => {
      try {
        const courseData = await getCourseDraft(auth.jwt, id);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourseDraft();
  }, [id]);
  
  const fetchMaterialQualities = async () => {
    try {
      const qualities = await getMaterialQualities(auth.jwt);
      setMaterialQualities(qualities);
    } catch (error) {
      console.error("Error fetching material qualities:", error);
    }
  }; 
  // Fetch material qualities (reviews)
  useEffect(() => {
    
    fetchMaterialQualities();
  }, []);
  

  // Fetch materials for a chapter
  const fetchMaterials = async (chapterId) => {
    if (materials[chapterId]) return; // Skip if already fetched
    try {
      const materialData = await getMaterials(auth.jwt, chapterId);
      setMaterials((prev) => ({ ...prev, [chapterId]: materialData }));
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };
  

  // Open modal for review
  const handleOpenModal = (material) => {
    const existingReview = materialQualities.find(
      (quality) => quality.materialId === material.materialId
    );

    if (existingReview) {
      setModalValues({
        materialId: existingReview.materialId,
        materialName: material.materialName,
        status: existingReview.status,
        comment: existingReview.comment,
        expertId: existingReview.expertId,
      });
    } else {
      setModalValues({
        materialId: material.materialId,
        materialName: material.materialName,
        status: "",
        comment: "",
        expertId: "",
      });
    }

    setIsModalOpen(true);
    setFormErrors({});
  };

  // Handle modal field changes
  const handleFieldChange = (field, value) => {
    setModalValues((prev) => ({ ...prev, [field]: value }));
  };

  // Save review
  const handleSaveReview = async () => {
    // Validate the form fields
    const errors = validateForm(modalValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const updatedMaterialQuality = await saveMaterialReview(
        auth.jwt,
        id,
        modalValues,
        materialQualities
      );
    
      setMaterialQualities((prev) => {
        const existingQuality = materialQualities.find(
          (quality) => quality.materialId === modalValues.materialId
        );
    
        if (existingQuality) {
          return prev.map((quality) =>
            quality.materialId === modalValues.materialId ? updatedMaterialQuality : quality
          );
        } else {
          return [...prev, updatedMaterialQuality];
        }
      });
      setAlert({ message: 'Review saved successfully!', status: 'success' });
      fetchMaterialQualities();
      setShowAlert(true);
      setIsModalOpen(false);
    } catch (error) {
      // Display backend error messages in the alert
      setAlert({
        message: error.message || "Failed to save review. Please try again.",
        status: "error",
      });
      setShowAlert(true);
      console.error(error);
    }
  };

  const validateForm = (values) => {
    const errors = {};
    if (!values.status) errors.status = "Status is required.";
    if (!values.expertId) errors.expertId = "Expert ID is required.";
    return errors;
  };

  // Handle material selection for preview
  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
  };

  return (
    <div className="container mx-auto p-6 max-w-screen-xl">
      {showAlert && (
          <Alert 
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      <h1 className="text-3xl font-bold">{course?.courseName || "Course Title"}</h1>
      <p className="text-lg text-gray-600">{course?.courseDescription || "Course Description"}</p>

      {/* Material Preview */}
      {selectedMaterial && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100">
          <h2 className="text-xl font-bold">Selected Material: {selectedMaterial.materialName}</h2>
          <div className="mt-4">
            {selectedMaterial.materialUrl.endsWith(".pdf") ? (
              // Render PDFs directly in an iframe
              <iframe
                src={selectedMaterial.materialUrl}
                title={selectedMaterial.materialName}
                width="100%"
                height="600px"
              ></iframe>
            ) : selectedMaterial.materialUrl.endsWith(".docx") || selectedMaterial.materialUrl.endsWith(".doc") ? (
              // Use Google Docs Viewer for Word documents
              <iframe
                src={`https://docs.google.com/gview?url=${selectedMaterial.materialUrl}&embedded=true`}
                title={selectedMaterial.materialName}
                width="100%"
                height="600px"
              ></iframe>
            ) : selectedMaterial.materialUrl.endsWith(".mp4") || selectedMaterial.materialUrl.includes("video") ? (
              // Render video files
              <video controls src={selectedMaterial.materialUrl} className="w-full"></video>
            ) : (
              // Fallback for other document types
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

      {course?.chapters?.map((chapter) => (
        <div key={chapter.chapterId} className="mt-4 bg-gray-200 rounded-lg shadow-md">
          {/* Chapter Header */}
          <div
            onClick={() => {
              setActiveChapter(chapter.chapterId === activeChapter ? null : chapter.chapterId);
              fetchMaterials(chapter.chapterId);
            }}
            className="p-4 flex justify-between items-center cursor-pointer"
          >
            <span className="text-xl font-bold">{chapter.chapterName}</span>
          </div>
          {/* Materials Section */}
          {activeChapter === chapter.chapterId && (
            <div className="bg-white p-4 space-y-4">
              {materials[chapter.chapterId]?.length > 0 ? (
                materials[chapter.chapterId].map((material) => (
                  <div
                    key={material.materialId}
                    className="flex justify-between items-center bg-gray-100 rounded-md p-3"
                    onClick={() => handleMaterialClick(material)}
                  >
                    <span>{material.materialName}</span>
                    <button
                      onClick={() => handleOpenModal(material)}
                      className={
                        materialQualities.find((quality) => quality.materialId === material.materialId)
                          ? "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          : "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      }
                    >
                      {materialQualities.find((quality) => quality.materialId === material.materialId)
                        ? "Update Review"
                        : "Add Review"}
                    </button>
                  </div>
                ))
              ) : (
                <p>No materials available for this chapter.</p>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => navigate(`/qa/all/${id}/assessment`)}
        className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
      >
        Add Assessment
      </button>

      <div className="w-full flex justify-center pt-5 items-center">
        <button
        className="bg-orange-400 hover:bg-orange-500 p-2 text-white rounded-lg"
        onClick={()=> navigate('/qa/dashboard')}
        >Save</button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          title="Add Review"
          fields={[
            { label: "Material Name", name: "materialName", type: "text", readOnly: true },
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
            { label: "Comment", name: "comment", type: "textarea" },
            { label: "Expert ID", name: "expertId", type: "text" },
          ]}
          values={modalValues}
          onChange={handleFieldChange}
          onSave={handleSaveReview}
          onCancel={() => setIsModalOpen(false)}
          formErrors={formErrors}
        />
      )}

    </div>
  );
};

export default CourseContent;

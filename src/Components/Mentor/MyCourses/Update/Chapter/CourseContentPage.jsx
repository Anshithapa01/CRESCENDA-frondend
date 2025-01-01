import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../../OtherComponents/Modal";
import { MENTOR_BASE_URL } from "../../../../../Config/apiConfig";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} from "../../../../../Config/Cloudinary";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "../../../../OtherComponents/Alert";


const CourseContent = () => {
  const [course, setCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [currentValues, setCurrentValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [activeChapter, setActiveChapter] = useState(null);
  const [materials, setMaterials] = useState({}); // Store materials for each chapter
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const [existingFileUrl, setExistingFileUrl] = useState(null);
  const auth = useSelector((store) => store.mentorAuth);
  const navigate=useNavigate();
  const { id } = useParams();

  // Fetch course data
  useEffect(() => {
    axios
      .get(`${MENTOR_BASE_URL}/draft/${id}`, {
        headers: { Authorization: `Bearer ${auth.jwt}` },
      })
      .then((response) => setCourse(response.data))
      .catch((error) => console.error("Error fetching course data:", error));
  }, [id]);

  // Modal Handling
  const handleOpenModal = (
    type,
    initialValues = {},
    existingFileUrl = null
  ) => {
    setModalType(type);
    setCurrentValues({
      ...initialValues,
      chapter: initialValues.chapter || activeChapter,
    });
    setIsModalOpen(true);
    setFormErrors({});
    setExistingFileUrl(existingFileUrl); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      console.log(fileType);

      const allowedFileTypes = {
        video: ["video/mp4", "video/mkv", "video/x-matroska", "video/webm"],
        document: [
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        pdf: ["application/pdf"],
      };
      let materialType = null;
      for (const [key, types] of Object.entries(allowedFileTypes)) {
        if (types.includes(fileType)) {
          materialType = key;
          break;
        }
      }
      if (!materialType) {
        setAlert({message:'Invalid file type! Please upload a valid file.',status:'error'});
        setShowAlert(true)
        e.target.value = "";
        return;
      }
      setCurrentValues({ ...currentValues, file });
    }
  };

  const uploadFileToCloudinary = async (file, materialType) => {
    const formData = new FormData();
    formData.append("file", file);

    // Select the correct upload preset and URL based on the material type
    let uploadPreset;
    let cloudinaryUrl;
    console.log(materialType);

    switch (materialType) {
      case "video":
        uploadPreset = "videos_preset";
        cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`; // URL for video upload
        break;
      case "document":
        uploadPreset = "document_preset";
        cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`; // URL for document upload
        break;
      case "pdf":
        uploadPreset = "pdf_preset";
        cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`; // URL for PDF upload
        break;
      default:
        throw new Error("Unsupported material type");
    }

    formData.append("upload_preset", uploadPreset);
    formData.append("api_key", CLOUDINARY_API_KEY);

    try {
      const response = await axios.post(cloudinaryUrl, formData);

      return response.data.secure_url; 
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      setAlert({message:'Error uploading file. Please try again.',status:'error'});
      setShowAlert(true)
      throw error; 
    }
  };

  const handleModalSave = async (values) => {
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    setLoading(true); // Start loading before the upload begins
  
    try {
      if (values.file) {
        const fileType = values.file.type;
        const materialTypeMapping = {
          video: ["video/mp4", "video/x-matroska", "video/webm"],
          document: [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ],
          pdf: ["application/pdf"],
        };
  
        let materialType = null;
  
        for (const [key, types] of Object.entries(materialTypeMapping)) {
          if (types.includes(fileType)) {
            materialType = key;
            break;
          }
        }
        if (!materialType) {
          setAlert({message:'Invalid file type! Please upload a valid file.',status:'error'});
          setShowAlert(true)
          return;
        }
  
        setCurrentValues({
          ...currentValues,
          materialType: materialType,
        });
  
        const fileUrl = await uploadFileToCloudinary(values.file, materialType);
        console.log("file url", fileUrl);
  
        values.materialUrl = fileUrl;
      }
  
      setIsModalOpen(false);
      setIsUpdating(false);
  
      if (modalType === "addChapter") {
        await handleAddChapter(values);
      } else if (modalType === "editChapter") {
        const chapterId = currentValues.chapterId;
        await handleUpdateChapter(chapterId, values);
      } else if (modalType === "addMaterial") {
        const chapterId = activeChapter;
        await handleAddMaterial(chapterId, values);
      } else if (modalType === "editMaterial") {
        const materialId = currentValues.materialId;
        await handleUpdateMaterial(materialId, currentValues);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false); // Stop loading after the process completes or fails
    }
  };
  

  const validateForm = (values) => {
    const errors = {};
    if (
      modalType.includes("Chapter") &&
      (!values.chapterName || values.chapterName.trim() === "")
    ) {
      errors.chapterName = "Chapter name is required.";
    }
    if (
      modalType.includes("Material") &&
      (!values.materialName || values.materialName.trim() === "")
    ) {
      errors.materialName = "Material name is required.";
    }
    if (
      modalType === "addMaterial" &&
      (!values.file || !(values.file instanceof File))
    ) {
      errors.file = "Please upload a valid file.";
    }
    return errors;
  };

  // Add Chapter
  const handleAddChapter = async (values) => {
    try {
      const response = await axios.post(
        `${MENTOR_BASE_URL}/draft/chapters/${id}/add`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.jwt}`,
          },
        }
      );
      setAlert({ message: 'Chapter added successfully!', status: 'success' });
      setShowAlert(true);
      setCourse((prev) => ({
        ...prev,
        chapters: [...prev.chapters, response.data],
      }));
    } catch (error) {
      setAlert({ message: 'Failed to add chapter.', status: 'error' });
      setShowAlert(true);
      console.error("Error adding chapter:", error);
    }
  };

  // Update Chapter
  const handleUpdateChapter = async (chapterId, values) => {
    try {
      const response = await axios.put(
        `${MENTOR_BASE_URL}/draft/chapters/${chapterId}/update`,
        values,
        { headers: { Authorization: `Bearer ${auth.jwt}` } }
      );
      setAlert({ message: 'Chapter updated successfully!', status: 'success' });
      setShowAlert(true);
      setCourse((prev) => ({
        ...prev,
        chapters: prev.chapters.map((chapter) =>
          chapter.chapterId === chapterId ? response.data : chapter
        ),
      }));
    } catch (error) {
      setAlert({ message: 'Failed to update chapter.', status: 'error' });
      setShowAlert(true);
      console.error("Error updating chapter:", error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm("Are you sure you want to delete this chapter?")) {
      try {
        await axios.delete(
          `${MENTOR_BASE_URL}/draft/chapters/${chapterId}/delete`,
          { headers: { Authorization: `Bearer ${auth.jwt}` } }
        );
        setAlert({ message: 'Chapter deleted successfully!', status: 'success' });
        setShowAlert(true);
        setCourse((prev) => ({
          ...prev,
          chapters: prev.chapters.filter(
            (chapter) => chapter.chapterId !== chapterId
          ),
        }));
      } catch (error) {
        setAlert({ message: 'Failed to delete chapter.', status: 'error' });
        setShowAlert(true);
        console.error("Error deleting chapter:", error);
      }
    }
  };  

  // Fetch Materials for a Chapter
  const fetchMaterials = async (chapterId) => {
    if (materials[chapterId]) return; // Skip if already fetched
    try {
      const response = await axios.get(
        `${MENTOR_BASE_URL}/draft/chapter/material/${chapterId}`,
        { headers: { Authorization: `Bearer ${auth.jwt}` } }
      );
      setMaterials((prev) => ({ ...prev, [chapterId]: response.data }));
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  // Add Material
  const handleAddMaterial = async (chapterId, values) => {
    try {
      const response = await axios.post(
        `${MENTOR_BASE_URL}/draft/chapter/material/${chapterId}/add`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.jwt}`,
          },
        }
      );
      setAlert({ message: 'Material added successfully!', status: 'success' });
      setShowAlert(true);  
      setMaterials((prev) => ({
        ...prev,
        [chapterId]: [...(prev[chapterId] || []), response.data],
      }));
    } catch (error) {
      setAlert({ message: 'Failed to add material.', status: 'error' });
      setShowAlert(true);
      console.error("Error adding material:", error);
    }
  };

  const handleUpdateMaterial = async (materialId, values) => {
    const { chapter, ...materialValues } = values; 
    const updatedValues = {
        ...materialValues,
        chapterId: chapter.chapterId?chapter.chapterId:chapter,  // Use chapterId from values if it's directly available
    };   
    try {
      const response = await axios.put(
        `${MENTOR_BASE_URL}/draft/chapter/material/${materialId}/update`,
        updatedValues,
        { headers: { Authorization: `Bearer ${auth.jwt}` } }
      );
      const chapterId =
            updatedValues.chapterId;
        if (!chapterId) {
          throw new Error("Chapter ID is undefined");
        }
        setAlert({ message: 'Material updated successfully!', status: 'success' });
        setShowAlert(true);
        setMaterials((prev) => ({
        ...prev,
        [chapterId]: prev[chapterId].map((material) =>
          material.materialId === materialId ? response.data : material
        ),
      }));
    } catch (error) {
      setAlert({ message: 'Failed to update material.', status: 'error' });
      setShowAlert(true);
      console.error("Error updating material:", error);
    }
  };

  const handleDeleteMaterial = async (materialId, chapterId) => {
    try {
      await axios.delete(
        `${MENTOR_BASE_URL}/draft/chapter/material/${materialId}/delete`,
        { headers: { Authorization: `Bearer ${auth.jwt}` } }
      );
      setAlert({ message: 'Material deleted successfully!', status: 'success' });
      setShowAlert(true);
      setMaterials((prev) => ({
        ...prev,
        [chapterId]: prev[chapterId].filter(
          (material) => material.materialId !== materialId
        ),
      }));
    } catch (error) {
      setAlert({ message: 'Failed to delete material.', status: 'error' });
      setShowAlert(true);
      console.error("Error deleting material:", error);
    }
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
      <h1 className="text-3xl font-bold">
        {course?.courseName || "Course Title"}
      </h1>
      <p className="text-lg text-gray-600">
        {course?.courseDescription || "Course Description"}
      </p>

      {course?.chapters?.map((chapter) => (
        <div
          key={chapter.chapterId}
          className="mt-4 bg-gray-200 rounded-lg shadow-md"
        >
          {/* Chapter Header */}
          <div
            onClick={() => {
              setActiveChapter(
                chapter.chapterId === activeChapter ? null : chapter.chapterId
              );
              fetchMaterials(chapter.chapterId);
            }}
            className="p-4 flex justify-between items-center cursor-pointer"
          >
            <span className="text-xl font-bold">{chapter.chapterName}</span>
            {/* Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent menu toggle
                  handleOpenModal("editChapter", chapter);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent menu toggle
                  handleDeleteChapter(chapter.chapterId);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
          {/* Materials Section */}
          {activeChapter === chapter.chapterId && (
            <div className="bg-white p-4 space-y-4">
              {materials[chapter.chapterId]?.length > 0 ? (
                materials[chapter.chapterId].map((material) => (
                  <div
                    key={material.materialId}
                    className="flex justify-between items-center bg-gray-100 rounded-md p-3"
                  >
                    <span>{material.materialName}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent menu toggle
                          const existingFileUrl = material.materialUrl;
                          setIsUpdating(true);
                          handleOpenModal(
                            "editMaterial",
                            {
                              materialId: material.materialId,
                              materialName: material.materialName,
                              materialType: material.materialType,
                              chapter: material.chapter,
                              materialUrl: existingFileUrl,
                            },
                            true,
                            existingFileUrl
                          );
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent menu toggle
                          handleDeleteMaterial(
                            material.materialId,
                            chapter.chapterId
                          );
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No materials available for this chapter.</p>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent menu toggle
                  handleOpenModal("addMaterial", {
                    materialName: "",
                    materialType: "",
                    materialUrl: "",
                  });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Material
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={() =>
          handleOpenModal("addChapter", {
            chapterName: "",
            chapterDescription: "",
          })
        }
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
      >
        Add New Chapter
      </button>

      <div className="w-full flex pt-5 justify-around">
        <button 
        onClick={()=>navigate('/mentor/courses/all')}
        className=" p-3 bg bg-orange-400 text-white rounded-md">
          Save</button>
          <button 
        onClick={()=>navigate(`/mentor/courses/all/${id}/update/quiz`)}
        className=" p-3 bg bg-orange-600 text-white rounded-md">
        Add Assessment</button>
      </div>

      <div className="relative">
      {/* Modal */}
      {isModalOpen && (
        <Modal
          title={
            modalType.includes("Chapter")
              ? `${modalType === "addChapter" ? "Add" : "Edit"} Chapter`
              : "Add Material"
          }
          fields={
            modalType.includes("Chapter")
              ? [
                  { label: "Chapter Name", name: "chapterName", type: "text" },
                  {
                    label: "Description",
                    name: "chapterDescription",
                    type: "textarea",
                  },
                ]
              : [
                  {
                    label: "Material Name",
                    name: "materialName",
                    type: "text",
                  },
                  { label: "Material URL", name: "materialUrl", type: "file" }, // Set the type as 'file' for file input
                ]
          }
          values={currentValues}
          onSave={handleModalSave}
          onCancel={() => {
            setIsModalOpen(false), setIsUpdating(false);
          }}
          isUpdating={isUpdating}
          onChange={(field, value) =>
            setCurrentValues((prev) => ({ ...prev, [field]: value }))
          }
          formErrors={formErrors}
          handleFileChange={handleFileChange} 
        />
      )}

  {/* Loading Spinner */}
  {loading && (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <CircularProgress />
    </div>
  )}
</div>

    </div>
  );
};

export default CourseContent;

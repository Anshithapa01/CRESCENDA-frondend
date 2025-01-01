import React, { useEffect, useRef, useState } from "react";
import { ADMIN_BASE_URL, MENTOR_BASE_URL } from "../../../../Config/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ActionAlerts from "../../../OtherComponents/ActionAlert";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
} from "../../../../Config/Cloudinary";
import CategoryDropdown from "../../../OtherComponents/CategoryDropdown";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { addDraft } from "../../../../Utility/Course";
import { fetchCategories } from "../../../../Utility/Category";
import { fetchSubCategories } from "../../../../Utility/SubCategory";


const AddCourse = () => {
  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    authorNote: "",
    specialNote: "",
    coursePrerequisite: "",
    coursePrice: "",
    sellingPrice: "",
    language: "",
    category: "",
    subCategory: "",
    subCategoryId: null,
    mentorId: null,
    type: "",
    level: "",
    thumbnail: null,
  });

  const alertRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useSelector((store) => store.mentorAuth);

  const handleCloseSuccessAlert = () => {
    setFormData({
      courseName: "",
      courseDescription: "",
      authorNote: "",
      specialNote: "",
      coursePrerequisite: "",
      coursePrice: "",
      sellingPrice: "",
      language: "",
      category: "",
      subCategory: "",
      subCategoryId: null,
      mentorId: null,
      type: "",
      level: "",
      thumbnail: null,
    });
    setShowSuccessAlert(false);
    navigate("/mentor/courses/all");
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await fetchCategories(auth.jwt);
        console.log(data);
        
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  const fetchSubCategory = async (categoryId) => {
    const data = await fetchSubCategories(categoryId,auth.jwt);
    if (Array.isArray(data)) {
      setSubCategories(data);
    } else {
      console.error("Invalid data structure for subcategories", data);
      setSubCategories([]);
    }
  };
  

  const handleSelectCategory = (category) => {
    setFormData({ ...formData, category });
    if (category) {
      fetchSubCategory(category.categoryId);
    }
  };

  const handleSelectSubCategory = (subCategory) => {
    setFormData({
      ...formData,
      subCategory: subCategory,
      subCategoryId: subCategory.subcategoryId,
    });
  };

  useEffect(() => {
    if (showSuccessAlert || showErrorAlert) {
      alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (showSuccessAlert) {
      const timer = setTimeout(handleCloseSuccessAlert, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert, showErrorAlert]);

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = "";
    if (value === "") {
      errorMessage = "This field is required";
    }
    if ((name === "coursePrice" || name === "sellingPrice") && value !== "") {
      if (isNaN(value)) {
        errorMessage = "This must be a valid number";
      } else if (parseFloat(value) <= 0) {
        errorMessage = "Price must be greater than 0";
      }
    }
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;

      const allowedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/svg+xml",
      ];
      if (!allowedImageTypes.includes(fileType)) {
        alert(
          "Invalid file type! Please upload an image (JPEG, PNG, WebP, or SVG)."
        );
        e.target.value = "";
      } else if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        e.target.value = "";
      } else {
        setFormData({ ...formData, thumbnail: file });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseName) newErrors.courseName = "Course name is required";
    if (!formData.courseDescription)
      newErrors.courseDescription = "Course description is required";
    if (formData.type === "Paid") {
      if (
        !formData.coursePrice ||
        isNaN(formData.coursePrice) ||
        parseFloat(formData.coursePrice) <= 0
      )
        newErrors.coursePrice =
          "Course price must be a valid number greater than 0";
      if (
        !formData.sellingPrice ||
        isNaN(formData.sellingPrice) ||
        parseFloat(formData.sellingPrice) <= 0
      )
        newErrors.sellingPrice =
          "Selling price must be a valid number greater than 0";
    }
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory)
      newErrors.subCategory = "Sub-Category is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.level) newErrors.level = "Level is required";
    if (!formData.thumbnail) newErrors.thumbnail = "Thumbnail is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadThumbnailToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images_preset");
    formData.append("api_key", CLOUDINARY_API_KEY);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await axios.post(url, formData);
    return response.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        let thumbnailUrl = null;
        if (formData.thumbnail) {
          thumbnailUrl = await uploadThumbnailToCloudinary(formData.thumbnail);
        }
        const formDataToSend = {
          ...formData,
          thumbnail: thumbnailUrl,
          mentorId: auth?.user?.mentorId || null,
        };
        
          try {
            console.log('add start');
            
            const response = await addDraft(auth.jwt, formDataToSend);
            console.log('add end');
            
            console.log("Draft added successfully:", response.data);
          } catch (error) {
            console.error("Error adding draft:", error);
          }
        
        setShowSuccessAlert(true);
        setShowErrorAlert(false);
      } catch (error) {
        console.error("Error adding course:", error);
        setShowSuccessAlert(false);
        setShowErrorAlert(true);
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  return (
    <div className="container mx-auto p-6 m-10 max-w-screen-xl shadow-md pt-10">
      <div ref={alertRef}>
        {showSuccessAlert && (
          <ActionAlerts type="success" onClose={handleCloseSuccessAlert} />
        )}
        {showErrorAlert && (
          <ActionAlerts type="error" onClose={handleCloseErrorAlert} />
        )}
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-center pb-10">
        Add Course
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              className="border p-2 rounded w-full"
              value={formData.courseName}
              onChange={handleChange}
            />
            {errors.courseName && (
              <p className="text-red-500 text-sm">{errors.courseName}</p>
            )}
          </div>
          <div>
            <select
              name="type"
              className="border p-2 rounded w-full"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}
          </div>
          {formData.type === "Paid" && (
            <>
              <div>
                <input
                  type="text"
                  name="coursePrice"
                  placeholder="Course Price"
                  className="border p-2 rounded w-full"
                  value={formData.coursePrice}
                  onChange={handleChange}
                />
                {errors.coursePrice && (
                  <p className="text-red-500 text-sm">{errors.coursePrice}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="sellingPrice"
                  placeholder="Course Selling Price"
                  className="border p-2 rounded w-full"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                />
                {errors.sellingPrice && (
                  <p className="text-red-500 text-sm">{errors.sellingPrice}</p>
                )}
              </div>
            </>
          )}
          <div className="col-span-2">
            <textarea
              name="courseDescription"
              placeholder="Course Description"
              className="border p-2 rounded w-full"
              value={formData.courseDescription}
              onChange={handleChange}
            />
            {errors.courseDescription && (
              <p className="text-red-500 text-sm">{errors.courseDescription}</p>
            )}
          </div>
          <input
            type="text"
            name="authorNote"
            placeholder="Author Note"
            className="border p-2 rounded"
            value={formData.authorNote}
            onChange={handleChange}
          />
          <input
            type="text"
            name="specialNote"
            placeholder="Special Note"
            className="border p-2 rounded"
            value={formData.specialNote}
            onChange={handleChange}
          />
          <input
            type="text"
            name="coursePrerequisite"
            placeholder="Course Prerequisite"
            className="border p-2 rounded"
            value={formData.coursePrerequisite}
            onChange={handleChange}
          />
          <div>
            <input
              type="text"
              name="language"
              placeholder="Language"
              className="border p-2 rounded w-full"
              value={formData.language}
              onChange={handleChange}
            />
            {errors.language && (
              <p className="text-red-500 text-sm">{errors.language}</p>
            )}
          </div>
          <div>
            <CategoryDropdown
              label="Category"
              options={categories}
              selectedOption={formData.category}
              onSelect={handleSelectCategory}
              displayField="categoryName"
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
          {formData.category && (
            <div>
              <CategoryDropdown
                label="Subcategory"
                options={subCategories}
                selectedOption={formData.subCategory}
                onSelect={handleSelectSubCategory}
                displayField="subcategoryName"
              />
              {errors.subCategory && (
                <p className="text-red-500 text-sm">{errors.subCategory}</p>
              )}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <select
              name="level"
              className="border p-2 rounded w-full"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {errors.level && (
              <p className="text-red-500 text-sm">{errors.level}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 w-full">Upload Thumbnail</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block border p-2 rounded w-full"
              accept="image/jpeg, image/png"
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-sm">{errors.thumbnail}</p>
            )}
          </div>
        </div>
        <div className="flex w-full justify-center p-10">
  {loading ? (
    <div className="flex justify-center my-4">
      {/* Material-UI Spinner */}
      <CircularProgress />
      {/* Or TailwindCSS Spinner */}
      {/* <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}
    </div>
  ) : (
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      disabled={loading} // Prevent multiple submissions
    >
      Add
    </button>
  )}
</div>

      </form>
    </div>
  );
};

export default AddCourse;

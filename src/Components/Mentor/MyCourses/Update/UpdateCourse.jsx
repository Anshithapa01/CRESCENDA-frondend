import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ADMIN_BASE_URL, MENTOR_BASE_URL } from "../../../../Config/apiConfig";
import { useSelector } from "react-redux";
import ActionAlerts from "../../../OtherComponents/ActionAlert";
import CategoryDropdown from "../../../OtherComponents/CategoryDropdown";
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } from "../../../../Config/Cloudinary";
import CircularProgress from "@mui/material/CircularProgress";

const UpdateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector((store) => store.mentorAuth);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lazyLoading, setLazyLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

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

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `${MENTOR_BASE_URL}/draft/${id}`, 
        { headers: { Authorization: `Bearer ${auth.jwt}` } });
        const data = response.data;
        
        // Set course data in the form state
        setCourse(data);
        
        // Set form data with the existing values
        const updatedFormData = {
          courseName: data.courseName,
          courseDescription: data.courseDescription,
          authorNote: data.authorNote || "",
          specialNote: data.specialNote || "",
          coursePrerequisite: data.coursePrerequisite || "",
          coursePrice: data.coursePrice,
          sellingPrice: data.sellingPrice,
          language: data.language,
          category: null, // Initially, category is null
          subCategory: data.subCategory || "", // Initially set the subcategory name
          subCategoryId: data.subCategory.subcategoryId, 
          type: data.type,
          level: data.level,
          thumbnail: data.thumbnailUrl,
        };        
        setFormData(updatedFormData);
        
        // Fetch full category and subcategory based on subCategory name
        if (data.subCategory) {
          // Fetch the category that this subcategory belongs to
          const category = categories.find((cat) =>
            cat.subCategories?.some(
              (sub) => sub.subcategoryName === data.subCategory.subcategoryName
            )
          );
          if (category) {
            fetchSubCategories(category.categoryId);
          }
          if (category) {
            const subCategory = category.subCategories.find(
              (sub) => sub.subcategoryName === data.subCategory
            );
            

            // Update formData with the full category and subcategory object
            setFormData((prevState) => ({
              ...prevState,
              category: category, // Set the full category object
              subCategoryId: subCategory ? subCategory.subcategoryId : null, // Set subcategoryId
            }));
          }
        }
        
        // If a category is selected, fetch its subcategories
        if (data.category) {
          fetchSubCategories(data.category.categoryId); // Use categoryId to fetch subcategories
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, categories]); // Make sure categories are available when setting the form data

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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLazyLoading(true);
    let thumbnailUrl = null;
    if (formData.thumbnail) {
      thumbnailUrl = await uploadThumbnailToCloudinary(formData.thumbnail);
    }

    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        sellingPrice: prevFormData.type === "Free" ? 0 : prevFormData.sellingPrice,
        coursePrice: prevFormData.type === "Free" ? 0 : prevFormData.coursePrice,
        subCategoryId: prevFormData.subCategory?.subcategoryId || null,
      };
      return updatedFormData;
    });

    const updatedCourse = {
      draftId: course.draftId,
      ...formData,
      thumbnail: thumbnailUrl,
      mentorId: auth.user.mentorId,
      subCategoryId: formData.subCategory?.subcategoryId || null,
      sellingPrice: formData.type === "Free" ? 0 : formData.sellingPrice,
      coursePrice: formData.type === "Free" ? 0 : formData.coursePrice,
    };
    
    try {
      await axios.put(`${MENTOR_BASE_URL}/draft/${id}`, updatedCourse, {
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${auth.jwt}`, },
      });
      setShowSuccessAlert(true);
      setTimeout(() => navigate("/mentor/courses/all"), 5000);
    } catch (error) {
      console.error("Error updating course:", error);
      setShowErrorAlert(true);
    }
    finally {
      setLazyLoading(false); // Stop loading
    }
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
      }else{
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => {
          const updatedFormData = {
            ...prevFormData,
            thumbnail: reader.result,
            subCategoryId: prevFormData.subCategory?.subcategoryId || null,
          };
          return updatedFormData;
        });
      };
      reader.readAsDataURL(file);
    }
    }
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${ADMIN_BASE_URL}/category`,
          { headers: { Authorization: `Bearer ${auth.jwt}` } });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value,
        subCategoryId: prevFormData.subCategory.subcategoryId,
      };
      return updatedFormData;
    });
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : "This field is required",
    }));
  };
  

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `${ADMIN_BASE_URL}/category/${categoryId}/subcategories`,
        {headers: {Authorization: `Bearer ${auth.jwt}`},},
      );
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSelectCategory = (category) => {
    setFormData({ ...formData, category });
    if (category) fetchSubCategories(category.categoryId);
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
  }, [showSuccessAlert, showErrorAlert]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div className="container mx-auto p-6 m-10 max-w-screen-xl shadow-md pt-10">
      <div ref={alertRef}>
        {showSuccessAlert && <ActionAlerts type="success" />}
        {showErrorAlert && <ActionAlerts type="error" />}
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-center pb-10">
        Update Course
      </h2>
      <div className="flex justify-between mb-4">
        <h1 className="font-bold text-2xl">Details</h1>
        <button
          onClick={() => navigate(`/mentor/courses/all/${id}/update/chapters`)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Chapters
        </button>
      </div>
      <form onSubmit={handleSave}>
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
          <div>
            <label className="block text-gray-700 font-medium">Thumbnail</label>
            <div
              className="relative w-full h-64 bg-cover bg-center rounded mt-1 border"
              style={{
                backgroundImage: formData.thumbnail
                  ? `url(${formData.thumbnail})`
                  : 'url("https://via.placeholder.com/400x300?text=No+Thumbnail")', // Placeholder image if no thumbnail
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-2">{errors.thumbnail}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center p-10">
        {lazyLoading ? (
    <div className="flex justify-center my-4">
      <CircularProgress />
    </div>
  ) : (
          <button
            type="submit"
            disabled={lazyLoading} 
            className="bg-blue-500 text-white px-6 py-3 rounded-full"
          >
            Update Course
          </button>
  )}
        </div>
      </form>
    </div>
  );
};

export default UpdateCourse;

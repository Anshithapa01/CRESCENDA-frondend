import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CourseCard from "../Components/CourseCard/CourseCard";
import CourseSubmissionGuidelinesModal from "./Add/CourseSubmissionGuidelinesModal";
import ConfirmationModal from "./Confirmation/ConfirmationModal";
import { ADMIN_BASE_URL, MENTOR_BASE_URL } from "../../../Config/apiConfig";
import Alert from "../../OtherComponents/Alert";
import CategoryDropdown from "../../OtherComponents/CategoryDropdown";

const AllCourses = () => {
  const navigate = useNavigate();
  const auth = useSelector((store) => store.mentorAuth);
  const [draftCourses, setDraftCourses] = useState([]);

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [filters, setFilters] = useState({
    price: null,
    rating: null,
    chapters: null,
    lectures: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get(
          `${MENTOR_BASE_URL}/draft?mentorId=${auth?.user?.mentorId}`,
          { headers: { Authorization: `Bearer ${auth.jwt}` } }
        );
        setDraftCourses(response.data);
      } catch (error) {
        console.error("Error fetching draft courses:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${ADMIN_BASE_URL}/category`, {
          headers: { Authorization: `Bearer ${auth.jwt}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (auth?.user?.mentorId) {
      fetchDrafts();
      fetchCategories();
    }
  }, [auth?.user?.mentorId]);

  const handleDeleteConfirm = async () => {
    console.log(selectedCourseId);

    try {
      await axios.delete(`${MENTOR_BASE_URL}/draft/${selectedCourseId}`, {
        headers: { Authorization: `Bearer ${auth.jwt}` },
      });
      setDraftCourses((prev) =>
        prev.filter((course) => course.draftId !== selectedCourseId)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handlePublishConfirm = async (draftId) => {
    try {
      // Fetch chapters for the selected draft
      const chaptersResponse = await axios.get(
        `${MENTOR_BASE_URL}/draft/chapters/${draftId}`,
        {
          headers: { Authorization: `Bearer ${auth.jwt}` },
        }
      );

      const chapters = chaptersResponse.data;

      // Check if there are at least 3 chapters
      if (chapters.length < 3) {
        setAlert({
          message: "A course must have at least 3 chapters before publishing.",
          status: "error",
        });
        setShowAlert(true);
        return; // Stop further execution
      }

      // Validate each chapter for materials
      for (const chapter of chapters) {
        const materialsResponse = await axios.get(
          `${MENTOR_BASE_URL}/draft/chapter/material/${chapter.chapterId}`,
          {
            headers: { Authorization: `Bearer ${auth.jwt}` },
          }
        );

        const materials = materialsResponse.data;

        if (materials.length < 2) {
          setAlert({
            message:
              "Each chapter must have at least 2 materials before publishing.",
            status: "error",
          });
          setShowAlert(true);
          return; // Stop further execution
        }
      }

      // All conditions satisfied, proceed to publish
      await axios.post(
        `${MENTOR_BASE_URL}/draft/${draftId}/publish`,
        {},
        { headers: { Authorization: `Bearer ${auth.jwt}` } }
      );

      setAlert({
        message: "Course successfully published.",
        status: "success",
      });
      setShowAlert(true);

      const updatedCourses = await axios.get(
        `${MENTOR_BASE_URL}/draft?mentorId=${auth?.user?.mentorId}`,
        { headers: { Authorization: `Bearer ${auth.jwt}` } }
      );
      setDraftCourses(updatedCourses.data);
      
    } catch (error) {
      setAlert({
        message: "An error occurred while publishing the course.",
        status: "error",
      });
      setShowAlert(true);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory("");
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `${ADMIN_BASE_URL}/category/${category.categoryId}/subcategories`,
          { headers: { Authorization: `Bearer ${auth.jwt}` } }
        );
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    if (category) {
      fetchSubcategories();
    }
  };

  // Filter courses based on search term, filters, and categories
  useEffect(() => {
    const filtered = draftCourses.filter((course) => {
      const matchesSearch = searchTerm
        ? course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? course.subCategory.catetoryName === selectedCategory.categoryName
        : true;

      const matchesSubcategory = selectedSubcategory
        ? course.subCategory.subcategoryName ===
          selectedSubcategory.subcategoryName
        : true;

      const matchesPrice = filters.price
        ? filters.price.min <= course.sellingPrice &&
          course.sellingPrice <= filters.price.max
        : true;

      const matchesRating = filters.rating
        ? course.rating >= filters.rating
        : true;

      const matchesChapters = filters.chapters
        ? filters.chapters.min <= course.chaptersCount &&
          course.chaptersCount <= filters.chapters.max
        : true;

      const matchesLectures = filters.lectures
        ? filters.lectures.min <= course.materialsCount &&
          course.materialsCount <= filters.lectures.max
        : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesPrice &&
        matchesRating &&
        matchesChapters &&
        matchesLectures
      );
    });

    setFilteredCourses(filtered);
  }, [
    searchTerm,
    selectedCategory,
    selectedSubcategory,
    filters,
    draftCourses,
  ]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  // Pagination
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleMenuToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  const modalCloseHandler = () => {
    setIsModalOpen(false);
    navigate("/mentor/courses/all/add");
  };
  const modalCancelHandler=()=>{
    setIsModalOpen(false);
  }

  const handleSubCategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory)
  };

  return (
    <div className="p-5 grid grid-cols-4 gap-4">
      {/* Left Section: Courses and Add Button */}
      <div className="col-span-3 space-y-4">
        {showAlert && (
          <Alert
            message={alert.message}
            status={alert.status}
            onClose={() => {
              setShowAlert(false);
              setAlert({ message: "", status: "" });
            }}
          />
        )}
  
        <div className="mb-4 flex justify-between">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-300 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded"
        >
          Add Course
        </button>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-3/4 py-2 px-4 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
  
        <div className="">
                
          {paginatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {
                paginatedCourses.map((course) => (
                  <CourseCard
                    key={course.draftId}
                    course={course}
                    menuItems={[
                      course.status !== "pending" &&
                        course.status !== "rejected" && {
                          label: "Publish",
                          onClick: () => {
                            setSelectedCourseId(course.draftId);
                            handlePublishConfirm(course.draftId);
                          },
                        },
                      course.status !== "pending" && {
                        label: "Delete",
                        onClick: () => {
                          setShowDeleteModal(true);
                          setSelectedCourseId(course.draftId);
                        },
                      },
                      {
                        label: "View",
                        onClick: () =>
                          navigate(`/mentor/courses/all/${course.draftId}/view`),
                      },
                      course.status !== "pending" &&
                        course.status !== "rejected" && {
                          label: "Update",
                          onClick: () =>
                            navigate(`/mentor/courses/all/${course.draftId}/update`),
                        },
                    ].filter(Boolean)} // Remove null/undefined entries
                    onMenuClose={handleMenuClose}
                    openMenuId={openMenuId}
                    index={course.draftId}
                    onMenuToggle={handleMenuToggle}
                  />
                ))
              }
            </div>
          ) : (
            <div className="flex justify-center h-full pt-44">
              <p className="text-lg font-semibold text-gray-700">
                  No courses found!
            </p>
            </div> // Add a fallback UI for better UX
          )}
        

        </div>
  
        <div className="flex justify-center mt-6">
          {/* Pagination */}
          {totalPages>0 && (
            <div className="flex space-x-2 mt-12">
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === page + 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
  
      {/* Right Section: Filters */}
      <div className="col-span-1 bg-white p-4 rounded-lg shadow">
        <h3 className="font-bold mb-4 text-xl">Filters</h3>
        <div className="space-y-4">
          {/* Category Filter */}
          <CategoryDropdown
            label="Category"
            options={categories}
            selectedOption={selectedCategory}
            onSelect={handleCategoryChange}
            displayField="categoryName"
          />
  
          {/* Subcategory Filter */}
          {subcategories.length > 0 && (
            <CategoryDropdown
              label="Subcategory"
              options={subcategories}
              selectedOption={selectedSubcategory}
              onSelect={handleSubCategorySelect}
              displayField="subcategoryName"
            />
          )}
  
          {/* Price Filter */}
          <h4 className="mb-1">Price</h4>
          <select
            onChange={(e) => {
              const priceRange = e.target.value
                ? JSON.parse(e.target.value)
                : null;
              handleFilterChange("price", priceRange);
            }}
            className="w-full py-2 px-4 rounded-lg border"
          >
            <option value="">All Prices</option>
            <option value='{"min":0,"max":500}'>0 - 500</option>
            <option value='{"min":500,"max":1000}'>500 - 1000</option>
            <option value='{"min":1000,"max":5000}'>1000 - 5000</option>
          </select>
  
          <h4 className="mb-1">Chapters</h4>
          <select
            className="w-full py-2 px-4 rounded-lg border"
            onChange={(e) => {
              const chaptersRange = e.target.value
                ? JSON.parse(e.target.value)
                : null;
              handleFilterChange("chapters", chaptersRange);
            }}
          >
            <option value="">All Chapters</option>
            <option value='{"min":0,"max":5}'>5 and below</option>
            <option value='{"min":6,"max":10}'>6 - 10</option>
            <option value='{"min":11,"max":15}'>11 - 15</option>
            <option value='{"min":16,"max":Infinity}'>Above 15</option>
          </select>

          <h4 className="mb-1">Lectures</h4>
          <select
            className="w-full py-2 px-4 rounded-lg border"
            onChange={(e) => {
              const lecturesRange = e.target.value
                ? JSON.parse(e.target.value)
                : null;
              handleFilterChange("lectures", lecturesRange);
            }}
          >
            <option value="">All Lectures</option>
            <option value='{"min":0,"max":10}'>10 and below</option>
            <option value='{"min":11,"max":20}'>11 - 20</option>
            <option value='{"min":21,"max":Infinity}'>Above 20</option>
          </select>

          <h4 className="mb-1">Rating</h4>
          <select
            className="w-full py-2 px-4 rounded-lg border"
            onChange={(e) =>
              handleFilterChange("rating", parseInt(e.target.value, 10))
            }
          >
            <option value="">All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars & Up</option>
            <option value={3}>3 Stars & Up</option>
          </select>
        </div>
      </div>
      <ConfirmationModal
        type="delete"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />

      <CourseSubmissionGuidelinesModal
        showModal={isModalOpen}
        onClose={modalCloseHandler}
        onCancel={modalCancelHandler}
      />
    </div>
  );
  
};

export default AllCourses;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../Components/CourseCard/CourseCard";
import ConfirmationModal from "./Confirmation/ConfirmationModal";
import CourseSubmissionGuidelinesModal from "./Add/CourseSubmissionGuidelinesModal";
import { useSelector } from "react-redux";
import axios from "axios";
import { ADMIN_BASE_URL, MENTOR_BASE_URL } from "../../../Config/apiConfig";
import CategoryDropdown from "../../OtherComponents/CategoryDropdown";
import { deleteCourse, fetchAllCourses } from "../../../Utility/Course";
import { fetchAllDrafts } from "../../../Utility/Draft";

const ActiveCourses = () => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = useSelector((store) => store.mentorAuth);
  const [originalCourse,setOriginalCourse]=useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  
  const [filters, setFilters] = useState({
    price: null,
    rating: null,
    chapters: null,
    lectures: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // const fetchApprovedDrafts = async () => {
    //     fetchAllDrafts(auth.jwt,auth?.user?.mentorId).then(data=>{
    //       setCourses(data);
    //       setFilteredCourses(data);
    //       console.log(data);        
    //     })       
    // };

    const fetchApprovedDrafts = async () => {
    // fetchAllCourses().then((data) => {
    //   setOriginalCourse(data);
    // });

    const courses = await fetchAllCourses();
    const drafts = await fetchAllDrafts(auth.jwt, auth?.user?.mentorId);
    const filteredData = drafts.filter((draft) => {
      const matchingCourse = courses.find((course) => course.draft.draftId === draft.draftId);
      if (!matchingCourse) {
        draft.isBlocked = true;
      }
      return true; 
    });
    setCourses(filteredData);
    setFilteredCourses(filteredData);
    }

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
      fetchApprovedDrafts();
    }
    fetchCategories();
  }, [auth?.user?.mentorId]);

  // Filter courses based on search term, category, subcategory, and other filters
  useEffect(() => {
    const filtered = courses.filter((course) => {
      const matchesSearch = searchTerm
        ? course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? course.subCategory.catetoryName === selectedCategory.categoryName
        : true;
      
      const matchesSubcategory = selectedSubcategory
        ? course.subCategory.subcategoryName === selectedSubcategory.subcategoryName
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
    courses,
  ]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(""); // Reset subcategory when category changes
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `${ADMIN_BASE_URL}/category/${category.categoryId}/subcategories`,{
            headers: { Authorization: `Bearer ${auth.jwt}` },
          });
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    if (category) {
      fetchSubcategories();
    }
  };

  const handleSubCategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory)
  };

  const handleDeleteConfirm = () => {
    console.log("Item deleted",selectedCourseId);
    deleteCourse(auth.jwt,selectedCourseId)
    setShowDeleteModal(false);
  };

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

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const modalCancelHandler=()=>{
    setIsModalOpen(false);
  }

  return (
    <div className="min-h-screen p-5 flex">
      {/* Courses Section */}
      <div className="flex-1">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 px-4 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {paginatedCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginatedCourses.map((course) => (
              <CourseCard
                key={course.draftId}
                course={course}
                menuItems={[
                  {
                    label: "View",
                    onClick: () =>
                      navigate(`/mentor/courses/active/${course.draftId}/view`),
                  },
                  !course.isBlocked &&
                  { label: "Delete", onClick: () =>{ setShowDeleteModal(true); setSelectedCourseId(course.draftId);}},
                ]}
                onMenuClose={handleMenuClose}
                openMenuId={openMenuId}
                index={course.draftId}
                onMenuToggle={handleMenuToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center pt-20">
            <p className="text-lg font-semibold text-gray-700">
              No courses found. Add a course to start earning!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 text-white mt-4 py-2 px-4 rounded-md"
            >
              Add Course
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages>0  && (
          <div className="flex justify-center mt-12">
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

      {/* Filters Section */}
      <div className="flex gap-6 p-4 w-1/4">
        {/* Filters */}
        <div className="w-full bg-white p-4 rounded-lg shadow">
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
      </div>

      <ConfirmationModal
        type="delete"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
      <CourseSubmissionGuidelinesModal
        isOpen={isModalOpen}
        onClose={modalCloseHandler}
        onCancel={modalCancelHandler}
      />
    </div>
  );
};

export default ActiveCourses;

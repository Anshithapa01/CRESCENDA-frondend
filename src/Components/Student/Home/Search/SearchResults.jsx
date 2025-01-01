import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../../../OtherComponents/Card/CourseCard";
import { useSelector } from "react-redux";
import CategoryDropdown from "../../../OtherComponents/CategoryDropdown";
import { fetchAllCourses } from "../../../../Utility/Course";
import { fetchCategory } from "../../../../Utility/Category";
import { fetchSubCategory } from "../../../../Utility/SubCategory";

const SearchResults = () => {
  const auth = useSelector((store) => store.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    rating: 0,
    chapters: null,
    lectures: null,
    price: null,
    category: null, 
    subcategory: null, 
  });
  const [categories, setCategories] = useState([]); 
  const [subCategories, setSubCategories] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    setSearchTerm(query); 
  }, [query]);

   useEffect(() => {
        getCourses();
        loadCategories()
  }, []);

  const getCourses = async () => {      
    try {
      const data = await fetchAllCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategory();
      setCategories(data); // Set the displayed list
    } catch (error) {
      console.error("Error fetching categories:", error);
    }}

  // Fetch subcategories for a selected category
  const loadSubCategories = async (categoryId) => {
    try {
      const data = await fetchSubCategory(categoryId);
      setSubCategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Filter courses based on searchTerm, filters, and selected categories
  useEffect(() => {
    const filtered = courses.filter((course) => {
      const matchesQuery = searchTerm
        ? course.draft.courseName.toLowerCase().includes(searchTerm) ||
          course.draft.courseDescription.toLowerCase().includes(searchTerm)
        : true;

      const matchesRating =
        filters.rating > 0 ? course.draft.rating >= filters.rating : true;

      const matchesChapters = filters.chapters
        ? filters.chapters.min <= course.draft.chaptersCount &&
          course.draft.chaptersCount <= filters.chapters.max
        : true;

      const matchesLectures = filters.lectures
        ? filters.lectures.min <= course.draft.materialsCount &&
          course.draft.materialsCount <= filters.lectures.max
        : true;

      const matchesPrice = filters.price
        ? filters.price.min <= course.draft.sellingPrice &&
          course.draft.sellingPrice <= filters.price.max
        : true;

      const matchesCategory = filters.category?.categoryName
        ? course.draft?.subCategory.catetoryName === filters.category.categoryName
        : true;

      const matchesSubCategory = filters.subcategory?.subcategoryName
        ? course.draft.subCategory.subcategoryName === filters.subcategory.subcategoryName
        : true;
        
      return (
        matchesQuery &&
        matchesRating &&
        matchesChapters &&
        matchesLectures &&
        matchesPrice &&
        matchesCategory &&
        matchesSubCategory
      );
    });

    setFilteredCourses(filtered);
  }, [courses, searchTerm, filters]);

  const handleCardClick = (draftId) => {
    navigate(`/course/${draftId}`);
  };

  const handleSearch = () => {
    navigate(`/search?query=${searchTerm}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleCategorySelect = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: category || null,
      subcategory: null, 
    }));
    if (category) loadSubCategories(category.categoryId);
    else setSubCategories([]);
  };

  const handleSubCategorySelect = (subcategory) => {
    setFilters((prev) => ({
      ...prev,
      subcategory: subcategory || null,
    }));
  };

  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  return (
    <div className="p-6 bg-gray-50">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 py-3 px-4 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            className="py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Search
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex gap-6">
        {/* Filters */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-4 text-xl">Filters</h3>

          {/* Category Filter */}
          <CategoryDropdown
            label="Category"
            options={categories}
            selectedOption={filters.category}
            onSelect={handleCategorySelect}
            displayField="categoryName"
          />

          {/* Subcategory Filter */}
          {subCategories.length > 0 && (
            <CategoryDropdown
              label="Subcategory"
              options={subCategories}
              selectedOption={filters.subcategory}
              onSelect={handleSubCategorySelect}
              displayField="subcategoryName"
            />
          )}

          {/* Rating Filter */}
          <div className="mb-6">
            <h4 className="font-bold mb-2">Rating</h4>
            <select
              className="w-full py-2 px-3 rounded-lg border"
              onChange={(e) =>
                handleFilterChange("rating", parseInt(e.target.value, 10))
              }
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars & Up</option>
              <option value={3}>3 Stars & Up</option>
            </select>
          </div>

          {/* Number of Chapters Filter */}
          <div className="mb-6">
            <h4 className="font-bold mb-2">Number of Chapters</h4>
            <select
                className="w-full py-2 px-3 rounded-lg border"
                onChange={(e) => {
                const selectedRange = e.target.value ? JSON.parse(e.target.value) : null;
                handleFilterChange("chapters", selectedRange);
                }}
            >
            <option value="">All Chapters</option>
            <option value='{"min":0,"max":5}'>5 and below</option>
            <option value='{"min":6,"max":10}'>5 - 10</option>
            <option value='{"min":11,"max":15}'>10 - 15</option>
            <option value='{"min":16,"max":20}'>15 - 20</option>
                <option value='{"min":21,"max":Infinity}'>Above 20</option>
            </select>
         </div>

        {/* Number of Lectures Filter */}
        <div className="mb-6">
        <h4 className="font-bold mb-2">Number of Lectures</h4>
        <select
            className="w-full py-2 px-3 rounded-lg border"
            onChange={(e) => {
            const selectedRange = e.target.value ? JSON.parse(e.target.value) : null;
            handleFilterChange("lectures", selectedRange);
            }}
        >
            <option value="">All Lectures</option>
            <option value='{"min":0,"max":10}'>Below 10</option>
            <option value='{"min":10,"max":20}'>10 - 20</option>
            <option value='{"min":20,"max":30}'>20 - 30</option>
            <option value='{"min":30,"max":40}'>30 - 40</option>
            <option value='{"min":40,"max":50}'>40 - 50</option>
            <option value='{"min":51,"max":Infinity}'>50 and above</option>
        </select>
        </div>


          {/* Price Filter */}
          <div className="mb-6">
            <h4 className="font-bold mb-2">Price</h4>
            <select
              className="w-full py-2 px-3 rounded-lg border"
              onChange={(e) => {
                const priceRange = e.target.value
                  ? JSON.parse(e.target.value)
                  : null;
                handleFilterChange("price", priceRange);
              }}
            >
              <option value="">All Prices</option>
              <option value='{"min":0,"max":500}'>0 - 500</option>
              <option value='{"min":500,"max":1000}'>500 - 1000</option>
              <option value='{"min":1000,"max":2000}'>1000 - 2000</option>
              <option value='{"min":2000,"max":3000}'>2000 - 3000</option>
              <option value='{"min":4000,"max":5000}'>4000 - 5000</option>
              <option value='{"min":5001,"max":Infinity}'>Above 5000</option>
            </select>
          </div>
        
        </div>

        {/* Results and Pagination */}
        <div className="w-3/4">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          {paginatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedCourses.map((course) => (
                <CourseCard onClick={() => handleCardClick(course.draft.draftId)} key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-lg">No courses found for "{searchTerm}".</p>
          )}

          {/* Pagination */}
          {totalPages  && (
            <div className="flex justify-center mt-6">
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
    </div>
  );
};

export default SearchResults;

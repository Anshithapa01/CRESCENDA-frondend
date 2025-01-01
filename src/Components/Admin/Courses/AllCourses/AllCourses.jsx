import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { fetchAllCourses } from "../../../../Utility/Course";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const auth = useSelector((store) => store.adminAuth);
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {      
      try {
        const data = await fetchAllCourses(auth.adminJwt);
        setCourses(data);
        setFilteredCourses(data); 
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
  
    getCourses();
  }, [auth.adminJwt]);
  

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter courses based on search term
    const filtered = courses.filter(
      (course) =>
        course.draft.courseName.toLowerCase().includes(value) ||
        course.draft.courseDescription.toLowerCase().includes(value)
    );
    setFilteredCourses(filtered);
  };

  // Handle navigation
  const handleCardClick = (draftId) => {
    navigate(`/admin/courses/all/${draftId}/view`);
  };

  // Define table columns
  const columns = [
    {
      name: "Thumbnail",
      selector: (row) => (
        <img
          src={row.draft.thumbnailUrl || "placeholder.jpg"}
          alt="Course Thumbnail"
          className="w-16 h-16"
        />
      ),
      sortable: false,
      width: "100px",
    },
    {
      name: "Course Name",
      selector: (row) => row.draft.courseName,
      sortable: true,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => row.draft.courseDescription,
      sortable: true,
      width: "200px",
    },
    {
      name: "Tutor",
      selector: (row) => row.draft.mentorName,
      sortable: true,
      width: "140px",
    },
    {
      name: "Price",
      selector: (row) => `₹${row.draft.coursePrice}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Sale Price",
      selector: (row) => `₹${row.draft.sellingPrice}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Created Date",
      selector: (row) =>
        new Date(row.draft.addedDate).toLocaleDateString(),
      sortable: true,
      width: "150px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            onClick={() => handleCardClick(row.draft.draftId)}
            className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
          >
            View
          </button>
          {/* <button className="px-3 py-1 bg-red-500 text-white rounded">
            Delete
          </button> */}
        </div>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="p-4">
  <h1 className="text-2xl font-bold mb-4">All Courses</h1>

  {/* Search Bar */}
  <div className="mb-4">
    <input
      type="text"
      placeholder="Search by course name or description..."
      value={searchTerm}
      onChange={handleSearch}
      className="border rounded px-3 py-2 w-full"
    />
  </div>

  {/* Data Table */}
  <div className="w-3/4">
      <DataTable
        columns={columns}
        data={filteredCourses}
        pagination
        highlightOnHover
        striped
        responsive={false}
        customStyles={{
          table: {
            style: {
              width: "100%", // Stretch table to container width
              minWidth: "1200px", // Force a minimum table width for proper scrolling
            },
          },
          headCells: {
            style: {
              backgroundColor: "#f9fafb",
              fontWeight: "bold",
              color: "#4b5563",
              textTransform: "uppercase",
            },
          },
          rows: {
            style: {
              minHeight: "56px", // Adjust row height
            },
          },
          cells: {
            style: {
              padding: "8px", // Adjust padding
            },
          },
        }}
        noDataComponent="No courses found."
      />
  </div>
</div>



  );
};

export default AllCourses;

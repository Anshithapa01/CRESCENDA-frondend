import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../../../Config/apiConfig";
import { fetchStudents, updateBlockStatus } from "../../../Utility/Student";
import Alert from "../../OtherComponents/Alert";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState({ message: "", status: "" });

  const auth = useSelector((store) => store.adminAuth);

  // Fetch students from backend
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const studentsData = await fetchStudents(auth.adminJwt);
        setStudents(studentsData);
        console.log('studentsData',studentsData);
        
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStudents();
  }, [auth.adminJwt]);
  

  // Handle search
  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = students.filter(
      (student) =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(lowerCaseSearch) ||
        student.emailId.toLowerCase().includes(lowerCaseSearch) ||
        student.phoneNumber.includes(lowerCaseSearch)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Toggle block/unblock functionality
  const toggleBlockStatus = async (studentId, isBlocked) => {
    try {
      await updateBlockStatus (studentId,isBlocked, auth.adminJwt);
  
      // Update local state
      const updatedStudents = students.map((student) =>
        student.studentId === studentId ? { ...student, isBlocked: !isBlocked } : student
      );
      console.log(updatedStudents);
      
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      setAlert({
        message: `Student ${isBlocked ? "unblocked" : "blocked"} successfully.`,
        status: "success",
      });
      setShowAlert(true);
    } catch (error) {
      setAlert({
        message: `Failed to ${isBlocked ? "unblock" : "block"} student.`,
        status: "error",
      });
      setShowAlert(true);
      console.error("Error toggling block status:", error);
    }
  };
  

  // Define columns
  const columns = [
    {
      name: "Full Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: (row) => row.emailId,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
    },
    {
      name: "Enrolled Courses",
      selector: () => 0, // Currently, course purchases are not implemented
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => toggleBlockStatus(row.studentId, row.isBlocked)}
          style={{
            backgroundColor: row.isBlocked ? "green" : "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          {row.isBlocked ? "Unblock" : "Block"}
        </button>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="container mx-auto mt-5 p-10">
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredStudents}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default StudentList;

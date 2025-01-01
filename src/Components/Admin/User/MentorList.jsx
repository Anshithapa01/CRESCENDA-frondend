import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import Alert from "../../OtherComponents/Alert";
import { changeBlockStatus, fetchMentors } from "../../../Utility/Mentor";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });

  const auth = useSelector((store) => store.adminAuth);

  // Fetch mentors from backend
  useEffect(() => {
    const fetchAllMentors = async () => {
      try {
        const mentorsData = await fetchMentors(auth.adminJwt);
        setMentors(mentorsData);
        setFilteredMentors(mentorsData);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMentors();
  }, [auth.adminJwt]);
  

  // Handle block/unblock toggle
  const toggleBlockStatus = async (mentorId, isBlocked) => {
    try {
      await changeBlockStatus(mentorId, isBlocked, auth.adminJwt);
  
      // Update local state to reflect the change
      const updatedMentors = mentors.map((mentor) =>
        mentor.mentorId === mentorId ? { ...mentor, isBlocked: !isBlocked } : mentor
      );
      setMentors(updatedMentors);
      setFilteredMentors(updatedMentors);
  
      setAlert({
        message: `Mentor ${isBlocked ? "unblocked" : "blocked"} successfully.`,
        status: "success",
      });
      setShowAlert(true);
    } catch (error) {
      setAlert({
        message: `Failed to ${isBlocked ? "unblock" : "block"} mentor.`,
        status: "error",
      });
      setShowAlert(true);
      console.error("Error toggling block status:", error);
    }
  };
  

  // Handle search functionality
  useEffect(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = mentors.filter(
      (mentor) =>
        `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(lowerCaseSearch) ||
        mentor.emailId.toLowerCase().includes(lowerCaseSearch) ||
        (mentor.headLine && mentor.headLine.toLowerCase().includes(lowerCaseSearch))
    );
    setFilteredMentors(filtered);
  }, [searchTerm, mentors]);

  // Define columns for the DataTable
  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: (row) => row.emailId,
      sortable: true,
    },
    {
      name: "Headline",
      selector: (row) => row.headLine || "N/A",
    },
    {
      name: "Courses",
      selector: (row) => (row.drafts ? row.drafts.length : 0),
    },
    {
      name: "Qualification",
      selector: (row) => row.highestQualification || "N/A",
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => toggleBlockStatus(row.mentorId, row.isBlocked)}
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
        <h1 className="text-2xl font-bold">Mentor List</h1>
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
        data={filteredMentors}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default MentorList;

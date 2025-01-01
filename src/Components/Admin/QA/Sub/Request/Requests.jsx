import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { ADMIN_BASE_URL, MENTOR_BASE_URL, QA_BASE_URL } from "../../../../../Config/apiConfig";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompletedTasksData } from "../../../../../Utility/Task";
import { publishCourse, rejectTask, sendToUpdate } from "../../../../../Utility/Course";


const Requests = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null); // To track open dropdown
  const auth = useSelector((store) => store.qaAuth);
  const adminAuth = useSelector((store) => store.adminAuth);
  const navigate=useNavigate()


  const buttonRef = useRef(null);
  
  const fetchCompletedTasks = async () => {
    try {
      const response = await fetchCompletedTasksData(auth.qaJwt);
      console.log(response);
      setData(response || []);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);
  

  const renderDropdown = (row, buttonRef) => {
    if (!buttonRef.current) return null;
  
    const { top, left, height } = buttonRef.current.getBoundingClientRect();
  
    const dropdownContent = (
      <div
        style={{
          position: "absolute",
          top: `${top + height + window.scrollY}px`, // Position below the button
          left: `${left}px`, // Align with the button
          zIndex: 9999, // Ensure it appears above everything
        }}
        className="w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1" role="menu">
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleAction("publish", row.taskId)}
          >
            Publish
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleAction("reject", row.taskId)}
          >
            Reject
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleAction("sendToUpdate", row.taskId)}
          >
            Send to Update
          </button>
        </div>
      </div>
    );
  
    return ReactDOM.createPortal(dropdownContent, document.body);
  };
  
  

  const handleAction = async (action, taskid) => {
    switch (action) {
      case "publish":
        console.log("Publishing course:", taskid);
        try {
          const response = await publishCourse(adminAuth.adminJwt, taskid);
          console.log("Course published successfully:", response);
        } catch (error) {
          console.error("Error publishing course:", error);
        }
        break;
      case "reject":
        console.log("Rejecting course:", taskid);
        try {
          const response = await rejectTask(auth.qaJwt, taskid);
          console.log(response);
        } catch (error) {
          console.error("Error rejecting task:", error);
        }
        break;
      case "sendToUpdate":
        try {
          const response = await sendToUpdate(auth.qaJwt, taskid);
          console.log(response);
        } catch (error) {
          console.error("Error sending to update:", error);
        }
        break;
      default:
        console.log("Unknown action:", action);
    }
    setDropdownOpen(null); // Close dropdown after action
    fetchCompletedTasks();
  };
  

  const columns = [
    {
      name: "Thumbnail",
      cell: (row) => <img src={row.thumbnailUrl} alt="Thumbnail" width="50" />,
      width: "80px",
    },
    {
      name: "Course Name",
      selector: (row) => row.courseName,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.courseDescription,
    },
    {
      name: "Chapters",
      selector: (row) => row.chapterCount,
      sortable: true,
      width: "100px",
    },
    {
      name: "Materials",
      selector: (row) => row.materialCount,
      sortable: true,
      width: "100px",
    },
    {
      name: "Added At",
      selector: (row) => row.addedDate,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`font-bold ${
            row.status === "approved" ? "text-green-600" : "text-red-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
        name: "Action",
        cell: (row) => (
          <div>
            <button
              onClick={() => viewCourse(row.draftId)}
              style={{
                marginRight: "10px",
                backgroundColor: "orange",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              View
            </button>
            <div className="relative inline-block text-left">
              <button
              ref={buttonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((prev) =>
                    prev === row.taskId ? null : row.taskId
                  );
                }}
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Actions ▼
              </button>
              {dropdownOpen === row.taskId && renderDropdown(row,buttonRef)}
            </div>
          </div>
        ),
        width: "300px",
      }
      
  ];

  const viewCourse = (id) => {
    navigate(`/admin/qa/request/${id}`)
  };

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Course List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <div className="text-center mt-5">
          <h2 className="text-lg font-medium">No Requests Available</h2>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data || []}
          pagination
          highlightOnHover
          striped
        />
      )}
    </div>
  );
};

export default Requests;

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { QA_BASE_URL } from "../../../../Config/apiConfig";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../OtherComponents/Alert";

const QAList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: '', status: '' });
  const auth=useSelector(store=>store.qaAuth)
  const navigate=useNavigate();
  const location = useLocation();

  useEffect(() => {
      if (location.state?.alert) {
        console.log(location.state?.alert);
        
        setAlert(location.state.alert);
        setShowAlert(true);
        window.history.replaceState({}, document.title);
      }
    }, [location.state]); 

  // Fetch data from backend
  useEffect(() => {
    const fetchQAs = async () => {
      try {
        const response = await axios.get(`${QA_BASE_URL}`,{
            headers: { Authorization: `Bearer ${auth.qaJwt}` },
          });
        console.log(response.data);
        
        setData(response.data);
      } catch (error) {
        console.error("Error fetching QA data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQAs();
  }, []);

  const toggleBlockStatus = async (id, isBlocked) => {
    try {
      const url = `${QA_BASE_URL}/${id}/${isBlocked ? "unblock" : "block"}`;
      await axios.put(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${auth.qaJwt}` },
        }
      );

      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, isBlocked: !isBlocked } : item
        )
      );

      setAlert({
        message: `QA ${isBlocked ? "unblocked" : "blocked"} successfully.`,
        status: "success",
      });
      setShowAlert(true);
    } catch (error) {
      setAlert({
        message: `Failed to ${isBlocked ? "unblock" : "block"} QA.`,
        status: "error",
      });
      setShowAlert(true);
      console.error("Error toggling block status:", error);
    }
  };

  // Define columns for the DataTable
  const columns = [
    {
      name: "Full Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Email ID",
      selector: (row) => row.emailId,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
    },
    {
      name: "Role",
      selector: (row) => row.role,
    },
    {
      name: "Qualification",
      selector: (row) => row.qualification,
    },
    {
      name: "Experience",
      selector: (row) => `${row.experience} years`,
    },
    {
      name: "Date of Join",
      selector: (row) => row.dateOfJoin,
      sortable: true,
    },
    {
      name: "QA Lead",
      selector: (row) => row.lead?.firstName,
      sortable: true,
    },
    {
      name: "Task Count",
      selector: (row) => row.taskCount,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            onClick={() => toggleBlockStatus(row.qaId, row.isBlocked)}
            style={{
              marginRight: "10px",
              backgroundColor: row.isBlocked ? "green" : "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            {row.isBlocked ? "Unblock" : "Block"}
          </button>
          <button
            onClick={() => navigate(`/admin/qa/qateam/${row.qaId}`, { state: { qaData: row } })}
            style={{
              backgroundColor: "orange",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Update
        </button>

        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <div className="container mx-auto mt-5">
      {showAlert && (
        <Alert
          message={alert.message}
          status={alert.status}
          onClose={() => {
            setShowAlert(false);
            setAlert({ message: '', status: '' });
          }}
        />
      )}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4 ml-2">QA Specialist List</h1>
        <button 
        className="bg-orange-500 hover:bg-orange-600 p-5 rounded-lg mr-10"
        onClick={()=>navigate('/admin/qa/qateam/add')}>Add +</button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default QAList;

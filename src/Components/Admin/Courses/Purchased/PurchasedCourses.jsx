import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchAllPurchases } from "../../../../Utility/Enrollments";

// PurchasedCourses.jsx
const PurchasedCourses = () => {
  const auth = useSelector((store) => store.adminAuth);
  const [purchases,setPurchases]=useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllPurchases(auth.adminJwt);
        console.log(response);
        setPurchases(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (auth.adminJwt && auth.user) {
      fetchData();
    }
  }, [auth.adminJwt, auth.user]);
  

  const columns = [
    {
      name: "Payment Id",
      selector: row => row.purchaseId,
      sortable: true,
    },
    {
      name: "Thumbnail",
      selector: row => <img src={row.thumbnailUrl} alt="Course" className="w-16 h-10 rounded" />,
      sortable: false,
      style: { padding: "18px" }
    },
    {
      name: "Course Name",
      selector: row => row.courseName,
      sortable: true,
    },
    {
      name: "Customer",
      selector: row => row.customerName,
      sortable: true,
    },
    {
      name: "Purchase Date",
      selector: row => new Date(row.enrollmentDate).toLocaleString(),
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: row => `₹${row.amount.toFixed(2)}`,
      sortable: true,
    },
  ];

    return (
      <div className="overflow-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 m-10 p-5">
            <DataTable
              columns={columns}
              data={purchases} // Pass the purchases data here
              pagination // Add pagination
              highlightOnHover // Highlight rows on hover
            />
          </div>
      </div>
    );
  };
  
  export default PurchasedCourses;
  
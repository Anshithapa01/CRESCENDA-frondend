import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchDailyTotals, fetchDashboard, fetchTopSelling } from "../../../Utility/AdminDashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const auth = useSelector((store) => store.adminAuth);

  // State for API Data
  const [dashboardData, setDashboardData] = useState({});
  const [topSellingCourses, setTopSellingCourses] = useState([]);
  const [viewType, setViewType] = useState("weekly"); // Set initial view type to 'weekly'

  // Get the current date and other constants
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth(); // Current month index

  const [graphData, setGraphData] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (viewType === "custom" && fromDate && toDate) {
      const formattedFromDate = `${fromDate}T00:00:00`;
      const formattedToDate = `${toDate}T23:59:59`; 
      const fetchEarnings = async () => {
        try {
          const data = await fetchDailyTotals(auth.adminJwt, formattedFromDate, formattedToDate);
          const labels = data.map((entry) => entry.day);
          const earnings = data.map((entry) => entry.totalAmount);
  
          setGraphData({
            labels,
            datasets: [
              {
                label: "Custom Date Earnings",
                data: earnings,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                tension: 0.3, // Smooth line
                pointBackgroundColor: "rgb(255, 99, 132)",
                pointBorderWidth: 2,
              },
            ],
          });
        } catch (error) {
          console.error("Error fetching earnings data:", error);
        }
      };
  
      fetchEarnings();
    }
  }, [fromDate, toDate]);
  

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const rotatedLabels = months.slice(10, currentMonthIndex + 1); // For Monthly, Nov 2024 to current month

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetchDashboard(auth.adminJwt);
        console.log(response);
        setDashboardData(response);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    const fetchTopSellingCourses = async () => {
      try {
        const response = await fetchTopSelling(auth.adminJwt);
        console.log(response);
        setTopSellingCourses(response);
      } catch (error) {
        console.error("Error fetching top-selling courses:", error);
      }
    };
  
    fetchDashboardData();
    fetchTopSellingCourses();
  }, [auth.adminJwt]);
  

  // Weekly data (last 7 days)
  const getWeeklyData = () => {
    const labels = dashboardData.weeklyData
      ? dashboardData.weeklyData.map((entry) => entry.day.trim())
      : [];
    const data = dashboardData.weeklyData
      ? dashboardData.weeklyData.map((entry) => entry.amount)
      : [];
    return { labels, data };
  };

  // Monthly data (Nov 2024 to current month)
  const getMonthlyData = () => {
    const labels = dashboardData.monthlyData
      ? dashboardData.monthlyData.map((entry) => months[entry.month - 1].trim())
      : [];
    const data = dashboardData.monthlyData
      ? dashboardData.monthlyData.map((entry) => entry.amount)
      : [];
    return { labels, data };
  };

  // Yearly data (2024 to current year)
  const getYearlyData = () => {
    const labels = dashboardData.yearlyData
      ? dashboardData.yearlyData.map((entry) => entry.year.toString())
      : [];
    const data = dashboardData.yearlyData
      ? dashboardData.yearlyData.map((entry) => entry.amount)
      : [];
    return { labels, data };
  };

  // Dynamically update chart data based on viewType
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  useEffect(() => {
    let data;
    switch (viewType) {
      case "weekly":
        data = getWeeklyData();
        setGraphData(null)
        break;
      case "monthly":
        data = getMonthlyData();
        setGraphData(null)
        break;
      case "yearly":
        data = getYearlyData();
        setGraphData(null)
        break;
      default:
        data = getWeeklyData();
        setGraphData(null)
    }
    setChartData(data);
  }, [viewType, dashboardData]); // Triggers when viewType or dashboardData changes

  // Chart configuration
  const salesData = {
    labels: chartData.labels, // Labels for X-axis (days, months, or years)
    datasets: [
      {
        label:
          viewType === "weekly"
            ? "Weekly Earnings"
            : viewType === "monthly"
            ? "Monthly Earnings"
            : "Yearly Earnings",
        data: chartData.data, // Data points for Y-axis
        borderColor:
          viewType === "weekly"
            ? "#2196f3"
            : viewType === "monthly"
            ? "#4caf50"
            : "#ff5722",
        backgroundColor:
          viewType === "weekly"
            ? "rgba(33, 150, 243, 0.2)"
            : viewType === "monthly"
            ? "rgba(76, 175, 80, 0.2)"
            : "rgba(255, 87, 34, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  // Columns for DataTable
  const columns = [
    {
      name: "Thumbnail",
      selector: (row) => (
        <img
          src={row.thumbnailUrl}
          alt={row.courseName}
          style={{ width: 40, height: 40, borderRadius: "5px" }}
        />
      ),
      sortable: false,
      style: {
        width: "70px", // Fixed width for thumbnail
        textAlign: "center",
      },
    },
    {
      name: "Course Name",
      selector: (row) => row.courseName,
      sortable: true,
      style: {
        maxWidth: "150px", // Limit course name width
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    {
      name: "Description",
      selector: (row) => row.courseDescription,
      sortable: false,
      style: {
        maxWidth: "200px", // Reduce width for description
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      style: {
        width: "100px", // Fixed width
      },
    },
    {
      name: "Sale Price",
      selector: (row) => `₹${row.salePrice}`,
      sortable: true,
      style: {
        width: "100px", // Fixed width
        textAlign: "right",
      },
    },
    {
      name: "Enrollment Count",
      selector: (row) => row.enrollmentCount,
      sortable: true,
      style: {
        width: "120px", // Fixed width
        textAlign: "center",
      },
    },
  ];

  return (
    <div className="p-5">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="p-4 bg-white shadow rounded">
          <h4 className="text-gray-500">Life Time Paid Courses Commission</h4>
          <h2 className="text-2xl font-bold text-green-500">
            ₹{dashboardData.lifetimeCommission || 0}
          </h2>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h4 className="text-gray-500">Life Time Received Commission</h4>
          <h2 className="text-2xl font-bold text-blue-500">
            ₹{dashboardData.lifetimeEarnings || 0}
          </h2>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h4 className="text-gray-500">Life Time Total Revenue</h4>
          <h2 className="text-2xl font-bold text-red-500">
            ₹{dashboardData.lifetimeTotalEnrollmentAmount || 0}
          </h2>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-6 gap-4 mb-5">
        <div className="p-4 bg-white shadow rounded text-center">
          <h4 className="text-gray-500">Total Reviews</h4>
          <h2 className="text-xl font-bold">
            {dashboardData.totalReviews || 0}
          </h2>
        </div>
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="p-4 bg-white shadow rounded text-center">
            <h4 className="text-gray-500">{star} Star Reviews</h4>
            <h2 className="text-xl font-bold">
              {dashboardData[`${star}StarReviews`] || 0}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-5 mb-10">
        <div className="p-4 bg-yellow-100 rounded shadow w-1/4">
          <h3 className="text-lg font-bold">Todays Revenue</h3>
          <p className="text-2xl font-semibold">
            ₹{dashboardData.todaysAmount}
          </p>
        </div>
        <div className="p-4 bg-green-100 rounded shadow w-1/4">
          <h3 className="text-lg font-bold">This Week Revenue</h3>
          <p className="text-2xl font-semibold">
            ₹{dashboardData.thisWeeksAmount}
          </p>
        </div>
        <div className="p-4 bg-blue-100 rounded shadow w-1/4">
          <h3 className="text-lg font-bold">This Month Revenue</h3>
          <p className="text-2xl font-semibold">
            ₹{dashboardData.thisMonthsAmount}
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      <div>
        <div className="flex items-center ">
          <label className="mr-3" htmlFor="viewType">
            Select View:{" "}
          </label>
          <select
            id="viewType"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>

          {viewType === "custom" && (
            <div className="flex space-x-4 mb-6 ml-10">
              <div className="flex flex-col">
                <label htmlFor="fromDate" className="text-gray-600 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="toDate" className="text-gray-600 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border rounded-md p-2"
                />
              </div>
            </div>
          )}
        </div>
        {graphData?(
          <>
          <Line
          data={graphData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Mentor Daily Earnings',
              },
            },
          }}
        />
        </>
        ):(
          <>
          <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
          <Line
            data={salesData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Allows height adjustment
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: `${
                    viewType.charAt(0).toUpperCase() + viewType.slice(1)
                  } Revenue`,
                },
              },
            }}
            style={{ height: "400px", maxHeight: "80vh" }}
          />
        </div>
          </>
        )
        }
      </div>

      {/* Top Selling Courses Table */}
      <div className="pt-10 flex flex-col">
        <h4 className="mb-5 text-center text-xl font-bold text-gray-700">
          Top Selling Courses
        </h4>
        <div className="overflow-x-auto overflow-y-hidden max-w-full">
          <div className="inline-block min-w-full shadow-lg rounded-lg border border-gray-200 bg-white">
            <DataTable
              columns={columns}
              data={topSellingCourses}
              pagination
              highlightOnHover
              striped
              customStyles={{
                table: {
                  style: {
                    width: "100%",
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
                cells: {
                  style: {
                    padding: "8px", // Reduce cell padding
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

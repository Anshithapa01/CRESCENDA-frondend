import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import DataTable from "react-data-table-component";
import { fetchEarnings, fetchMentorDashboardData, fetchPurchases } from "../../../Utility/Enrollments";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const MentorDashboard = () => {
  const auth = useSelector((store) => store.mentorAuth);
  const [purchases,setPurchases]=useState([])
  const [chartData, setChartData] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [data, setData] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    totalPurchases: 0,
    activeCourses: 0,
  });

  useEffect(() => {
    if (fromDate && toDate) {
      const formattedFromDate = `${fromDate}T00:00:00`;
      const formattedToDate = `${toDate}T23:59:59`; 
      console.log(formattedFromDate, ' and ', formattedToDate);
  
      const fetchEarningsData = async () => {
        try {
          const earningsData = await fetchEarnings(auth.jwt, auth.user?.mentorId, formattedFromDate, formattedToDate);
          const labels = earningsData.map((entry) => entry.day);
          const earnings = earningsData.map((entry) => entry.totalEarnings);
  
          setChartData({
            labels,
            datasets: [
              {
                label: 'Custom Date Earnings',
                data: earnings,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3,
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderWidth: 2,
              },
            ],
          });
        } catch (error) {
          console.error('Error fetching earnings data:', error);
        }
      };
  
      fetchEarningsData();
    }
  }, [auth.user?.mentorId, fromDate, toDate]);
  


  const chartData1 = {
    labels: [
      "Total Earnings",
      "Monthly Earnings",
    ],
    datasets: [
      {
        label: "Dashboard Stats",
        data: [
          data.totalEarnings,
          data.monthlyEarnings,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };

  const chartData2 = {
    labels: [
      "Total Purchases",
      "Active Courses",
    ],
    datasets: [
      {
        label: "Dashboard Stats",
        data: [
          data.totalPurchases,
          data.activeCourses,
        ],
        backgroundColor: [
          "rgba(255, 159, 64, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchasesData = await fetchPurchases(auth.jwt, auth.user?.mentorId);
        setPurchases(purchasesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (auth.jwt && auth.user) {
      fetchData();
    }
  }, [auth.jwt, auth.user?.mentorId]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const purchasesData = await fetchPurchases(auth.jwt, auth.user?.mentorId);
        setPurchases(purchasesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (auth.jwt && auth.user) {
      fetchData();
    }
  }, [auth.jwt, auth.user?.mentorId]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMentorDashboardData(auth.jwt, auth.user?.mentorId);
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (auth.jwt && auth.user) {
      fetchData();
    }
  }, [auth.jwt, auth.user?.mentorId]);
  

  const columns = [
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
      selector: row => `$${row.amount.toFixed(2)}`,
      sortable: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 py-8 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Mentor Dashboard
          </h1>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">
                {data.totalEarnings.toFixed(2)}
              </h2>
              <p className="text-gray-500">Total Earned</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">
                {data.activeCourses}
              </h2>
              <p className="text-gray-500">Active Courses</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">
                {data.monthlyEarnings.toFixed(2)}
              </h2>
              <p className="text-gray-500">This Month Earnings</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-700">
                {data.totalPurchases}
              </h2>
              <p className="text-gray-500">Total Purchases</p>
            </div>
          </div>
          {data && (
            <div className="w-full flex">
              <div className="w-1/2">
                <h2>Overview Chart</h2>
                <Bar data={chartData1} key={JSON.stringify(chartData1)} />
              </div>
            <div className="w-1/2">
              <h2>Overview Chart</h2>
              <Bar data={chartData2} key={JSON.stringify(chartData2)} />
            </div>
              </div>
          )}

<h2 className="text-xl font-bold text-gray-800 mb-4">Earnings Overview</h2>

{/* Date Range Selection */}
<div className="flex space-x-4 mb-6">
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

{/* Line Graph */}
{chartData ? (
  <Line
    data={chartData}
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
) : (
  <div className="text-center text-gray-500">Select a date range to view earnings</div>
)}

          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-10 m-10 p-5">
            <DataTable
              columns={columns}
              data={purchases} // Pass the purchases data here
              pagination // Add pagination
              highlightOnHover // Highlight rows on hover
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MentorDashboard;




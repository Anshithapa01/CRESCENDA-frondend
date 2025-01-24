import React, { useState, useEffect } from "react";
import axios from "axios";
import { QA_BASE_URL } from "../../../Config/apiConfig";
import { useSelector } from "react-redux";
import Alert from "../../OtherComponents/Alert";
import { useNavigate, useLocation } from "react-router-dom";

const QAForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useSelector((store) => store.adminAuth);
  const [isUpdating,setIsUpdating]=useState(false);

  // Initial form state
  const [qaData, setQaData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    phoneNumber: "",
    role: "QA_Expert",
    qualification: "",
    experience: "",
    areasOfExpertise: "",
    password: "",
    lead: "",
  });

  const [qaLeads, setQaLeads] = useState([]);
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState({ message: "", status: "" });

  // Populate data if updating
  useEffect(() => {
    if (location.state?.qaData) {
        console.log(location.state.qaData.lead);
        setIsUpdating(true)
      setQaData(location.state.qaData);
    }
  }, [location.state]);

  // Fetch QA Leads
  useEffect(() => {
    const fetchQALeads = async () => {
      try {
        const response = await axios.get(`${QA_BASE_URL}/leads`, {
          headers: {
            Authorization: `Bearer ${auth.adminJwt}`,
          },
        });
        setQaLeads(response.data);
      } catch (error) {
        console.error("Error fetching QA Leads:", error);
      }
    };

    fetchQALeads();
  }, [auth.adminJwt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQaData({ ...qaData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!qaData.firstName) newErrors.firstName = "First name is required";
    if (!qaData.lastName) newErrors.lastName = "Last name is required";
    if (!qaData.emailId) newErrors.emailId = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(qaData.emailId)) newErrors.emailId = "Invalid email format";

    if (!qaData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(qaData.phoneNumber)) newErrors.phoneNumber = "Invalid phone number (must be 10 digits)";

    if (!qaData.qualification) newErrors.qualification = "Qualification is required";
    if (!qaData.experience) newErrors.experience = "Experience is required";
    else if (qaData.experience < 0) newErrors.experience = "Experience cannot be negative";

    if (!qaData.areasOfExpertise) newErrors.areasOfExpertise = "Areas of expertise are required";

    if (!isUpdating && qaData.role === "QA_Lead" && !qaData.password ) newErrors.password = "Password is required";
    else if (!isUpdating && qaData.role === "QA_Lead" && qaData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";

    if (qaData.role === "QA_Expert" && !qaData.lead) newErrors.lead = "QA Lead is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const leadData =
      qaData.role === "QA_Expert" && qaData.lead
        ? { qaId: qaData.lead } // Include the lead as an object with qaId
        : {qaId: null};

    const submissionData = {
      ...qaData,
      lead: leadData, // Replace string with object
    };
    
    // if (qaData.role === "QA_Lead") setQaData({...qaData, lead:{...qaData.lead, qaId: ''}})
    console.log('submissionData',submissionData);
    
      const url = qaData.qaId
        ? `${QA_BASE_URL}/${qaData.qaId}` // Update existing QA
        : QA_BASE_URL; // Add new QA
      const method = qaData.qaId ? "put" : "post";

      const response = await axios[method](url, submissionData, {
        headers: {
          Authorization: `Bearer ${auth.adminJwt}`,
        },
      });

      const successMessage = qaData.qaId ? "QA updated successfully!" : "QA added successfully!"; 
      navigate("/admin/qa/qateam", { state:{ alert: { message: successMessage, status: "success" } }});
    } catch (error) {
      console.error("Error:", error);
      setAlert({ message: "Failed to save QA", status: "error" });
      setShowAlert(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-lg mt-5 mb-5">
      {showAlert && (
        <Alert
          message={alert.message}
          status={alert.status}
          onClose={() => setShowAlert(false)}
        />
      )}
      <h2 className="text-2xl font-bold mb-6">{qaData.qaId ? "Update QA" : "Add QA"}</h2>
      <form onSubmit={handleSubmit}>
        {/* Full name */}
        <div className="mb-4 flex">
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={qaData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={qaData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email and Phone */}
        <div className="mb-4 flex">
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="emailId"
              value={qaData.emailId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.emailId && <p className="text-red-500 text-sm">{errors.emailId}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={qaData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>
        </div>

        {/* Role */}
        <div className="mb-4 flex">
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Role</label>
            <select
              name="role"
              value={qaData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="QA_Expert">QA Expert</option>
              <option value="QA_Lead">QA Lead</option>
            </select>
          </div>
          {qaData.role==='QA_Expert' && (
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">QA Lead</label>
            <select
                name="lead"
                value={qaData.lead?.qaId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
                <option value="">Select a QA Lead</option>
                {qaLeads.map((lead) => (
                <option key={lead.qaId} value={lead.qaId}>
                    {lead.firstName} {lead.lastName}
                </option>
                ))}
            </select>
            {errors.lead && <p className="text-red-500 text-sm">{errors.lead}</p>}
        </div>
        )}
        </div>

        {/* QA Lead Dropdown */}
        

        {/* Qualification */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Qualification</label>
          <input
            type="text"
            name="qualification"
            value={qaData.qualification}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification}</p>}
        </div>

        {/* Areas of Expertise */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Areas of Expertise</label>
          <input
            type="text"
            name="areasOfExpertise"
            value={qaData.areasOfExpertise}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          {errors.areasOfExpertise && <p className="text-red-500 text-sm">{errors.areasOfExpertise}</p>}
        </div>

        {/* Experience */}
        <div className="mb-4 flex">
          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Experience (Years)</label>
            <input
              type="number"
              name="experience"
              value={qaData.experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
          </div>
          {qaData.role === "QA_Lead" && (

          <div className="w-1/2">
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={qaData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          )}
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {qaData.qaId ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QAForm;

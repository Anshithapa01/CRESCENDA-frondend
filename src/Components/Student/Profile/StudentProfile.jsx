import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../Config/apiConfig";
import { useSelector } from "react-redux";
import Avatar from "../Components/Nav/Avatar";
import Alert from "../../OtherComponents/Alert";

const StudentProfile = () => {
  const auth=useSelector(store=>store.auth)
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    phoneNumber: "",
    link: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(auth);
    if(auth.user){
        axios
      .get(`${API_BASE_URL}/student/${auth?.user?.studentId}`, {
        headers: { Authorization: `Bearer ${auth.jwtUser}` },
      })
      .then((response) => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching student:", error));
    }
  }, [auth?.user?.studentId, auth.jwt]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!student.firstName) newErrors.firstName = "First name is required";
    if (!student.lastName) newErrors.lastName = "Last name is required";
    if (!student.emailId || !/\S+@\S+\.\S+/.test(student.emailId))
      newErrors.emailId = "A valid email is required";
    if (!student.phoneNumber || !/^\d{10}$/.test(student.phoneNumber))
      newErrors.phoneNumber = "A valid 10-digit phone number is required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      axios
        .put(`${API_BASE_URL}/student/${auth?.user?.studentId}`, student, {
          headers: { Authorization: `Bearer ${auth.jwtUser}` },
        })
        .then((response) => {
          setAlert({message:'Profile updated successfully!',status:'success'});
          setShowAlert(true)
        })
        .catch((error) => console.error("Error updating student:", error));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-6">
      <div className='w-full flex items-center'>
        {showAlert && (
          <Alert  
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      </div>
      <h1 className="text-2xl font-bold text-center mb-6">My Account</h1>
      <div className="flex justify-center mb-4">
      <Avatar>
        {auth.user.firstName[0].toUpperCase()}
      </Avatar>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            value={student.firstName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={student.lastName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email ID</label>
          <input
            type="email"
            name="emailId"
            value={student.emailId}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.emailId && (
            <p className="text-red-500 text-sm">{errors.emailId}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phoneNumber"
            value={student.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Link</label>
          <input
            type="text"
            name="link"
            value={student.link}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default StudentProfile;

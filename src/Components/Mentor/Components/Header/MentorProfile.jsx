import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } from "../../../../Config/Cloudinary";
import Alert from "../../../OtherComponents/Alert";
import { updateProfile } from "../../../../Utility/Mentor";

const MentorProfile = () => {
  const auth = useSelector((store) => store.mentorAuth); // Get mentor data from Redux
  const [mentor, setMentor] = useState(auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentor((prevMentor) => ({
      ...prevMentor,
      [name]: value,
    }));
  };

  useEffect(() => {
    setMentor(auth.user);
  }, [auth]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images_preset");
    formData.append("api_key", CLOUDINARY_API_KEY);
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await axios.post(url, formData);
    return response.data.secure_url;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploading(true); // Start spinner
      try {
        const uploadedImageUrl = await uploadImageToCloudinary(file);
        console.log('uploadedImageUrl,', uploadedImageUrl);
        
        setMentor((prevMentor) => ({
          ...prevMentor,
          image: uploadedImageUrl,
        }));
        setAlert({message:'Image uploaded successfully!',status:'success'});
          setShowAlert(true)
      } catch (error) {
        console.error("Error uploading image:", error);
        setAlert({message:'Failed to upload image.',status:'error'});
          setShowAlert(true)
      } finally {
        setImageUploading(false); // Stop spinner
      }
    }
  };

  // Save the updated profile
  const saveProfile = async () => {
    try {
      const updatedProfile = await updateProfile(mentor.mentorId, mentor, auth.jwt);
      setMentor(updatedProfile);
      setIsEditing(false);
      setAlert({ message: 'Profile updated successfully!', status: 'success' });
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({ message: 'Failed to update profile.', status: 'error' });
      setShowAlert(true);
    }
  };
  

  return (
    <div className="container ">
      {showAlert && (
          <Alert 
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      <div className="m-20 p-20 bg-orange-50 shadow-2xl rounded-lg transition duration-300 ease-in-out transform hover:shadow-3xl">
      {mentor && (
        <>
        <div className="flex flex-col items-center mb-5">
        {imageUploading ? (
                <CircularProgress />
            ) : (
                <img
                src={mentor.image || "https://via.placeholder.com/150"}
                alt={`${mentor.firstName} ${mentor.lastName}`}
                className="w-32 h-32 rounded-full shadow-md border-4 border-blue-500"
                />
            )}
        {isEditing ? (
          <div className="flex flex-col mt-3">
            <input
            type="file"
            name="image"
            onChange={handleImageUpload} // Use the new handler
            className="mb-3 border border-gray-300 p-2 rounded-md focus:ring focus:ring-orange-300"
            />
          </div>
        ) : (
          <p className="mt-4 text-2xl font-semibold text-gray-700">{mentor.firstName} {mentor.lastName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-600">First Name</label>
          <input
            type="text"
            name="firstName"
            value={mentor.firstName}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={mentor.lastName}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={mentor.phoneNumber}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="emailId"
            value={mentor.emailId}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100 border-gray-200"
          />
        </div>
        <div>
          <label className="block text-gray-600">Headline</label>
          <input
            type="text"
            name="headLine"
            value={mentor.headLine || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Highest Qualification</label>
          <input
            type="text"
            name="highestQualification"
            value={mentor.highestQualification || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-600">Bio</label>
          <textarea
            name="bio"
            value={mentor.bio || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-600">Areas of Expertise</label>
          <textarea
            name="areasOfExpertise"
            value={mentor.areasOfExpertise || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Website Link</label>
          <input
            type="text"
            name="websiteLink"
            value={mentor.websiteLink || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">LinkedIn Link</label>
          <input
            type="text"
            name="linkedInLink"
            value={mentor.linkedInLink || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">YouTube Link</label>
          <input
            type="text"
            name="youtubeLink"
            value={mentor.youtubeLink || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block text-gray-600">Facebook Link</label>
          <input
            type="text"
            name="facebookLink"
            value={mentor.facebookLink || ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full p-2 border rounded-md focus:ring focus:ring-orange-300 transition-transform duration-300 ease-in-out transform focus:scale-105 ${isEditing ? "border-gray-400" : "border-gray-200 bg-gray-100"}`}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        {isEditing ? (
          <button onClick={saveProfile} className="px-6 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition">
            Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-orange-400 text-white rounded-md shadow-md hover:bg-orange-500 transition">
            Edit
          </button>
        )}
      </div>
        </>
      )}
      </div>
    </div>
  );
};

export default MentorProfile;

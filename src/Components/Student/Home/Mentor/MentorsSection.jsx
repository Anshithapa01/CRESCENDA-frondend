import React, { useEffect, useState } from 'react';
import MentorCard from './MentorCard';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MENTOR_AUTH_BASE_URL, MENTOR_BASE_URL } from '../../../../Config/apiConfig';

const MentorsSection = () => {
  const auth=useSelector(store=>store.auth)
  const jwt=localStorage.getItem("user_jwt")
  const[mentors,setMentors]=useState([]);
  useEffect(()=>{
    const fetchAllMentors = async () => {
      try {
          const response = await axios.get(`${MENTOR_AUTH_BASE_URL}`);
          setMentors(response.data)
      } catch (error) {
          console.error("Error fetching mentors:", error);
          throw error;
      }
  };
    fetchAllMentors()
  },[jwt,auth.jwtUser])
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-2">Popular Instructor</h2>
      <p className="text-gray-600 mb-6">We know the best things for You. Top picks for You.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mentors.slice(0, 4).map((mentor) => (
          <MentorCard
            key={mentor.mentorId}
            mentorId={mentor.mentorId}
            image={mentor.image}
            name={`${mentor.firstName || ''} ${mentor.lastName || ''}`.trim()}
            title={mentor.headLine}
          />
        ))}
      </div>
    </div>
  );
};

export default MentorsSection;

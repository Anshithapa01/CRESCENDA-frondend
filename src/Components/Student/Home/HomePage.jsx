import React, { useEffect, useState } from 'react'
import MainHero from './Body/MainHero'
import CourseCarousel from './Body/CourseCarousel';
import MentorsSection from "./Mentor/MentorsSection";
import SearchBar from '../../OtherComponents/SearchBar';
import FeaturedCourseCard from '../../OtherComponents/Card/FeaturedCourseCard';
import CourseCard from '../../OtherComponents/Card/CourseCard';
import { API_AUTH_BASE_URL, API_BASE_URL } from '../../../Config/apiConfig';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const auth=useSelector(store=>store.auth)
  const jwt=localStorage.getItem("user_jwt")
  const [courses,setCourses]=useState([])
  const featuredCourse=courses.slice(0)
  
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchAllCourses = async () => {
      try {
          const response = await axios.get(`${API_AUTH_BASE_URL}/courses`);
          setCourses(response.data)
      } catch (error) {
          console.error("Error fetching courses:", error);
          throw error;
      }
  };
    fetchAllCourses()
  },[auth.jwtUser,jwt])

  const handleCardClick = (draftId) => {
    navigate(`/course/${draftId}`);
  };

  return (
    <> 
    <div className="relative">
        <MainHero />
        <div className="relative">
          <SearchBar />
        </div>
      </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <CourseCarousel title="Popular courses" courses={courses} limit={16} />
  
      <h2 className="text-2xl font-bold mb-6">Featured</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <FeaturedCourseCard course={featuredCourse} />
        </div>
        <div className="lg:col-span-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {courses.slice(0, 4).map((course) => (
              <CourseCard onClick={() => handleCardClick(course.draft.draftId)} key={course.draftId} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
    <MentorsSection/>
    </>
  )
}

export default HomePage

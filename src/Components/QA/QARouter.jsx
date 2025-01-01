import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './Components/NavBar';
import QALogin from './Login/QALogin';
import Tab from '../OtherComponents/Tab/Tab';
import Course from './Dashboard/Course';
import Request from './Dashboard/Request';
import CourseContent from './Dashboard/Start/CourseContent';
import Quiz from '../Mentor/MyCourses/Update/Quiz';

const QARouter = () => {
    const [forceRender, setForceRender] = useState(false);
    const location = useLocation();
  
    useEffect(() => {
      setForceRender(!forceRender);
    }, [location.pathname]);
  
    const hideNav = location.pathname === '/qa/login';
  
    return (
      <>
        {!hideNav && <NavBar />}
        
        <Routes>
          
        <Route
          path='/dashboard/*'
          element={
            <Course/>
            // <Tab
            //   title="Courses"
            //   tabOne="All Courses"
            //   // tabTwo="Requests"
            //   pathOne="all"
            //   pathTwo="request"
            //   basePath="/qa/dashboard"
            //   componentOne={Course}
            //   // componentTwo={Request}
            // />
          }
        />
        <Route path='/all/:id' element={<CourseContent/>}/>
        <Route path='/all/:id/assessment' element={<Quiz/>}/>
        <Route path="/login" element={<QALogin />} />
        </Routes>
  
      </>
    );
  };
export default QARouter

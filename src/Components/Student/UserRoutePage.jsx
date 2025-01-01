import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './Home/HomePage';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import Navbar from './Components/Nav/Navbar';
import Footer from './Components/Footer/Footer';
import MentorRouter from '../Mentor/MentorRouter';
import Tab from '../OtherComponents/Tab/Tab';
import PurchasedCourses from './MyCourses/PurchasedCourses/PurchasedCourses';
import Wishlist from './MyCourses/Wishlist/Wishlist';
import PrivateRoute from './Auth/PrivateRoute';
import CourseContentReadOnly from '../Admin/QA/Sub/Request/CourseContentReadOnly';
import CoursePage from './CourseView/CoursePage';
import StudentProfile from './Profile/StudentProfile';
import SearchResults from './Home/Search/SearchResults';
import MentorPage from './Home/Mentor/MentorPage';
import QuizView from '../OtherComponents/QuizView';
import Messages from './Chat/Messages';
import VideoCall from './Chat/VideoCall';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './ForgotPassword/ResetPassword';
import CourseCard from '../OtherComponents/Card/CourseCard';
import AboutUs from '../OtherComponents/AboutUs';

const UserRoutePage = () => {
  const [forceRender, setForceRender] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setForceRender(!forceRender);
  }, [location.pathname]);

  const hideNavFooter = ['/login', '/signup'].includes(location.pathname) || location.pathname.startsWith('/mentor');

  return (
    <>
      {!hideNavFooter && <Navbar />}
      
      <Routes>
        <Route exact index element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/aboutUs' element={<AboutUs />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/messages" element={<Messages />} />    
        <Route path='/messages/videocall' element={<VideoCall/>}/>
        <Route path="/mentor/*" element={<MentorRouter />} />
        <Route path="/detailsmentor/:mentorId" element={<MentorPage />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/myCourses/*"
            element={
              <Tab
                title="My Courses"
                tabOne="Purchased Courses"
                tabTwo="Wishlist"
                pathOne="purchased"
                pathTwo="wishlist"
                basePath="/myCourses"
                componentOne={PurchasedCourses}
                componentTwo={Wishlist}
              />
              }
            />
          </Route>
          <Route path='/course/:id' element={<CoursePage/>}/>
          <Route path='/purchased/:id' element={<CourseContentReadOnly/>}/>
          <Route path='/purchased/:id/quiz' element={<QuizView/>}/>
      </Routes>

      {!hideNavFooter && <Footer />}
    </>
  );
};

export default UserRoutePage;

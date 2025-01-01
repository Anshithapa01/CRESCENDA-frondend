import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import MentorDashboard from "./Dashboard/MentorDashboard";
import SignUpPage from "./SignUp/SignUpPage";
import NavBar from "./Components/Header/NavBar";
import LoginPage from "./Login/LoginPage";
import ActiveCourses from "./MyCourses/ActiveCourses";
import Tab from "../OtherComponents/Tab/Tab";
import AllCourses from "./MyCourses/AllCourses";
import AddCourse from "./MyCourses/Add/AddCourse";
import UpdateCourse from "./MyCourses/Update/UpdateCourse";
import AboutUs from "../OtherComponents/AboutUs";
import CourseContentPage from "./MyCourses/Update/Chapter/CourseContentPage";
import Quiz from "./MyCourses/Update/Quiz";
import CourseContentReadOnly from "../Admin/QA/Sub/Request/CourseContentReadOnly";
import QuizView from "../OtherComponents/QuizView";
import MentorProfile from "./Components/Header/MentorProfile";
import MentorMessages from "./Messages/MentorMessages";
import ForgotPassword from "../Student/ForgotPassword/ForgotPassword";
import ResetPassword from "../Student/ForgotPassword/ResetPassword";
import Footer from "./Components/Footer/Footer";

const MentorRouter = () => {
  const [forceRender, setForceRender] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setForceRender(!forceRender);
  }, [location.pathname]);

  const hideNavFooter = ["/mentor/login", "/mentor/signup",,'/mentor/forgot-password','/mentor/reset-password'].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen"> 
      {!hideNavFooter && <NavBar />}

      
      <div className="relative z-10">
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />    
          <Route path="/profile" element={<MentorProfile />} />
          <Route path="/dashboard" element={<MentorDashboard />} />
          <Route
            path="/courses/*"
            element={
              <Tab
                title="Courses"
                tabOne="Active Courses"
                tabTwo="All Courses"
                pathOne="active"
                pathTwo="all"
                basePath="/mentor/courses"
                componentOne={ActiveCourses}
                componentTwo={AllCourses}
              />
            }
          />
          <Route path="/courses/active/:id/view" element={<CourseContentReadOnly />}/>
          <Route path="/courses/active/:id/view/quiz" element={<QuizView/>}/>


          <Route path="/courses/all/:id/view" element={<CourseContentReadOnly />}/>
          <Route path="/courses/all/:id/view/quiz" element={<QuizView/>}/>

          <Route path="/courses/all/:id/update" element={<UpdateCourse />} />
          <Route path="/courses/all/:id/update/chapters" element={<CourseContentPage />} />
          <Route path="/courses/all/:id/update/quiz" element={<Quiz />} />
          <Route path="/courses/all/add" element={<AddCourse />} /> 
          <Route path='/aboutUs' element={<AboutUs />} />
          <Route path='/messages' element={<MentorMessages />} />
        </Routes>
      </div>
      
      {!hideNavFooter && <Footer />}
    </div>
  );
};

export default MentorRouter;

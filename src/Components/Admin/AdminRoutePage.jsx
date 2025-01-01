import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import AdminLogin from './Login/AdminLogin';
import Dashboard from './Dashboard/Dashboard';
import AllCourses from './Courses/AllCourses/AllCourses';
import Tab from '../OtherComponents/Tab/Tab';
import Category from './Category/Category';
import UpdateCategory from './Category/UpdateCategory';
import PurchasedCourses from './Courses/Purchased/PurchasedCourses';
import QAList from './QA/Sub/QAList';
import Requests from './QA/Sub/Request/Requests';
import CourseContentReadOnly from './QA/Sub/Request/CourseContentReadOnly';
import QuizView from '../OtherComponents/QuizView';
import QAForm from './QA/QAForm';
import MentorList from './User/MentorList';
import StudentList from './User/StudentList';

const AdminRoutePage = () => {
  const [forceRender, setForceRender] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setForceRender(!forceRender);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      {!location.pathname.endsWith('/adminLogin') && (
        <div className="w-64 fixed inset-y-0 left-0" style={{zIndex:1000}}>
          <Sidebar />
        </div>
      )}
      
      <div className={`flex-1 ${!location.pathname.endsWith('/adminLogin') ? 'ml-64' : ''}`}>
        <Routes>
          <Route exact index element={<Dashboard />} />
          <Route path='/adminLogin' element={<AdminLogin />} />
          
            <Route
            path='/courses/*'
            element={
              <Tab
                title="Courses"
                tabOne="All Courses"
                tabTwo="Purchased"
                pathOne="all"
                pathTwo="purchased"
                basePath="/admin/courses"
                componentOne={AllCourses}
                componentTwo={PurchasedCourses}
              />
            }
          />
          <Route path="/courses/all/:id/view" element={<CourseContentReadOnly />}/>
          <Route path="category" element={<Category />} />
          <Route path="category/:id" element={<UpdateCategory />} />
          <Route
            path='/qa/*'
            element={
              <Tab
                title="QA"
                tabOne="Qa Team"
                tabTwo="Requests"
                pathOne="qateam"
                pathTwo="request"
                basePath="/admin/qa"
                componentOne={QAList}
                componentTwo={Requests}
              />
            }
          />
          <Route path='/qa/qateam/add' element={<QAForm/>}/>
          <Route path='/qa/qateam/:id' element={<QAForm/>}/>
          <Route path='/qa/request/:id' element={<CourseContentReadOnly/>}/>
          <Route path='/qa/request/:id/quiz' element={<QuizView/>}/>

          <Route
            path='/user/*'
            element={
              <Tab
                title="Users"
                tabOne="Students"
                tabTwo="Mentors"
                pathOne="students"
                pathTwo="mentors"
                basePath="/admin/user"
                componentOne={StudentList}
                componentTwo={MentorList}
              />
            }
          />
        </Routes>
        
      </div>
    </div>
  );
};

export default AdminRoutePage;

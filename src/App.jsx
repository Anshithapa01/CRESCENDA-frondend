import React from 'react';
import UserRoutePage from './Components/Student/UserRoutePage';
import { Route, Routes } from 'react-router-dom';
import AdminRoutePage from './Components/Admin/AdminRoutePage';
import QARouter from './Components/QA/QARouter';

function App() {
  return (
    <Routes>
      <Route path='/*' element={<UserRoutePage/>}/>
      <Route path='/admin/*' element={<AdminRoutePage/>}/>
      <Route path='/qa/*' element={<QARouter/>}/>
    </Routes>
  );
}

export default App;

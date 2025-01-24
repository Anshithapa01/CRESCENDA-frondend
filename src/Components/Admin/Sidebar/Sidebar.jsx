import { Link, useNavigate } from 'react-router-dom';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { Dashboard } from '@mui/icons-material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAdmin, logout } from '../../../State/Auth/Admin/Action';
import wrapAdminAuth from '../Auth/wrapAdminAuth';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem('admin_jwt');
  const auth = useSelector((state) => state.adminAuth);

  useEffect(() => {
    if (jwt) {
      dispatch(getAdmin(jwt));
    }
  }, [jwt, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/adminLogin');
  };

  return (
    <div className="bg-blue-950 h-screen w-64 z-1000 fixed top-0 left-0 text-white flex flex-col justify-between">
      <div>
        <div className="pt-7 pl-5">
          <img
            alt="CRESCENDA"
            src="/adminLogo.png"
            className="w-56 h-auto"
          />
        </div>
        <nav className="mt-10 ml-5">
          <Link to="/admin" className="block py-2 px-4 hover:bg-blue-700"><SpeedIcon /> Dashboard</Link>
          <Link to="/admin/courses" className="block py-2 px-4 hover:bg-blue-700"><AutoStoriesIcon /> Courses</Link>
          <Link to="/admin/user" className="block py-2 px-4 hover:bg-blue-700"><Diversity3Icon /> Users</Link>
          <Link to="/admin/category" className="block py-2 px-4 hover:bg-blue-700"><Dashboard /> Category</Link>
          <Link to="/admin/qa" className="block py-2 px-4 hover:bg-blue-700"><QuestionAnswerIcon /> QA</Link>
          <button onClick={handleLogout} className="block py-2 px-4 hover:bg-blue-700"><ExitToAppIcon /> Logout</button>
        </nav>
      </div>
      {auth.user?.adminUsername && (
      <div className="flex items-center px-4 py-4 border-t border-gray-700">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center ml-5 justify-center mr-4">
          <img src="/admin.jpg" alt="Admin Profile" className="w-10 h-10 rounded-full" />
        </div>
          <p className="text-white text-sm">Hi, {auth.user.adminUsername.split('@')[0].replace(/\d+/g, '')}</p>
      </div>
      )}
    </div>
  );
};

export default wrapAdminAuth(Sidebar);

import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Tab = ({ title, tabOne, tabTwo, pathOne, pathTwo, basePath, componentOne: ComponentOne, componentTwo: ComponentTwo }) => {
  const location = useLocation();
  const navigate = useNavigate();


  const isActiveTabOne = location.pathname.includes(pathOne);
  const isActiveTabTwo = location.pathname.includes(pathTwo);


  useEffect(() => {
    if (location.pathname === basePath) {
      navigate(`${basePath}/${pathOne}`);
    }
  }, [location.pathname, basePath, pathOne, navigate]);

  return (
    <div className="flex flex-col pb-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>

      <div className="flex space-x-4 mb-6 justify-center">
        <Link
          to={`${basePath}/${pathOne}`}
          className={`px-4 py-2 ${isActiveTabOne ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          {tabOne}
        </Link>
        <Link
          to={`${basePath}/${pathTwo}`}
          className={`px-4 py-2 ${isActiveTabTwo ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}
        >
          {tabTwo}
        </Link>
      </div>

      <div className="mt-4">
        <Routes>
          <Route path={`/${pathOne}`} element={<ComponentOne />} />
          <Route path={`/${pathTwo}`} element={<ComponentTwo />} />
        </Routes>
      </div>
    </div>
  );
};

export default Tab;

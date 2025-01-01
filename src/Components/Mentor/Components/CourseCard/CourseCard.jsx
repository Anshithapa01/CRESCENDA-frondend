import React, { useEffect } from 'react';

const CourseCard = ({ course, menuItems, onMenuClose, openMenuId, index, onMenuToggle }) => {

  const isMenuOpen = index === openMenuId;
  const handleMenuClick = () => {
    onMenuToggle(index);
  };

  const handleMenuItemClick = (menuItemIndex) => {
    if (menuItems[menuItemIndex] && menuItems[menuItemIndex].onClick) {
      menuItems[menuItemIndex].onClick();
    }
    onMenuClose();
  };

  return (
    <div className="relative flex flex-col items-center justify-center bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="relative w-full h-40 overflow-hidden rounded-t-md">
        <img
          src={course.thumbnailUrl}
          alt={course.courseName}
          className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-95 hover:translate-y-4"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 text-white text-sm font-semibold">
          {course.type}
        </div>
      </div>
      <div className="p-4 w-full">
        <div>
        <div className=' bg-green-400 w-20 p-1 rounded-md justify-center flex'>
        <p className="text-sm text-white">
          {course.level}
        </p>
        </div>
        <p className='text-gray-500'>{course.subCategory.catetoryName}/{course.subCategory.subcategoryName}</p>
        <div className="group relative">
        <div className='flex justify-between'>
        <h3 className="text-2xl font-bold truncate w-44">
              {course.courseName}
            </h3>
            {
          course.status=='pending'?(<p className="text-sm text-blue-500 mt-1">
            <strong> Request Submitted</strong>
          </p>):(<></>)
        }
        {
          course.status=='need improvement' || course.status=='rejected' ?(<p className="text-sm text-red-500 mt-1">
            <strong className='uppercase'> {course.status}</strong>
          </p>):(<></>)
        }
        {course.isBlocked &&
          <p className="text-sm text-red-500 font-bold mt-1">
            <strong className='uppercase'> Deleted</strong></p>
        }
        </div>
           
            <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-gray-500 text-white text-xs rounded-md px-2 py-1 shadow-lg transition-opacity duration-200 w-max -top-8 left-1/2 transform -translate-x-1/2">
              {course.courseName}
            </div>
          </div>
          
        
        </div>
        
        <p className="text-gray-700 truncate">{course.courseDescription}</p>
        <p className="text-sm text-gray-500 mt-2">
          <strong>Date :</strong> {course.addedDate}
        </p>
        
        

        

        <div className="flex mt-4 justify-between">
        {course.type=='Paid'?(
          <div className="flex items-center mt-4">
          <p className="text-black font-semibold">${course.sellingPrice}</p>
          <p className="text-red-500 line-through pl-3">${course.coursePrice}</p>
          </div>):(
            <div className='w-12 h-auto bg-green-600 text-white pl-2 rounded-md mt-5'>
              <p>Free</p>
            </div>
          )
        }
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleMenuClick}
          >
            Action
          </button>
          {isMenuOpen && (
            <div
              className="absolute -right-16 mt-12 bg-white border border-gray-200 rounded-md shadow-sm z-10"
              style={{ minWidth: '120px' }}
            >
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <button
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      onClick={() => handleMenuItemClick(index)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

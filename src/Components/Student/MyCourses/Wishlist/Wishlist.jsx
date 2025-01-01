import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../../OtherComponents/Card/CourseCard';
import { addToWishlist } from '../../../../Utility/Wishlist';

const Wishlist = () => {
  const auth = useSelector((store) => store.auth); 
  const [wishlistCourses, setWishlistCourses] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchWishlistCourses = async () => {
      try {
        if (!auth?.user?.studentId || !auth.jwtUser) {
          return;
        }
        addToWishlist(auth.jwtUser,auth.user.studentId).then(data=>{
          setWishlistCourses(data)
        })
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistCourses();
  }, [auth,wishlistCourses]);

  

  if (loading) {
    return <p>Loading wishlist...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {wishlistCourses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-6">No courses added to your wishlist yet.</p>
          <button
            onClick={() => navigate('/search')} // Redirect to homepage
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse More Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistCourses.map((course) => (
            <CourseCard onClick={() => navigate(`/course/${course.draft.draftId}`)} key={course.courseId} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

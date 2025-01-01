import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Rating from './Rating';
import Badge from './Badge';
import { checkRatingStatus, fetchRatings } from '../../../Utility/Ratings';
import { checkWishlistStatus, toggleWishlist } from '../../../Utility/Wishlist';

const CourseCard = ({ course, onClick, onLeaveRating }) => {
  const auth = useSelector((store) => store.auth);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hasRated, setHasRated] = useState(false); // New state to track rating status
  const [ratings, setRatings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation(); // Hook to access the current route
  const navigate=useNavigate();

  useEffect(() => {
  const loadRatings = async () => {
    try {
      await fetchRatings(course.courseId).then(data=>{  
        setRatings(data);
      })
    } catch (error) {
      setErrorMessage('Failed to load ratings. Please try again.');
    }
  };
  const loadWishlistStatus = async () => {
    try {
      const data = await checkWishlistStatus(course.courseId, auth.user.studentId, auth.jwtUser);
      setIsWishlisted(data.isWishlisted);
    } catch (error) {
      setErrorMessage('Failed to check wishlist status. Please try again.');
    }
  };
  const loadRatingStatus = async () => {
    try {
      const data = await checkRatingStatus(course.courseId, auth.user.studentId);
      setHasRated(data.hasRated);
    } catch (error) {
      setErrorMessage('Failed to check rating status. Please try again.');
    }
  };

  loadRatings();
  if (auth.jwtUser && auth.user?.studentId) {
    loadRatings();
    loadWishlistStatus();
    loadRatingStatus();
  }
  }, [course.courseId, auth.jwtUser, auth.user?.studentId]);

  useEffect(() => {
  }, [hasRated]);

  const averageRating =ratings.length > 0
      ? (ratings.reduce((total, rating) => total + rating.rating, 0) /
          ratings.length).toFixed(1)
      : 0; 

    useEffect(() => {
      if (errorMessage) {
        const timer = setTimeout(() => setErrorMessage(''), 5000);
        return () => clearTimeout(timer);
      }
    }, [errorMessage]);

  const handleToggleWishlist = async () => {
    if (course.blocked) {
      setErrorMessage('This course has been deleted and cannot be added to the wishlist.');
      return;
    }
    if (!auth.jwtUser) {
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(course.courseId, auth.user.studentId, auth.jwtUser);
      setIsWishlisted((prev) => !prev);
    } catch (error) {
      setErrorMessage('Failed to update wishlist. Please try again.');
    }
  };
  const isPurchasedPage = location.pathname.startsWith('/myCourses/purchased');

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg p-4 transform transition duration-300 hover:scale-105"
    >
      <img
        src={course.draft.thumbnailUrl}
        alt={course.draft.courseName}
        className="rounded-t-lg w-full h-36 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <Badge text={course.draft.level} color="bg-green-100 text-green-700" />
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents triggering parent onClick
              handleToggleWishlist();
            }}
            className="focus:outline-none"
          >
            {isWishlisted ? (
              // Filled heart (when wishlisted)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              // Outlined heart (when not wishlisted)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 21l-7.682-8.318a4.5 4.5 0 010-6.364z"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="group relative">
        {errorMessage && (
          <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
        )}
          <p className="text-xs text-slate-400 truncate">
            {course.draft.subCategory.catetoryName}/
            {course.draft.subCategory.subcategoryName}
          </p>
          <h3 className="text-lg font-semibold truncate w-40">
            {course.draft.courseName}
          </h3>
          <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-gray-500 text-white text-xs rounded-md px-2 py-1 shadow-lg transition-opacity duration-200 w-max -top-8 left-1/2 transform -translate-x-1/2">
            {course.draft.courseName}
          </div>
        </div>
        <p className="text-sm text-gray-500">{course.draft.mentorName}</p>
        <p className="text-sm mt-1 truncate">{course.draft.courseDescription}</p>

        {/* Show either Rating or Leave Rating button based on the page path */}
        {isPurchasedPage ? (
          hasRated ? (
            <Rating rating={averageRating} reviews={ratings.length} />
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent onClick
                setHasRated((prevHasRated) => !prevHasRated);
                onLeaveRating(); // Trigger the passed callback to open the rating modal
              }}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Leave Rating
            </button>
          )
        ) : (
          <Rating rating={averageRating} reviews={ratings.length} />
        )}

        <div className="flex items-center mt-2 space-x-2">
          <span className="text-lg font-bold text-black">
            {course.draft.sellingPrice}
          </span>
          <span className="line-through text-gray-400">
            {course.draft.coursePrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
      
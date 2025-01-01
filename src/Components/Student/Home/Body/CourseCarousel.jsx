// CourseCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';
import './style.css'
import CourseCard from '../../../OtherComponents/Card/CourseCard';
import { useNavigate } from 'react-router-dom';
const CourseCarousel = ({ title, courses, limit = 6 }) => {
  const coursesToShow = courses.slice(0, limit);
  const navigate = useNavigate();

  const handleCardClick = (draftId) => {
    navigate(`/course/${draftId}`);
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 40 },
        }}
        modules={[Navigation, Pagination]}
        className="course-carousel"
      >
        {coursesToShow.map((course) => (
          <SwiperSlide  key={course.id}>
            <CourseCard onClick={() => handleCardClick(course.draft.draftId)} course={course} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CourseCarousel;

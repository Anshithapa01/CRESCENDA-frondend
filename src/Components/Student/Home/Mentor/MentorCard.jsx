// MentorCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MentorCard = ({ mentorId, image, name, title }) => {
  const navigate=useNavigate()
  return (
    <div
    onClick={()=>navigate(`/detailsmentor/${mentorId}`)}
      className="relative bg-cover bg-center rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
      style={{
        backgroundImage: `url(${image})`,
        height: '400px',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm">{title}</p>
      </div>
    </div>
  );
};

export default MentorCard;

import React from 'react';

const MentorCard = ({ mentor, onClick }) => {
  return (
    <div
    onClick={onClick}
     className='flex items-center justify-center py-2 group cursor-pointer'>
      <div className='w-[20%]'>
        <img className='h-12 w-12 rounded-full bg-black' 
        src={mentor.mentorImage||'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}/>
      </div>
      <div className='w-[80%]'>
        <div className='flex justify-between items-center'>
            <p className='text-md'>{mentor.mentorFirstName} {mentor.mentorLastName}</p>
        </div>
        <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500'>Have doubts? message me...</p>
        </div>
      </div>
      
    </div>
  );
};

export default MentorCard;

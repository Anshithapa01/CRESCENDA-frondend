import React from 'react'
import Avatar from '../Components/Nav/Avatar';

const ChatCard = ({chat,onClick,isStudent}) => {

  const formatLastUpdated = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    // Check if the date is today
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  
    if (isToday) {
      // Return time in HH:mm format
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Return date in DD-MM-YYYY format
      return date.toLocaleDateString('en-GB'); // 'en-GB' gives DD-MM-YYYY format
    }
  };

  return (
    <div
    onClick={onClick}
     className='flex items-center justify-center py-2 group cursor-pointer'>
      <div className='w-[20%]'>
      {isStudent=='true' ?
          (
        <img className='h-12 w-12 rounded-full bg-black' src={chat.mentorStudent?.mentorImage ||'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}/>
          ):
          (
            <Avatar>
              {chat.mentorStudent?.mentorFirstName[0].toUpperCase()}
            </Avatar>
          )}
      </div>
      <div className='pl-5 w-[80%]'>
        <div className='flex justify-between items-center'>
          {isStudent=='true' ?
          (
            <p className='text-md'>{chat.mentorStudent?.mentorFirstName} {chat.mentorStudent?.mentorLastName}</p>
          ):
          (
            <p className='text-md'>{chat.mentorStudent?.studentFirstName} {chat.mentorStudent?.studentLastName}</p>
          )}
            <p className='text-[10px]'>{formatLastUpdated(chat.lastUpdated)}</p>
        </div>
        <div className='flex justify-between items-center'>
            <p className='text-sm text-gray-500 truncate'>{chat.lastMessage}</p>
            <div className='flex space-x-2 items-center'>
                {/* <p className='text-xs px-1 text-white bg-orange-500 rounded-full'>5</p> */}
            </div>
        </div>
      </div>
      
    </div>
  )
}

export default ChatCard

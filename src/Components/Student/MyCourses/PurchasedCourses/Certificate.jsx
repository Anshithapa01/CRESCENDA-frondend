import React from 'react'

const Certificate = ({studentName,courseName,date,mentorName}) => {
  return (
    <div
        id="certificate"
        className="absolute top-[-10000px] left-[-10000px] w-[1000px] h-[700px] bg-gray-100 text-gray-800 font-serif border-4 border-gray-600 p-10 shadow-md"
      >
        <div className="text-center h-full relative">
          {/* Decorative Icon */}
          <img
            src="/certificate-logo.png"
            alt="Award Icon"
            className="w-32 h-32 mx-auto mb-4"
          />

          {/* Certificate Title */}
          <h1 className="text-3xl font-bold uppercase mb-4">
            Certificate of Completion
          </h1>

          {/* Recipient Info */}
          <p className="text-lg italic mb-2">This certificate is proudly awarded to</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{studentName}</h2>

          {/* Course Details */}
          <div className="flex justify-center items-center">
            <p className="text-lg">For successfully completing</p>
            <h3 className="text-lg font-bold ml-2">{courseName}</h3>
          </div>
          <p className="text-lg mt-2">
            Completed on <strong>{date}</strong>
          </p>

          {/* Motivational Quote */}
          <div className="mt-8">
            <div className="w-3/4 h-[2px] bg-gray-400 mx-auto my-4"></div>
            <p className="text-sm italic text-gray-600">
              "Learning is the gateway to success, and every achievement takes you closer to
              your dreams."
            </p>
          </div>

          {/* Footer Section */}
          <div className="flex justify-between items-center mt-10 px-10">
            {/* Mentor Section */}
            <div className="text-center">
              <p className="text-lg font-semibold">Lecturer</p>
              <p className="italic">{mentorName}</p>
            </div>

            {/* Powered By Section */}
            <div className="text-center">
              <p className="text-lg font-semibold">Powered by</p>
              <p className="italic">Crescenda</p>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Certificate

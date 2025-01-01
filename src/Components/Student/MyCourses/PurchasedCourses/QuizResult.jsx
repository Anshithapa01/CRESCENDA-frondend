import React from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Certificate from "./Certificate";

const QuizResult = ({
  score,
  totalQuestions,
  status,
  id,
  studentName,
  courseName,
  mentorName,
  date,
  onNavigateToQuiz,
}) => {
  const navigate = useNavigate();

  const isPassed = status === "Pass";

  const generateCertificate = async () => {
    
    try {
      const certificateElement = document.getElementById("certificate");
      const canvas = await html2canvas(certificateElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF("landscape", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 277, 190);
      pdf.save("certificate.pdf");
  
      onNavigateToQuiz()
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        {isPassed ? (
          <>
            <h1 className="text-2xl font-bold text-center text-blue-600">
              Congratulations!
            </h1>
            <p className="mt-4 text-center">
              You have scored {score}/{totalQuestions}.
            </p>
            <p className="text-center mt-2">
              You can download your certificate now!
            </p>
            <div className="mt-6 flex justify-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={generateCertificate}
              >
                Download
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center text-red-600">
              Oops!
            </h1>
            <p className="mt-4 text-center">
              You have scored {score}/{totalQuestions}.
            </p>
            <p className="text-center mt-2">
              You have failed. Kindly retake the quiz!
            </p>
            <div className="mt-6 flex justify-center">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                onClick={() => onNavigateToQuiz()} // Navigate back or retry logic
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden Certificate Element */}
      <div>
        <Certificate studentName={studentName} courseName={courseName} date={date} mentorName={mentorName}/>
      </div>
    </div>
  );
};

export default QuizResult;

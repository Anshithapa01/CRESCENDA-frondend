import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { MENTOR_BASE_URL, QA_BASE_URL } from "../../Config/apiConfig";
import QuizResult from "../Student/MyCourses/PurchasedCourses/QuizResult";
import Alert from "./Alert";

const QuizView = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [view, setView] = useState("quiz");
  const [quizResult, setQuizResult] = useState(null); // For showing result
  const [course,setCourse]=useState({})
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const isAdmin = path.startsWith("/admin")||path.startsWith("/mentor");
  const auth = path.startsWith('/purchased') ? useSelector((store=>store.auth.jwtUser)): useSelector((store) => store.qaAuth.qaJwt);
  const studentId=useSelector((store=>store.auth.user?.studentId))
  const student=useSelector((store=>store.auth.user))

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${MENTOR_BASE_URL}/draft/${id}`, {
          headers: { Authorization: `Bearer ${auth}` },
        });
        console.log('course', response.data);
        setCourse(response.data);
      } catch (error) {
        setAlert({message:'Failed to fetch course data',status:'error'});
        setShowAlert(true)
      }
    };
  
    fetchCourse();
  }, [id, auth]); // Ensure dependencies are accurate
  
  useEffect(() => {
    console.log(studentId);
  }, [studentId]);
  

  useEffect(()=>{
    console.log(studentId);
    
  },[studentId])
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await axios.get(`${QA_BASE_URL}/quiz/draft/${id}`, {
          headers: { Authorization: `Bearer ${auth}` },
        });
        console.log(response.data);
        
        const quizzes = response.data || [];
        setQuestions(
          quizzes.map((quiz) => ({
            id: quiz.quizId,
            question: quiz.question || "",
            options: [
              quiz.option1 || "",
              quiz.option2 || "",
              quiz.option3 || "",
              quiz.option4 || "",
            ],
            answer: quiz.answer || "",
          }))
        );
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    loadQuizzes();
  }, [id, auth]);

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    
    const unansweredQuestions = questions.filter(
      (question) => !selectedAnswers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      setAlert({message:'Please answer all questions before submitting.',status:'error'});
      setShowAlert(true)
      return;
    }

    const answers = questions.reduce((acc, question) => {
      acc[question.id] = selectedAnswers[question.id] || null;
      return acc;
    }, {});

  
    try {
      const response = await axios.post(
        `${QA_BASE_URL}/quiz/submit`,
        {
          courseId: id, // Course ID from state or props
          studentId: studentId, // Student ID from auth
          answers: answers,
        },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
  
      const result = response.data;
      console.log(result);
      
      setQuizResult(result);
      setView('result')
      // Optionally redirect or update the UI with the result
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setAlert({message:'Failed to submit quiz. Please try again.',status:'error'});
      setShowAlert(true)
    }
  };

  useEffect(()=>{
    console.log('student',student);
  },[student])
  

  return (
    <div>
      {(view === "result" && quizResult) ? (
        <QuizResult
          score={quizResult.correctAnswers}
          totalQuestions={quizResult.totalQuestions}
          status={quizResult.status}
          id={id}
          studentName={`${student.firstName} ${student.lastName}`}
          courseName={course.courseName}
          mentorName={course.mentorName}
          date={new Date().toLocaleDateString()}
          onNavigateToQuiz={() =>navigate(`/purchased/${id}`)} 
        />
      ) : (
        <div className="container mx-auto p-6 max-w-screen-xl">
          <div className='w-full flex items-center'>
        {showAlert && (
          <Alert  
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      </div>
          <div className="mb-10 flex justify-center mt-10">
            <h1 className="text-3xl font-semibold">Quiz</h1>
          </div>
  
          {questions.map((quiz, index) => (
            <div key={index} className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{`${index + 1}. ${quiz.question}`}</h2>
              <div className="mt-2 space-y-2">
                {quiz.options.map((option, optIndex) => (
                  <label key={optIndex} className="block">
                    <input
                      type="radio"
                      name={`question-${quiz.id}`}
                      value={option}
                      checked={selectedAnswers[quiz.id] === option}
                      onChange={() => handleAnswerChange(quiz.id, option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                ))}
              </div>
              {isAdmin && (
                <p className="mt-2 text-green-600 font-bold">
                  Correct Answer: {quiz.answer}
                </p>
              )}
            </div>
          ))}
  
          <div className="mt-10 flex justify-center">
            {isAdmin ? (
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Back
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
  
};

export default QuizView;

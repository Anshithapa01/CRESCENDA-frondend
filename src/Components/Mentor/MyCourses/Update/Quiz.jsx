import React, { useEffect, useState } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Modal from '../../../OtherComponents/Modal';
import { QA_BASE_URL } from '../../../../Config/apiConfig';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Alert from '../../../OtherComponents/Alert';

const Quiz = () => {
  const [openQuizIndex, setOpenQuizIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [currentValues, setCurrentValues] = useState({ question: '', options: ['', '', '', ''], answer: '' });
  const [questions, setQuestions] =  useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [showAlert, setShowAlert] = React.useState(false);
  const [alert, setAlert] = useState({message:'',status:''});
  const { id } = useParams();
  const navigate=useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isMentor = path.includes("/mentor/");
  const auth=isMentor?useSelector((store) => store.mentorAuth.jwt):useSelector((store) => store.qaAuth.qaJwt)

  const validateForm = (values) => {
    const errors = {};
    if (!values.question) errors.question = 'Question is required';
    if (!values.option1) errors.option1 = 'Option 1 is required';
    if (!values.option2) errors.option2 = 'Option 2 is required';
    if (!values.option3) errors.option3 = 'Option 3 is required';
    if (!values.option4) errors.option4 = 'Option 4 is required';
    if (!values.answer) errors.answer = 'Answer is required';
    return errors;
  };
  
  const handleFieldChange = (field, value) => {
    // Update the field's value in currentValues
    setCurrentValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  
    // Inline validation for the field
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (!value.trim()) {
        newErrors[field] = `${field} is required`;
      } else {
        delete newErrors[field]; // Remove error if valid
      }
      return newErrors;
    });
  };
  

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const response = await axios.get(`${QA_BASE_URL}/quiz/draft/${id}`, {
          headers: { Authorization: `Bearer ${auth}` },
        });
  
        const quizzes = response.data || [];
        
        setQuestions(
          quizzes.map((quiz) => ({
            id: quiz.quizId,
            question: quiz.question || "", // Default to empty string if missing
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

  const handleQuizToggle = (index) => {
    setOpenQuizIndex(openQuizIndex === index ? null : index);
  };

  const handleOpenModal = (type, values = {}) => {
    setModalType(type);
    console.log('values',values);
    
    setCurrentValues({
      question: values.question || '',
      option1: values.options ? values.options[0] : '',
      option2: values.options ? values.options[1] : '',
      option3: values.options ? values.options[2] : '',
      option4: values.options ? values.options[3] : '',
      answer: values.answer || '',
      id: values.id || null,
      index: values.index !== undefined ? values.index : null,
    });
    setIsModalOpen(true);
  };
  

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentValues({ question: '', options: ['', '', '', ''], answer: '' });
  };

  const handleSave = async(updatedValues) => {

    const errors = validateForm(updatedValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors); // Update state with validation errors
      return; // Prevent submission
    }

    // Create options array from individual fields
    const options = [
      updatedValues.option1,
      updatedValues.option2,
      updatedValues.option3,
      updatedValues.option4,
    ];

    const newQuiz = {
      question: updatedValues.question,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      answer: updatedValues.answer,
      draft: id, 
    };
    
    console.log(newQuiz);
    
    if (modalType === 'addQuestion') {
      try {
        const response = await axios.post(`${QA_BASE_URL}/quiz`, newQuiz,{
          headers: {"Content-Type": "application/json",
             Authorization: `Bearer ${auth}` },
        });
        setAlert({ message: 'Question added successfully!', status: 'success' });
        setShowAlert(true);
        const addedQuiz = response.data;
        setQuestions((prevQuestions) => [
          ...prevQuestions,
          {
            id: addedQuiz.quizId,
            question: addedQuiz.question,
            options: [
              addedQuiz.option1,
              addedQuiz.option2,
              addedQuiz.option3,
              addedQuiz.option4,
            ],
            answer: addedQuiz.answer,
          },
        ]);
      } catch (error) {
        setAlert({ message: 'Failed to add question!', status: 'error' });
        setShowAlert(true);
        console.error("Error adding quiz:", error);
      }
    } else if (modalType === 'editQuestion') {
      try {
        console.log('currentValues',currentValues);
        
        const updatedQuiz = await axios.put(`${QA_BASE_URL}/quiz/${currentValues.id}`, newQuiz,{
          headers: { "Content-Type": "application/json",Authorization: `Bearer ${auth}` },
        });
        setAlert({ message: 'Question updated successfully!', status: 'success' });
        setShowAlert(true);
        setQuestions(
          questions.map((quiz, index) =>
            index === currentValues.index
              ? {
                  id: updatedQuiz.data.quizId, // Ensure consistent IDs
                  question: updatedQuiz.data.question,
                  options: [
                    updatedQuiz.data.option1,
                    updatedQuiz.data.option2,
                    updatedQuiz.data.option3,
                    updatedQuiz.data.option4,
                  ],
                  answer: updatedQuiz.data.answer,
                }
              : quiz
          )
        );
      } catch (error) {
        setAlert({ message: 'Failed to update question!', status: 'error' });
        setShowAlert(true);
        console.error("Error updating quiz:", error);
      }
    }
    handleCloseModal();
  };
  
  const handleRemoveQuestion = async (index) => {
    try {
      await axios.delete(`${QA_BASE_URL}/quiz/${questions[index].id}`,{
        headers: { Authorization: `Bearer ${auth}` },
      });
      setAlert({ message: 'Question deleted successfully!', status: 'success' });
      setShowAlert(true);
      setQuestions(questions.filter((_, i) => i !== index));
    } catch (error) {
      setAlert({ message: 'Failed to delete question!', status: 'error' });
      setShowAlert(true);
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-screen-xl">
      {showAlert && (
          <Alert 
            message={alert.message}
            status={alert.status}
            onClose={() =>{
              setShowAlert(false);
              setAlert({ message: '', status: '' });}} 
          />)}
      <div className="mb-10 flex justify-center mt-10">
        <h1 className="text-3xl font-semibold">Quiz Management</h1>
      </div>

      {questions.map((quiz, index) => {
        if (!quiz) return null; 

        return (  
          <div key={index} className="mt-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleQuizToggle(index)}
                className="w-full flex justify-between items-center text-xl font-thin px-4 py-2 bg-gray-100 rounded-lg"
              >
                {`${index + 1}. ${quiz.question}`}
                <span>
                  {openQuizIndex === index ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
                </span>
              </button>
            </div>
            {openQuizIndex === index && (
              <div className="mt-2 px-4">
                <ul className="list-disc ml-8">
                  {quiz.options.map((option, optIndex) => (
                    <li key={optIndex} className="text-gray-700 my-2">
                      {option}
                    </li>
                  ))}
                </ul>
                <p className="font-bold">Answer: {quiz.answer}</p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleOpenModal("editQuestion", { ...quiz, index })}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveQuestion(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        );
})}



      <div className="mt-4 flex justify-end">
        <button
          onClick={() => handleOpenModal('addQuestion')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Question
        </button>
      </div>

      {isModalOpen && (
        <Modal
        title={modalType === 'addQuestion' ? 'Add New Question' : 'Edit Question'}
        fields={[
          { label: 'Question', name: 'question', type: 'text' },
          { label: 'Answer', name: 'answer', type: 'text' },
          { label: 'Option 1', name: 'option1', type: 'text' },
          { label: 'Option 2', name: 'option2', type: 'text' },
          { label: 'Option 3', name: 'option3', type: 'text' },
          { label: 'Option 4', name: 'option4', type: 'text' },
        ]}
        onChange={handleFieldChange}
        values={currentValues}
        onSave={handleSave}
        onCancel={handleCloseModal}
        formErrors={formErrors}
      />

      )}
    <div className='w-full pt-10 flex justify-center'>
        <button onClick={()=>navigate(isMentor?'/mentor/courses/all':'/qa/dashboard')} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  );
};

export default Quiz;

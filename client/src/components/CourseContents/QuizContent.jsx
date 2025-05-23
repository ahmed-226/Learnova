import React, { useState } from 'react';

const QuizContent = ({ content, onComplete, onNext, isCompleted }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  
  const quizData = {
    title: content.title,
    description: "Test your knowledge of the concepts covered in this module.",
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        type: "MULTIPLE_CHOICE",
        options: [
          "Hyper Text Markup Language",
          "Hyper Transfer Markup Language",
          "High Text Machine Language",
          "Hyper Technical Markup Logic"
        ],
        correctAnswer: "0" 
      },
      {
        id: 2,
        question: "Which CSS property is used to control the spacing between elements?",
        type: "MULTIPLE_CHOICE",
        options: [
          "spacing",
          "margin",
          "padding",
          "border"
        ],
        correctAnswer: "1"
      },
      {
        id: 3,
        question: "JavaScript is a statically-typed language.",
        type: "TRUE_FALSE",
        correctAnswer: "false"
      },
      {
        id: 4,
        question: "HTML5 introduced native support for video elements.",
        type: "TRUE_FALSE",
        correctAnswer: "true"
      }
    ],
    passingScore: 70
  };
  
  const handleOptionSelect = (questionIndex, answer) => {
    if (quizSubmitted) return;
    
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    
    quizData.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return Math.round((correctCount / quizData.questions.length) * 100);
  };
  
  const handleQuizSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setQuizSubmitted(true);
    
    if (calculatedScore >= quizData.passingScore) {
      onComplete();
    }
  };

  
  const isQuestionAnswered = (questionIndex) => {
    return answers[questionIndex] !== undefined;
  };
  
  
  const renderQuestionContent = (question, questionIndex) => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <div 
                key={optionIndex}
                className={`border rounded-md p-3 cursor-pointer transition-colors ${
                  answers[questionIndex] === optionIndex.toString() 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
                onClick={() => handleOptionSelect(questionIndex, optionIndex.toString())}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                    answers[questionIndex] === optionIndex.toString() 
                      ? 'border-primary-500 bg-primary-500 text-white' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answers[questionIndex] === optionIndex.toString() && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-3">
            {['true', 'false'].map((option) => (
              <div 
                key={option}
                className={`border rounded-md p-3 cursor-pointer transition-colors ${
                  answers[questionIndex] === option 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
                onClick={() => handleOptionSelect(questionIndex, option)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                    answers[questionIndex] === option 
                      ? 'border-primary-500 bg-primary-500 text-white' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {answers[questionIndex] === option && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="capitalize">{option}</span>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <p className="text-red-500">Unsupported question type: {question.type}</p>;
    }
  };

  
  const renderReviewAnswer = (question, questionIndex) => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div 
                key={optionIndex}
                className={`p-2 rounded-md ${
                  optionIndex.toString() === question.correctAnswer
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : answers[questionIndex] === optionIndex.toString() && optionIndex.toString() !== question.correctAnswer
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center text-xs">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span>{option}</span>
                  
                  {optionIndex.toString() === question.correctAnswer && (
                    <svg className="w-4 h-4 ml-auto text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-2">
            {['true', 'false'].map((option) => (
              <div 
                key={option}
                className={`p-2 rounded-md ${
                  option === question.correctAnswer
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                    : answers[questionIndex] === option && option !== question.correctAnswer
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                      : 'bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="capitalize">{option}</span>
                  
                  {option === question.correctAnswer && (
                    <svg className="w-4 h-4 ml-auto text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <p className="text-red-500">Unsupported question type: {question.type}</p>;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {!quizSubmitted ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{quizData.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{quizData.description}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
              <div 
                className="bg-primary-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Current Question */}
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-4">
                Question {currentQuestion + 1} of {quizData.questions.length}
              </h2>
              
              <div className="mb-4 flex items-center">
                <p className="flex-grow">{quizData.questions[currentQuestion].question}</p>
                <span className="text-xs font-medium py-1 px-2 bg-gray-100 dark:bg-gray-800 rounded">
                  {quizData.questions[currentQuestion].type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' : 'True / False'}
                </span>
              </div>
              
              {renderQuestionContent(quizData.questions[currentQuestion], currentQuestion)}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              className="btn btn-outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            
            {currentQuestion === quizData.questions.length - 1 ? (
              <button 
                className="btn btn-primary"
                onClick={handleQuizSubmit}
                disabled={Object.keys(answers).length !== quizData.questions.length}
              >
                Submit Quiz
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={handleNextQuestion}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
            score >= quizData.passingScore 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            <span className="text-3xl font-bold">{score}%</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">
            {score >= quizData.passingScore ? 'Congratulations!' : 'Not quite there yet'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {score >= quizData.passingScore 
              ? `You passed the quiz with a score of ${score}%` 
              : `You scored ${score}%. You need ${quizData.passingScore}% to pass the quiz.`
            }
          </p>
          
          {/* Review Answers */}
          <div className="card p-6 mb-8">
            <h2 className="text-lg font-medium mb-4 text-left">Review Your Answers</h2>
            
            <div className="space-y-6 text-left">
              {quizData.questions.map((question, qIndex) => (
                <div key={qIndex} className="border-b dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center mb-2">
                    <p className="font-medium flex-grow">{question.question}</p>
                    <span className="text-xs font-medium py-1 px-2 bg-gray-100 dark:bg-gray-800 rounded">
                      {question.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' : 'True / False'}
                    </span>
                  </div>
                  
                  {renderReviewAnswer(question, qIndex)}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            {score < quizData.passingScore && (
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setQuizSubmitted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
              >
                Retry Quiz
              </button>
            )}
            
            <button 
              className="btn btn-primary"
              onClick={onNext}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizContent;
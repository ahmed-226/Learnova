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
        options: [
          "Hyper Text Markup Language",
          "Hyper Transfer Markup Language",
          "High Text Machine Language",
          "Hyper Technical Markup Logic"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Which CSS property is used to control the spacing between elements?",
        options: [
          "spacing",
          "margin",
          "padding",
          "border"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Which of the following is NOT a JavaScript data type?",
        options: [
          "String",
          "Boolean",
          "Float",
          "Object"
        ],
        correctAnswer: 2
      }
    ],
    passingScore: 70
  };
  
  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (quizSubmitted) return;
    
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
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
              
              <p className="mb-4">{quizData.questions[currentQuestion].question}</p>
              
              <div className="space-y-3">
                {quizData.questions[currentQuestion].options.map((option, index) => (
                  <div 
                    key={index}
                    className={`border rounded-md p-3 cursor-pointer transition-colors ${
                      answers[currentQuestion] === index 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                    onClick={() => handleOptionSelect(currentQuestion, index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                        answers[currentQuestion] === index 
                          ? 'border-primary-500 bg-primary-500 text-white' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {answers[currentQuestion] === index && (
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
                  <p className="font-medium mb-2">{question.question}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div 
                        key={oIndex}
                        className={`p-2 rounded-md ${
                          oIndex === question.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                            : answers[qIndex] === oIndex && oIndex !== question.correctAnswer
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                              : 'bg-gray-50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="w-5 h-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span>{option}</span>
                          
                          {oIndex === question.correctAnswer && (
                            <svg className="w-4 h-4 ml-auto text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
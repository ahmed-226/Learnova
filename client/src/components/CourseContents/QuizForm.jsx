import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { marked } from 'marked';

const QuizForm = ({ moduleId, onCancel, onSave }) => {
  
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    timeLimit: '', 
    passingScore: 70, 
    shuffleQuestions: false,
    showCorrectAnswers: true,
    isPublished: true
  });
  
  
  const [questions, setQuestions] = useState([]);
  
  
  const [currentQuestion, setCurrentQuestion] = useState(null); 
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  
  const getQuestionTemplate = (type) => ({
    id: Date.now(),
    type,
    text: '',
    points: 10,
    options: type === 'multiple_choice' ? [
      { id: Date.now(), text: '', isCorrect: false },
      { id: Date.now() + 1, text: '', isCorrect: false }
    ] : [],
    answer: type === 'true_false' ? 'true' : '',
    feedback: {
      correct: '',
      incorrect: ''
    }
  });
  
  
  const handleQuizChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setQuizData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  
  const handleAddQuestion = (type) => {
    const newQuestion = getQuestionTemplate(type);
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion(newQuestion.id);
  };
  
  
  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };
  
  
  const handleOptionChange = (questionId, optionId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const updatedOptions = q.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, [field]: value };
          }
          
          
          if (field === 'isCorrect' && value === true) {
            return { ...opt, isCorrect: opt.id === optionId };
          }
          
          return opt;
        });
        
        return { ...q, options: updatedOptions };
      }
      return q;
    }));
  };
  
  
  const handleAddOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: [
            ...q.options,
            { id: Date.now(), text: '', isCorrect: false }
          ]
        };
      }
      return q;
    }));
  };
  
  
  const handleRemoveOption = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.filter(opt => opt.id !== optionId)
        };
      }
      return q;
    }));
  };
  
  
  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
    if (currentQuestion === questionId) {
      setCurrentQuestion(null);
    }
  };
  
  
  const handleFeedbackChange = (questionId, feedbackType, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          feedback: {
            ...q.feedback,
            [feedbackType]: value
          }
        };
      }
      return q;
    }));
  };
  
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setQuestions(items);
  };
  
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!quizData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    }
    
    if (quizData.timeLimit && (isNaN(quizData.timeLimit) || parseInt(quizData.timeLimit) <= 0)) {
      newErrors.timeLimit = 'Time limit must be a positive number';
    }
    
    if (isNaN(quizData.passingScore) || quizData.passingScore < 0 || quizData.passingScore > 100) {
      newErrors.passingScore = 'Passing score must be between 0 and 100';
    }
    
    if (questions.length === 0) {
      newErrors.questions = 'Add at least one question to your quiz';
    } else {
      
      let invalidQuestions = false;
      
      questions.forEach((question, index) => {
        if (!question.text.trim()) {
          invalidQuestions = true;
        }
        
        if (question.type === 'multiple_choice') {
          
          if (question.options.length < 2) {
            invalidQuestions = true;
          }
          
          
          if (question.options.some(opt => !opt.text.trim())) {
            invalidQuestions = true;
          }
          
          
          if (!question.options.some(opt => opt.isCorrect)) {
            invalidQuestions = true;
          }
        }
        
        if (question.type === 'short_answer' && !question.answer.trim()) {
          invalidQuestions = true;
        }
      });
      
      if (invalidQuestions) {
        newErrors.questions = 'One or more questions are incomplete or invalid';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      const formattedData = {
        ...quizData,
        moduleId,
        questions,
        type: 'quiz',
        totalPoints: questions.reduce((sum, q) => sum + parseInt(q.points || 0), 0)
      };
      
      onSave(formattedData);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setErrors({ submit: 'Failed to create quiz. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  const insertMarkdown = (field, template) => {
    if (field === 'description') {
      const textArea = document.getElementById('quiz-description');
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = quizData.description;
      
      const beforeSelection = text.substring(0, start);
      const selection = text.substring(start, end);
      const afterSelection = text.substring(end);
      
      
      const newText = beforeSelection + 
        template.replace('$1', selection || '') + 
        afterSelection;
      
      setQuizData(prev => ({ ...prev, description: newText }));
      
      
      setTimeout(() => {
        textArea.focus();
        
        
        const newCursorPos = template.includes('$1') && selection
          ? start + template.indexOf('$1') + selection.length
          : start + template.length;
        
        textArea.setSelectionRange(newCursorPos, newCursorPos);
      }, 10);
    } else if (currentQuestion) {
      
      const textArea = document.getElementById(`question-${currentQuestion}`);
      if (!textArea) return;
      
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = questions.find(q => q.id === currentQuestion)?.text || '';
      
      const beforeSelection = text.substring(0, start);
      const selection = text.substring(start, end);
      const afterSelection = text.substring(end);
      
      const newText = beforeSelection + 
        template.replace('$1', selection || '') + 
        afterSelection;
      
      handleQuestionChange(currentQuestion, 'text', newText);
      
      
      setTimeout(() => {
        textArea.focus();
        
        const newCursorPos = template.includes('$1') && selection
          ? start + template.indexOf('$1') + selection.length
          : start + template.length;
        
        textArea.setSelectionRange(newCursorPos, newCursorPos);
      }, 10);
    }
  };
  
  
  const totalPoints = questions.reduce((sum, q) => sum + parseInt(q.points || 0), 0);
  
  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {errors.submit && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          {errors.submit}
        </div>
      )}
      
      {/* Quiz Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quiz Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={quizData.title}
          onChange={handleQuizChange}
          className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
          placeholder="e.g., Module 1 Assessment"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>
      
      {/* Quiz Description with Markdown */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quiz Description
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`text-xs px-2 py-1 rounded ${!previewMode 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`text-xs px-2 py-1 rounded ${previewMode 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
            >
              Preview
            </button>
          </div>
        </div>
        
        {/* Markdown Toolbar */}
        {!previewMode && (
          <div className="flex flex-wrap gap-1 mb-2 p-1 border border-gray-300 dark:border-gray-700 rounded-t-md bg-gray-50 dark:bg-gray-800">
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Bold" onClick={() => insertMarkdown('description', '**$1**')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 13h8m-8 6h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </svg>
            </button>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Italic" onClick={() => insertMarkdown('description', '*$1*')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <div className="border-r border-gray-300 dark:border-gray-700 mx-1 h-6"></div>
            <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded" title="Bullet List" onClick={() => insertMarkdown('description', '\n- $1\n')}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Description Editor/Preview */}
        {previewMode ? (
          <div 
            className="w-full min-h-[100px] p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm overflow-auto prose prose-primary dark:prose-invert max-w-none bg-white dark:bg-dark-card"
            dangerouslySetInnerHTML={{ __html: marked(quizData.description || '') }}
          />
        ) : (
          <textarea
            id="quiz-description"
            name="description"
            value={quizData.description}
            onChange={handleQuizChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100 font-mono"
            placeholder="Instructions for students taking this quiz. You can use Markdown for formatting."
          ></textarea>
        )}
      </div>
      
      {/* Quiz Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Limit */}
        <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            min="0"
            id="timeLimit"
            name="timeLimit"
            value={quizData.timeLimit}
            onChange={handleQuizChange}
            className={`w-full px-3 py-2 border ${errors.timeLimit ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
            placeholder="Leave blank for no time limit"
          />
          {errors.timeLimit && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.timeLimit}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Leave empty for unlimited time
          </p>
        </div>
        
        {/* Passing Score */}
        <div>
          <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Passing Score (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            id="passingScore"
            name="passingScore"
            value={quizData.passingScore}
            onChange={handleQuizChange}
            className={`w-full px-3 py-2 border ${errors.passingScore ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100`}
            placeholder="e.g., 70"
          />
          {errors.passingScore && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.passingScore}</p>
          )}
        </div>
      </div>
      
      {/* Additional Quiz Options */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="shuffleQuestions"
            name="shuffleQuestions"
            checked={quizData.shuffleQuestions}
            onChange={handleQuizChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="shuffleQuestions" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Shuffle question order for each student
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showCorrectAnswers"
            name="showCorrectAnswers"
            checked={quizData.showCorrectAnswers}
            onChange={handleQuizChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="showCorrectAnswers" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Show correct answers after submission
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            checked={quizData.isPublished}
            onChange={handleQuizChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Make this quiz available to students immediately
          </label>
        </div>
      </div>
      
      {/* Questions Section */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Questions</h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total Points: {totalPoints}
          </span>
        </div>
        
        {errors.questions && (
          <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {errors.questions}
          </div>
        )}
        
        {/* Question List */}
        <div className="space-y-4 mb-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {questions.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No questions added yet. Add your first question to get started.
                      </p>
                    </div>
                  ) : (
                    questions.map((question, index) => (
                      <Draggable key={question.id} draggableId={`question-${question.id}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                          >
                            {/* Question Header */}
                            <div 
                              className={`p-3 flex justify-between items-center ${currentQuestion === question.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                              {...provided.dragHandleProps}
                            >
                              <div className="flex items-center">
                                <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-800 dark:text-gray-200 mr-2">
                                  {index + 1}
                                </span>
                                <span className="font-medium truncate max-w-md">
                                  {question.text ? question.text.substring(0, 50) + (question.text.length > 50 ? '...' : '') : 'Untitled Question'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs bg-gray-200 dark:bg-gray-700 py-1 px-2 rounded text-gray-800 dark:text-gray-200">
                                  {question.points} pts
                                </span>
                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 py-1 px-2 rounded text-blue-800 dark:text-blue-300 capitalize">
                                  {question.type.replace('_', ' ')}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setCurrentQuestion(currentQuestion === question.id ? null : question.id)}
                                  className="p-1.5 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                  className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Question Edit Form */}
                            {currentQuestion === question.id && (
                              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <div className="space-y-4">
                                  {/* Question Text */}
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Question Text <span className="text-red-500">*</span>
                                      </label>
                                      
                                      {/* Simple markdown toolbar */}
                                      <div className="flex flex-wrap gap-1">
                                        <button 
                                          type="button" 
                                          className="p-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                          onClick={() => insertMarkdown('question', '**$1**')}
                                        >
                                          B
                                        </button>
                                        <button 
                                          type="button" 
                                          className="p-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded italic"
                                          onClick={() => insertMarkdown('question', '*$1*')}
                                        >
                                          I
                                        </button>
                                        <button 
                                          type="button" 
                                          className="p-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                          onClick={() => insertMarkdown('question', '`$1`')}
                                        >
                                          Code
                                        </button>
                                      </div>
                                    </div>
                                    <textarea
                                      id={`question-${question.id}`}
                                      value={question.text}
                                      onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                                      rows="3"
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                                      placeholder="Enter your question here. You can use markdown formatting."
                                    ></textarea>
                                    <div className="mt-1">
                                      <div className="flex justify-between">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          Markdown formatting supported
                                        </p>
                                        <div className="flex items-center space-x-2">
                                          <label className="text-xs text-gray-700 dark:text-gray-300">Points:</label>
                                          <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={question.points}
                                            onChange={(e) => handleQuestionChange(question.id, 'points', e.target.value)}
                                            className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Answer Options Based on Question Type */}
                                  {question.type === 'multiple_choice' && (
                                    <div className="space-y-3">
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Answer Options <span className="text-red-500">*</span>
                                      </label>
                                      
                                      {question.options.map((option, optIndex) => (
                                        <div key={option.id} className="flex items-center gap-3">
                                          <input
                                            type="checkbox"
                                            checked={option.isCorrect}
                                            onChange={(e) => handleOptionChange(question.id, option.id, 'isCorrect', e.target.checked)}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                          />
                                          <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                                            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                                            placeholder={`Option ${optIndex + 1}`}
                                          />
                                          {question.options.length > 2 && (
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveOption(question.id, option.id)}
                                              className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                              </svg>
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                      
                                      <button
                                        type="button"
                                        onClick={() => handleAddOption(question.id)}
                                        className="mt-2 flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                      >
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Option
                                      </button>
                                      
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        Check the box next to correct option(s).
                                      </p>
                                    </div>
                                  )}
                                  
                                  {question.type === 'true_false' && (
                                    <div className="space-y-3">
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Correct Answer <span className="text-red-500">*</span>
                                      </label>
                                      <div className="flex space-x-4">
                                        <div className="flex items-center">
                                          <input
                                            type="radio"
                                            id={`true-${question.id}`}
                                            name={`answer-${question.id}`}
                                            checked={question.answer === 'true'}
                                            onChange={() => handleQuestionChange(question.id, 'answer', 'true')}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                          />
                                          <label htmlFor={`true-${question.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            True
                                          </label>
                                        </div>
                                        <div className="flex items-center">
                                          <input
                                            type="radio"
                                            id={`false-${question.id}`}
                                            name={`answer-${question.id}`}
                                            checked={question.answer === 'false'}
                                            onChange={() => handleQuestionChange(question.id, 'answer', 'false')}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                          />
                                          <label htmlFor={`false-${question.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            False
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {question.type === 'short_answer' && (
                                    <div className="space-y-2">
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Acceptable Answer(s) <span className="text-red-500">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={question.answer}
                                        onChange={(e) => handleQuestionChange(question.id, 'answer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                                        placeholder="Enter acceptable answers, separate multiple answers with commas"
                                      />
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        For multiple acceptable answers, separate with commas (e.g. "Paris, paris, PARIS")
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* Feedback Section */}
                                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Student Feedback (Optional)</h4>
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                          For correct answers:
                                        </label>
                                        <input
                                          type="text"
                                          value={question.feedback.correct}
                                          onChange={(e) => handleFeedbackChange(question.id, 'correct', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                                          placeholder="e.g., Great job! That's correct."
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                          For incorrect answers:
                                        </label>
                                        <input
                                          type="text"
                                          value={question.feedback.incorrect}
                                          onChange={(e) => handleFeedbackChange(question.id, 'incorrect', e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                                          placeholder="e.g., Not quite. Review section 2.3 for more information."
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        
        {/* Add Question Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleAddQuestion('multiple_choice')}
            className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Multiple Choice
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion('true_false')}
            className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            True/False
          </button>
          <button
            type="button"
            onClick={() => handleAddQuestion('short_answer')}
            className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Short Answer
          </button>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save Quiz'
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default QuizForm;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

import TextLessonForm from '../components/CourseContents/TextLessonForm';
import VideoLessonForm from '../components/CourseContents/VideoLessonForm';
import QuizForm from '../components/CourseContents/QuizForm';
import AssignmentForm from '../components/CourseContents/AssignmentForm';

const CourseModuleManagementPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  
  
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: ''
  });
  
  
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        
        
        
        
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockCourse = {
          id: courseId,
          title: 'Web Development Fundamentals',
          description: 'Learn the essentials of web development',
          coverImage: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80'
        };
        
        const mockModules = [
          {
            id: 1,
            title: 'Introduction to HTML',
            description: 'Learn the basics of HTML document structure',
            order: 1,
            content: [
              { id: 1, type: 'text', title: 'HTML Structure', order: 1 },
              { id: 2, type: 'video', title: 'HTML Tags Explained', order: 2 },
              { id: 3, type: 'quiz', title: 'HTML Basics Quiz', order: 3 }
            ]
          },
          {
            id: 2,
            title: 'CSS Styling',
            description: 'Master the fundamentals of CSS styling',
            order: 2,
            content: [
              { id: 4, type: 'text', title: 'CSS Selectors', order: 1 },
              { id: 5, type: 'assignment', title: 'Style a Webpage', order: 2 }
            ]
          }
        ];
        
        setCourse(mockCourse);
        setModules(mockModules);
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError('Failed to load course data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId]);
  
  
  const toggleModule = (moduleId) => {
        setActiveModuleId(activeModuleId === moduleId ? null : moduleId);
    };
    
    const handleSaveTextLesson = async (lessonData) => {
    try {
        
        
        
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        
        const newLesson = {
        id: Date.now(), 
        type: 'text',
        title: lessonData.title,
        content: lessonData.content,
        estimatedTime: lessonData.estimatedTime,
        isPublished: lessonData.isPublished,
        order: 0 
        };
        
        
        const updatedModules = modules.map(module => {
        if (module.id === selectedModule) {
            
            const highestOrder = module.content.length > 0 
            ? Math.max(...module.content.map(item => item.order))
            : 0;
            
            
            const newContent = {
            ...newLesson,
            order: highestOrder + 1
            };
            
            return {
            ...module,
            content: [...module.content, newContent]
            };
        }
        return module;
        });
        
        setModules(updatedModules);
        setSelectedContentType(null); 
        
        
        alert('Lesson created successfully!');
    } catch (error) {
        console.error('Error creating lesson:', error);
        alert('Failed to create lesson. Please try again.');
    }
    };

    const handleSaveAssignment = async (assignmentData) => {
  try {
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    
    const newAssignment = {
      id: Date.now(),
      type: 'assignment',
      title: assignmentData.title,
      instructions: assignmentData.instructions,
      submissionType: assignmentData.submissionType,
      allowedFileTypes: assignmentData.allowedFileTypes,
      maxFileSize: assignmentData.maxFileSize,
      deadline: assignmentData.deadline,
      totalPoints: assignmentData.totalPoints,
      passingGrade: assignmentData.passingGrade,
      isGroupAssignment: assignmentData.isGroupAssignment,
      isPublished: assignmentData.isPublished,
      order: 0
    };
    
    
    const updatedModules = modules.map(module => {
      if (module.id === selectedModule) {
        
        const highestOrder = module.content.length > 0 
          ? Math.max(...module.content.map(item => item.order))
          : 0;
        
        
        const newContent = {
          ...newAssignment,
          order: highestOrder + 1
        };
        
        return {
          ...module,
          content: [...module.content, newContent]
        };
      }
      return module;
    });
    
    setModules(updatedModules);
    setSelectedContentType(null); 
    
    
    alert('Assignment created successfully!');
  } catch (error) {
    console.error('Error creating assignment:', error);
    alert('Failed to create assignment. Please try again.');
  }
};

    const handleSaveQuiz = async (quizData) => {
  try {
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    
    const newQuiz = {
      id: Date.now(),
      type: 'quiz',
      title: quizData.title,
      description: quizData.description,
      timeLimit: quizData.timeLimit,
      passingScore: quizData.passingScore,
      shuffleQuestions: quizData.shuffleQuestions,
      showCorrectAnswers: quizData.showCorrectAnswers,
      isPublished: quizData.isPublished,
      questions: quizData.questions,
      totalPoints: quizData.totalPoints,
      order: 0
    };
    
    
    const updatedModules = modules.map(module => {
      if (module.id === selectedModule) {
        
        const highestOrder = module.content.length > 0 
          ? Math.max(...module.content.map(item => item.order))
          : 0;
        
        
        const newContent = {
          ...newQuiz,
          order: highestOrder + 1
        };
        
        return {
          ...module,
          content: [...module.content, newContent]
        };
      }
      return module;
    });
    
    setModules(updatedModules);
    setSelectedContentType(null); 
    
    
    alert('Quiz created successfully!');
  } catch (error) {
    console.error('Error creating quiz:', error);
    alert('Failed to create quiz. Please try again.');
  }
};


    const handleSaveVideoLesson = async (lessonData) => {
        try {
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            
            const newLesson = {
            id: Date.now(),
            type: 'video',
            title: lessonData.title,
            videoUrl: lessonData.videoUrl,
            videoType: lessonData.videoType,
            description: lessonData.description,
            duration: lessonData.duration,
            isPublished: lessonData.isPublished,
            order: 0
            };
            
            
            const updatedModules = modules.map(module => {
            if (module.id === selectedModule) {
                
                const highestOrder = module.content.length > 0 
                ? Math.max(...module.content.map(item => item.order))
                : 0;
                
                
                const newContent = {
                ...newLesson,
                order: highestOrder + 1
                };
                
                return {
                ...module,
                content: [...module.content, newContent]
                };
            }
            return module;
            });
            
            setModules(updatedModules);
            setSelectedContentType(null); 
            
            
            alert('Video lesson created successfully!');
        } catch (error) {
            console.error('Error creating video lesson:', error);
            alert('Failed to create video lesson. Please try again.');
        }
        };


  
  const handleModuleFormChange = (e) => {
    const { name, value } = e.target;
    setModuleForm({
      ...moduleForm,
      [name]: value
    });
  };
  
  
  const handleAddModule = async (e) => {
    e.preventDefault();
    
    if (!moduleForm.title.trim()) {
      return;
    }
    
    try {
      
      
      
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newModule = {
        id: Date.now(), 
        title: moduleForm.title,
        description: moduleForm.description,
        order: modules.length + 1,
        content: []
      };
      
      setModules([...modules, newModule]);
      setModuleForm({ title: '', description: '' });
      setShowModuleForm(false);
      setActiveModuleId(newModule.id);
    } catch (err) {
      console.error('Error adding module:', err);
      alert('Failed to add module. Please try again.');
    }
  };
  
  
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { source, destination, type } = result;
    
    
    if (type === 'module') {
      const reorderedModules = [...modules];
      const [movedModule] = reorderedModules.splice(source.index, 1);
      reorderedModules.splice(destination.index, 0, movedModule);
      
      
      const updatedModules = reorderedModules.map((module, index) => ({
        ...module,
        order: index + 1
      }));
      
      setModules(updatedModules);
      
      
      
      
      
      
    }
    
    
    if (type === 'content') {
      const moduleId = parseInt(source.droppableId.replace('module-content-', ''));
      const moduleIndex = modules.findIndex(m => m.id === moduleId);
      
      if (moduleIndex !== -1) {
        const updatedModules = [...modules];
        const module = { ...updatedModules[moduleIndex] };
        const content = [...module.content];
        
        const [movedItem] = content.splice(source.index, 1);
        content.splice(destination.index, 0, movedItem);
        
        
        const updatedContent = content.map((item, index) => ({
          ...item,
          order: index + 1
        }));
        
        module.content = updatedContent;
        updatedModules[moduleIndex] = module;
        
        setModules(updatedModules);
        
        
        
      }
    }
  };
  
  
  const handleAddContent = (moduleId, contentType) => {
    setSelectedModule(moduleId);
    setSelectedContentType(contentType);
  };
  
  
  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module and all its content? This action cannot be undone.')) {
      try {
        
        
        
        
        await new Promise(resolve => setTimeout(resolve, 400));
        
        setModules(modules.filter(module => module.id !== moduleId));
      } catch (err) {
        console.error('Error deleting module:', err);
        alert('Failed to delete module. Please try again.');
      }
    }
  };
  
  
  const handleDeleteContent = async (moduleId, contentId, contentType) => {
    if (window.confirm(`Are you sure you want to delete this ${contentType}? This action cannot be undone.`)) {
      try {
        
        
        
        
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const updatedModules = modules.map(module => {
          if (module.id === moduleId) {
            return {
              ...module,
              content: module.content.filter(item => item.id !== contentId)
            };
          }
          return module;
        });
        
        setModules(updatedModules);
      } catch (err) {
        console.error(`Error deleting ${contentType}:`, err);
        alert(`Failed to delete ${contentType}. Please try again.`);
      }
    }
  };
  
  
  const getContentIcon = (type) => {
    switch (type) {
      case 'text':
        return (
          <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'assignment':
        return (
          <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading course data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="card p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to="/dashboard" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Manage Course Content</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {course?.title}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Link to={`/courses/${courseId}`} className="btn btn-outline btn-sm">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Course
              </Link>
              <button 
                onClick={() => setShowModuleForm(!showModuleForm)}
                className="btn btn-primary btn-sm"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Module
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Module Creation Form */}
        {showModuleForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Create New Module</h2>
              
              <form onSubmit={handleAddModule}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Module Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={moduleForm.title}
                    onChange={handleModuleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                    placeholder="e.g., Introduction to the Course"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Module Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={moduleForm.description}
                    onChange={handleModuleFormChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-gray-100"
                    placeholder="Brief overview of what this module covers"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModuleForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Module
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
        
        {/* Modules List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="modules" type="module">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {modules.length === 0 ? (
                  <div className="card p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-xl font-medium mb-2">No Modules Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start building your course by adding your first module.
                    </p>
                    <button 
                      onClick={() => setShowModuleForm(true)}
                      className="btn btn-primary"
                    >
                      Add Your First Module
                    </button>
                  </div>
                ) : (
                  <>
                    {modules.map((module, index) => (
                      <Draggable key={module.id} draggableId={`module-${module.id}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="card overflow-hidden"
                          >
                            {/* Module Header */}
                            <div 
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700"
                              {...provided.dragHandleProps}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center mr-3">
                                  {module.order}
                                </div>
                                <div>
                                  <h3 className="font-medium">{module.title}</h3>
                                  {module.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleDeleteModule(module.id)}
                                  className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  title="Delete Module"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => toggleModule(module.id)}
                                  className="p-1 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  title={activeModuleId === module.id ? "Collapse Module" : "Expand Module"}
                                >
                                  <svg className={`h-5 w-5 transition-transform ${activeModuleId === module.id ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Module Content */}
                            {activeModuleId === module.id && (
                              <div className="p-4">
                                <Droppable droppableId={`module-content-${module.id}`} type="content">
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className="space-y-2 mb-4"
                                    >
                                      {module.content.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                          <p className="text-gray-500 dark:text-gray-400">
                                            No content in this module yet. Add your first lesson, quiz, or assignment.
                                          </p>
                                        </div>
                                      ) : (
                                        module.content.map((content, contentIndex) => (
                                          <Draggable key={content.id} draggableId={`content-${content.id}`} index={contentIndex}>
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                                              >
                                                <div className="flex items-center">
                                                  <span className="mr-3">
                                                    {getContentIcon(content.type)}
                                                  </span>
                                                  <div>
                                                    <div className="font-medium">{content.title}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{content.type}</div>
                                                  </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-2">
                                                  <button
                                                    onClick={() => handleDeleteContent(module.id, content.id, content.type)}
                                                    className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    title="Delete Content"
                                                  >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                                
                                {/* Content Type Buttons */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                  <button
                                    onClick={() => handleAddContent(module.id, 'text')}
                                    className="btn btn-sm btn-outline flex items-center"
                                  >
                                    <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Text Lesson
                                  </button>
                                  <button
                                    onClick={() => handleAddContent(module.id, 'video')}
                                    className="btn btn-sm btn-outline flex items-center"
                                  >
                                    <svg className="h-4 w-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Video Lesson
                                  </button>
                                  <button
                                    onClick={() => handleAddContent(module.id, 'quiz')}
                                    className="btn btn-sm btn-outline flex items-center"
                                  >
                                    <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Quiz
                                  </button>
                                  <button
                                    onClick={() => handleAddContent(module.id, 'assignment')}
                                    className="btn btn-sm btn-outline flex items-center"
                                  >
                                    <svg className="h-4 w-4 mr-1 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Assignment
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        {/* Publish Course Button */}
        {modules.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button className="btn btn-success">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Publish Course
            </button>
          </div>
        )}
      </div>
      
      <Footer />
      
      {/* Content Creation Modal */}
      {selectedContentType && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold capitalize">
            {selectedContentType === 'text' ? 'Add Text Lesson' : 
             selectedContentType === 'video' ? 'Add Video Lesson' :
             selectedContentType === 'quiz' ? 'Create Quiz' : 'Create Assignment'}
          </h2>
          <button 
            onClick={() => setSelectedContentType(null)}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Render appropriate form based on content type */}
        {selectedContentType === 'text' ? (
          <TextLessonForm 
            moduleId={selectedModule}
            onCancel={() => setSelectedContentType(null)}
            onSave={handleSaveTextLesson}
          />
        ) : selectedContentType === 'video' ? (
          <VideoLessonForm 
                moduleId={selectedModule}
                onCancel={() => setSelectedContentType(null)}
                onSave={handleSaveVideoLesson}
            />
        ) : selectedContentType === 'quiz' ? (
            <QuizForm 
                moduleId={selectedModule}
                onCancel={() => setSelectedContentType(null)}
                onSave={handleSaveQuiz}
            />
        ) : (
<AssignmentForm 
    moduleId={selectedModule}
    onCancel={() => setSelectedContentType(null)}
    onSave={handleSaveAssignment}
  />        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CourseModuleManagementPage;
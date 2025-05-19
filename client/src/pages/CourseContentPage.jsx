import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TextLessonContent from '../components/CourseContents/TextLessonContent';
import VideoLessonContent from '../components/CourseContents/VideoLessonContent';
import QuizContent from '../components/CourseContents/QuizContent';
import AssignmentContent from '../components/CourseContents/AssignmentContent';
import {courseContent} from '../data/main.js'; 

const CourseContentPage = () => {
  const { courseId, contentId, contentType } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(courseContent);
  
  const [currentContent, setCurrentContent] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [nextContent, setNextContent] = useState(null);
  const [prevContent, setPrevContent] = useState(null);
  
  const toggleModule = (moduleId) => {
    if (activeModuleId === moduleId) {
      setActiveModuleId(null);
    } else {
      setActiveModuleId(moduleId);
    }
  };
  
  useEffect(() => {
    
    let foundContent = null;
    let foundModule = null;
    let prevContentItem = null;
    let nextContentItem = null;
    let prevModuleId = null;
    let nextModuleId = null;
    
    const allContent = [];
    
    course.modules.forEach((module, moduleIndex) => {
      const moduleItems = module.content.map(item => ({...item, moduleId: module.id, moduleTitle: module.title}));
      allContent.push(...moduleItems);
      
      
      const contentInModule = moduleItems.find(item => item.id === parseInt(contentId));
      if (contentInModule) {
        foundContent = contentInModule;
        foundModule = module;
        setActiveModuleId(module.id);
      }
    });
    
    
    if (allContent.length > 0) {
      const currentIndex = allContent.findIndex(item => item.id === parseInt(contentId));
      
      if (currentIndex > 0) {
        prevContentItem = allContent[currentIndex - 1];
      }
      
      if (currentIndex < allContent.length - 1 && currentIndex !== -1) {
        nextContentItem = allContent[currentIndex + 1];
      }
    }
    
    setCurrentContent(foundContent);
    setNextContent(nextContentItem);
    setPrevContent(prevContentItem);
    
    if (!foundContent && allContent.length > 0) {
      const firstContent = allContent[0];
      navigate(`/courses/${courseId}/${firstContent.type}/${firstContent.id}`);
    }
  }, [courseId, contentId, contentType, course]);
  
  
  const calculateProgress = () => {
    let completedItems = 0;
    let totalItems = 0;
    
    course.modules.forEach(module => {
      module.content.forEach(item => {
        totalItems++;
        if (item.isCompleted) completedItems++;
      });
    });
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };
  
  
  const markAsCompleted = () => {
    if (!currentContent) return;
    
    const updatedCourse = {...course};
    updatedCourse.modules = course.modules.map(module => {
      if (module.id === currentContent.moduleId) {
        return {
          ...module,
          content: module.content.map(item => {
            if (item.id === currentContent.id) {
              return { ...item, isCompleted: true };
            }
            return item;
          })
        };
      }
      return module;
    });
    
    setCourse(updatedCourse);
    
    
    console.log(`Marked content ${currentContent.id} as completed`);
  };
  
  const goToNextContent = () => {
    if (nextContent) {
      navigate(`/courses/${courseId}/${nextContent.type}/${nextContent.id}`);
      window.scrollTo(0, 0);
    }
  };
  
  const renderContent = () => {
    if (!currentContent) return <div className="p-8 text-center">Loading content...</div>;
    
    switch (currentContent.type) {
      case 'text':
        return (
          <TextLessonContent 
            content={currentContent} 
            onComplete={markAsCompleted} 
            onNext={goToNextContent}
            isCompleted={currentContent.isCompleted}
          />
        );
      case 'video':
        return (
          <VideoLessonContent 
            content={currentContent} 
            onComplete={markAsCompleted} 
            onNext={goToNextContent}
            isCompleted={currentContent.isCompleted}
          />
        );
      case 'quiz':
        return (
          <QuizContent 
            content={currentContent} 
            onComplete={markAsCompleted} 
            onNext={goToNextContent}
            isCompleted={currentContent.isCompleted}
          />
        );
      case 'assignment':
        return (
          <AssignmentContent 
            content={currentContent} 
            onComplete={markAsCompleted} 
            onNext={goToNextContent}
            isCompleted={currentContent.isCompleted}
          />
        );
      default:
        return <div className="p-8 text-center">Unknown content type</div>;
    }
  };

  
  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'text':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'assignment':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar - Course Content Navigation */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to={`/courses/${courseId}`} className="text-primary-600 dark:text-primary-400 text-sm flex items-center mb-4 hover:underline">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
            <h1 className="text-xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Instructor: {course.instructor}</p>
            
            {/* Progress Bar */}
            <div className="mb-1 flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{calculateProgress()}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600 rounded-full" 
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="p-2">
            {/* Module List */}
            <div className="space-y-2">
              {course.modules.map((module) => (
                <div key={module.id} className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                  <button 
                    className={`w-full px-4 py-3 flex justify-between items-center text-left transition-colors ${
                      module.isCompleted 
                        ? 'bg-green-50 dark:bg-green-900/10' 
                        : activeModuleId === module.id 
                          ? 'bg-primary-50 dark:bg-primary-900/10' 
                          : 'bg-white dark:bg-dark-card'
                    }`}
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center">
                      {module.isCompleted ? (
                        <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-xs mr-3">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center text-xs mr-3">
                          {module.id}
                        </span>
                      )}
                      <span className="font-medium text-sm">{module.title}</span>
                    </div>
                    <svg 
                      className={`h-5 w-5 transition-transform ${activeModuleId === module.id ? 'transform rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Module Content List */}
                  {activeModuleId === module.id && (
                    <div className="bg-gray-50 dark:bg-gray-800/30">
                      <ul className="py-2">
                        {module.content.map((item) => (
                          <li key={item.id}>
                            <Link 
                              to={`/courses/${courseId}/${item.type}/${item.id}`}
                              className={`flex items-center px-4 py-2 text-sm ${
                                currentContent && currentContent.id === item.id
                                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                  : item.isCompleted
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                              }`}
                            >
                              <span className="w-6 mr-3 flex justify-center">
                                {item.isCompleted ? (
                                  <svg className="h-4 w-4 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  getContentIcon(item.type)
                                )}
                              </span>
                              <div className="flex-grow overflow-hidden">
                                <span className="block truncate">{item.title}</span>
                              </div>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                {item.duration || (item.type === 'quiz' ? `${item.questions} questions` : '')}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto">
          {/* Content Navigation */}
          <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-between items-center">
            {prevContent ? (
              <Link 
                to={`/courses/${courseId}/${prevContent.type}/${prevContent.id}`}
                className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            ) : (
              <div></div>
            )}
            
            {currentContent && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentContent.moduleTitle} - {currentContent.title}
              </div>
            )}
            
            {nextContent ? (
              <Link 
                to={`/courses/${courseId}/${nextContent.type}/${nextContent.id}`}
                className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Next
                <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
          
          {/* Dynamic Content Area */}
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              key={currentContent?.id}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseContentPage;
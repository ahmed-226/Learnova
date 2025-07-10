import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TextLessonContent from '../components/CourseContents/TextLessonContent';
import VideoLessonContent from '../components/CourseContents/VideoLessonContent';
import QuizContent from '../components/CourseContents/QuizContent';
import AssignmentContent from '../components/CourseContents/AssignmentContent';
import { useAuth } from '../contexts/AuthContext';
import CourseCompletionCelebration from '../components/profile/CourseCompletionCelebration';


const CourseContentPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { api, user } = useAuth();

  const courseId = params.courseId;
  const contentId = params.contentId;
  const contentType = params.contentType;
  
  const [course, setCourse] = useState(null);
  const [currentContent, setCurrentContent] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [nextContent, setNextContent] = useState(null);
  const [prevContent, setPrevContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);
  const [completionAchievement, setCompletionAchievement] = useState(null);
  
  const toggleModule = (moduleId) => {
    if (activeModuleId === moduleId) {
      setActiveModuleId(null);
    } else {
      setActiveModuleId(moduleId);
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !api) return;

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching course content for course:', courseId);
        const response = await api.get(`/courses/${courseId}/content`);
        console.log('Course content response:', response.data);
        
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course content:', error);
        if (error.response?.status === 403) {
          setError('You must be enrolled in this course to access content');
        } else if (error.response?.status === 404) {
          setError('Course not found');
        } else {
          setError('Failed to load course content. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, api]);

useEffect(() => {
  if (!course) return;

  const allContent = [];
  
  course.modules.forEach((module) => {
    if (module.content && Array.isArray(module.content)) {
      const moduleItems = module.content.map(item => ({
        ...item, 
        moduleId: module.id, 
        moduleTitle: module.title
      }));
      allContent.push(...moduleItems);
    } else {
      const moduleItems = [];
      
      if (module.lessons) {
          moduleItems.push(...module.lessons.map(item => ({
            ...item,
            type: 'lesson',
            subType: item.videoUrl ? 'video' : 'text', 
            moduleId: module.id,
            moduleTitle: module.title
          })));
      }
      
      if (module.quizzes) {
        moduleItems.push(...module.quizzes.map(item => ({
          ...item,
          type: 'quiz',
          moduleId: module.id,
          moduleTitle: module.title
        })));
      }
      
      if (module.assignments) {
        moduleItems.push(...module.assignments.map(item => ({
          ...item,
          type: 'assignment',
          moduleId: module.id,
          moduleTitle: module.title
        })));
      }
      
      allContent.push(...moduleItems);
      module.content = moduleItems.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  });

  console.log('All content collected:', allContent);

    
    allContent.sort((a, b) => (a.order || 0) - (b.order || 0));

    if (contentId && contentType && allContent.length > 0) {
      const currentIndex = allContent.findIndex(item => {
        
        return item.type === contentType && item.order === parseInt(contentId);
      });
      
      if (currentIndex !== -1) {
        const content = allContent[currentIndex];
        setCurrentContent(content);
        setActiveModuleId(content.moduleId);
        
        if (currentIndex > 0) {
          setPrevContent(allContent[currentIndex - 1]);
        } else {
          setPrevContent(null);
        }
        
        if (currentIndex < allContent.length - 1) {
          setNextContent(allContent[currentIndex + 1]);
        } else {
          setNextContent(null);
        }
      } else {
        console.log('Content not found:', contentType, contentId);
        setError('Content not found');
      }
    } else if ((!contentId || !contentType) && allContent.length > 0) {
      console.log("Redirecting to first content");
      const firstContent = allContent[0];
      const firstContentType = firstContent.type;
      
      setTimeout(() => {
        
        navigate(`/courses/${courseId}/${firstContentType}/${firstContent.order}`, { replace: true });
      }, 100);
    } else if (allContent.length === 0) {
      setError('This course does not have any content yet.');
    }
  }, [courseId, contentId, contentType, course, navigate]);

  const calculateProgress = () => {
    if (!course) return 0;
    
    let completedItems = 0;
    let totalItems = 0;
    
    course.modules.forEach(module => {
      if (module.content) {
        module.content.forEach(item => {
          totalItems++;
          if (item.isCompleted) completedItems++;
        });
      }
    });
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

    const checkCourseCompletion = async () => {
    if (!course) return;

    
    let totalContent = 0;
    let completedContent = 0;

    course.modules.forEach(module => {
      if (module.content) {
        module.content.forEach(item => {
          totalContent++;
          if (item.isCompleted) completedContent++;
        });
      }
    });

    
    if (totalContent > 0 && completedContent === totalContent) {
      try {
        const response = await api.post(`/courses/${courseId}/complete`);
        if (response.data.achievement) {
          setCompletionAchievement(response.data.achievement);
          setShowCompletionCelebration(true);
        }
      } catch (error) {
        console.error('Error completing course:', error);
      }
    }
  };


const markAsCompleted = async () => {
  if (!currentContent) return;
  
  try {
    let response;
    if (currentContent.type === 'lesson' || currentContent.type === 'video' || currentContent.type === 'text') {
      response = await api.post(`/lessons/${currentContent.id}/complete`);
      console.log('Completion response:', response?.data);
    } else if (currentContent.type === 'quiz') {
      // For quizzes, completion is already handled in quiz submission
      // Just refetch the course data to update the UI
      console.log('Quiz completion handled in QuizContent component - skipping API call');
    } else if (currentContent.type === 'assignment') {
      response = await api.post(`/assignments/${currentContent.id}/complete`);
      console.log('Completion response:', response?.data);
    }
    
    // Refetch the data and update everything
    const refreshed = await api.get(`/courses/${courseId}/content`);
    setCourse(refreshed.data);
    
    // Find and update the current content from the refreshed data
    const allRefreshedContent = [];
    refreshed.data.modules.forEach(module => {
      if (module.content) {
        allRefreshedContent.push(...module.content);
      }
    });
    
    const refreshedCurrentContent = allRefreshedContent.find(
      item => item.id === currentContent.id && item.type === currentContent.type
    );
    
    if (refreshedCurrentContent) {
      setCurrentContent(refreshedCurrentContent);
      console.log(`✅ Content completion status: ${refreshedCurrentContent.isCompleted}`);
    }
    
    console.log(`✅ Marked content "${currentContent.title}" as completed`);
    
    // Navigate to next content after a short delay
    setTimeout(() => {
      goToNextContent();
    }, 1000);
    
  } catch (error) {
    console.error('Error marking content as completed:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // For quizzes, don't show error since completion is handled elsewhere
    if (currentContent.type !== 'quiz') {
      let errorMessage = 'Failed to mark content as completed. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      alert(errorMessage);
    }
  }
};

  const goToNextContent = () => {
    if (nextContent) {
      const nextContentType = nextContent.type;
      
      navigate(`/courses/${courseId}/${nextContentType}/${nextContent.order}`);
      window.scrollTo(0, 0);
    }
  };
  
  const getContentIcon = (type, subType) => {
    if (type === 'lesson') {
      switch (subType) {
        case 'video':
          return (
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          );
        case 'text':
        default:
          return (
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          );
      }
    }
    
    switch (type) {
      case 'quiz':
        return (
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'assignment':
        return (
          <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      default:
        return null;
    }
  };

  console.log('Current content being rendered:', currentContent);
  console.log('Content ID:', currentContent?.id);
  console.log('Content type:', currentContent?.type);

  const renderContent = () => {
    if (!currentContent) {
      return (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading content...</p>
        </div>
      );
    }
  
  try {
    
    if (currentContent.type === 'lesson') {
      switch (currentContent.subType) {
        case 'video':
          return (
            <VideoLessonContent 
              content={currentContent} 
              onComplete={markAsCompleted} 
              onNext={goToNextContent}
              isCompleted={currentContent.isCompleted}
            />
          );
        case 'text':
        default:
          return (
            <TextLessonContent 
              content={currentContent} 
              onComplete={markAsCompleted} 
              onNext={goToNextContent}
              isCompleted={currentContent.isCompleted}
            />
          );
      }
    }
    
    
    switch (currentContent.type) {
      case 'video':
        return (
          <VideoLessonContent 
            content={currentContent} 
            onComplete={markAsCompleted} 
            onNext={goToNextContent}
            isCompleted={currentContent.isCompleted}
          />
        );
      case 'text':
        return (
          <TextLessonContent 
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
        return (
          <div className="p-8 text-center border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p>Unknown content type: {currentContent.type}</p>
          </div>
        );
    }
  } catch (err) {
    console.error("Error rendering content:", err);
    return (
      <div className="p-8 text-center border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p>Error displaying content. Please try again.</p>
      </div>
    );
  }
};
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading course content...</p>
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
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Access Denied</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button onClick={() => navigate(`/courses/${courseId}`)} className="btn btn-primary">
              Back to Course
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return null;
  }

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
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              Instructor: {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Instructor'}
            </p>
            
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
              {course.modules?.map((module) => (
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
                          {module.order}
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
                  {activeModuleId === module.id && module.content && (
                    <div className="bg-gray-50 dark:bg-gray-800/30">
                      <ul className="py-2">
                        {module.content.map((item) => (
                          <li key={`${item.type}-${item.id}`}>
                            <Link 
                              
                              to={`/courses/${courseId}/${item.type}/${item.order}`}
                              className={`flex items-center px-4 py-2 text-sm ${
                                currentContent && currentContent.order === item.order && currentContent.type === item.type
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
                                  getContentIcon(item.type, item.subType)
                                )}
                              </span>
                              <div className="flex-grow overflow-hidden">
                                <span className="block truncate">{item.title}</span>
                              </div>
                              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                {item.duration || (item.type === 'quiz' ? `${item.questions?.length || 0} questions` : '')}
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
        <div className="flex-1 flex flex-col">
          {/* Content Navigation Header */}
          <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-between items-center">
            {prevContent ? (
              <Link 
                
                to={`/courses/${courseId}/${prevContent.type}/${prevContent.order}`}
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
                
                to={`/courses/${courseId}/${nextContent.type}/${nextContent.order}`}
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
          
          {/* Content Display Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <CourseCompletionCelebration
        isOpen={showCompletionCelebration}
        onClose={() => setShowCompletionCelebration(false)}
        course={course}
        achievement={completionAchievement}
      />
      
      <Footer />
    </div>
  );
};

export default CourseContentPage;
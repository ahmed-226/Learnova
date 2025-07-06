import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/ui/CourseCard';
import { useAuth } from '../contexts/AuthContext';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { api, user } = useAuth();
  
  
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    if (!courseId) {
      console.error("Course ID is undefined");
      navigate("/courses"); 
      return;
    }

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        
        
        const courseResponse = await api.get(`/courses/${courseId}`);
        console.log('Course Response:', courseResponse.data);
        
        
        if (courseResponse.data && courseResponse.data.modules) {
          console.log('Modules found:', courseResponse.data.modules.length);
        } else {
          console.log('No modules property found in the response');
          courseResponse.data.modules = [];
        }
        
        
        if (!courseResponse.data._count) {
          courseResponse.data._count = {};
        }
        
        courseResponse.data._count = {
          progress: courseResponse.data._count.progress || 0,
          lessons: courseResponse.data._count.lessons || 0,
          quizzes: courseResponse.data._count.quizzes || 0,
          assignments: courseResponse.data._count.assignments || 0
        };
        
        setCourse(courseResponse.data);
        
        
        if (user) {
          try {
            console.log('Checking enrollment for user:', user.id, 'course:', courseId);
            
            
            const enrollmentResponse = await api.get(`/courses/${courseId}/enrollment-status`);
            console.log('Enrollment Response:', enrollmentResponse.data);
            
            setIsEnrolled(enrollmentResponse.data.isEnrolled);
          } catch (enrollError) {
            console.error('Error checking enrollment:', enrollError);
            
            try {
              const enrollmentCheck = await api.get(`/users/${user.id}/enrollments`);
              const isUserEnrolled = enrollmentCheck.data.some(
                enrollment => enrollment.courseId === parseInt(courseId)
              );
              setIsEnrolled(isUserEnrolled);
            } catch (fallbackError) {
              console.error('Fallback enrollment check failed:', fallbackError);
              setIsEnrolled(false);
            }
          }
        }
        
        
        try {
          const relatedResponse = await api.get(`/courses?category=${courseResponse.data.category}&limit=3`);
          setRelatedCourses(relatedResponse.data.courses?.filter(c => c.id !== parseInt(courseId)) || []);
        } catch (relatedError) {
          console.error('Error fetching related courses:', relatedError);
          setRelatedCourses([]);
        }
        
      } catch (error) {
        console.error('Error fetching course data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          setError(error.response.data.error || 'Failed to load course data');
        } else {
          setError('Failed to load course data. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    };    
    
    fetchCourseData();
  }, [courseId, api, user]);
  
  
  const toggleModule = (moduleId) => {
    if (activeModule === moduleId) {
      setActiveModule(null);
    } else {
      setActiveModule(moduleId);
    }
  };

  
  const handleEnrollment = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${courseId}` } });
      return;
    }
    
    setEnrollmentLoading(true);
    
    try {
      await api.post(`/courses/${courseId}/enroll`);
      setIsEnrolled(true);
      
      
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Enrollment error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to enroll in course';
      alert(errorMessage);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  
  const handleContinueLearning = () => {
    navigate(`/courses/${courseId}/content`);
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  
  if (error || !course) {
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
            <h3 className="text-xl font-medium mb-2">Course Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'The course you are looking for does not exist or has been removed.'}
            </p>
            <button onClick={() => navigate('/courses')} className="btn btn-primary">
              Browse All Courses
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
      
      <div className="flex-grow">
        {/* Hero Section with Course Banner */}
        <section 
          className="py-16 bg-gradient-to-r from-primary-700 to-primary-800 dark:from-primary-900 dark:to-primary-800 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="max-w-3xl">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <div className="flex items-center space-x-2 text-primary-100 mb-4">
                  <span className="bg-primary-600/50 text-white text-xs px-2.5 py-1 rounded">
                    {course.category || "Category"}
                  </span>
                  <span>•</span>
                  <span>{course.level || "All Levels"}</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
                
                <p className="text-xl text-primary-100 mb-6">
                  {course.description && course.description.split('.')[0] + '.'}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-primary-100">
                  <div className="flex items-center">
                    <img 
                      src={course.instructor?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                      alt={`${course.instructor?.firstName} ${course.instructor?.lastName}`} 
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="text-white font-medium">
                        {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Instructor'}
                      </p>
                      <p className="text-sm">Instructor</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-white">
                      {course._count?.progress || 0} Students Enrolled
                    </p>
                    <p className="text-sm">Learn Together</p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-white">
                      {course.modules?.length || 0} Modules
                    </p>
                    <p className="text-sm">Structured Learning</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Main Content Section with Course Details */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Course Content */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Course Overview */}
                <div className="card mb-8">
                  <h2 className="text-2xl font-bold mb-6">Course Overview</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {course.description}
                  </p>
                  
                  <div className="mt-8 border-t dark:border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Understand key concepts in {course.title}</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Apply practical skills to real-world scenarios</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Build complete projects from scratch</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Gain confidence in your abilities</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Course Content/Modules */}
                <div className="card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Course Content</h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {course.modules?.length || 0} modules • {course._count?.lessons || 0} lessons
                    </div>
                  </div>
                  
                  {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-4">
                      {course.modules.map((module) => (
                        <div 
                          key={module.id} 
                          className="border dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                          <button 
                            className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="flex items-center">
                              <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-sm font-medium mr-3">
                                {module.order}
                              </span>
                              <span className="font-medium">{module.title}</span>
                            </div>
                            <svg 
                              className={`h-5 w-5 transition-transform ${activeModule === module.id ? 'transform rotate-180' : ''}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {activeModule === module.id && (
                            <div className="px-4 py-3 bg-white dark:bg-dark-card border-t dark:border-gray-700">
                              {module.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{module.description}</p>
                              )}
                              
                              {/* Lessons List */}
                              <div className="space-y-2">
                                {module.lessons && module.lessons.map((lesson) => (
                                  <div 
                                    key={lesson.id}
                                    className="flex items-center py-2 border-b last:border-b-0 dark:border-gray-700"
                                  >
                                    <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className={`flex-grow ${isEnrolled ? 'hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer' : 'text-gray-700 dark:text-gray-300'}`}>
                                      {lesson.title}
                                    </span>
                                    {!isEnrolled && (
                                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                        <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                      </span>
                                    )}
                                  </div>
                                ))}
                                
                                {/* Module Quizzes */}
                                {module.quizzes && module.quizzes.map((quiz) => (
                                  <div 
                                    key={quiz.id}
                                    className="flex items-center py-2 border-b last:border-b-0 dark:border-gray-700"
                                  >
                                    <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className={`flex-grow ${isEnrolled ? 'hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer' : 'text-gray-700 dark:text-gray-300'}`}>
                                      Quiz: {quiz.title}
                                    </span>
                                    {!isEnrolled && (
                                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                        <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                      </span>
                                    )}
                                  </div>
                                ))}
                                
                                {/* Module Assignments */}
                                {module.assignments && module.assignments.map((assignment) => (
                                  <div 
                                    key={assignment.id}
                                    className="flex items-center py-2 border-b last:border-b-0 dark:border-gray-700"
                                  >
                                    <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className={`flex-grow ${isEnrolled ? 'hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer' : 'text-gray-700 dark:text-gray-300'}`}>
                                      Assignment: {assignment.title}
                                    </span>
                                    {!isEnrolled && (
                                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                        <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">Course content coming soon</h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        The instructor is currently developing the modules and content for this course.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Course Forum Preview - Only shown if enrolled */}
                {isEnrolled && (
                  <div className="card mt-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Course Forum</h2>
                      <Link 
                        to={`/courses/${courseId}/forum`}
                        className="btn btn-outline flex items-center"
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Discussion Forum
                      </Link>
                    </div>
                    
                    {/* Forum Preview */}
                    <div className="space-y-4">
                      <div className="flex items-start p-4 border dark:border-gray-700 rounded-lg">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-10 h-10 rounded-full mr-4" />
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">Welcome to the Course!</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">3 days ago</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            Welcome everyone! Feel free to ask questions and share your progress here.
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span className="mr-4">12 replies</span>
                            <span>Last reply: 2 hours ago</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <Link 
                          to={`/courses/${courseId}/forum`}
                          className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
                        >
                          View All Discussions
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
              
              {/* Right Column - Enrollment Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="card sticky top-24">
                  <div className="relative mb-6 rounded-lg overflow-hidden h-48 bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={course.coverImage || 'https://via.placeholder.com/400x300?text=Course+Cover'} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <button className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all transform hover:scale-105">
                        <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">
                        {course.isFree ? 'Free' : `$${course.price}`}
                      </h3>
                      {course.originalPrice && !course.isFree && (
                        <span className="line-through text-gray-500 dark:text-gray-400">${course.originalPrice}</span>
                      )}
                    </div>
                    
                    {isEnrolled ? (
                      <Link to={`/courses/${courseId}/lesson/1`} className="btn btn-primary w-full">
                        Continue Learning
                      </Link>
                    ) : (
                      <button 
                        onClick={handleEnrollment}
                        disabled={enrollmentLoading}
                        className="btn btn-primary w-full"
                      >
                        {enrollmentLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enrolling...
                          </span>
                        ) : (
                          course.isFree ? 'Enroll for Free' : `Enroll for $${course.price}`
                        )}
                      </button>
                    )}
                    
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                      30-day satisfaction guarantee
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold">This Course Includes:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start text-sm">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{course._count?.lessons || 0} on-demand video lessons</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{course._count?.quizzes || 0} quizzes with feedback</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{course._count?.assignments || 0} practical assignments</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Discussion forum access</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Completion certificate</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Lifetime access</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-t dark:border-gray-700 pt-6">
                    <h4 className="font-semibold mb-4">Share this course</h4>
                    <div className="flex space-x-4">
                      <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full text-white">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                        </svg>
                      </button>
                      <button className="bg-blue-400 hover:bg-blue-500 p-2 rounded-full text-white">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </button>
                      <button className="bg-blue-700 hover:bg-blue-800 p-2 rounded-full text-white">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Related Courses Section */}
        {relatedCourses.length > 0 && (
          <section className="py-12 bg-gray-50 dark:bg-gray-800/20">
            <div className="container mx-auto px-4 max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Courses</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedCourses.map((relatedCourse) => (
                    <CourseCard 
                      key={relatedCourse.id}
                      id={relatedCourse.id}
                      title={relatedCourse.title}
                      instructor={relatedCourse.instructor ? `${relatedCourse.instructor.firstName} ${relatedCourse.instructor.lastName}` : 'Instructor'}
                      rating={relatedCourse.rating || 0}
                      price={relatedCourse.price}
                      isFree={relatedCourse.isFree}
                      level={relatedCourse.level}
                      studentsCount={relatedCourse._count?.progress || 0}
                      coverImage={relatedCourse.coverImage}
                      category={relatedCourse.category}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
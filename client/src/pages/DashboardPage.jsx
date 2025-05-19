import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import UpcomingLessonCard from '../components/dashboard/UpcomingLessonCard';
import PopularCoursesCard from '../components/dashboard/PopularCoursesCard';
import { instructorCourses, recentActivities, upcomingLessons } from '../data/main.js';

const DashboardPage = () => {
  const [welcomeMessage, setWelcomeMessage] = useState(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  });
  
  const userData = {
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    role: "INSTRUCTOR",
    courseProgress: 68,
    hoursSpent: 42,
    certificatesEarned: 1,
    averageScore: 89
  };

  const isInstructor = userData.role === "student";

  return (
    <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{welcomeMessage}, {userData.name}!</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isInstructor 
                  ? "Manage your courses and engage with your students"
                  : "Here's what's happening with your learning journey"
                }
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              {isInstructor ? (
                <Link to="/create-course" className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New Course
                </Link>
              ) : (
                <button className="btn btn-primary">Start Learning</button>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Dashboard Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <DashboardStats userData={userData} />
        </motion.div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Instructor Courses Section */}
            {isInstructor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Your Courses</h2>
                    <Link to="/courses" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View All
                    </Link>
                  </div>
                  
                  {instructorCourses.length > 0 ? (
                    <div className="space-y-4">
                      {instructorCourses.map(course => (
                        <div 
                          key={course.id} 
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="mb-3 md:mb-0">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{course.title}</h3>
                            <div className="flex flex-wrap gap-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                {course.enrollmentCount} students
                              </span>
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {course.moduleCount} modules
                              </span>
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Updated {course.lastUpdated}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Link 
                              to={`/courses/${course.id}/edit`} 
                              className="btn btn-outline btn-sm py-1"
                            >
                              Edit
                            </Link>
                            <Link 
                              to={`/courses/${course.id}/modules`} 
                              className="btn btn-primary btn-sm py-1"
                            >
                              Manage Content
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You haven't created any courses yet. Start creating your first course.
                      </p>
                      <Link to="/create-course" className="btn btn-primary">
                        Create Your First Course
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: isInstructor ? 0.3 : 0.2 }}
            >
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Recent Activity</h2>
                  <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <RecentActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Upcoming Lessons */}
            {!isInstructor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Upcoming Lessons</h2>
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View Calendar
                    </button>
                  </div>
                  {upcomingLessons.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingLessons.map(lesson => (
                        <UpcomingLessonCard key={lesson.id} lesson={lesson} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Upcoming Lessons</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        You don't have any scheduled lessons right now.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Student Submissions/Feedback Section for Instructors */}
            {isInstructor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Recent Submissions</h2>
                    <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 border dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-2 py-1 rounded-md">Pending Review</span>
                          <h4 className="font-medium mt-2">Assignment: Building a Responsive Layout</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Submitted by John Smith • 2 hours ago</p>
                        </div>
                        <button className="btn btn-outline btn-sm">Review</button>
                      </div>
                    </div>
                    <div className="p-4 border dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-2 py-1 rounded-md">Pending Review</span>
                          <h4 className="font-medium mt-2">Assignment: JavaScript Event Handlers</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Submitted by Maria Rodriguez • Yesterday</p>
                        </div>
                        <button className="btn btn-outline btn-sm">Review</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Right Column - 1/3 width on large screens */}
          <div className="space-y-8">
            {!isInstructor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <PopularCoursesCard />
              </motion.div>
            )}
            
            {isInstructor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="card">
                  <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <Link to="/create-course" className="btn btn-outline flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create New Course
                    </Link>
                    <Link to="/create-content" className="btn btn-outline flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Add Content
                    </Link>
                    <Link to="/assignments" className="btn btn-outline flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Manage Assignments
                    </Link>
                    <Link to="/student-progress" className="btn btn-outline flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Student Progress
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Learning Goals */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">
                  {isInstructor ? "Course Analytics" : "Learning Goals"}
                </h2>
                
                {isInstructor ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Enrollments</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">222 students</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">↑ 12% from last month</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Completion Rate</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">76%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-secondary-600 h-2.5 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn btn-outline w-full">
                        View Detailed Analytics
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Study Goal</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">4/5 hours</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Completion</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">2/3 courses</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div className="bg-secondary-600 h-2.5 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="btn btn-outline w-full">
                        Set New Goal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
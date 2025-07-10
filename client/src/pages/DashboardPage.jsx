import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import PopularCoursesCard from '../components/dashboard/PopularCoursesCard';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, api } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [welcomeMessage, setWelcomeMessage] = useState(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !api) return;

      try {
        setLoading(true);
        const response = await api.get('/users/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, api]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isInstructor = user?.role === 'INSTRUCTOR';
  const stats = dashboardData?.stats || {};

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
              <h1 className="text-2xl md:text-3xl font-bold">
                {welcomeMessage}, {user?.firstName}!
              </h1>
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
                <Link to="/courses" className="btn btn-primary">Start Learning</Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isInstructor ? (
              <>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.coursesCreated || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Courses Created</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                    {stats.totalStudents || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Total Students</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.averageRating || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Average Rating</div>
                </div>
              </>
            ) : (
              <>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.hoursSpent || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Hours Spent</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                    {stats.certificatesEarned || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Certificates</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.averageScore || 0}%
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mt-1">Average Score</div>
                </div>
              </>
            )}
          </div>
        </motion.div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Instructor Courses Section */}
            {isInstructor && dashboardData?.instructorCourses && (
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
                  
                  {dashboardData.instructorCourses.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.instructorCourses.slice(0, 3).map(course => (
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
                                {course._count?.progress || 0} students
                              </span>
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Updated {new Date(course.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
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
                </div>
                <div className="space-y-4">
                  {dashboardData?.recentActivities?.length > 0 ? (
                    dashboardData.recentActivities.map(activity => (
                      <RecentActivityCard key={activity.id} activity={activity} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - 1/3 width on large screens */}
          <div className="space-y-8">
            {/* Popular Courses */}
            {!isInstructor && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <PopularCoursesCard popularCourses={dashboardData?.popularCourses || []} />
              </motion.div>
            )}
            
            {/* Learning Goals / Course Analytics */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">
                  {isInstructor ? "Quick Actions" : "Learning Goals"}
                </h2>
                
                {isInstructor ? (
                  <div className="grid grid-cols-1 gap-3">
                    <Link to="/create-course" className="btn btn-outline flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create New Course
                    </Link>
                    <Link to="/courses" className="btn btn-outline flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Analytics
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Study Goal</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.floor((stats.hoursSpent || 0) / 7)}/10 hours
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(((stats.hoursSpent || 0) / 7) / 10 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {stats.averageScore || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-secondary-600 h-2.5 rounded-full" 
                          style={{ width: `${stats.averageScore || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Link to="/courses" className="btn btn-outline w-full">
                        Browse Courses
                      </Link>
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
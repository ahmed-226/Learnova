import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentActivityCard from '../components/dashboard/RecentActivityCard';
import UpcomingLessonCard from '../components/dashboard/UpcomingLessonCard';
import PopularCoursesCard from '../components/dashboard/PopularCoursesCard';

const DashboardPage = () => {
  const [welcomeMessage, setWelcomeMessage] = useState(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  });
  
  // Mock data - in a real app, this would come from an API
  const userData = {
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    role: "Student",
    courseProgress: 68,
    hoursSpent: 42,
    certificatesEarned: 1,
    averageScore: 89
  };
  
  const recentActivities = [
    { 
      id: 1, 
      type: 'course-progress', 
      courseName: 'Web Development Bootcamp', 
      progress: 75, 
      date: '2 hours ago',
      icon: 'book-open'
    },
    { 
      id: 2, 
      type: 'quiz-completed', 
      courseName: 'Data Science Fundamentals', 
      score: 92, 
      date: 'Yesterday',
      icon: 'check-circle'
    },
    { 
      id: 3, 
      type: 'assignment-submitted', 
      courseName: 'UX Design Principles', 
      date: '3 days ago',
      icon: 'clipboard'
    }
  ];
  
  const upcomingLessons = [
    {
      id: 1,
      title: "Advanced CSS Layouts",
      courseName: "Web Development Bootcamp",
      date: "Tomorrow, 10:00 AM",
      duration: "45 min"
    },
    {
      id: 2,
      title: "Data Visualization with D3.js",
      courseName: "Data Science Fundamentals",
      date: "Thu, 2:00 PM",
      duration: "60 min"
    }
  ];

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
                Here's what's happening with your learning journey
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="btn btn-primary">Start Learning</button>
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
            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
          </div>
          
          {/* Right Column - 1/3 width on large screens */}
          <div className="space-y-8">
            {/* Popular Courses */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <PopularCoursesCard />
            </motion.div>
            
            {/* Learning Goals */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Learning Goals</h2>
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
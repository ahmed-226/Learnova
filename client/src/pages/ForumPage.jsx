import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ThreadList from '../components/forum/ThreadList';
import CreateThreadForm from '../components/forum/CreateThreadForm';

import { mockForum, mockThreads, mockCourseForForum } from '../data/main.js';

const ForumPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [forum, setForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  
  useEffect(() => {
    
    const timer = setTimeout(() => {
      try {
        
        setForum(mockForum);
        setCourse(mockCourseForForum);
        setThreads(mockThreads);
        setTotalPages(1); 
        setIsLoading(false);
      } catch (err) {
        console.error('Error with mock data:', err);
        setError('Failed to load forum. Please try again later.');
        setIsLoading(false);
      }
    }, 800); 
    
    return () => clearTimeout(timer);
  }, [courseId]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    
  };
  
  const handleThreadCreated = (newThread) => {
    
    const mockNewThread = {
      ...newThread,
      id: threads.length + 1,
      forumId: forum.id,
      userId: 5, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: 5,
        firstName: "Alex",
        lastName: "Johnson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      },
      postCount: 1
    };
    
    setThreads([mockNewThread, ...threads]);
    setShowCreateThread(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading forum...</p>
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
        {/* Forum Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link to={`/courses/${courseId}`} className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Course
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{course?.title} Forum</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discussion space for students and instructors
              </p>
            </div>
            <div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateThread(!showCreateThread)}
              >
                {showCreateThread ? 'Cancel' : 'Start New Discussion'}
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Create Thread Form */}
        {showCreateThread && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <CreateThreadForm 
              forumId={forum.id} 
              onThreadCreated={handleThreadCreated}
              onCancel={() => setShowCreateThread(false)}
            />
          </motion.div>
        )}
        
        {/* Thread List */}
        <ThreadList 
          threads={threads} 
          courseId={courseId} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default ForumPage;
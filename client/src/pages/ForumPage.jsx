import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ThreadList from '../components/forum/ThreadList';
import CreateThreadForm from '../components/forum/CreateThreadForm';

const ForumPage = () => {
  const { courseId } = useParams();
  const { api, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [forum, setForum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  useEffect(() => {
    if (courseId && api) {
      fetchForumData();
    }
  }, [courseId, api, currentPage]);

const fetchForumData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      
      const [courseResponse, enrollmentResponse] = await Promise.all([
        api.get(`/courses/${courseId}`),
        user ? api.get(`/courses/${courseId}/enrollment-status`).catch(() => ({ data: { isEnrolled: false } })) : Promise.resolve({ data: { isEnrolled: false } })
      ]);

      setCourse(courseResponse.data);
      setIsEnrolled(enrollmentResponse.data.isEnrolled);

      
      const canAccessForum = enrollmentResponse.data.isEnrolled || 
                           (user && courseResponse.data.instructorId === user.id) ||
                           (user && user.role === 'ADMIN');

      if (!canAccessForum) {
        setError('You must be enrolled in this course to access the forum.');
        setIsLoading(false);
        return;
      }

      
      console.log('Fetching forum for course:', courseId);
      const forumResponse = await api.get(`/forums/course/${courseId}`);
      console.log('Forum response:', forumResponse.data);
      setForum(forumResponse.data);

      
      console.log('Fetching threads for forum:', forumResponse.data.id);
      const threadsResponse = await api.get(`/forums/${forumResponse.data.id}/threads`, {
        params: {
          page: currentPage,
          limit: 10
        }
      });

      console.log('Threads response:', threadsResponse.data);
      setThreads(threadsResponse.data.threads || []);
      setTotalPages(threadsResponse.data.pagination?.totalPages || 1);

    } catch (error) {
      console.error('Error fetching forum data:', error);
      
      if (error.response?.status === 404) {
        setError('Forum not found for this course.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to access this forum.');
      } else {
        setError('Failed to load forum data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleThreadCreated = async (newThread) => {
    try {
      console.log('Creating thread with data:', newThread);
      
      
      const response = await api.post(`/forums/${forum.id}/threads`, {
        title: newThread.title,
        content: newThread.content
      });
      
      console.log('Thread creation response:', response.data);
      
      
      const createdThread = {
        ...response.data,
        postCount: response.data.postCount || 1,
        user: response.data.user || {
          firstName: user?.firstName || 'Unknown',
          lastName: user?.lastName || 'User'
        }
      };
      
      setThreads([createdThread, ...threads]);
      setShowCreateThread(false);
      
      
      setTimeout(() => {
        fetchForumData();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Failed to create thread. Please try again.');
    }
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
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <div className="space-x-4">
              <Link to={`/courses/${courseId}`} className="btn btn-outline">
                Back to Course
              </Link>
              {!isEnrolled && (
                <Link to={`/courses/${courseId}`} className="btn btn-primary">
                  Enroll in Course
                </Link>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="card p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Login Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You must be logged in and enrolled in this course to access the forum.
            </p>
            <div className="space-x-4">
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
              <Link to={`/courses/${courseId}`} className="btn btn-outline">
                Back to Course
              </Link>
            </div>
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
              forumId={forum?.id} 
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
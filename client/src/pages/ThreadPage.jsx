import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PostList from '../components/forum/PostList';
import CreatePostForm from '../components/forum/CreatePostForm';

const ThreadPage = () => {
  const { courseId, threadId } = useParams();
  const { api, user } = useAuth();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  useEffect(() => {
    if (threadId && api) {
      fetchThreadData();
    }
  }, [threadId, api, currentPage]);

  const fetchThreadData = async () => {
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
        setError('You must be enrolled in this course to access this thread.');
        setIsLoading(false);
        return;
      }

      
      console.log('Fetching thread data for thread ID:', threadId);
      const threadResponse = await api.get(`/forums/threads/${threadId}`, {
        params: {
          page: currentPage,
          limit: 20
        }
      });

      console.log('Thread response:', threadResponse.data);
      
      setThread(threadResponse.data.thread);
      setPosts(threadResponse.data.posts || []);
      setTotalPages(threadResponse.data.pagination?.totalPages || 1);

    } catch (error) {
      console.error('Error fetching thread data:', error);
      
      if (error.response?.status === 404) {
        setError('Thread not found.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to access this thread.');
      } else {
        setError('Failed to load thread data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
const handlePostCreated = async (newPost) => {
    try {
      console.log('Creating post with data:', newPost);
      
      
      const response = await api.post(`/forums/threads/${threadId}/posts`, {
        content: newPost.content,
        parentId: newPost.parentId || null
      });
      
      console.log('Post creation response:', response.data);
      
      
      const createdPost = {
        ...response.data,
        user: response.data.user || {
          id: user?.id,
          firstName: user?.firstName || 'Unknown',
          lastName: user?.lastName || 'User'
        }
      };
      
      
      setPosts(prevPosts => [...prevPosts, createdPost]);
      
      
      setTimeout(() => {
        fetchThreadData();
      }, 500);
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading thread...</p>
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
              <Link to={`/courses/${courseId}/forum`} className="btn btn-outline">
                Back to Forum
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
              You must be logged in and enrolled in this course to access this thread.
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
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {/* Thread Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Link to={`/courses/${courseId}/forum`} className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Forum
            </Link>
          </div>
          
          <div className="card p-6">
            <h1 className="text-2xl font-bold mb-2">{thread?.title}</h1>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Started by {thread?.user?.firstName} {thread?.user?.lastName}</span>
              <span className="mx-2">•</span>
              <span>{thread?.createdAt ? new Date(thread.createdAt).toLocaleDateString() : ''}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Posts List */}
        {posts.length > 0 ? (
          <PostList 
            posts={posts} 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            currentUser={user}
            onPostsUpdated={setPosts}
            courseId={courseId}
          />
        ) : (
          <div className="card p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">No Posts Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Be the first to reply to this discussion.
            </p>
          </div>
        )}
        

      </div>
      
      <Footer />
    </div>
  );
};

export default ThreadPage;
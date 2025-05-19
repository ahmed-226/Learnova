import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PostList from '../components/forum/PostList';
import CreatePostForm from '../components/forum/CreatePostForm';

import { mockThreads, mockPosts, mockUser } from '../data/main.js';

const ThreadPage = () => {
  const { courseId, threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null); 
  
  
  useEffect(() => {
    
    const timer = setTimeout(() => {
      try {
        
        const foundThread = mockThreads.find(t => t.id === parseInt(threadId));
        
        if (!foundThread) {
          setError('Thread not found');
          setIsLoading(false);
          return;
        }
        
        setThread(foundThread);
        setPosts(mockPosts);
        setTotalPages(1); 
        setUser(mockUser);
        setIsLoading(false);
      } catch (err) {
        console.error('Error with mock data:', err);
        setError('Failed to load thread. Please try again later.');
        setIsLoading(false);
      }
    }, 800); 
    
    return () => clearTimeout(timer);
  }, [threadId]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    
  };
  
  const handlePostCreated = (newPost) => {
    
    const mockNewPost = {
      ...newPost,
      id: posts.length + 6, 
      threadId: parseInt(threadId),
      userId: user.id,
      parentId: newPost.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        role: user.role
      },
      replies: []
    };
    
    setPosts([...posts, mockNewPost]);
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
              <span>Started by {thread?.user.firstName} {thread?.user.lastName}</span>
              <span className="mx-2">•</span>
              <span>{new Date(thread?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
        
        {/* Posts List */}
        <PostList 
          posts={posts} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          currentUser={user}
        />
        
        {/* Reply Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Post a Reply</h3>
            <CreatePostForm 
              threadId={threadId} 
              onPostCreated={handlePostCreated}
            />
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ThreadPage;
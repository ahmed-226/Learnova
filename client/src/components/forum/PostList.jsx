import React from 'react';
import { motion } from 'framer-motion';
import PostItem from './PostItem';
import Pagination from '../common/Pagination';

const PostList = ({ posts, currentPage, totalPages, onPageChange, currentUser, onPostsUpdated, courseId }) => {
  const handlePostUpdated = (updatedPost) => {
    // Find and update the post in the list
    const updatedPosts = posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    
    if (onPostsUpdated) {
      onPostsUpdated(updatedPosts);
    }
  };

  const handlePostDeleted = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    
    if (onPostsUpdated) {
      onPostsUpdated(updatedPosts);
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="card p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-xl font-medium mb-2">No Posts Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Be the first to start a discussion in this thread.
        </p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="space-y-6">
        {posts.map((post, index) => (
          <React.Fragment key={post.id}>
            <PostItem 
              post={post} 
              isFirstPost={index === 0}
              currentUser={currentUser}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
              courseId={courseId}
            />
            
            {/* Replies */}
            {post.replies && post.replies.length > 0 && (
              <div className="ml-12 space-y-6 mt-6">
                {post.replies.map((reply) => (
                  <PostItem 
                    key={reply.id} 
                    post={reply} 
                    isReply={true}
                    currentUser={currentUser}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                    courseId={courseId}
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </motion.div>
  );
};

export default PostList;
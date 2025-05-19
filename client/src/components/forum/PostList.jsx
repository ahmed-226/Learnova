import React from 'react';
import { motion } from 'framer-motion';
import PostItem from './PostItem';
import Pagination from '../common/Pagination';

const PostList = ({ posts, currentPage, totalPages, onPageChange, currentUser }) => {
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
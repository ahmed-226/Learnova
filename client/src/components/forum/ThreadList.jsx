import React from 'react';
import { motion } from 'framer-motion';
import ThreadItem from './ThreadItem';
import Pagination from '../common/Pagination';

const ThreadList = ({ threads, courseId, currentPage, totalPages, onPageChange }) => {
  if (threads.length === 0) {
    return (
      <div className="card p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h3 className="text-xl font-medium mb-2">No Discussions Yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Be the first to start a discussion in this forum.
        </p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-12 text-sm font-medium text-gray-600 dark:text-gray-400">
            <div className="col-span-6 md:col-span-7">Topic</div>
            <div className="col-span-2 text-center hidden md:block">Replies</div>
            <div className="col-span-4 md:col-span-3 text-right">Activity</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {threads.map((thread) => (
            <ThreadItem 
              key={thread.id} 
              thread={thread} 
              courseId={courseId} 
            />
          ))}
        </div>
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

export default ThreadList;
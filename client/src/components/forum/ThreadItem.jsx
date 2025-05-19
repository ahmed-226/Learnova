import React from 'react';
import { Link } from 'react-router-dom';

const ThreadItem = ({ thread, courseId }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-6 md:col-span-7">
          <Link 
            to={`/courses/${courseId}/forum/thread/${thread.id}`}
            className="font-medium text-primary-700 dark:text-primary-400 hover:underline"
          >
            {thread.title}
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span>Started by {thread.user.firstName} {thread.user.lastName}</span>
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center hidden md:flex">
          <div className="text-center">
            <span className="text-gray-900 dark:text-gray-100 font-medium">{thread.postCount - 1}</span>
          </div>
        </div>
        <div className="col-span-4 md:col-span-3 flex items-center justify-end">
          <div className="text-right">
            <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(thread.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadItem;
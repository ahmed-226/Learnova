import React from 'react';

const UpcomingLessonCard = ({ lesson }) => {
  return (
    <div className="flex items-start p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="bg-secondary-100 dark:bg-secondary-900/30 p-2 rounded-md text-secondary-700 dark:text-secondary-400 mr-4 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">{lesson.title}</h4>
        <p className="text-sm text-primary-600 dark:text-primary-400">{lesson.courseName}</p>
        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {lesson.date} • {lesson.duration}
        </div>
      </div>
      <button className="flex-shrink-0 btn btn-outline py-1 px-3 text-sm">
        Join
      </button>
    </div>
  );
};

export default UpcomingLessonCard;
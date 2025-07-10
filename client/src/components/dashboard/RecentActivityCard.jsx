import React from 'react';

const RecentActivityCard = ({ activity }) => {
  const renderIcon = () => {
    switch (activity.type) {
      case 'course-enrolled':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'assignment-submitted':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'forum-post':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'assignment-received':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const renderActivityMessage = () => {
    switch (activity.type) {
      case 'course-enrolled':
        return (
          <>
            You enrolled in <span className="font-medium">{activity.courseName}</span>
          </>
        );
      case 'assignment-submitted':
        return (
          <>
            You submitted <span className="font-medium">{activity.assignmentTitle}</span> in <span className="font-medium">{activity.courseName}</span>
          </>
        );
      case 'forum-post':
        return (
          <>
            You posted in <span className="font-medium">{activity.threadTitle}</span> discussion
          </>
        );
      case 'assignment-received':
        return (
          <>
            <span className="font-medium">{activity.studentName}</span> submitted <span className="font-medium">{activity.assignmentTitle}</span>
            {activity.needsGrading && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-2 py-1 rounded-md">Needs Grading</span>}
          </>
        );
      default:
        return (
          <>
            Activity in <span className="font-medium">{activity.courseName}</span>
          </>
        );
    }
  };

  return (
    <div className="flex items-start p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-md text-primary-700 dark:text-primary-400 mr-4 flex-shrink-0">
        {renderIcon()}
      </div>
      <div className="flex-grow">
        <p className="text-gray-800 dark:text-gray-200">
          {renderActivityMessage()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {new Date(activity.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default RecentActivityCard;
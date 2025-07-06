import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'green';
    if (progress >= 50) return 'blue';
    if (progress >= 25) return 'yellow';
    return 'red';
  };

  const color = course.color || getProgressColor(course.progress);

  if (!course.id) {
    console.error("Course ID is missing:", course);
    return (
      <div className="card h-[360px] flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-center">
          <p className="text-gray-500">Invalid course data</p>
        </div>
      </div>
    );
  }

  const courseTitle = course.title || 'Unknown Course';
  const courseProgress = course.progress || 0;
  const instructorName = course.instructor || 'Unknown Instructor';
  const lastAccessed = course.lastAccessed || 'Never';

  return (
    <div className="card h-[360px] flex flex-col overflow-hidden">
      {/* Course Image */}
      <div className="relative h-32 bg-gray-200 dark:bg-gray-700">
        {course.coverImage ? (
          <img 
            src={course.coverImage} 
            alt={courseTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback display when no image */}
        <div 
          className={`absolute inset-0 flex items-center justify-center ${course.coverImage ? 'hidden' : 'flex'}`}
        >
          <div className="text-center">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm text-gray-500">Course</p>
          </div>
        </div>
        
        {/* Instructor Badge - Shows student count */}
        {course.isInstructor && (
          <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {course.studentsEnrolled || 0} students
          </span>
        )}
        
        {/* Student Badge - Shows completion status */}
        {!course.isInstructor && (
          <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${
            course.isCompleted 
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white'
          }`}>
            {course.isCompleted ? 'Completed' : 'In Progress'}
          </span>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-primary-900 dark:text-primary-100 line-clamp-2">
            {courseTitle}
          </h3>
          
          {/* Status Badge */}
          {course.isInstructor ? (
            <span className="px-2 py-1 rounded-md text-xs whitespace-nowrap ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              Published
            </span>
          ) : (
            <span className={`px-2 py-1 rounded-md text-xs whitespace-nowrap ml-2 ${
              course.isCompleted 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-400`
            }`}>
              {course.isCompleted ? 'Completed' : `${courseProgress}%`}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {course.isInstructor ? 'Your Course' : `Instructor: ${instructorName}`}
        </p>
        
        {/* Progress Bar - Only for students */}
        {!course.isInstructor && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
              className={`h-2.5 rounded-full ${
                course.isCompleted 
                  ? 'bg-green-500' 
                  : color === 'green' ? 'bg-green-500'
                  : color === 'blue' ? 'bg-blue-500'
                  : color === 'yellow' ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${courseProgress}%` }}
            ></div>
          </div>
        )}
        
        {/* Course Stats - Only for instructors */}
        {course.isInstructor && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                {course.studentsEnrolled || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Students</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                4.8
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {course.isInstructor ? `Updated: ${lastAccessed}` : `Last accessed: ${lastAccessed}`}
          </span>
          <Link 
            to={course.isInstructor ? `/courses/${course.id}/modules` : `/courses/${course.id}/lesson/1`}
            className="btn btn-primary text-sm py-1 px-3"
          >
            {course.isInstructor ? 'Manage' : 'Continue Learning'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
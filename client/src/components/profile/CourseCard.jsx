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
  }

  return (
    <div className="card h-[280px] flex flex-col overflow-hidden">
      {/* Course Image */}
      <div className="relative h-32 bg-gray-200 dark:bg-gray-700">
        <img 
          src={course.coverImage} 
          alt={course.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200'; 
          }}
        />
        {course.isInstructor && (
          <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {course.studentsEnrolled} students
          </span>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-primary-900 dark:text-primary-100 line-clamp-2">
            {course.title}
          </h3>
          <span className={`bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-400 text-xs px-2 py-1 rounded-md whitespace-nowrap ml-2`}>
            {course.isCompleted ? 'Completed' : `${course.progress}%`}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
          {course.isInstructor ? 'Your Course' : `Instructor: ${course.instructor}`}
        </p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div 
            className={`h-2.5 rounded-full bg-${color}-500`} 
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last accessed: {course.lastAccessed}
          </span>
          <Link 
            to={course.isInstructor ? `/courses/${course.id}/modules` : `/courses/${course.id}`}
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
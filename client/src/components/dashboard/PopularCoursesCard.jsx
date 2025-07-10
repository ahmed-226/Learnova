import React from 'react';
import { Link } from 'react-router-dom';

const PopularCoursesCard = ({ popularCourses }) => {
  if (!popularCourses || popularCourses.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Popular Courses</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">No popular courses available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Popular Courses</h2>
        <Link to="/courses" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {popularCourses.map(course => (
          <div 
            key={course.id} 
            className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <h4 className="font-medium text-gray-800 dark:text-gray-200">{course.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">by {course.instructor}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">{course.students} students</span>
              </div>
              <div className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">{course.rating.toFixed(1)}</span>
              </div>
            </div>
            <Link 
              to={`/courses/${course.id}`}
              className="btn btn-outline w-full mt-3 py-1 text-sm"
            >
              View Course
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Link 
          to="/courses"
          className="btn bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 w-full hover:bg-primary-100 dark:hover:bg-primary-900/30"
        >
          Browse More Courses
        </Link>
      </div>
    </div>
  );
};

export default PopularCoursesCard;
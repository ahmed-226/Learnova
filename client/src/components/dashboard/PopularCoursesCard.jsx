import React from 'react';

const PopularCoursesCard = () => {
  // Mock data for popular courses
  const popularCourses = [
    {
      id: 1,
      title: "Machine Learning Basics",
      students: 1243,
      rating: 4.8
    },
    {
      id: 2,
      title: "JavaScript Masterclass",
      students: 982,
      rating: 4.7
    },
    {
      id: 3,
      title: "Modern UI/UX Design",
      students: 756,
      rating: 4.9
    }
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Popular Courses</h2>
        <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {popularCourses.map(course => (
          <div 
            key={course.id} 
            className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <h4 className="font-medium text-gray-800 dark:text-gray-200">{course.title}</h4>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">{course.students.toLocaleString()} students</span>
              </div>
              <div className="flex items-center text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-400">{course.rating}</span>
              </div>
            </div>
            <button className="btn btn-outline w-full mt-3 py-1 text-sm">Enroll Now</button>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button className="btn bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 w-full hover:bg-primary-100 dark:hover:bg-primary-900/30">
          Browse More Courses
        </button>
      </div>
    </div>
  );
};

export default PopularCoursesCard;
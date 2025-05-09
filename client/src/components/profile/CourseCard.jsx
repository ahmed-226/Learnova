const CourseCard = ({ course }) => {
    return (
        <div className="card h-[240px] flex flex-col">
            <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-medium text-primary-900 dark:text-primary-100">{course.title}</h3>
            <span className={`bg-${course.color}-100 dark:bg-${course.color}-900/30 text-${course.color}-700 dark:text-${course.color}-400 text-xs px-2 py-1 rounded-md`}>
                {course.progress}% Complete
            </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Instructor: {course.instructor}</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
                className={`h-2.5 rounded-full bg-${course.color}-500`} 
                style={{ width: `${course.progress}%` }}
            ></div>
            </div>
            <div className="flex justify-between items-center mt-auto">
            <span className="text-xs text-gray-500 dark:text-gray-400">Last accessed: {course.lastAccessed}</span>
            <button className="btn btn-primary text-sm py-1">
                Continue Learning
            </button>
            </div>
        </div>
    );
}

export default CourseCard;

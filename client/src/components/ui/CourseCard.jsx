import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../common/AnimatedSection.jsx';

const CourseCard = ({ id, title, instructor, level, coverImage, category, price, isFree, studentsCount, rating }) => {
  const [imageError, setImageError] = useState(false);
  
  const placeholderImage = "https://via.placeholder.com/300x200?text=Course+Image";
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <AnimatedSection>
      <Link to={`/courses/${id}`} className="group card overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        <div className="h-48 overflow-hidden relative">
          <div className="absolute top-2 right-2 z-10">
            <span className="px-2 py-1 text-xs font-semibold bg-primary-500 text-white rounded-md">
              {level}
            </span>
          </div>
          <img 
            src={imageError ? placeholderImage : coverImage || placeholderImage} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <span className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider mb-1">{category}</span>
          <h3 className="text-lg font-semibold mb-2 flex-grow">{title}</h3>
          <div className="mt-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400">By {instructor}</p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">({studentsCount})</span>
              </div>
              <div className="font-bold text-primary-600 dark:text-primary-400">
                {isFree ? 'Free' : `$${price}`}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
};

export default CourseCard;
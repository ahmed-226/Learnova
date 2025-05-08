import React from 'react';
import AnimatedSection from '../common/AnimatedSection.jsx';

const CourseCard = ({ title, instructor, level, image, category }) => (
  <AnimatedSection>
    <div className="group card overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-1 text-xs font-semibold bg-primary-500 text-white rounded-md">
            {level}
          </span>
        </div>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 p-4">
        <span className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">{category}</span>
        <h4 className="font-semibold text-lg mt-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">By {instructor}</p>
      </div>
    </div>
  </AnimatedSection>
);

export default CourseCard;
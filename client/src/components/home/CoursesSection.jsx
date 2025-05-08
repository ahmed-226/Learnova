import React from 'react';
import AnimatedSection from '../common/AnimatedSection.jsx';
import CourseCard from '../ui/CourseCard';
import { popularCourses } from '../../data/main.js';

const CoursesSection = () => {
  return (
    <section className="py-16 px-4 bg-white dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Popular Courses</h2>
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">View all →</a>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCourses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
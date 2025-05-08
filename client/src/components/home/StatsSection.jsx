import React from 'react';
import AnimatedSection from '../common/AnimatedSection.jsx';

const StatsSection = () => {
  return (
    <section className="py-12 bg-white dark:bg-dark-bg border-y border-gray-100 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedSection delay={0.1}>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">100+</div>
              <div className="text-gray-600 dark:text-gray-400">Courses</div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Instructors</div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">10k+</div>
              <div className="text-gray-600 dark:text-gray-400">Students</div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-primary-400">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Satisfaction</div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
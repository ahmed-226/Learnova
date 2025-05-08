import React from 'react';
import AnimatedSection from '../common/AnimatedSection.jsx';
import TestimonialCard from '../ui/TestimonialCard';
import { TestimonialCards } from '../../data/main.js';

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-dark-bg/30">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TestimonialCards.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
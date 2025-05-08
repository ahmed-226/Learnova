import React from 'react';
import AnimatedSection from '../common/AnimatedSection.jsx';

const TestimonialCard = ({ quote, author, role, image }) => (
  <AnimatedSection>
    <div className="card text-center">
      <img src={image} alt={author} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
      <p className="italic text-gray-600 dark:text-gray-400 mb-4">{quote}</p>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">{role}</p>
    </div>
  </AnimatedSection>
);

export default TestimonialCard;
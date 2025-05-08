import React from 'react';
import AnimatedSection from '../common/AnimatedSection.jsx';

const FeatureCard = ({ icon, title, description }) => (
  <AnimatedSection>
    <div className="card hover:shadow-md transition-shadow">
      <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </AnimatedSection>
);

export default FeatureCard;
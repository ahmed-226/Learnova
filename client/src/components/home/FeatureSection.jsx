import React from 'react';
import AnimatedSection from '../common/AnimatedSection.jsx';
import FeatureCard from '../ui/FeatureCard';
import { features } from '../../data/main.js';

const FeatureSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-dark-bg/30">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Learnova?</h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
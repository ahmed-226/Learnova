import React from 'react';
import AnimatedSection from '../common/AnimatedSection.jsx';

const CTASection = () => {
  return (
    <section className="py-16 px-4 bg-primary-700 dark:bg-primary-900">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Learning?</h2>
          <p className="text-primary-100 mb-8 text-lg">Join thousands of students learning on Learnova.</p>
          <button className="btn bg-white text-primary-700 hover:bg-primary-50">Create Free Account</button>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default CTASection;
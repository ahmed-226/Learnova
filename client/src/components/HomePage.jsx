import React from 'react';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import HeroSection from './home/HeroSection';
import StatsSection from './home/StatsSection';
import FeatureSection from './home/FeatureSection';
import CoursesSection from './home/CoursesSection';
import TestimonialsSection from './home/TestimonialsSection';
import CTASection from './home/CTASection';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeatureSection />
      <CoursesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
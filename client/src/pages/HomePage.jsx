import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeatureSection from '../components/home/FeatureSection';
import CoursesSection from '../components/home/CoursesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-primary-50 dark:bg-dark-bg">
      <Navbar />

      {/* Keep original HeroSection */}
      <HeroSection />

      {/* Enhanced Stats Section with Animation */}
      <section className="py-20 relative overflow-hidden bg-white dark:bg-dark-card">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-800/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                scale: Math.random() * 0.6 + 0.4
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
          <div className="absolute right-0 top-0 h-full opacity-10 dark:opacity-5">
            <svg viewBox="0 0 400 400" width="400" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="statsPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-primary-500 dark:text-primary-400" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#statsPattern)" />
            </svg>
          </div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <StatsSection />
        </div>
      </section>

      {/* Enhanced Feature Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/10 dark:to-primary-900/20"></div>
        
        {/* Decorative Elements */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-secondary-200 dark:bg-secondary-800/20 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        ></motion.div>
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-primary-200 dark:bg-primary-800/20 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2 }}
        ></motion.div>
        
        <div className="container relative z-10 mx-auto px-4">
          <FeatureSection />
        </div>
      </section>

      {/* Enhanced Courses Section */}
      <section className="py-20 bg-white dark:bg-dark-card relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-8 -left-8 w-32 h-32">
            <svg viewBox="0 0 100 100" className="text-primary-400 dark:text-primary-600 opacity-20">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
              <circle cx="25" cy="25" r="15" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute -bottom-8 -right-8 w-40 h-40 text-secondary-400 dark:text-secondary-600 opacity-20">
            <svg viewBox="0 0 100 100">
              <rect width="80" height="80" x="10" y="10" stroke="currentColor" strokeWidth="8" fill="none" rx="10" />
            </svg>
          </div>
        </div>
        
        <motion.div 
          className="container relative z-10 mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <motion.div
              className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/40 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              EXPAND YOUR KNOWLEDGE
            </motion.div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Featured Courses
            </motion.h2>
          </div>
          
          <CoursesSection />
        </motion.div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-primary-50/50 to-white dark:from-primary-900/10 dark:to-dark-bg">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-28 h-28 rounded-full bg-primary-200 dark:bg-primary-800/20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: Math.random() * 4 + 5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-1 bg-primary-100 dark:bg-primary-900/40 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              STUDENT EXPERIENCES
            </div>
            <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
          </motion.div>
          
          <TestimonialsSection />
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 relative overflow-hidden bg-white dark:bg-dark-card">
        {/* Background Design Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute left-0 top-0 h-full opacity-10 dark:opacity-5" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ctaPattern" patternUnits="userSpaceOnUse" width="40" height="40">
                <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctaPattern)" className="text-primary-500 dark:text-primary-400" />
          </svg>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-900/30 dark:via-dark-card dark:to-secondary-900/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CTASection />
            
            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required for free courses
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      
      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
import React from 'react';
import {motion} from 'framer-motion';

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 dark:from-primary-900 dark:to-primary-800 min-h-screen flex items-center">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

        {/* Floating decoration elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-primary-400/20 dark:bg-primary-300/10 rounded-full blur-3xl"></div>
          <div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-secondary-400/20 dark:bg-secondary-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center">
          {/* Text content */}
          <motion.div 
            className="text-center md:text-left mb-12 md:mb-0 md:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              ✨ The future of online learning is here
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Learn anything, <span className="text-secondary-300">anytime</span>, anywhere.
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-lg">
              Learnova's interactive platform helps you master new skills with expert-led courses, hands-on projects, and a supportive community.
            </p>
            <motion.div 
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <button className="btn bg-white text-primary-700 hover:bg-primary-50 hover:shadow-lg shadow-md transition-all">
                Get Started For Free
              </button>
              <button className="btn border border-white/30 text-white hover:bg-white/10 transition-colors">
                Browse Courses
              </button>
            </motion.div>
            
            {/* Stats pill */}
            <div className="mt-10 inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 space-x-4 text-white/90">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">10K+ Students</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="text-sm">100+ Courses</span>
              </div>
              <div className="w-px h-4 bg-white/30"></div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">95% Success Rate</span>
              </div>
            </div>
          </motion.div>
          
          {/* Hero image/illustration */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Browser mockup */}
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transform scale-110">
                {/* Browser header */}
                <div className="bg-gray-100 dark:bg-dark-bg border-b border-gray-200 dark:border-gray-700 p-3 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="mx-auto bg-white dark:bg-dark-bg rounded-md px-3 py-1 text-xs text-gray-600 dark:text-gray-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    app.learnova.edu
                  </div>
                </div>
                
                {/* Browser content - Course dashboard preview with LARGER content */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-medium text-xl text-primary-700 dark:text-primary-400">My Learning Dashboard</h3>
                    <div className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-400 text-xs px-2 py-1 rounded-md">
                      3 Courses in Progress
                    </div>
                  </div>
                  
                  {/* Course progress cards - slightly larger with more spacing */}
                  <div className="space-y-4">
                    {[
                      { title: "Web Development Bootcamp", progress: 75, color: "primary" },
                      { title: "Data Science Fundamentals", progress: 40, color: "secondary" },
                      { title: "UX Design Principles", progress: 20, color: "green" }
                    ].map((course, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-md p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-gray-800 dark:text-gray-200">{course.title}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full bg-${course.color}-500`} 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary-500 rounded-lg opacity-80 -z-10"></div>
              <div className="absolute -left-4 -top-4 w-16 h-16 bg-primary-500 rounded-lg opacity-80 -z-10"></div>
            </div>
          </motion.div>
        </div>
      </section>
    );
}

export default HeroSection;
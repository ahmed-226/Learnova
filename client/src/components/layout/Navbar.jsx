import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '../common/ThemeToggle';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-100 dark:border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="font-display font-bold text-2xl text-primary-700 dark:text-primary-400">Learnova</span>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">Courses</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">About</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">Contact</a>
            <button className="btn btn-outline ml-2" onClick={()=>navigate('./auth')}>Sign In</button>
            <button className="btn btn-primary">Register</button>
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg">Courses</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg">About</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg">Contact</a>
          <div className="flex flex-col space-y-2 pt-2">
            <button className="btn btn-outline">Sign In</button>
            <button className="btn btn-primary">Register</button>
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
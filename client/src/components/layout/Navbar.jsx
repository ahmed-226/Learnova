import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const AuthenticatedMenu = () => (
    <div className="flex items-center ">
      {/* Desktop User Menu */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">
          Courses
        </Link>
        <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">
          About
        </Link>
        <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">
          Contact
        </Link>
        <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">
          Dashboard
        </Link>
        
        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg focus:outline-none"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.firstName?.charAt(0)?.toUpperCase()}{user?.lastName?.charAt(0)?.toUpperCase()}
            </div>
            <span className="font-medium">{user?.firstName} {user?.lastName}</span>
            <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg border border-gray-200 dark:border-dark-border z-50"
            >
              <div className="py-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-bg"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        <ThemeToggle />
      </div>
    </div>
  );

  const GuestMenu = () => (
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/courses" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">
        Courses
      </Link>
      <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">
        About
      </Link>
      <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2">
        Contact
      </Link>
      <Link to="/auth" className="btn btn-primary ml-2">
        Sign In/Register
      </Link>
      <ThemeToggle />
    </div>
  );

  return (
    <nav className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-100 dark:border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-display font-bold text-2xl text-primary-700 dark:text-primary-400">
              Learnova
            </Link>
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
          {isAuthenticated ? <AuthenticatedMenu /> : <GuestMenu />}
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
          <Link 
            to="/courses" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
            onClick={() => setIsMenuOpen(false)}
          >
            Courses
          </Link>
          <Link 
            to="/about" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <div >
              <Link 
                to="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <div className="px-3 py-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Signed in as: <span className="font-medium text-gray-700 dark:text-gray-300">{user?.firstName} {user?.lastName}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-bg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <Link 
                to="/auth" 
                className="btn btn-primary w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In/Register
              </Link>
            </div>
          )}
          
          <div className="pt-2">
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
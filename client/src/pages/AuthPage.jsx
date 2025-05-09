import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import GridBackground from '../components/ui/GridBackground';
import FloatingDecoration from '../components/ui/FloatingDecoration';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 dark:from-primary-900 dark:to-primary-800 relative overflow-hidden">
      <GridBackground />

      <FloatingDecoration />


      <div className="flex-grow flex items-center justify-center px-4 relative z-10">
        <motion.div 
          className="bg-white dark:bg-dark-card shadow-xl rounded-lg p-8 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <motion.h2 
              className="text-3xl font-bold text-center mb-3 text-primary-700 dark:text-primary-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {isLogin ? 'Welcome Back!' : 'Join Learnova'}
            </motion.h2>
            <motion.p 
              className="text-center text-gray-600 dark:text-gray-400 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {isLogin
                ? 'Login to access your account and continue learning.'
                : 'Sign up to start your learning journey with us.'}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </motion.div>

          <motion.div 
            className="mt-8 text-sm text-center text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={toggleForm}
                  className="text-secondary-500 hover:text-secondary-600 hover:underline focus:outline-none transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={toggleForm}
                  className="text-secondary-500 hover:text-secondary-600 hover:underline focus:outline-none transition-colors"
                >
                  Login
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
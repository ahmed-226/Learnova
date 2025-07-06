import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AchievementCard from './AchievementCard';

const CourseCompletionCelebration = ({ isOpen, onClose, course, achievement }) => {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowFireworks(true);
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-dark-card rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Fireworks Effect */}
          {showFireworks && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: '50%',
                    y: '50%'
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              ))}
            </div>
          )}

          {/* Celebration Content */}
          <div className="text-center">
            <motion.div
              className="text-6xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              🎉
            </motion.div>
            
            <motion.h2
              className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Course Completed!
            </motion.h2>
            
            <motion.p
              className="text-gray-600 dark:text-gray-400 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Congratulations! You've successfully completed <strong>{course?.title}</strong>
            </motion.p>

            {/* Achievement Badge */}
            {achievement && (
              <motion.div
                className="mb-6 flex justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <AchievementCard
                  achievement={achievement.achievement}
                  userAchievement={achievement.userAchievement}
                  size="normal"
                />
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 btn btn-outline"
              >
                Continue Learning
              </button>
              <button
                onClick={() => {
                  // Navigate to profile achievements
                  window.location.href = '/profile?tab=achievements';
                }}
                className="flex-1 btn btn-primary"
              >
                View Achievements
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CourseCompletionCelebration;
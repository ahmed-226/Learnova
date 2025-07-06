import React from 'react';
import { motion } from 'framer-motion';

const AchievementCard = ({ achievement, userAchievement, size = 'normal' }) => {
  // Size classes
  const cardSize = size === 'small' ? 'w-32 h-36' : size === 'large' ? 'w-56 h-64' : 'w-44 h-52';
  const iconSize = size === 'small' ? 'text-3xl' : size === 'large' ? 'text-6xl' : 'text-4xl';
  const titleSize = size === 'small' ? 'text-sm' : size === 'large' ? 'text-2xl' : 'text-lg';

  // Rarity color for border
  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'COMMON': return 'stroke-gray-400';
      case 'UNCOMMON': return 'stroke-green-400';
      case 'RARE': return 'stroke-blue-400';
      case 'EPIC': return 'stroke-purple-400';
      case 'LEGENDARY': return 'stroke-yellow-400';
      default: return 'stroke-gray-400';
    }
  };

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-center ${cardSize} group`}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ minWidth: 128, minHeight: 152 }}
    >
      {/* Shield SVG background */}
      <svg
        viewBox="0 0 200 240"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id="badge-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#23272f" />
            <stop offset="100%" stopColor="#111216" />
          </linearGradient>
        </defs>
        <polygon
          points="20,20 180,20 195,60 100,230 5,60"
          fill="url(#badge-gradient)"
          className={`transition-all duration-300 ${getRarityBorder(achievement.rarity)}`}
          strokeWidth="4"
        />
        {/* Optional: subtle GitHub logo at top */}
        <g opacity="0.08">
          <circle cx="100" cy="55" r="28" fill="#fff" />
          <text x="100" y="65" textAnchor="middle" fontSize="32" fill="#000"></text>
        </g>
      </svg>

      {/* Points badge */}
      <div className="absolute top-3 right-5 bg-black/80 text-white rounded-full px-2 py-1 text-xs font-bold z-10 shadow">
        {achievement.points}
      </div>

      {/* Icon */}
      <div className={`${iconSize} mt-8 mb-2 z-10 relative`}>
        {achievement.icon}
      </div>

      {/* Title */}
      <div className={`${titleSize} font-bold text-center z-10 relative text-white drop-shadow-md`}>
        {achievement.title}
      </div>

      {/* Subtitle or description */}
      <div className="text-xs text-green-400 font-medium text-center z-10 relative mt-1">
        {achievement.subtitle || achievement.rarity}
      </div>

      {/* Earned date */}
      {userAchievement && (
        <div className="absolute bottom-3 right-5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full z-10">
          {new Date(userAchievement.earnedAt).toLocaleDateString()}
        </div>
      )}

      {/* Hover overlay for description */}
      <div className="absolute inset-0 rounded-[18px] bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 z-20 pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center px-4">
          <p className="text-xs text-white font-medium">{achievement.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
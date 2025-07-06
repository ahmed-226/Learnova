const prisma = require('../../config/database');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');

const createCourseCompletionAchievement = async (userId, courseId) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      select: { 
        id: true, 
        title: true, 
        category: true,
        level: true 
      }
    });

    if (!course) {
      throw new Error('Course not found');
    }

    
    const existingAchievement = await prisma.achievement.findFirst({
      where: {
        type: 'COURSE_COMPLETION',
        criteria: {
          path: ['courseId'],
          equals: courseId
        }
      }
    });

    let achievement;
    if (!existingAchievement) {
      
      achievement = await prisma.achievement.create({
        data: {
          type: 'COURSE_COMPLETION',
          title: `${course.title} Graduate`,
          description: `Successfully completed the ${course.title} course`,
          icon: getCourseIcon(course.category),
          criteria: {
            courseId: courseId,
            courseName: course.title,
            category: course.category,
            level: course.level
          },
          points: getCoursePoints(course.level),
          rarity: getCourseRarity(course.level)
        }
      });
    } else {
      achievement = existingAchievement;
    }

    
    const existingUserAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: Number(userId),
          achievementId: achievement.id
        }
      }
    });

    if (existingUserAchievement) {
      return {
        achievement,
        userAchievement: existingUserAchievement
      };
    }

    
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId: Number(userId),
        achievementId: achievement.id,
        progress: 100
      }
    });

    return {
      achievement,
      userAchievement
    };
  } catch (error) {
    logger.error(`Error creating course completion achievement: ${error.message}`);
    throw error;
  }
};

const getUserAchievements = async (userId) => {
  try {
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: Number(userId) },
      include: {
        achievement: true
      },
      orderBy: {
        earnedAt: 'desc'
      }
    });

    return achievements;
  } catch (error) {
    logger.error(`Error fetching user achievements: ${error.message}`);
    throw error;
  }
};

const getUserAchievementStats = async (userId) => {
  try {
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: Number(userId) },
      include: {
        achievement: {
          select: { 
            points: true, 
            rarity: true 
          }
        }
      }
    });

    const totalPoints = achievements.reduce((sum, ua) => sum + ua.achievement.points, 0);
    const rarityCount = achievements.reduce((acc, ua) => {
      const rarity = ua.achievement.rarity;
      acc[rarity] = (acc[rarity] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAchievements: achievements.length,
      totalPoints,
      rarityBreakdown: rarityCount
    };
  } catch (error) {
    logger.error(`Error fetching user achievement stats: ${error.message}`);
    throw error;
  }
};


const getCourseIcon = (category) => {
  const icons = {
    'Development': '💻',
    'Design': '🎨',
    'Business': '💼',
    'Marketing': '📢',
    'Data Science': '📊',
    'Language': '🗣️',
    'Other': '🎓'
  };
  return icons[category] || '🏆';
};

const getCoursePoints = (level) => {
  const points = {
    'Beginner': 10,
    'Intermediate': 20,
    'Advanced': 30,
    'All Levels': 15
  };
  return points[level] || 10;
};

const getCourseRarity = (level) => {
  const rarity = {
    'Beginner': 'COMMON',
    'Intermediate': 'UNCOMMON',
    'Advanced': 'RARE',
    'All Levels': 'COMMON'
  };
  return rarity[level] || 'COMMON';
};

module.exports = {
  createCourseCompletionAchievement,
  getUserAchievements,
  getUserAchievementStats
};
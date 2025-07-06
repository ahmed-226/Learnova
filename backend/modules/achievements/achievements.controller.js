const achievementsService = require('./achievements.service');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');

const getUserAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const achievements = await achievementsService.getUserAchievements(userId);
    
    res.status(HTTP_STATUS.OK).json(achievements);
  } catch (error) {
    logger.error(`Error in getUserAchievements: ${error.message}`);
    next(error);
  }
};

const getUserAchievementStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await achievementsService.getUserAchievementStats(userId);
    
    res.status(HTTP_STATUS.OK).json(stats);
  } catch (error) {
    logger.error(`Error in getUserAchievementStats: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getUserAchievements,
  getUserAchievementStats
};
const express = require('express');
const router = express.Router();
const achievementsController = require('./achievements.controller');
const auth = require('../../middleware/auth');

router.get('/user', auth, achievementsController.getUserAchievements);
router.get('/user/stats', auth, achievementsController.getUserAchievementStats);

module.exports = router;
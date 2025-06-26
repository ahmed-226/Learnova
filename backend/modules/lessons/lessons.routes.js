const express = require('express');
const router = express.Router();
const controller = require('./lessons.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./lessons.schema');
const { checkRole } = require('../users/users.controller');

// All lesson routes require authentication
router.use(auth);

// Public routes for authenticated users
router.get('/:lessonId', controller.getLessonById);
router.get('/module/:moduleId', controller.getLessonsByModule);

// Student routes
router.post('/:lessonId/complete', controller.markLessonComplete);

// Instructor routes
router.post('/', checkRole('INSTRUCTOR'), controller.createLesson);
router.put('/:lessonId', checkRole('INSTRUCTOR'), controller.updateLesson);
router.delete('/:lessonId', checkRole('INSTRUCTOR'), controller.deleteLesson);

module.exports = router;
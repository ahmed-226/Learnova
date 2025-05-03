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
router.get('/:lessonId', validate({ params: schema.lessonIdParam }), controller.getLessonById);
router.get('/module/:moduleId', controller.getLessonsByModule);

// Instructor routes
router.post('/', checkRole('INSTRUCTOR'), validate(schema.createLesson), controller.createLesson);
router.put('/:lessonId', checkRole('INSTRUCTOR'), validate(schema.updateLesson), controller.updateLesson);
router.delete('/:lessonId', checkRole('INSTRUCTOR'), controller.deleteLesson);

module.exports = router;
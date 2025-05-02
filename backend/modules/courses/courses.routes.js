const express = require('express');
const router = express.Router();
const controller = require('./courses.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./courses.schema');
const { checkRole } = require('../users/users.controller');

// Public routes 
router.get('/', validate(schema.listCourses), controller.listCourses);
router.get('/:courseId', controller.getCourseById);

// Protected routes 
router.use(auth);

// Student enrollment routes
router.post('/:courseId/enroll', controller.enrollInCourse);
router.delete('/:courseId/enroll', controller.unenrollFromCourse);

// Instructor routes (requires INSTRUCTOR or ADMIN role)
router.post('/', checkRole('INSTRUCTOR'), validate(schema.createCourse), controller.createCourse);
router.put('/:courseId', checkRole('INSTRUCTOR'), validate(schema.updateCourse), controller.updateCourse);
router.delete('/:courseId', checkRole('INSTRUCTOR'), controller.deleteCourse);
router.get('/:courseId/students', checkRole('INSTRUCTOR'), controller.getEnrolledStudents);

// Module management
router.post('/:courseId/modules', checkRole('INSTRUCTOR'), validate(schema.createModule), controller.addModule);
router.put('/modules/:moduleId', checkRole('INSTRUCTOR'), validate(schema.updateModule), controller.updateModule);

module.exports = router;
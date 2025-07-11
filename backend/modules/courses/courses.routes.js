const express = require('express');
const router = express.Router();
const controller = require('./courses.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./courses.schema');
const { checkRole } = require('../users/users.controller');
const { courseContentUpload } = require('../../middleware/upload');


router.get('/', validate(schema.listCourses), controller.listCourses);
router.get('/:courseId', controller.getCourseById);
router.get('/:courseId/content', auth, controller.getCourseContent);


router.use(auth);


router.post('/:courseId/enroll', 
  validate({ params: schema.enrollmentParam }), 
  controller.enrollInCourse
);
router.delete('/:courseId/enroll', 
  validate({ params: schema.enrollmentParam }), 
  controller.unenrollFromCourse
);
router.get('/:courseId/enrollment-status', controller.checkEnrollment);
router.post('/:courseId/complete', auth, controller.completeCourse);


router.post('/',
  auth,
  checkRole('INSTRUCTOR'),
  courseContentUpload,
  validate(schema.createCourse),
  controller.createCourse
);
router.get('/:courseId/modules', 
  auth,
  validate({ params: schema.courseIdParam }),
  controller.getModulesByCourse
);
router.put('/:courseId/modules/reorder', 
  auth,
  checkRole('INSTRUCTOR'), 
  validate({ params: schema.courseIdParam }),
  controller.reorderModules
);

router.delete('/modules/:moduleId', 
  auth,
  checkRole('INSTRUCTOR'),
  validate({ params: schema.moduleIdParam }),
  controller.deleteModule
);

router.put('/modules/:moduleId/content/reorder',
  auth,
  checkRole('INSTRUCTOR'),
  validate({ params: schema.moduleIdParam }),
  controller.reorderModuleContent
);
router.put('/:courseId', checkRole('INSTRUCTOR'), validate(schema.updateCourse), controller.updateCourse);
router.delete('/:courseId', checkRole('INSTRUCTOR'), controller.deleteCourse);
router.get('/:courseId/students', checkRole('INSTRUCTOR'), controller.getEnrolledStudents);


router.post('/:courseId/modules', checkRole('INSTRUCTOR'), validate(schema.createModule), controller.addModule);
router.put('/modules/:moduleId', checkRole('INSTRUCTOR'), validate(schema.updateModule), controller.updateModule);

module.exports = router;
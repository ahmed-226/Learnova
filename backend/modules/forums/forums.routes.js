const express = require('express');
const router = express.Router();
const controller = require('./assignments.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./assignments.schema');
const { checkRole } = require('../users/users.controller');

// All routes require authentication
router.use(auth);

// Routes for all authenticated users
router.get('/module/:moduleId', controller.getAssignmentsByModule);
router.get('/:assignmentId', validate({ params: schema.assignmentIdParam }), controller.getAssignmentById);

// Student routes
router.post('/:assignmentId/submit',
    validate({ params: schema.assignmentIdParam, body: schema.submitAssignment }),
    controller.submitAssignment
);
router.get('/:assignmentId/submission',
    validate({ params: schema.assignmentIdParam }),
    controller.getUserSubmission
);

// Instructor routes
router.post('/',
    checkRole('INSTRUCTOR'),
    validate({ body: schema.createAssignment }),
    controller.createAssignment
);
router.put('/:assignmentId',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.assignmentIdParam, body: schema.updateAssignment }),
    controller.updateAssignment
);
router.delete('/:assignmentId',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.assignmentIdParam }),
    controller.deleteAssignment
);
router.get('/:assignmentId/submissions',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.assignmentIdParam }),
    controller.getAssignmentSubmissions
);
router.put('/submissions/:submissionId',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.submissionIdParam, body: schema.gradeSubmission }),
    controller.gradeSubmission
);

module.exports = router;
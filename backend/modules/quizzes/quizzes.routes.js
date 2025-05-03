const express = require('express');
const router = express.Router();
const controller = require('./quizzes.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./quizzes.schema');
const { checkRole } = require('../users/users.controller');

// All quiz routes require authentication
router.use(auth);

// Routes for all authenticated users
router.get('/module/:moduleId', controller.getQuizzesByModule);
router.get('/:quizId', validate({ params: schema.quizIdParam }), controller.getQuizById);
router.get('/:quizId/results', validate({ params: schema.quizIdParam }), controller.getUserQuizResults);

// Student routes
router.post('/:quizId/submit',
    validate({ params: schema.quizIdParam, body: schema.submitQuizAnswers }),
    controller.submitQuizAnswers
);

// Instructor routes
router.post('/',
    checkRole('INSTRUCTOR'),
    validate({ body: schema.createQuiz }),
    controller.createQuiz
);

router.put('/:quizId',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.quizIdParam, body: schema.updateQuiz }),
    controller.updateQuiz
);

router.delete('/:quizId',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.quizIdParam }),
    controller.deleteQuiz
);

router.post('/:quizId/questions',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.quizIdParam, body: schema.createQuestion }),
    controller.addQuestion
);

router.put('/questions/:questionId',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.questionIdParam, body: schema.updateQuestion }),
    controller.updateQuestion
);

router.delete('/questions/:questionId',
    checkRole('INSTRUCTOR'),
    validate({ params: schema.questionIdParam }),
    controller.deleteQuestion
);

module.exports = router;
const Joi = require('joi');
const { QUESTION_TYPES } = require('../../utils/constants');

const createQuiz = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().allow('').optional(),
  moduleId: Joi.number().integer().required(),
  timeLimit: Joi.number().integer().allow(null).optional(),
  passingScore: Joi.number().integer().min(0).max(100).optional(),
  shuffleQuestions: Joi.boolean().optional(),
  showCorrectAnswers: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
  questions: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      type: Joi.string().valid('multiple_choice', 'true_false', 'short_answer').required(),
      options: Joi.when('type', {
        is: 'multiple_choice',
        then: Joi.array().items(
          Joi.object({
            text: Joi.string().required(),
            isCorrect: Joi.boolean().required()
          })
        ).min(2).required(),
        otherwise: Joi.optional()
      }),
      answer: Joi.when('type', {
        is: Joi.string().valid('true_false', 'short_answer'),
        then: Joi.string().required(),
        otherwise: Joi.optional()
      }),
      points: Joi.number().integer().min(1).optional()
    })
  ).optional()
});

const updateQuiz = Joi.object({
  title: Joi.string().max(100)
}).min(1);

const createQuestion = Joi.object({
  question: Joi.string().required().max(500),
  type: Joi.string().valid(...Object.values(QUESTION_TYPES)).required(),
  options: Joi.when('type', {
    is: QUESTION_TYPES.MULTIPLE_CHOICE,
    then: Joi.array().items(Joi.string()).min(2).required(),
    otherwise: Joi.optional()
  }),
  correctAnswer: Joi.string().required()
});

const updateQuestion = Joi.object({
  question: Joi.string().max(500),
  type: Joi.string().valid(...Object.values(QUESTION_TYPES)),
  options: Joi.array().items(Joi.string()).min(2),
  correctAnswer: Joi.string()
}).min(1);

const quizIdParam = Joi.object({
  quizId: Joi.number().integer().required()
});

const submitQuizAnswers = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number().integer().required(),
      answer: Joi.string().required()
    })
  ).required()
});

const questionIdParam = Joi.object({
  questionId: Joi.number().integer().required()
});

module.exports = {
  createQuiz,
  updateQuiz,
  createQuestion,
  updateQuestion,
  submitQuizAnswers,
  quizIdParam,
  questionIdParam
};
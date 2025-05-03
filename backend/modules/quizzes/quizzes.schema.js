const Joi = require('joi');
const { QUESTION_TYPES } = require('../../utils/constants');

const createQuiz = Joi.object({
  title: Joi.string().required().max(100),
  moduleId: Joi.number().integer().required()
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

const submitQuizAnswers = Joi.object({
  answers: Joi.array().items(
    Joi.object({
      questionId: Joi.number().integer().required(),
      answer: Joi.string().required()
    })
  ).required().min(1)
});

const quizIdParam = Joi.object({
  quizId: Joi.number().integer().required()
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
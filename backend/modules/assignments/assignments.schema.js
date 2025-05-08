const Joi = require('joi');
const { CONTENT_TYPES } = require('../../utils/constants');


const createAssignment = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().max(5000),
  moduleId: Joi.number().integer().required(),
  dueDate: Joi.date().required().min('now')
});


const updateAssignment = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(5000),
  dueDate: Joi.date().min('now')
}).min(1);


const submitAssignment = Joi.object({
  content: Joi.string().required(),
  contentType: Joi.string().valid(...Object.values(CONTENT_TYPES)).required()
});


const gradeSubmission = Joi.object({
  feedback: Joi.string().max(5000),
  grade: Joi.number().integer().min(0).max(100)
}).min(1);


const assignmentIdParam = Joi.object({
  assignmentId: Joi.number().integer().required()
});

const submissionIdParam = Joi.object({
  submissionId: Joi.number().integer().required()
});

module.exports = {
  createAssignment,
  updateAssignment,
  submitAssignment,
  gradeSubmission,
  assignmentIdParam,
  submissionIdParam
};
const Joi = require('joi');
const { PAGINATION } = require('../../utils/constants');

const createCourse = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().max(1000),
});

const updateCourse = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(1000),
}).min(1);

const createModule = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().max(1000),
  order: Joi.number().integer().min(1),
});

const updateModule = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(1000),
  order: Joi.number().integer().min(1),
}).min(1);

const listCourses = Joi.object({
  page: Joi.number().integer().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: Joi.number().integer().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
  search: Joi.string(),
  instructorId: Joi.number().integer(),
});

const courseIdParam = Joi.object({
  courseId: Joi.number().integer().required(),
});

const moduleIdParam = Joi.object({
  moduleId: Joi.number().integer().required(),
});

module.exports = {
  createCourse,
  updateCourse,
  createModule,
  updateModule,
  listCourses,
  courseIdParam,
  moduleIdParam,
};
const Joi = require('joi');


const createThread = Joi.object({
  title: Joi.string().required().max(200),
  content: Joi.string().required().max(10000) 
});


const updateThread = Joi.object({
  title: Joi.string().max(200)
}).min(1);


const createPost = Joi.object({
  content: Joi.string().required().max(10000),
  parentId: Joi.number().integer().positive().optional() 
});


const updatePost = Joi.object({
  content: Joi.string().required().max(10000)
});


const forumIdParam = Joi.object({
  forumId: Joi.number().integer().required()
});

const courseIdParam = Joi.object({
  courseId: Joi.number().integer().required()
});

const threadIdParam = Joi.object({
  threadId: Joi.number().integer().required()
});

const postIdParam = Joi.object({
  postId: Joi.number().integer().required()
});

module.exports = {
  createThread,
  updateThread,
  createPost,
  updatePost,
  forumIdParam,
  courseIdParam,
  threadIdParam,
  postIdParam
};
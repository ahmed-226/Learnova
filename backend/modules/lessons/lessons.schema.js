const Joi = require('joi');


const createLesson = Joi.object({
    title: Joi.string().required().max(100),
    content: Joi.string().allow('').max(50000),
    moduleId: Joi.number().integer().required(),
    order: Joi.number().integer().min(1)
});


const updateLesson = Joi.object({
    title: Joi.string().max(100),
    content: Joi.string().allow('').max(50000),
    order: Joi.number().integer().min(1)
});


const lessonIdParam = Joi.object({
    lessonId: Joi.number().integer().required()
});

module.exports = {
    createLesson,
    updateLesson,
    lessonIdParam
};
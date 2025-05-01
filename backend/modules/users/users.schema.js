const Joi = require('joi');
const { ROLES } = require('../../utils/constants');

const register = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid('STUDENT', 'INSTRUCTOR', 'ADMIN').default('STUDENT')
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfile = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  password: Joi.string().min(6),
  currentPassword: Joi.string().when('password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional()
  })
}).min(1);

const updateUser = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  role: Joi.string().valid('STUDENT', 'INSTRUCTOR', 'ADMIN'),
  password: Joi.string().min(6)
}).min(1);

module.exports = {
  register,
  login,
  updateProfile,
  updateUser
};
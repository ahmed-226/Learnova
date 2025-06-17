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
  bio: Joi.string().allow('').max(500), 
  currentPassword: Joi.string().when('password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional()
  })
}).min(1);

const updateUser = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  bio: Joi.string().allow('').max(500),
  role: Joi.string().valid('STUDENT', 'INSTRUCTOR', 'ADMIN'),
  password: Joi.string().min(6)
}).min(1);

const changePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const deleteAccount = Joi.object({
  password: Joi.string().required()
});





module.exports = {
  register,
  login,
  updateProfile,
  updateUser,
  changePassword,
  deleteAccount,
};
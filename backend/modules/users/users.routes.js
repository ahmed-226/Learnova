const express = require('express');
const router = express.Router();
const controller = require('./users.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./users.schema');

// Authentication routes
router.post('/register', validate(schema.register), controller.register);
router.post('/login', validate(schema.login), controller.login);

// User management routes 
router.get('/profile', auth, controller.getProfile);
router.put('/profile', auth, validate(schema.updateProfile), controller.updateProfile);
router.get('/dashboard', auth, controller.getDashboard);

// Admin routes 
router.get('/', auth, controller.checkRole('ADMIN'), controller.getAllUsers);
router.get('/:userId', auth, controller.checkRole('ADMIN'), controller.getUserById);
router.put('/:userId', auth, controller.checkRole('ADMIN'), validate(schema.updateUser), controller.updateUser);
router.delete('/:userId', auth, controller.checkRole('ADMIN'), controller.deleteUser);

module.exports = router;
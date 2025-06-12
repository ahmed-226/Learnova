const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const controller = require('./users.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./users.schema');
const upload = require('../../middleware/upload');

// Public routes
router.post('/register', validate({ body: schema.register }), controller.register);
router.post('/login', validate({ body: schema.login }), controller.login);

// Protected routes
router.use(auth);
router.post('/logout', controller.logout);
router.get('/profile', controller.getProfile);
router.put('/profile', validate({ body: schema.updateProfile }), controller.updateProfile);
router.post('/upload-avatar', upload.single('avatar'), controller.uploadAvatar);
router.get('/dashboard', controller.getDashboard);

// Admin routes
router.get('/', controller.checkRole('ADMIN'), controller.getAllUsers);
router.get('/:userId', controller.checkRole('ADMIN'), controller.getUserById);
router.put('/:userId', controller.checkRole('ADMIN'), validate({ body: schema.updateUser }), controller.updateUser);
router.delete('/:userId', controller.checkRole('ADMIN'), controller.deleteUser);

module.exports = router;
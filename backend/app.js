// Express app setup
const express = require('express');
const errorHandler = require('./middleware/error');
const userRoutes = require('./modules/users/users.routes.js');
const courseRoutes = require('./modules/courses/courses.routes.js');
// Add other routes

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
// Add other routes
app.use(errorHandler);

module.exports = app;

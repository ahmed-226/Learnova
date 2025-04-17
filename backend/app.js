// Express app setup
const express = require('express');
const errorMiddleware = require('./middleware/error');
const userRoutes = require('./modules/users/users.routes.js');
// Add other routes

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
// Add other routes
app.use(errorMiddleware);

module.exports = app;

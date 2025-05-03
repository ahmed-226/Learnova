const express = require('express');
const errorHandler = require('./middleware/error');
const userRoutes = require('./modules/users/users.routes.js');
const courseRoutes = require('./modules/courses/courses.routes.js');
const lessonsRoutes = require('./modules/lessons/lessons.routes');
const quizzesRoutes = require('./modules/quizzes/quizzes.routes.js');


const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/quizzes', quizzesRoutes); 

app.use(errorHandler);

module.exports = app;

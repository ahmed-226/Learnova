// filepath: backend/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const userRoutes = require('./modules/users/users.routes.js');
const courseRoutes = require('./modules/courses/courses.routes.js');
const lessonsRoutes = require('./modules/lessons/lessons.routes');
const quizzesRoutes = require('./modules/quizzes/quizzes.routes.js');
const assignmentsRoutes = require('./modules/assignments/assignments.routes.js');
const forumsRoutes = require('./modules/forums/forums.routes.js');
const achievementsRoutes = require('./modules/achievements/achievements.router.js');

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/quizzes', quizzesRoutes); 
app.use('/api/assignments', assignmentsRoutes); 
app.use('/api/forums', forumsRoutes);
app.use('/api/achievements', achievementsRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
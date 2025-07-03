const quizService = require('./quizzes.service');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');
const prisma = require('../../config/database'); 


const createQuiz = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const quiz = await quizService.createQuiz(req.body, instructorId);
    
    logger.info(`Quiz created: ${quiz.id} by instructor ${instructorId}`);
    res.status(HTTP_STATUS.CREATED).json(quiz);
  } catch (error) {
    logger.error(`Error in createQuiz: ${error.message}`);
    next(error);
  }
};


const getQuizById = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user.id;
    const role = req.user.role;
    
    const quiz = await quizService.getQuizById(quizId, true);
    
    const isEnrolled = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: quiz.module.courseId
        }
      }
    });

    const isInstructor = quiz.module.course.instructorId === Number(userId);
    const isAdmin = role === 'ADMIN';

    if (!isEnrolled && !isInstructor && !isAdmin) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'You must be enrolled in this course to access this quiz'
      });
    }
    
    res.status(HTTP_STATUS.OK).json(quiz);
  } catch (error) {
    logger.error(`Error in getQuizById: ${error.message}`);
    next(error);
  }
};


const updateQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const instructorId = req.user.id;
    
    const updatedQuiz = await quizService.updateQuiz(quizId, req.body, instructorId);
    
    logger.info(`Quiz updated: ${quizId} by instructor ${instructorId}`);
    res.status(HTTP_STATUS.OK).json(updatedQuiz);
  } catch (error) {
    logger.error(`Error in updateQuiz: ${error.message}`);
    next(error);
  }
};


const deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const instructorId = req.user.id;
    
    await quizService.deleteQuiz(quizId, instructorId);
    
    logger.info(`Quiz deleted: ${quizId} by instructor ${instructorId}`);
    res.status(HTTP_STATUS.OK).json({ success: true });
  } catch (error) {
    logger.error(`Error in deleteQuiz: ${error.message}`);
    next(error);
  }
};


const addQuestion = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const instructorId = req.user.id;
    
    const question = await quizService.addQuestion(quizId, req.body, instructorId);
    
    logger.info(`Question added to quiz ${quizId} by instructor ${instructorId}`);
    res.status(HTTP_STATUS.CREATED).json(question);
  } catch (error) {
    logger.error(`Error in addQuestion: ${error.message}`);
    next(error);
  }
};


const updateQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const instructorId = req.user.id;
    
    const updatedQuestion = await quizService.updateQuestion(questionId, req.body, instructorId);
    
    logger.info(`Question ${questionId} updated by instructor ${instructorId}`);
    res.status(HTTP_STATUS.OK).json(updatedQuestion);
  } catch (error) {
    logger.error(`Error in updateQuestion: ${error.message}`);
    next(error);
  }
};


const deleteQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.questionId;
    const instructorId = req.user.id;
    
    await quizService.deleteQuestion(questionId, instructorId);
    
    logger.info(`Question ${questionId} deleted by instructor ${instructorId}`);
    res.status(HTTP_STATUS.OK).json({ success: true });
  } catch (error) {
    logger.error(`Error in deleteQuestion: ${error.message}`);
    next(error);
  }
};


const submitQuizAnswers = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user.id;
    
    const results = await quizService.submitQuizAnswers(quizId, req.body, userId);
    
    logger.info(`User ${userId} submitted answers for quiz ${quizId}`);
    res.status(HTTP_STATUS.CREATED).json(results);
  } catch (error) {
    logger.error(`Error in submitQuizAnswers: ${error.message}`);
    next(error);
  }
};


const getUserQuizResults = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.user.id;
    
    const results = await quizService.getUserQuizResults(quizId, userId);
    
    res.status(HTTP_STATUS.OK).json(results);
  } catch (error) {
    logger.error(`Error in getUserQuizResults: ${error.message}`);
    next(error);
  }
};


const getQuizzesByModule = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;
    
    const quizzes = await quizService.getQuizzesByModule(moduleId);
    
    res.status(HTTP_STATUS.OK).json(quizzes);
  } catch (error) {
    logger.error(`Error in getQuizzesByModule: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  submitQuizAnswers,
  getUserQuizResults,
  getQuizzesByModule
};
const lessonService = require('./lessons.service');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');


const createLesson = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const lesson = await lessonService.createLesson(req.body, userId);

        logger.info(`Lesson created: ${lesson.id} for module ${lesson.moduleId} by instructor ${userId}`);
        res.status(HTTP_STATUS.CREATED).json(lesson);
    } catch (error) {
        logger.error(`Error in createLesson: ${error.message}`);
        next(error);
    }
};


const getLessonById = async (req, res, next) => {
    try {
        const lessonId = req.params.lessonId;
        const userId = req.user?.id;

        const lesson = await lessonService.getLessonById(lessonId, userId);
        res.status(HTTP_STATUS.OK).json(lesson);
    } catch (error) {
        logger.error(`Error in getLessonById: ${error.message}`);
        next(error);
    }
};


const updateLesson = async (req, res, next) => {
    try {
        const lessonId = req.params.lessonId;
        const userId = req.user.id;

        const lesson = await lessonService.updateLesson(lessonId, req.body, userId);
        logger.info(`Lesson ${lessonId} updated by instructor ${userId}`);
        res.status(HTTP_STATUS.OK).json(lesson);
    } catch (error) {
        logger.error(`Error in updateLesson: ${error.message}`);
        next(error);
    }
};


const deleteLesson = async (req, res, next) => {
    try {
        const lessonId = req.params.lessonId;
        const userId = req.user.id;

        await lessonService.deleteLesson(lessonId, userId);
        logger.info(`Lesson ${lessonId} deleted by instructor ${userId}`);
        res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error) {
        logger.error(`Error in deleteLesson: ${error.message}`);
        next(error);
    }
};


const getLessonsByModule = async (req, res, next) => {
    try {
        const moduleId = req.params.moduleId;

        const lessons = await lessonService.getLessonsByModule(moduleId);
        res.status(HTTP_STATUS.OK).json(lessons);
    } catch (error) {
        logger.error(`Error in getLessonsByModule: ${error.message}`);
        next(error);
    }
};

module.exports = {
    createLesson,
    getLessonById,
    updateLesson,
    deleteLesson,
    getLessonsByModule
};
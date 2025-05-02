const courseService = require('./courses.service');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');

const createCourse = async (req, res,next) => {
  try {
    const userId = req.user.id;

    const course = await courseService.createCourse(req.body, userId);
    logger.info(`Course created: ${course.id} by instructor ${userId}`);
    res.status(HTTP_STATUS.CREATED).json(course);
  } catch (error) {
    logger.error(`Error in createCourse: ${error.message}`);
    next(error);
  }
}

const getCourseById = async (req, res,next) => {
  try {
    const courseId = req.params.courseId;
    const includeDetails = req.user.role !== 'STUDENT';
    
    const course = await courseService.getCourseById(courseId, includeDetails);
    res.status(HTTP_STATUS.OK).json(course);
  } catch (error) {
    logger.error(`Error in getCourseById: ${error.message}`);
    next(error);
  }
}

const updateCourse = async (req, res,next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const updatedCourse = await courseService.updateCourse(courseId, req.body, userId);
    logger.info(`Course updated: ${courseId} by instructor ${userId}`);
    res.status(HTTP_STATUS.OK).json(updatedCourse);
  } catch (error) {
    logger.error(`Error in updateCourse: ${error.message}`);
    next(error);
  }
}

const deleteCourse=async (req, res,next) => {
  try {
    const courseId = req.params.courseId;
    const userId =req.user.id

    await courseService.deleteCourse(courseId, userId);
    logger.info(`Course deleted: ${courseId} by instructor ${userId}`);
    res.status(HTTP_STATUS.NO_CONTENT).end();
  } catch (error) {
    logger.error(`Error in deleteCourse: ${error.message}`);
    next(error);
  }
}

const listCourses = async (req, res,next) => {
  try {
    const courses = await courseService.listCourses(req.query);
    res.status(HTTP_STATUS.OK).json(courses);
  } catch (error) {
    logger.error(`Error in listCourses: ${error.message}`);
    next(error);
  }
}
const enrollInCourse = async (req, res,next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;
    
    const enrollment = await courseService.enrollInCourse(courseId, userId);
    logger.info(`User ${userId} enrolled in course ${courseId}`);
    res.status(HTTP_STATUS.CREATED).json(enrollment);
  } catch (error) {
    logger.error(`Error in enrollInCourse: ${error.message}`);
    next(error);
  }
}


const unenrollFromCourse = async (req, res,next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    await courseService.unenrollFromCourse(courseId, userId);
    logger.info(`User ${userId} unenrolled from course ${courseId}`);
    res.status(HTTP_STATUS.NO_CONTENT).end();
  } catch (error) {
    logger.error(`Error in unenrollFromCourse: ${error.message}`);
    next(error);
  }
}
const getEnrolledStudents = async (req, res,next) => {
  try{
    const courseId= req.params.courseId;
    const userId = req.user.id;

    const students = await courseService.getEnrolledStudents(courseId, userId);
    res.status(HTTP_STATUS.OK).json(students);
  }catch (error) {
    logger.error(`Error in getEnrolledCourses: ${error.message}`);
    next(error);
  }
}

const addModule = async (req, res,next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const module = await courseService.addModule(courseId, req.body, userId);
    logger.info(`Module added to course ${courseId} by instructor ${userId}`);
    res.status(HTTP_STATUS.CREATED).json(module);
  } catch (error) {
    logger.error(`Error in addModule: ${error.message}`);
    next(error);
  }
}

const updateModule = async (req, res,next) => {
  try {
    const moduleId = req.params.moduleId;
    const userId = req.user.id;

    const updatedModule = await courseService.updateModule( moduleId, req.body, userId);
    logger.info(`Module updated in course ${moduleId} by instructor ${userId}`);
    res.status(HTTP_STATUS.OK).json(updatedModule);
  } catch (error) {
    logger.error(`Error in updateModule: ${error.message}`);
    next(error);
  }
}


module.exports = {
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  listCourses,
  enrollInCourse,
  unenrollFromCourse,
  getEnrolledStudents, 
  addModule,
  updateModule
}
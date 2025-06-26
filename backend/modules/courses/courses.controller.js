const courseService = require('./courses.service');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');

const createCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courseData = req.body;
    
    console.log("Request body:", req.body); 
    console.log("Files in request:", req.files); 
    
    const course = await courseService.createCourse(courseData, userId, req.files || {});
    logger.info(`Course created: ${course.id} by instructor ${userId}`);
    res.status(HTTP_STATUS.CREATED).json(course);
  } catch (error) {
    logger.error(`Error in createCourse: ${error.message}`);
    next(error);
  }
};

const getCourseContent = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;
    
    console.log(`Getting content for course ${courseId} for user ${userId}`);
    
    const courseContent = await courseService.getCourseContent(courseId, userId);
    res.status(HTTP_STATUS.OK).json(courseContent);
  } catch (error) {
    logger.error(`Error in getCourseContent: ${error.message}`);
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Invalid course ID'
      });
    }
    
    const includeDetails = req.user ? req.user.role !== 'STUDENT' : false;
    
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

const getModulesByCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    
    const modules = await courseService.getModulesByCourse(courseId);
    res.status(HTTP_STATUS.OK).json(modules);
  } catch (error) {
    logger.error(`Error in getModulesByCourse: ${error.message}`);
    next(error);
  }
};



const deleteModule = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;
    const userId = req.user.id;

    await courseService.deleteModule(moduleId, userId);
    logger.info(`Module ${moduleId} deleted by instructor ${userId}`);
    res.status(HTTP_STATUS.OK).json({ success: true });
  } catch (error) {
    logger.error(`Error in deleteModule: ${error.message}`);
    next(error);
  }
};

const reorderModules = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;
    const { moduleIds } = req.body;

    if (!Array.isArray(moduleIds)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'moduleIds must be an array'
      });
    }

    await courseService.reorderModules(courseId, moduleIds, userId);
    logger.info(`Modules reordered for course ${courseId} by instructor ${userId}`);
    res.status(HTTP_STATUS.OK).json({ success: true });
  } catch (error) {
    logger.error(`Error in reorderModules: ${error.message}`);
    next(error);
  }
};

const reorderModuleContent = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;
    const userId = req.user.id;
    const { contentIds } = req.body;

    if (!Array.isArray(contentIds)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'contentIds must be an array'
      });
    }

    await courseService.reorderModuleContent(moduleId, contentIds, userId);
    logger.info(`Content reordered for module ${moduleId} by instructor ${userId}`);
    res.status(HTTP_STATUS.OK).json({ success: true });
  } catch (error) {
    logger.error(`Error in reorderModuleContent: ${error.message}`);
    next(error);
  }
};


module.exports = {
  createCourse,
  getCourseById,
  getCourseContent,
  updateCourse,
  deleteCourse,
  listCourses,
  enrollInCourse,
  unenrollFromCourse,
  getEnrolledStudents, 
  addModule,
  updateModule,
  deleteModule,
  getModulesByCourse,
  reorderModules,
  reorderModuleContent
};
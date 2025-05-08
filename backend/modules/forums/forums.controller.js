const assignmentService = require('./assignments.service');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');


const createAssignment = async (req, res, next) => {
  try {
    const instructorId = req.user.id;
    const assignment = await assignmentService.createAssignment(req.body, instructorId);
    
    logger.info(`Assignment created: ${assignment.id} by instructor ${instructorId}`);
    res.status(HTTP_STATUS.CREATED).json(assignment);
  } catch (error) {
    logger.error(`Error in createAssignment: ${error.message}`);
    next(error);
  }
};


const getAssignmentById = async (req, res, next) => {
  try {
    const assignmentId = req.params.assignmentId;
    
    const assignment = await assignmentService.getAssignmentById(assignmentId);
    res.status(HTTP_STATUS.OK).json(assignment);
  } catch (error) {
    logger.error(`Error in getAssignmentById: ${error.message}`);
    next(error);
  }
};


const updateAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.assignmentId;
    const instructorId = req.user.id;
    
    const updatedAssignment = await assignmentService.updateAssignment(assignmentId, req.body, instructorId);
    
    logger.info(`Assignment updated: ${assignmentId} by instructor ${instructorId}`);
    res.status(HTTP_STATUS.OK).json(updatedAssignment);
  } catch (error) {
    logger.error(`Error in updateAssignment: ${error.message}`);
    next(error);
  }
};


const deleteAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.assignmentId;
    const instructorId = req.user.id;
    
    await assignmentService.deleteAssignment(assignmentId, instructorId);
    
    logger.info(`Assignment deleted: ${assignmentId} by instructor ${instructorId}`);
    res.status(HTTP_STATUS.OK).json({ success: true });
  } catch (error) {
    logger.error(`Error in deleteAssignment: ${error.message}`);
    next(error);
  }
};

const submitAssignment = async (req, res, next) => {
  try {
    const assignmentId = req.params.assignmentId;
    const userId = req.user.id;
    
    const submission = await assignmentService.submitAssignment(assignmentId, req.body, userId);
    
    logger.info(`User ${userId} submitted assignment ${assignmentId}`);
    res.status(HTTP_STATUS.CREATED).json(submission);
  } catch (error) {
    logger.error(`Error in submitAssignment: ${error.message}`);
    next(error);
  }
};


const gradeSubmission = async (req, res, next) => {
  try {
    const submissionId = req.params.submissionId;
    const instructorId = req.user.id;
    
    const gradedSubmission = await assignmentService.gradeSubmission(submissionId, req.body, instructorId);
    
    logger.info(`Submission ${submissionId} graded by instructor ${instructorId}`);
    res.status(HTTP_STATUS.OK).json(gradedSubmission);
  } catch (error) {
    logger.error(`Error in gradeSubmission: ${error.message}`);
    next(error);
  }
};


const getAssignmentSubmissions = async (req, res, next) => {
  try {
    const assignmentId = req.params.assignmentId;
    const instructorId = req.user.id;
    
    const submissions = await assignmentService.getAssignmentSubmissions(assignmentId, instructorId);
    
    res.status(HTTP_STATUS.OK).json(submissions);
  } catch (error) {
    logger.error(`Error in getAssignmentSubmissions: ${error.message}`);
    next(error);
  }
};


const getUserSubmission = async (req, res, next) => {
  try {
    const assignmentId = req.params.assignmentId;
    const userId = req.user.id;
    
    const submission = await assignmentService.getUserSubmission(assignmentId, userId);
    
    if (!submission) {
      return res.status(HTTP_STATUS.OK).json({ submitted: false });
    }
    
    res.status(HTTP_STATUS.OK).json({
      submitted: true,
      submission
    });
  } catch (error) {
    logger.error(`Error in getUserSubmission: ${error.message}`);
    next(error);
  }
};


const getAssignmentsByModule = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;
    
    const assignments = await assignmentService.getAssignmentsByModule(moduleId);
    
    res.status(HTTP_STATUS.OK).json(assignments);
  } catch (error) {
    logger.error(`Error in getAssignmentsByModule: ${error.message}`);
    next(error);
  }
};

module.exports = {
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getAssignmentSubmissions,
  getUserSubmission,
  getAssignmentsByModule
};
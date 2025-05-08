const prisma = require('../../config/database');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');

const createAssignment = async (assignmentData, instructorId) => {
  try {
    
    const module = await prisma.module.findUnique({
      where: { id: Number(assignmentData.moduleId) },
      include: { course: true }
    });

    if (!module) {
      const error = new Error('Module not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to add assignments to this module');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    const assignment = await prisma.assignment.create({
      data: {
        title: assignmentData.title,
        description: assignmentData.description || '',
        moduleId: Number(assignmentData.moduleId),
        dueDate: new Date(assignmentData.dueDate)
      }
    });

    return assignment;
  } catch (error) {
    logger.error(`Error creating assignment: ${error.message}`);
    throw error;
  }
};


const getAssignmentById = async (assignmentId) => {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: Number(assignmentId) },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            courseId: true,
            course: {
              select: {
                id: true,
                title: true,
                instructorId: true
              }
            }
          }
        }
      }
    });

    if (!assignment) {
      const error = new Error('Assignment not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    return assignment;
  } catch (error) {
    logger.error(`Error getting assignment: ${error.message}`);
    throw error;
  }
};


module.exports={
  createAssignment,
  getAssignmentById
}
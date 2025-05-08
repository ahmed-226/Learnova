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


const updateAssignment = async (assignmentId, assignmentData, instructorId) => {
  try {
    
    const assignment = await prisma.assignment.findUnique({
      where: { id: Number(assignmentId) },
      include: {
        module: {
          select: {
            course: {
              select: { instructorId: true }
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

    if (assignment.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to update this assignment');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    const updateData = {};
    if (assignmentData.title) updateData.title = assignmentData.title;
    if (assignmentData.description !== undefined) updateData.description = assignmentData.description;
    if (assignmentData.dueDate) updateData.dueDate = new Date(assignmentData.dueDate);

    
    return await prisma.assignment.update({
      where: { id: Number(assignmentId) },
      data: updateData
    });
  } catch (error) {
    logger.error(`Error updating assignment: ${error.message}`);
    throw error;
  }
};

/**
 * Delete an assignment
 */
const deleteAssignment = async (assignmentId, instructorId) => {
  try {
    
    const assignment = await prisma.assignment.findUnique({
      where: { id: Number(assignmentId) },
      include: {
        module: {
          select: {
            course: {
              select: { instructorId: true }
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

    if (assignment.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to delete this assignment');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    await prisma.assignment.delete({
      where: { id: Number(assignmentId) }
    });

    return { success: true };
  } catch (error) {
    logger.error(`Error deleting assignment: ${error.message}`);
    throw error;
  }
};

module.exports={
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
}
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

const submitAssignment = async (assignmentId, submissionData, userId) => {
  try {
    
    const assignment = await prisma.assignment.findUnique({
      where: { id: Number(assignmentId) },
      include: {
        module: {
          select: {
            courseId: true
          }
        }
      }
    });

    if (!assignment) {
      const error = new Error('Assignment not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    
    const now = new Date();
    if (now > assignment.dueDate) {
      const error = new Error('Assignment due date has passed');
      error.status = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    
    const enrollment = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: assignment.module.courseId
        }
      }
    });

    if (!enrollment) {
      
      await prisma.progress.create({
        data: {
          userId: Number(userId),
          courseId: assignment.module.courseId,
          progress: 0
        }
      });
    }

    
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        assignmentId: Number(assignmentId),
        userId: Number(userId)
      }
    });

    
    if (existingSubmission) {
      
      return await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          content: submissionData.content,
          contentType: submissionData.contentType,
          grade: null, 
          feedback: null 
        }
      });
    } else {
      
      return await prisma.submission.create({
        data: {
          assignmentId: Number(assignmentId),
          userId: Number(userId),
          content: submissionData.content,
          contentType: submissionData.contentType
        }
      });
    }
  } catch (error) {
    logger.error(`Error submitting assignment: ${error.message}`);
    throw error;
  }
};


const gradeSubmission = async (submissionId, gradeData, instructorId) => {
  try {
    
    const submission = await prisma.submission.findUnique({
      where: { id: Number(submissionId) },
      include: {
        assignment: {
          include: {
            module: {
              select: {
                course: {
                  select: { instructorId: true }
                }
              }
            }
          }
        }
      }
    });

    if (!submission) {
      const error = new Error('Submission not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    
    if (submission.assignment.module.course.instructorId !== Number(instructorId)) {
      const error = new Error('Not authorized to grade this submission');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    const updateData = {};
    if (gradeData.grade !== undefined) updateData.grade = gradeData.grade;
    if (gradeData.feedback !== undefined) updateData.feedback = gradeData.feedback;

    return await prisma.submission.update({
      where: { id: Number(submissionId) },
      data: updateData
    });
  } catch (error) {
    logger.error(`Error grading submission: ${error.message}`);
    throw error;
  }
};

const getAssignmentSubmissions = async (assignmentId, instructorId) => {
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
      const error = new Error('Not authorized to view submissions for this assignment');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    return await prisma.submission.findMany({
      where: { assignmentId: Number(assignmentId) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    logger.error(`Error getting assignment submissions: ${error.message}`);
    throw error;
  }
};


const getUserSubmission = async (assignmentId, userId) => {
  try {
    
    const assignment = await prisma.assignment.findUnique({
      where: { id: Number(assignmentId) }
    });

    if (!assignment) {
      const error = new Error('Assignment not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    
    const submission = await prisma.submission.findFirst({
      where: {
        assignmentId: Number(assignmentId),
        userId: Number(userId)
      }
    });

    return submission || null; 
  } catch (error) {
    logger.error(`Error getting user submission: ${error.message}`);
    throw error;
  }
};


const getAssignmentsByModule = async (moduleId) => {
  try {
    return await prisma.assignment.findMany({
      where: { moduleId: Number(moduleId) },
      orderBy: { dueDate: 'asc' }
    });
  } catch (error) {
    logger.error(`Error getting assignments by module: ${error.message}`);
    throw error;
  }
};

module.exports={
  createAssignment,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getAssignmentSubmissions,
  getUserSubmission,
  getAssignmentsByModule
}
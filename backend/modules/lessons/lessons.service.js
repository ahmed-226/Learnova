const prisma = require('../../config/database');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');



const createLesson = async (lessonData, instructorId) => {
    try {
        const module = await prisma.module.findUnique({
            where: { id: Number(lessonData.moduleId) },
            include: { course: true }
        });

        if (!module) {
            throw new Error('Module not found');
        }

        if (module.course.instructorId !== Number(instructorId)) {
            throw new Error('Not authorized to add lessons to this module');
        }

        
        if (!lessonData.order) {
            const highestOrder = await prisma.lesson.findFirst({
                where: { moduleId: Number(lessonData.moduleId) },
                orderBy: { order: 'desc' }
            });

            lessonData.order = highestOrder ? highestOrder.order + 1 : 1;
        }

        
        const lesson = await prisma.lesson.create({
            data: {
                title: lessonData.title,
                content: lessonData.content || '',
                moduleId: Number(lessonData.moduleId),
                order: lessonData.order,
                videoUrl: lessonData.videoUrl || null,  
                duration: lessonData.duration ? Number(lessonData.duration) : null
            }
        });

        return lesson;
    } catch (error) {
        logger.error(`Error creating lesson: ${error.message}`);
        throw error;
    }
};

const getLessonById = async (lessonId, userId) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: Number(lessonId) },
      include: {
        module: {
          include: {
            course: {
              include: {
                progress: userId ? {
                  where: { userId: Number(userId) }
                } : false
              }
            }
          }
        }
      }
    });

    if (!lesson) {
      const error = new Error('Lesson not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    
    if (userId && lesson.module.course.progress.length === 0) {
      const error = new Error('You must be enrolled in this course to access lessons');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    return lesson;
  } catch (error) {
    logger.error(`Error getting lesson: ${error.message}`);
    throw error;
  }
};


const updateLesson = async (lessonId, lessonData, instructorId) => {

    const lesson = await prisma.lesson.findUnique({
        where: { id: Number(lessonId) },
        include: {
            module: {
                select: {
                    course: {
                        select: {
                            instructorId: true
                        }
                    }
                }
            }
        }
    });

    if (!lesson) {
        throw new Error('Lesson not found');
    }

    if (lesson.module.course.instructorId !== Number(instructorId)) {
        throw new Error('Not authorized to update this lesson');
    }


    const updatedLesson = await prisma.lesson.update({
        where: { id: Number(lessonId) },
        data: lessonData
    });

    return updatedLesson;
};


const deleteLesson = async (lessonId, instructorId) => {

    const lesson = await prisma.lesson.findUnique({
        where: { id: Number(lessonId) },
        include: {
            module: {
                select: {
                    course: {
                        select: {
                            instructorId: true
                        }
                    }
                }
            }
        }
    });

    if (!lesson) {
        throw new Error('Lesson not found');
    }

    if (lesson.module.course.instructorId !== Number(instructorId)) {
        throw new Error('Not authorized to delete this lesson');
    }


    await prisma.lesson.delete({
        where: { id: Number(lessonId) }
    });

    return { success: true };
};


const getLessonsByModule = async (moduleId) => {
    const lessons = await prisma.lesson.findMany({
        where: { moduleId: Number(moduleId) },
        orderBy: { order: 'asc' }
    });

    return lessons;
};

const markLessonComplete = async (lessonId, userId) => {
  try {
    
    const lesson = await prisma.lesson.findUnique({
      where: { id: Number(lessonId) },
      include: {
        module: {
          include: {
            course: {
              include: {
                progress: {
                  where: { userId: Number(userId) }
                }
              }
            }
          }
        }
      }
    });

    if (!lesson) {
      const error = new Error('Lesson not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (lesson.module.course.progress.length === 0) {
      const error = new Error('You must be enrolled in this course');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        lessonId_userId: {
          lessonId: Number(lessonId),
          userId: Number(userId)
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date()
      },
      create: {
        lessonId: Number(lessonId),
        userId: Number(userId),
        isCompleted: true,
        completedAt: new Date()
      }
    });

    return lessonProgress;
  } catch (error) {
    logger.error(`Error marking lesson complete: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
  getLessonsByModule,
  markLessonComplete 
};


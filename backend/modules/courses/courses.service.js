const prisma = require('../../config/database');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');
const { uploadToCloudinary } = require('../../utils/fileUpload');


const createCourse = async (courseData, instructorId, files) => {
  try {
    
    let coverImageUrl = null;
    let previewVideoUrl = null;
    
    console.log("Files received:", files); 
    
    if (files) {
      if (files.coverImage && files.coverImage[0]) {
        console.log("Cover image file:", files.coverImage[0]); 
        
        
        if (files.coverImage[0].path) {
          try {
            const uploadResult = await uploadToCloudinary(files.coverImage[0].path, {
              folder: 'learnova/course-covers'
            });
            coverImageUrl = uploadResult.url;
          } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            
          }
        } else {
          console.error("Missing file path for coverImage");
        }
      }
      
      if (files.previewVideo && files.previewVideo[0]) {
        console.log("Preview video file:", files.previewVideo[0]); 
        
        if (files.previewVideo[0].path) {
          try {
            const uploadResult = await uploadToCloudinary(files.previewVideo[0].path, {
              folder: 'learnova/course-previews',
              resource_type: 'video'
            });
            previewVideoUrl = uploadResult.url;
          } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            
          }
        } else {
          console.error("Missing file path for previewVideo");
        }
      }
    }

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        level: courseData.level,
        price: courseData.isFree ? 0 : parseFloat(courseData.price),
        isFree: courseData.isFree === 'true' || courseData.isFree === true,
        coverImage: coverImageUrl,
        previewVideo: previewVideoUrl,
        instructorId: Number(instructorId)
      }
    });

    await prisma.forum.create({
      data: {
        courseId: course.id
      }
    });
    
    return course;
  } catch (error) {
    logger.error(`Error in createCourse: ${error.message}`);
    throw error;
  }
};

const getCourseById = async (courseId,instructorDetails=false) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: instructorDetails ? {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        modules: {
          orderBy: {
            order: 'asc'
          },
          include: {
            lessons: {
              orderBy: {
                order: 'asc'
              },
              select: {
                id: true,
                title: true,
                order: true
              }
            },
            quizzes: {
              select: {
                id: true,
                title: true
              }
            },
            assignments: {
              select: {
                id: true,
                title: true,
                dueDate: true
              }
            }
          }
        },
        _count: {
          select: {
            progress: true
          }
        }
      } : {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!course) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    return course;
  } catch (error) {
    logger.error(`Error getting course: ${error.message}`);
    throw error;
  }
}

const updateCourse = async (courseId, courseData, instructorId) => {
  try {
    const existingCourse = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      select: { instructorId: true }
    });

    if (!existingCourse) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (existingCourse.instructorId !== instructorId) {
      const error = new Error('Not authorized to update this course');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    return await prisma.course.update({
      where: { id: Number(courseId) },
      data: {
        title: courseData.title,
        description: courseData.description
      }
    });
  } catch (error) {
    logger.error(`Error updating course: ${error.message}`);
    throw error;
  }
}

const deleteCourse = async (courseId, instructorId) => {
  try {
    const existingCourse = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      select: { instructorId: true }
    });

    if (!existingCourse) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (existingCourse.instructorId !== instructorId) {
      const error = new Error('Not authorized to delete this course');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    await prisma.course.delete({
      where: { id: Number(courseId) }
    });

    return { success: true };
  } catch (error) {
    logger.error(`Error deleting course: ${error.message}`);
    throw error;
  }
}

const listCourses=async (filters = {})=>{
  try {
    const { page = 1, limit = 10, search, instructorId } = filters;
    const skip = (page - 1) * limit;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (instructorId) {
      where.instructorId = Number(instructorId);
    }
    
    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              progress: true,
              modules: true
            }
          }
        }
      }),
      prisma.course.count({ where })
    ]);

    return {
      courses: courses.map(course => ({
        ...course,
        enrollmentCount: course._count.progress,
        moduleCount: course._count.modules
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    logger.error(`Error listing courses: ${error.message}`);
    throw error;
  }
}

const enrollInCourse = async (courseId, userId) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) }
    });

    if (!course) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId)
        }
      }
    });

    if (existingProgress) {
      const error = new Error('Already enrolled in this course');
      error.status = HTTP_STATUS.CONFLICT;
      throw error;
    }

    const progress = await prisma.progress.create({
      data: {
        userId: Number(userId),
        courseId: Number(courseId),
        progress: 0
      }
    });

    return progress;
  } catch (error) {
    logger.error(`Error enrolling in course: ${error.message}`);
    throw error;
  }
}

const unenrollFromCourse = async (courseId, userId) =>{
  try {
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId)
        }
      }
    });

    if (!existingProgress) {
      const error = new Error('Not enrolled in this course');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    await prisma.progress.delete({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId)
        }
      }
    });

    return { success: true };
  } catch (error) {
    logger.error(`Error unenrolling from course: ${error.message}`);
    throw error;
  }
}

const getEnrolledStudents = async (courseId, instructorId) => {
  try {
    const existingCourse = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      select: { instructorId: true }
    });

    if (!existingCourse) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (existingCourse.instructorId !== instructorId) {
      const error = new Error('Not authorized to access this course');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    const enrollments = await prisma.progress.findMany({
      where: { courseId: Number(courseId) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return enrollments;
  } catch (error) {
    logger.error(`Error getting enrolled students: ${error.message}`);
    throw error;
  }
}

const addModule = async (courseId, moduleData, instructorId) =>{
  try {
    const existingCourse = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      select: { instructorId: true }
    });

    if (!existingCourse) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (existingCourse.instructorId !== instructorId) {
      const error = new Error('Not authorized to update this course');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    if (!moduleData.order) {
      const highestOrderModule = await prisma.module.findFirst({
        where: { courseId: Number(courseId) },
        orderBy: { order: 'desc' }
      });
      
      moduleData.order = highestOrderModule ? highestOrderModule.order + 1 : 1;
    }

    return await prisma.module.create({
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order,
        courseId: Number(courseId)
      }
    });
  } catch (error) {
    logger.error(`Error adding module: ${error.message}`);
    throw error;
  }
}

const updateModule = async (moduleId, moduleData, instructorId) =>{
  try {
    const existingModule = await prisma.module.findUnique({
      where: { id: Number(moduleId) },
      include: {
        course: {
          select: { instructorId: true }
        }
      }
    });

    if (!existingModule) {
      const error = new Error('Module not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (existingModule.course.instructorId !== instructorId) {
      const error = new Error('Not authorized to update this module');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    return await prisma.module.update({
      where: { id: Number(moduleId) },
      data: {
        title: moduleData.title,
        description: moduleData.description,
        order: moduleData.order
      }
    });
  } catch (error) {
    logger.error(`Error updating module: ${error.message}`);
    throw error;
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
};
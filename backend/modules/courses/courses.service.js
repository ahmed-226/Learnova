const prisma = require('../../config/database');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');
const { uploadToCloudinary } = require('../../utils/fileUpload');


const createCourse = async (courseData, instructorId, files) => {
  try {

      const { title, description, category, level, isFree, price } = courseData;

    
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

const getCourseById = async (courseId, instructorDetails = false) => {
  try {
    
    const courseExists = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      select: { id: true }
    });

    if (!courseExists) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true, 
            avatar: true,
            email: instructorDetails ? true : false
          }
        },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                content: false, 
                videoUrl: true,
                duration: true,
                order: true,
                moduleId: true
              }
            },
            quizzes: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                order: true
              }
            },
            assignments: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                description: false, 
                dueDate: true,
                order: true
              }
            }
          }
        },
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    
    const lessonCount = await prisma.lesson.count({
      where: {
        module: {
          courseId: Number(courseId)
        }
      }
    });

    const quizCount = await prisma.quiz.count({
      where: {
        module: {
          courseId: Number(courseId)
        }
      }
    });

    const assignmentCount = await prisma.assignment.count({
      where: {
        module: {
          courseId: Number(courseId)
        }
      }
    });

    
    if (!course.modules) {
      course.modules = [];
    }

    
    course._count = {
      ...course._count,
      lessons: lessonCount,
      quizzes: quizCount,
      assignments: assignmentCount
    };

    return course;
  } catch (error) {
    logger.error(`Error getting course: ${error.message}`);
    throw error;
  }
};

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
    
    const numericCourseId = Number(courseId);
    const numericUserId = Number(userId);
    
    if (isNaN(numericCourseId)) {
      const error = new Error('Invalid course ID');
      error.status = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }
  
    const course = await prisma.course.findUnique({
      where: { id: numericCourseId }
    });

    if (!course) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId: numericUserId,
          courseId: numericCourseId
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
        userId: numericUserId,
        courseId: numericCourseId,
        progress: 0
      }
    });

    return progress;
  } catch (error) {
    logger.error(`Error in enrollInCourse: ${error.message}`);
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

const getCourseContent = async (courseId, userId) => {
  try {
    
    const enrollment = await prisma.progress.findFirst({
      where: {
        courseId: Number(courseId),
        userId: Number(userId)
      }
    });

    if (!enrollment) {
      const error = new Error('You must be enrolled in this course to access content');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                content: true,
                videoUrl: true,
                duration: true,
                order: true,
                moduleId: true,
              }
            },
            quizzes: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                timeLimit: true,
                order: true,
                questions: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    question: true,
                    type: true,
                    options: true,
                    correctAnswer: true,
                    explanation: true,
                    order: true
                  }
                }
              }
            },
            assignments: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                instructions: true,
                dueDate: true,
                totalPoints: true,
                order: true
              }
            }
          }
        },
        _count: {
          select: {
            progress: true
          }
        }
      }
    });

    console.log('Course Data:', course);


    if (!course) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    
    const userProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: Number(userId),
        lesson: {
          module: {
            courseId: Number(courseId)
          }
        }
      },
      select: {
        lessonId: true,
        isCompleted: true,
        completedAt: true
      }
    });

    
    const transformedCourse = {
      ...course,
      modules: course.modules.map(module => ({
        ...module,
        content: [
          ...module.lessons.map(lesson => ({
            ...lesson,
            type: 'lesson',
            subType: lesson.videoUrl ? 'video' : 'text',
            moduleId: module.id,
            moduleTitle: module.title,
            isCompleted: userProgress.some(p => p.lessonId === lesson.id && p.isCompleted)
          })),
          ...module.quizzes.map(quiz => ({
            ...quiz,
            type: 'quiz',
            moduleId: module.id,
            moduleTitle: module.title,
            isCompleted: false 
          })),
          ...module.assignments.map(assignment => ({
            ...assignment,
            type: 'assignment',
            moduleId: module.id,
            moduleTitle: module.title,
            isCompleted: false 
          }))
        ].sort((a, b) => a.order - b.order)
      }))
    };

    return transformedCourse;
  } catch (error) {
    logger.error(`Error getting course content: ${error.message}`);
    throw error;
  }
};

const getModulesByCourse = async (courseId) => {
  try {
    
    console.log(`Fetching modules for course ${courseId}`);
    
    const modules = await prisma.module.findMany({
      where: {
        courseId: Number(courseId)
      },
      orderBy: {
        order: 'asc' 
      },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        lessons: {
          select: {
            id: true,
            title: true,
            content: true,
            order: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        quizzes: {
          select: {
            id: true,
            title: true
            
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        assignments: {
          select: {
            id: true,
            title: true,
            description: true,  
            dueDate: true       
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });
    
    console.log(`Found ${modules.length} modules for course ${courseId}`);
    
    return modules;
  } catch (error) {
    console.error(`Error in getModulesByCourse: ${error}`);
    logger.error(`Error getting modules by course: ${error.message}`);
    throw error;
  }
};


const deleteModule = async (moduleId, instructorId) => {
  try {
    const module = await prisma.module.findUnique({
      where: { id: Number(moduleId) },
      include: {
        course: {
          select: { instructorId: true }
        }
      }
    });

    if (!module) {
      const error = new Error('Module not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (module.course.instructorId !== instructorId) {
      const error = new Error('Not authorized to delete this module');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    await prisma.module.delete({
      where: { id: Number(moduleId) }
    });

    return { success: true };
  } catch (error) {
    logger.error(`Error deleting module: ${error.message}`);
    throw error;
  }
};

const reorderModules = async (courseId, moduleIds, instructorId) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      select: { instructorId: true }
    });

    if (!course) {
      const error = new Error('Course not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (course.instructorId !== instructorId) {
      const error = new Error('Not authorized to reorder modules for this course');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    const updates = moduleIds.map((moduleId, index) => {
      return prisma.module.update({
        where: { id: Number(moduleId) },
        data: { order: index + 1 }
      });
    });

    await prisma.$transaction(updates);

    return { success: true };
  } catch (error) {
    logger.error(`Error reordering modules: ${error.message}`);
    throw error;
  }
};

const reorderModuleContent = async (moduleId, contentIds, instructorId) => {
  try {
    const module = await prisma.module.findUnique({
      where: { id: Number(moduleId) },
      include: {
        course: {
          select: { instructorId: true }
        }
      }
    });

    if (!module) {
      const error = new Error('Module not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (module.course.instructorId !== instructorId) {
      const error = new Error('Not authorized to reorder content for this module');
      error.status = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    
    for (let i = 0; i < contentIds.length; i++) {
      const { id, type } = contentIds[i];
      
      if (type === 'text' || type === 'video') {
        await prisma.lesson.update({
          where: { id: Number(id) },
          data: { order: i + 1 }
        });
      } else if (type === 'quiz') {
        await prisma.quiz.update({
          where: { id: Number(id) },
          data: { order: i + 1 }
        });
      } else if (type === 'assignment') {
        
        await prisma.assignment.update({
          where: { id: Number(id) },
          data: { order: i + 1 }
        });
      }
    }

    return { success: true };
  } catch (error) {
    logger.error(`Error reordering module content: ${error.message}`);
    throw error;
  }
};

const checkUserEnrollment = async (courseId, userId) => {
  try {
    const enrollment = await prisma.progress.findUnique({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId)
        }
      }
    });
    
    return !!enrollment; 
  } catch (error) {
    logger.error(`Error checking enrollment: ${error.message}`);
    return false;
  }
};



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
  updateModule,
  deleteModule,
  getCourseContent,
  getModulesByCourse,
  reorderModules,
  reorderModuleContent,
  checkUserEnrollment
};
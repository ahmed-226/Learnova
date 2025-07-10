const prisma = require('../../config/database');
const logger = require('../../utils/logger');
const { ROLES } = require('../../utils/constants');
const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};


const createUser = async (userData) => {
  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    
    if (existingUser) {
      const error = new Error('Email already in use');
      error.status = 409;
      throw error;
    }

    
    const hashedPassword = hashPassword(userData.password);
    
    
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'STUDENT' 
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true
      }
    });
    
    return newUser;
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`);
    throw error;
  }
};


const verifyCredentials = async (email, password) => {
  try {
    
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }
    
    
    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }
    
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true, 
        role: true,
        createdAt: true
      }
    });
    
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    return user;
  } catch (error) {
    logger.error(`Error getting user by ID: ${error.message}`);
    throw error;
  }
};

const updateUser = async (userId, userData) => {
  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    
    const updateData = {};
    
    if (userData.firstName) updateData.firstName = userData.firstName;
    if (userData.lastName) updateData.lastName = userData.lastName;
    if (userData.role) updateData.role = userData.role;
    if (userData.password) updateData.password = hashPassword(userData.password);
    
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    throw error;
  }
};

const updateProfile = async (userId, userData) => {
  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    
    if (userData.password) {
      if (!userData.currentPassword) {
        const error = new Error('Current password is required');
        error.status = 400;
        throw error;
      }
      
      const hashedCurrentPassword = hashPassword(userData.currentPassword);
      if (existingUser.password !== hashedCurrentPassword) {
        const error = new Error('Current password is incorrect');
        error.status = 401;
        throw error;
      }
      
      userData.password = hashPassword(userData.password);
      delete userData.currentPassword;
    }
    
    
    const updateData = {};
    
    if (userData.firstName) updateData.firstName = userData.firstName;
    if (userData.lastName) updateData.lastName = userData.lastName;
    if (userData.password) updateData.password = userData.password; 
    if (userData.bio !== undefined) updateData.bio = userData.bio; 
    if (userData.avatar !== undefined) updateData.avatar = userData.avatar; 
    
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true, 
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating profile: ${error.message}`);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!existingUser) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    
    await prisma.user.delete({
      where: { id: userId }
    });
    
    return { success: true };
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    throw error;
  }
};

const getAllUsers = async (filters = {}) => {
  try {
    const where = {};
    
    
    if (filters.role) {
      where.role = filters.role;
    }
    
    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return users;
  } catch (error) {
    logger.error(`Error getting users: ${error.message}`);
    throw error;
  }
};


const getUserDashboard = async (userId) => {
  try {
    
    const user = await getUserById(userId);
    
    let dashboardData = {};
    
    if (user.role === 'STUDENT') {
      
      const progress = await prisma.progress.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              coverImage: true,
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });
      
      dashboardData = {
        user,
        enrolledCourses: progress.map(p => ({
          courseId: p.courseId,
          course: p.course,
          progress: p.progress || 0,
          isCompleted: p.isCompleted || false,
          lastAccessed: p.lastAccessed,
          hoursSpent: p.hoursSpent || 0
        }))
      };
    } else if (user.role === 'INSTRUCTOR') {
      
      const courses = await prisma.course.findMany({
        where: { instructorId: userId },
        include: {
          _count: {
            select: {
              progress: true
            }
          }
        }
      });
      
      dashboardData = {
        user,
        instructorCourses: courses
      };
    }
    
    return dashboardData;
  } catch (error) {
    logger.error(`Error getting user dashboard: ${error.message}`);
    throw error;
  }
};

const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    
    const hashedCurrentPassword = hashPassword(currentPassword);
    if (user.password !== hashedCurrentPassword) {
      const error = new Error('Current password is incorrect');
      error.status = 401;
      throw error;
    }
    
    const hashedNewPassword = hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });
    
    logger.info(`Password change notification would be sent to: ${user.email}`);
    
    return { success: true };
  } catch (error) {
    logger.error(`Error changing password: ${error.message}`);
    throw error;
  }
};



const verifyUserPassword = async (userId, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return false;
    }
    
    const hashedPassword = hashPassword(password);
    return user.password === hashedPassword;
  } catch (error) {
    logger.error(`Error verifying password: ${error.message}`);
    return false;
  }
};


const  getEnrolledCourses=async(userId)=> {
  return await prisma.progress.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });
}

const getUserEnrollments = async (userId) => {
  try {
    const enrollments = await prisma.progress.findMany({
      where: { userId: Number(userId) },
      select: {
        courseId: true,
        progress: true,
        isCompleted: true,
        enrolledAt: true,
        lastAccessed: true
      }
    });
    
    return enrollments;
  } catch (error) {
    logger.error(`Error getting user enrollments: ${error.message}`);
    throw error;
  }
};

// Add these functions to your existing users.service.js

const getDashboard = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true
      }
    });

    if (!user) {
      const error = new Error('User not found');
      error.status = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    let dashboardData = { user };

    if (user.role === 'STUDENT') {
      // Get enrolled courses with progress
      const progress = await prisma.progress.findMany({
        where: { userId: Number(userId) },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              coverImage: true,
              category: true,
              instructor: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      });

      // Get course completions (certificates)
      const completions = await prisma.courseCompletion.findMany({
        where: { userId: Number(userId) }
      });

      // Get recent activities
      const recentActivities = await getRecentActivities(userId);

      // Get popular courses
      const popularCourses = await getPopularCourses();

      // Calculate stats
      const totalHours = progress.reduce((sum, p) => sum + (p.hoursSpent || 0), 0);
      const averageScore = progress.length > 0 
        ? Math.round(progress.reduce((sum, p) => sum + (p.progress || 0), 0) / progress.length)
        : 0;

      dashboardData = {
        ...dashboardData,
        enrolledCourses: progress,
        stats: {
          hoursSpent: totalHours,
          certificatesEarned: completions.length,
          averageScore: averageScore
        },
        recentActivities,
        popularCourses
      };
    } else if (user.role === 'INSTRUCTOR') {
      // Get instructor courses
      const courses = await prisma.course.findMany({
        where: { instructorId: userId },
        include: {
          _count: {
            select: {
              progress: true
            }
          }
        }
      });

      // Get recent activities for instructor
      const recentActivities = await getInstructorRecentActivities(userId);

      dashboardData = {
        ...dashboardData,
        instructorCourses: courses,
        recentActivities
      };
    }

    return dashboardData;
  } catch (error) {
    logger.error(`Error getting user dashboard: ${error.message}`);
    throw error;
  }
};

const getRecentActivities = async (userId) => {
  try {
    const activities = [];

    // Get recent course enrollments
    const enrollments = await prisma.progress.findMany({
      where: { userId: Number(userId) },
      include: {
        course: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    enrollments.forEach(enrollment => {
      activities.push({
        id: `enrollment-${enrollment.id}`,
        type: 'course-enrolled',
        courseName: enrollment.course.title,
        date: enrollment.createdAt,
        icon: 'book-open'
      });
    });

    // Get recent assignment submissions
    const submissions = await prisma.submission.findMany({
      where: { userId: Number(userId) },
      include: {
        assignment: {
          include: {
            module: {
              include: {
                course: {
                  select: { title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    submissions.forEach(submission => {
      activities.push({
        id: `submission-${submission.id}`,
        type: 'assignment-submitted',
        courseName: submission.assignment.module.course.title,
        assignmentTitle: submission.assignment.title,
        date: submission.createdAt,
        icon: 'clipboard'
      });
    });

    // Get recent forum posts
    const posts = await prisma.post.findMany({
      where: { authorId: Number(userId) },
      include: {
        thread: {
          include: {
            forum: {
              include: {
                course: {
                  select: { title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    posts.forEach(post => {
      activities.push({
        id: `post-${post.id}`,
        type: 'forum-post',
        courseName: post.thread.forum.course.title,
        threadTitle: post.thread.title,
        date: post.createdAt,
        icon: 'chat'
      });
    });

    // Sort by date and return latest 5
    return activities
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  } catch (error) {
    logger.error(`Error getting recent activities: ${error.message}`);
    return [];
  }
};

const getInstructorRecentActivities = async (instructorId) => {
  try {
    const activities = [];

    // Get recent submissions to instructor's courses
    const submissions = await prisma.submission.findMany({
      where: {
        assignment: {
          module: {
            course: {
              instructorId: Number(instructorId)
            }
          }
        }
      },
      include: {
        user: {
          select: { firstName: true, lastName: true }
        },
        assignment: {
          include: {
            module: {
              include: {
                course: {
                  select: { title: true }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    submissions.forEach(submission => {
      activities.push({
        id: `submission-${submission.id}`,
        type: 'assignment-received',
        courseName: submission.assignment.module.course.title,
        studentName: `${submission.user.firstName} ${submission.user.lastName}`,
        assignmentTitle: submission.assignment.title,
        date: submission.createdAt,
        icon: 'clipboard',
        needsGrading: !submission.grade
      });
    });

    return activities;
  } catch (error) {
    logger.error(`Error getting instructor recent activities: ${error.message}`);
    return [];
  }
};

const getPopularCourses = async () => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: {
            progress: true
          }
        }
      },
      orderBy: {
        progress: {
          _count: 'desc'
        }
      },
      take: 3
    });

    return courses.map(course => ({
      id: course.id,
      title: course.title,
      instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
      students: course._count.progress,
      rating: 4.5 + Math.random() * 0.5, // Mock rating for now
      category: course.category,
      price: course.price
    }));
  } catch (error) {
    logger.error(`Error getting popular courses: ${error.message}`);
    return [];
  }
};

// Update the existing function
const getUserStats = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { role: true }
    });

    let stats = {};

    if (user.role === 'STUDENT') {
      const progress = await prisma.progress.findMany({
        where: { userId: Number(userId) }
      });

      const completions = await prisma.courseCompletion.findMany({
        where: { userId: Number(userId) }
      });

      stats = {
        hoursSpent: progress.reduce((sum, p) => sum + (p.hoursSpent || 0), 0),
        certificatesEarned: completions.length,
        averageScore: progress.length > 0 
          ? Math.round(progress.reduce((sum, p) => sum + (p.progress || 0), 0) / progress.length)
          : 0
      };
    } else if (user.role === 'INSTRUCTOR') {
      const courses = await prisma.course.findMany({
        where: { instructorId: userId },
        include: {
          _count: {
            select: {
              progress: true
            }
          }
        }
      });

      stats = {
        coursesCreated: courses.length,
        totalStudents: courses.reduce((sum, course) => sum + course._count.progress, 0),
        averageRating: 4.5 // Mock for now
      };
    }

    return stats;
  } catch (error) {
    logger.error(`Error getting user stats: ${error.message}`);
    throw error;
  }
};


module.exports = {
  createUser,
  verifyCredentials,
  getEnrolledCourses,
  getUserById,
  updateUser,
  updateProfile,
  deleteUser,
  getAllUsers,
  getUserDashboard,
  changePassword,
  verifyUserPassword,
  getUserEnrollments,
  getDashboard,
  getUserStats,
  getRecentActivities,
  getPopularCourses
};
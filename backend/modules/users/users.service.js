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
          ...p.course,
          progress: p.progress
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
        instructorCourses: courses.map(course => ({
          ...course,
          enrollmentCount: course._count.progress
        }))
      };
    } else if (user.role === 'ADMIN') {
      
      const [userCount, courseCount] = await Promise.all([
        prisma.user.count(),
        prisma.course.count()
      ]);
      
      dashboardData = {
        user,
        stats: {
          userCount,
          courseCount
        }
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


module.exports = {
  createUser,
  verifyCredentials,
  getUserById,
  updateUser,
  updateProfile,
  deleteUser,
  getAllUsers,
  getUserDashboard,
  changePassword,
  verifyUserPassword
};
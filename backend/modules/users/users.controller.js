const userService = require('./users.service');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');
const logger = require('../../utils/logger');
const { ROLES, PERMISSION_LEVELS, HTTP_STATUS } = require('../../utils/constants');



const register = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    
    logger.info(`User registered: ${user.email}`);
    res.status(HTTP_STATUS.CREATED).json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role 
      },
      message: 'Registration successful'
    });
  } catch (error) {
    logger.error(`Registration failed: ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await userService.verifyCredentials(req.body.email, req.body.password);
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    
    logger.info(`User logged in: ${user.email}`);
    res.status(HTTP_STATUS.OK).json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role 
      },
      message: 'Login successful'
    });
  } catch (error) {
    logger.error(`Login failed: ${error.message}`);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    logger.info(`User logged out: ${req.user?.id}`);
    res.status(HTTP_STATUS.OK).json({ message: 'Logout successful' });
  } catch (error) {
    logger.error(`Logout failed: ${error.message}`);
    next(error);
  }
};


const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    logger.error(`Error fetching profile for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};


const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    logger.info(`Profile updated for user ${req.user.id}`);
    res.status(HTTP_STATUS.OK).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating profile for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};


const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await userService.getUserDashboard(req.user.id);
    res.status(HTTP_STATUS.OK).json(dashboard);
  } catch (error) {
    logger.error(`Error fetching dashboard for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};


const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers(req.query);
    logger.info(`Admin ${req.user.id} fetched all users`);
    res.status(HTTP_STATUS.OK).json(users);
  } catch (error) {
    logger.error(`Error fetching all users: ${error.message}`);
    next(error);
  }
};


const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.userId));
    if (!user) {
      logger.warn(`User not found: ${req.params.userId}`);
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
    }
    res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    logger.error(`Error fetching user ${req.params.userId}: ${error.message}`);
    next(error);
  }
};


const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(parseInt(req.params.userId), req.body);
    logger.info(`Admin ${req.user.id} updated user ${req.params.userId}`);
    res.status(HTTP_STATUS.OK).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user ${req.params.userId}: ${error.message}`);
    next(error);
  }
};


const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(parseInt(req.params.userId));
    logger.info(`Admin ${req.user.id} deleted user ${req.params.userId}`);
    res.status(HTTP_STATUS.NO_CONTENT).end();
  } catch (error) {
    logger.error(`Error deleting user ${req.params.userId}: ${error.message}`);
    next(error);
  }
};


const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      logger.warn('Access attempt without role information');
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Authentication required' });
    }
    
    
    const userPermissionLevel = PERMISSION_LEVELS[userRole];
    const requiredPermissionLevel = PERMISSION_LEVELS[requiredRole];
    
    if (userPermissionLevel >= requiredPermissionLevel) {
      return next();
    }
    
    logger.warn(`Access denied: User ${req.user.id} with role ${userRole} attempted to access ${requiredRole} resource`);
    return res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Access denied' });
  };
};

const uploadAvatar = async (req, res, next) => {
  try {
    
    console.log({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing'
    });
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    
    const avatarUrl = req.file.path;
    
    const updatedUser = await userService.updateProfile(req.user.id, {
      avatar: avatarUrl
    });

    logger.info(`Avatar uploaded for user ${req.user.id}`);
    res.status(200).json({ 
      avatar: avatarUrl,
      user: updatedUser,
      message: 'Avatar uploaded successfully' 
    });
  } catch (error) {
    logger.error(`Error uploading avatar for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: 'Current password and new password are required' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: 'New password must be at least 6 characters long' 
      });
    }
    
    await userService.changePassword(userId, currentPassword, newPassword);
    
    logger.info(`Password changed for user ${userId}`);
    res.status(HTTP_STATUS.OK).json({ 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    logger.error(`Error changing password for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    
    const isPasswordValid = await userService.verifyUserPassword(userId, password);
    
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
        error: 'Password is incorrect' 
      });
    }
    
    await userService.deleteUser(userId);
    
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    logger.info(`User ${userId} deleted their own account`);
    res.status(HTTP_STATUS.OK).json({ 
      message: 'Account has been deleted successfully' 
    });
  } catch (error) {
    logger.error(`Error deleting account for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};



const getEnrolledCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const progress = await userService.getEnrolledCourses(userId);

    const enrolledCourses = progress.map(p => ({
      courseId: p.courseId,
      course: p.course,
      progress: p.progress || 0,
      isCompleted: p.isCompleted || false,
      lastAccessed: p.lastAccessed,
      hoursSpent: p.hoursSpent || 0
    }));

    res.status(HTTP_STATUS.OK).json(enrolledCourses);
  } catch (error) {
    logger.error(`Error fetching enrolled courses for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

const getUserEnrollments = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const requestingUserId = req.user.id;
    
    
    if (userId !== requestingUserId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Not authorized to view these enrollments'
      });
    }
    
    const enrollments = await prisma.progress.findMany({
      where: { userId },
      select: {
        courseId: true,
        progress: true,
        isCompleted: true,
        enrolledAt: true,
        lastAccessed: true
      }
    });
    
    res.status(HTTP_STATUS.OK).json(enrollments);
  } catch (error) {
    logger.error(`Error fetching user enrollments: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getEnrolledCourses,
  getUserEnrollments,
  uploadAvatar,
  getDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkRole,
  changePassword,
  deleteUserAccount
};
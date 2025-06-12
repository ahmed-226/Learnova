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
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    
    const updatedUser = await userService.updateProfile(req.user.id, {
      avatar: avatarPath
    });

    logger.info(`Avatar uploaded for user ${req.user.id}`);
    res.status(200).json({ 
      avatar: avatarPath,
      user: updatedUser,
      message: 'Avatar uploaded successfully' 
    });
  } catch (error) {
    logger.error(`Error uploading avatar for user ${req.user.id}: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  uploadAvatar,
  getDashboard,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkRole
};
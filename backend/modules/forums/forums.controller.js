const forumService = require('./forums.service');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');


const getForumByCourseId = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;

        const forum = await forumService.getForumByCourseId(courseId);

        res.status(HTTP_STATUS.OK).json(forum);
    } catch (error) {
        logger.error(`Error in getForumByCourseId: ${error.message}`);
        next(error);
    }
};


const getThreadsByForumId = async (req, res, next) => {
    try {
        const forumId = req.params.forumId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const threadsResult = await forumService.getThreadsByForumId(forumId, page, limit);

        res.status(HTTP_STATUS.OK).json(threadsResult);
    } catch (error) {
        logger.error(`Error in getThreadsByForumId: ${error.message}`);
        next(error);
    }
};


const createThread = async (req, res, next) => {
    try {
        const forumId = req.params.forumId;
        const userId = req.user.id;

        console.log('Creating thread:', { forumId, userId, body: req.body });

        const thread = await forumService.createThread(forumId, req.body, userId);

        logger.info(`Thread created: ${thread.id} in forum ${forumId} by user ${userId}`);
        res.status(HTTP_STATUS.CREATED).json(thread);
    } catch (error) {
        logger.error(`Error in createThread: ${error.message}`);
        next(error);
    }
};


const getThreadById = async (req, res, next) => {
    try {
        const threadId = req.params.threadId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        console.log(`Getting thread ${threadId} with page ${page}, limit ${limit}`);

        const result = await forumService.getThreadById(threadId, page, limit);

        logger.info(`Thread ${threadId} retrieved by user ${req.user.id}`);
        res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
        logger.error(`Error in getThreadById: ${error.message}`);
        next(error);
    }
};



const updateThread = async (req, res, next) => {
    try {
        const threadId = req.params.threadId;
        const userId = req.user.id;
        const userRole = req.user.role;

        const updatedThread = await forumService.updateThread(threadId, req.body, userId, userRole);

        logger.info(`Thread ${threadId} updated by user ${userId}`);
        res.status(HTTP_STATUS.OK).json(updatedThread);
    } catch (error) {
        logger.error(`Error in updateThread: ${error.message}`);
        next(error);
    }
};


const deleteThread = async (req, res, next) => {
    try {
        const threadId = req.params.threadId;
        const userId = req.user.id;
        const userRole = req.user.role;

        await forumService.deleteThread(threadId, userId, userRole);

        logger.info(`Thread ${threadId} deleted by user ${userId}`);
        res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error) {
        logger.error(`Error in deleteThread: ${error.message}`);
        next(error);
    }
};

const createPost = async (req, res, next) => {
    try {
        const threadId = req.params.threadId;
        const userId = req.user.id;

        console.log('Controller: Creating post:', { threadId, userId, body: req.body });

        const post = await forumService.createPost(threadId, req.body, userId);

        console.log('Controller: Post created successfully:', post.id);
        logger.info(`Post created: ${post.id} in thread ${threadId} by user ${userId}`);
        res.status(HTTP_STATUS.CREATED).json(post);
    } catch (error) {
        console.error('Controller: Error in createPost:', error);
        logger.error(`Error in createPost: ${error.message}`);
        next(error);
    }
};


const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        const userRole = req.user.role;

        const updatedPost = await forumService.updatePost(postId, req.body, userId, userRole);

        logger.info(`Post ${postId} updated by user ${userId}`);
        res.status(HTTP_STATUS.OK).json(updatedPost);
    } catch (error) {
        logger.error(`Error in updatePost: ${error.message}`);
        next(error);
    }
};


const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        const userRole = req.user.role;

        const result = await forumService.deletePost(postId, userId, userRole);

        logger.info(`Post ${postId} deleted by user ${userId}`);
        
        
        res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
        logger.error(`Error in deletePost: ${error.message}`);
        next(error);
    }
};


module.exports = {
    getForumByCourseId,
    getThreadsByForumId,
    createThread,
    getThreadById,
    updateThread,
    deleteThread,
    createPost,
    updatePost,
    deletePost
};
const prisma = require('../../config/database');
const logger = require('../../utils/logger');
const { HTTP_STATUS } = require('../../utils/constants');


const getForumByCourseId = async (courseId) => {
    try {

        const course = await prisma.course.findUnique({
            where: { id: Number(courseId) }
        });

        if (!course) {
            const error = new Error('Course not found');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }


        let forum = await prisma.forum.findUnique({
            where: { courseId: Number(courseId) }
        });


        if (!forum) {
            forum = await prisma.forum.create({
                data: {
                    courseId: Number(courseId)
                }
            });
            logger.info(`Created forum for course ${courseId}`);
        }

        return forum;
    } catch (error) {
        logger.error(`Error getting forum by course ID: ${error.message}`);
        throw error;
    }
};


const getThreadsByForumId = async (forumId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const [threads, totalCount] = await Promise.all([
      prisma.thread.findMany({
        where: { forumId: Number(forumId) },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              posts: true
            }
          }
        }
      }),
      prisma.thread.count({
        where: { forumId: Number(forumId) }
      })
    ]);

    return {
      threads: threads.map(thread => ({
        ...thread,
        postCount: thread._count.posts
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    logger.error(`Error getting threads by forum ID: ${error.message}`);
    throw error;
  }
};


const createThread = async (forumId, threadData, userId) => {
    try {
        console.log('Service: Creating thread with data:', { forumId, threadData, userId });

        
        const forum = await prisma.forum.findUnique({
            where: { id: Number(forumId) }
        });

        if (!forum) {
            const error = new Error('Forum not found');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        
        const result = await prisma.$transaction(async (prisma) => {
            
            const thread = await prisma.thread.create({
                data: {
                    title: threadData.title,
                    forumId: Number(forumId),
                    userId: Number(userId)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });

            
            const post = await prisma.post.create({
                data: {
                    content: threadData.content,
                    threadId: thread.id,
                    userId: Number(userId)
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            });

            return {
                ...thread,
                initialPost: post,
                postCount: 1 
            };
        });

        console.log('Thread created successfully:', result);
        return result;
    } catch (error) {
        logger.error(`Error creating thread: ${error.message}`);
        throw error;
    }
};

const getThreadById = async (threadId, page = 1, limit = 20) => {
    try {
        const skip = (page - 1) * limit;

        
        const thread = await prisma.thread.findUnique({
            where: { id: Number(threadId) },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                },
                forum: {
                    select: {
                        id: true,
                        courseId: true
                    }
                }
            }
        });

        if (!thread) {
            const error = new Error('Thread not found');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        
        const [posts, totalCount] = await Promise.all([
            prisma.post.findMany({
                where: { threadId: Number(threadId) },
                skip,
                take: limit,
                orderBy: { createdAt: 'asc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }),
            prisma.post.count({
                where: { threadId: Number(threadId) }
            })
        ]);

        return {
            thread,
            posts,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        };
    } catch (error) {
        logger.error(`Error getting thread by ID: ${error.message}`);
        throw error;
    }
};



const updateThread = async (threadId, threadData, userId, userRole) => {
    try {

        const thread = await prisma.thread.findUnique({
            where: { id: Number(threadId) },
            include: {
                forum: {
                    include: {
                        course: {
                            select: { instructorId: true }
                        }
                    }
                }
            }
        });

        if (!thread) {
            const error = new Error('Thread not found');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }


        const isCreator = thread.userId === Number(userId);
        const isInstructor = thread.forum.course.instructorId === Number(userId);
        const isAdmin = userRole === 'ADMIN';

        if (!isCreator && !isInstructor && !isAdmin) {
            const error = new Error('Not authorized to update this thread');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }


        return await prisma.thread.update({
            where: { id: Number(threadId) },
            data: { title: threadData.title }
        });
    } catch (error) {
        logger.error(`Error updating thread: ${error.message}`);
        throw error;
    }
};


const deleteThread = async (threadId, userId, userRole) => {
    try {

        const thread = await prisma.thread.findUnique({
            where: { id: Number(threadId) },
            include: {
                forum: {
                    include: {
                        course: {
                            select: { instructorId: true }
                        }
                    }
                }
            }
        });

        if (!thread) {
            const error = new Error('Thread not found');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }


        const isCreator = thread.userId === Number(userId);
        const isInstructor = thread.forum.course.instructorId === Number(userId);
        const isAdmin = userRole === 'ADMIN';

        if (!isCreator && !isInstructor && !isAdmin) {
            const error = new Error('Not authorized to delete this thread');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }


        await prisma.thread.delete({
            where: { id: Number(threadId) }
        });

        return { success: true };
    } catch (error) {
        logger.error(`Error deleting thread: ${error.message}`);
        throw error;
    }
};


const createPost = async (threadId, postData, userId) => {
    try {
        console.log('Service: Creating post with data:', { threadId, postData, userId });

        
        const thread = await prisma.thread.findUnique({
            where: { id: Number(threadId) },
            include: {
                forum: {
                    include: {
                        course: {
                            select: { instructorId: true }
                        }
                    }
                }
            }
        });

        if (!thread) {
            console.log('Thread not found:', threadId);
            const error = new Error('Thread not found');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        console.log('Thread found, creating post...');

        
        const post = await prisma.post.create({
            data: {
                content: postData.content,
                threadId: Number(threadId),
                userId: Number(userId),
                parentId: postData.parentId ? Number(postData.parentId) : null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        console.log('Post created successfully:', post);

        
        await prisma.thread.update({
            where: { id: Number(threadId) },
            data: { updatedAt: new Date() }
        });

        return post;
    } catch (error) {
        console.error('Error in createPost service:', error);
        logger.error(`Error creating post: ${error.message}`);
        throw error;
    }
};



const updatePost = async (postId, postData, userId, userRole) => {
    try {
        
        const post = await prisma.post.findUnique({
            where: { id: Number(postId) },
            include: {
                thread: {
                    include: {
                        forum: {
                            include: {
                                course: {
                                    select: { instructorId: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!post) {
            const error = new Error('Post not found');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        
        const isCreator = post.userId === Number(userId);
        const isInstructor = post.thread.forum.course.instructorId === Number(userId);
        const isAdmin = userRole === 'ADMIN';

        if (!isCreator && !isInstructor && !isAdmin) {
            const error = new Error('Not authorized to update this post');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        
        return await prisma.post.update({
            where: { id: Number(postId) },
            data: { 
                content: postData.content,
                updatedAt: new Date()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    } catch (error) {
        logger.error(`Error updating post: ${error.message}`);
        throw error;
    }
};

const deletePost = async (postId, userId, userRole) => {
    try {
        
        const post = await prisma.post.findUnique({
            where: { id: Number(postId) },
            include: {
                thread: {
                    include: {
                        forum: {
                            include: {
                                course: {
                                    select: { instructorId: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!post) {
            const error = new Error('Post not found');
            error.status = HTTP_STATUS.NOT_FOUND;
            throw error;
        }

        
        const isCreator = post.userId === Number(userId);
        const isInstructor = post.thread.forum.course.instructorId === Number(userId);
        const isAdmin = userRole === 'ADMIN';

        if (!isCreator && !isInstructor && !isAdmin) {
            const error = new Error('Not authorized to delete this post');
            error.status = HTTP_STATUS.FORBIDDEN;
            throw error;
        }

        
        const firstPost = await prisma.post.findFirst({
            where: { threadId: post.threadId },
            orderBy: { createdAt: 'asc' }
        });

        
        if (firstPost && firstPost.id === post.id) {
            console.log('Deleting entire thread as this is the first post');
            
            
            await prisma.thread.delete({
                where: { id: post.threadId }
            });

            return { 
                success: true, 
                threadDeleted: true,
                threadId: post.threadId 
            };
        } else {
            
            await prisma.post.delete({
                where: { id: Number(postId) }
            });

            return { 
                success: true, 
                threadDeleted: false 
            };
        }
    } catch (error) {
        logger.error(`Error deleting post: ${error.message}`);
        throw error;
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
}
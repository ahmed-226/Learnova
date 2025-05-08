const express = require('express');
const router = express.Router();
const controller = require('./forums.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./forums.schema');

// All forum routes require authentication
router.use(auth);

// Course forum routes
router.get('/course/:courseId', 
    validate({ params: schema.courseIdParam }),
    controller.getForumByCourseId
);

// Forum thread routes
router.get('/:forumId/threads', 
    validate({ params: schema.forumIdParam }),
    controller.getThreadsByForumId
);

router.post('/:forumId/threads', 
    validate({ params: schema.forumIdParam, body: schema.createThread }),
    controller.createThread
);

// Thread routes
router.get('/threads/:threadId', 
    validate({ params: schema.threadIdParam }),
    controller.getThreadById
);

router.put('/threads/:threadId', 
    validate({ params: schema.threadIdParam, body: schema.updateThread }),
    controller.updateThread
);

router.delete('/threads/:threadId', 
    validate({ params: schema.threadIdParam }),
    controller.deleteThread
);

// Post routes
router.post('/threads/:threadId/posts', 
    validate({ params: schema.threadIdParam, body: schema.createPost }),
    controller.createPost
);

router.put('/posts/:postId', 
    validate({ params: schema.postIdParam, body: schema.updatePost }),
    controller.updatePost
);

router.delete('/posts/:postId', 
    validate({ params: schema.postIdParam }),
    controller.deletePost
);

module.exports = router;
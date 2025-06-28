const express = require('express');
const router = express.Router();
const controller = require('./forums.controller');
const auth = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const schema = require('./forums.schema');

// Get forum by course ID
router.get('/course/:courseId', auth, validate({ params: schema.courseIdParam }), controller.getForumByCourseId);

// Get threads by forum ID
router.get('/:forumId/threads', auth, validate({ params: schema.forumIdParam }), controller.getThreadsByForumId);

// Create thread
router.post('/:forumId/threads', auth, validate({ params: schema.forumIdParam, body: schema.createThread }), controller.createThread);

// Thread operations
router.get('/threads/:threadId', auth, validate({ params: schema.threadIdParam }), controller.getThreadById);
router.put('/threads/:threadId', auth, validate({ params: schema.threadIdParam, body: schema.updateThread }), controller.updateThread);
router.delete('/threads/:threadId', auth, validate({ params: schema.threadIdParam }), controller.deleteThread);

// Post operations
router.post('/threads/:threadId/posts', auth, validate({ params: schema.threadIdParam, body: schema.createPost }), controller.createPost);
router.put('/posts/:postId', auth, validate({ params: schema.postIdParam, body: schema.updatePost }), controller.updatePost);
router.delete('/posts/:postId', auth, validate({ params: schema.postIdParam }), controller.deletePost);

module.exports = router;
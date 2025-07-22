const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Job Categories
router.get('/categories', jobController.getJobCategories);

// Job Posts
router.get('/', jobController.getAllJobPosts); // ดึงโพสต์ทั้งหมด + filter
router.post('/', verifyToken, upload.single('jobImage'), jobController.createJobPost);
router.get('/:id', jobController.getJobPostById);
router.put('/:id', verifyToken, jobController.updateJobPost);
router.delete('/:id', verifyToken, jobController.deleteJobPost);

// Job Applications
router.post('/:id/apply', verifyToken, jobController.applyForJob);

// Comments
router.get('/:id/comments', jobController.getComments);
router.post('/:id/comments', verifyToken, jobController.addComment);

module.exports = router;
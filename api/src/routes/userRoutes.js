// src/routes/userRoutes.js
const express = require('express');
const { getProfile, updateProfile, uploadProfilePicture } = require('../controllers/userController');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Middleware สำหรับอัปโหลด
const router = express.Router();

// Routes ที่ต้องมีการยืนยันตัวตน
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.post('/profile/upload', verifyToken, upload.single('profileImage'), uploadProfilePicture);

module.exports = router;
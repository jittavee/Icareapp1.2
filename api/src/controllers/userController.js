// src/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProfile = async (req, res) => {
    try {
        const userWithRelations = await prisma.user.findUnique({
            where: { id: req.userId },
            // เราไม่ได้ใช้ FriendCategory ในโปรเจกต์นี้แล้ว เลยไม่ต้อง include
            // ถ้าคุณยังใช้อยู่ ให้เอา include กลับมา
        });

        if (!userWithRelations) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // ไม่ส่งรหัสผ่านกลับไป
        const { password, ...userForClient } = userWithRelations;
        res.json(userForClient);

    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    const userId = req.userId;
    // รับข้อมูลเฉพาะ field ที่อนุญาตให้อัปเดต
    const { 
        firstName, 
        lastName, 
        phone, 
        address, 
        education, 
        experience, 
        skills 
    } = req.body;

    try {
        // อัปเดตข้อมูลพื้นฐานของ User
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                phone,
                address,
                education,
                experience,
                skills,
            },
        });
        
        // ดึงข้อมูล User ทั้งหมดอีกครั้งเพื่อส่งกลับ (ไม่รวม password)
        const { password, ...userForClient } = updatedUser;
        
        res.json({ message: 'Profile updated successfully', user: userForClient });

    } catch (error) {
         console.error("Update Profile Error:", error); // <-- Log error ที่เกิดขึ้นจริง
        res.status(500).json({ message: 'Error updating profile' });
    }
};


    
// --- END: แก้ไขฟังก์ชัน updateProfile ---

exports.uploadProfilePicture = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    try {
        const relativePath = `/uploads/${req.file.filename}`;

        const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { profileImageUrl: relativePath }, // เก็บแค่ Relative Path
        });
        
        // แปลง path เป็น Full URL ก่อนส่งกลับ
        updatedUser.profileImageUrl = createFullImageUrl(req, updatedUser.profileImageUrl);

        const { password: _, ...userToReturn } = updatedUser;

        res.status(200).json({
            message: 'Profile picture uploaded!',
            user: userToReturn, // ส่งข้อมูล user ที่อัปเดตแล้วและมี Full URL กลับไป
        });

    } catch (error) {
        console.error("[UPLOAD ERROR]", error);
        res.status(500).json({ message: 'Server error during file upload.', details: error.message });
    }
};

// ฟังก์ชันสำหรับสร้าง Full URL (แยกออกมาเพื่อใช้ซ้ำ)
const createFullImageUrl = (req, path) => {
    if (!path || path.startsWith('http')) {
        return path; // ถ้าไม่มี path หรือเป็น Full URL อยู่แล้ว ก็ไม่ต้องทำอะไร
    }
    const apiBaseUrl = process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`;
    return `${apiBaseUrl}${path}`;
};


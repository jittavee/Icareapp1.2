const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- 1. กำหนดค่าคงที่สำหรับโฟลเดอร์อัปโหลด ---
// ใช้ path.join เพื่อให้ทำงานได้ถูกต้องในทุกระบบปฏิบัติการ (Windows, macOS, Linux)
// __dirname จะชี้ไปยังโฟลเดอร์ปัจจุบัน (คือ /src/middlewares)
// '../..' จะถอยกลับไป 2 ระดับจนถึง root ของโปรเจกต์ 'api'
// จากนั้นจึงต่อไปยังโฟลเดอร์ 'uploads'
const UPLOAD_DIRECTORY = path.join(__dirname, '../../uploads');

// --- 2. ตรวจสอบและสร้างโฟลเดอร์อัปโหลดโดยอัตโนมัติ ---
// ส่วนนี้จะทำงานแค่ครั้งเดียวตอนที่เซิร์ฟเวอร์เริ่มทำงาน
try {
  if (!fs.existsSync(UPLOAD_DIRECTORY)) {
    fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
    console.log(`Upload directory created at: ${UPLOAD_DIRECTORY}`);
  }
} catch (error) {
  console.error('Could not create upload directory:', error);
}


// --- 3. กำหนดค่า Storage Engine ของ Multer ---
// เราจะบอก Multer ว่าจะเก็บไฟล์ไว้ที่ไหนและจะตั้งชื่อไฟล์อย่างไร
const storage = multer.diskStorage({
  // destination: กำหนดโฟลเดอร์ที่จะบันทึกไฟล์
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIRECTORY);
  },
  // filename: กำหนดชื่อไฟล์ที่จะบันทึก
  filename: (req, file, cb) => {
    // สร้างชื่อไฟล์ที่ไม่ซ้ำกันโดยใช้ timestamp และเลขสุ่ม
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // เอานามสกุลไฟล์เดิมมาใช้ (เช่น .jpg, .png)
    const extension = path.extname(file.originalname);
    // ประกอบเป็นชื่อไฟล์ใหม่: profileImage-1751529311315-79908581.jpg
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});


// --- 4. กำหนด Filter สำหรับไฟล์ ---
// เราจะตรวจสอบ Mimetype เพื่อให้แน่ใจว่าเป็นไฟล์รูปภาพเท่านั้น
const fileFilter = (req, file, cb) => {
  // ตรวจสอบว่า mimetype ขึ้นต้นด้วย 'image/' หรือไม่ (เช่น 'image/jpeg', 'image/png')
  if (file.mimetype.startsWith('image/')) {
    // อนุญาตให้อัปโหลด
    cb(null, true);
  } else {
    // ไม่อนุญาต พร้อมส่ง Error Message กลับไป
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed!'), false);
  }
};


// --- 5. สร้าง Middleware ของ Multer ด้วยค่า Configuration ทั้งหมด ---
const upload = multer({
  storage: storage,         // ใช้ Storage Engine ที่เรากำหนด
  fileFilter: fileFilter,   // ใช้ File Filter ที่เรากำหนด
  limits: {
    fileSize: 5 * 1024 * 1024 // จำกัดขนาดไฟล์ที่ 5MB
  }
});

// --- 6. Export Middleware เพื่อนำไปใช้ใน Routes ---
module.exports = upload;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- Job Category Controller ---
exports.getJobCategories = async (req, res) => {
  try {
    const categories = await prisma.jobCategory.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job categories.' });
  }
};

// --- Job Post Controllers (CRUD) ---
exports.createJobPost = async (req, res) => {
  const { title, description, categoryId,duration, budget, location  } = req.body;
  const authorId = req.userId;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newJobPost = await prisma.jobPost.create({
      data: { title, description, categoryId, authorId, imageUrl, duration, budget:budget ?parseFloat(budget):null, location }, 
      include: { author: true, category: true },
    });
    res.status(201).json(newJobPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job post.' });
  }
};

exports.getAllJobPosts = async (req, res) => {
  const { categoryId } = req.query; // รับ filter จาก query string
  const whereClause = categoryId ? { categoryId } : {};

  try {
    const jobPosts = await prisma.jobPost.findMany({
      where: whereClause,
      include: {
        author: { select: { id: true, username: true } },
        category: true,
        _count: { select: { applications: true, comments: true } }, // นับจำนวนผู้สมัครและคอมเมนต์
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(jobPosts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job posts.' });
  }
};

exports.getJobPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const jobPost = await prisma.jobPost.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, profileImageUrl: true } },
        category: true,
        applications: {
          include: { applicant: { select: { id: true, username: true } } },
        },
      },
    });
    if (!jobPost) return res.status(404).json({ message: 'Job post not found.' });
    res.status(200).json(jobPost);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job post.' });
  }
};

// (เพิ่ม updateJobPost, deleteJobPost ที่มีการตรวจสอบ ownership ที่นี่)
// ...
exports.updateJobPost = async (req, res) => {
  const { id } = req.params;
  const { title, description, categoryId, duration, budget, location, status } = req.body;
  const userId = req.userId;

   try {
    // 1. ค้นหาโพสต์เพื่อตรวจสอบ ownership
    const postToUpdate = await prisma.jobPost.findUnique({
      where: { id },
    });

    if (!postToUpdate) {
      return res.status(404).json({ message: 'Job post not found.' });
    }

    // 2. ตรวจสอบว่าเป็นเจ้าของโพสต์หรือไม่
    if (postToUpdate.authorId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this post.' });
    }

    // 3. อัปเดตข้อมูล
    const updatedPost = await prisma.jobPost.update({
      where: { id },
      data: {
        title,
        description,
        categoryId,
        duration,
        budget: budget ? parseFloat(budget) : null,
        location,
        status, // อนุญาตให้อัปเดตสถานะ (OPEN/CLOSED)
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Update Job Post Error:", error);
    res.status(500).json({ message: 'Error updating job post.' });
  }
};

exports.deleteJobPost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const jobPost = await prisma.jobPost.findUnique({ where: { id } });

    if (!jobPost) {
      return res.status(404).json({ message: 'Job post not found.' });
    }

    // ตรวจสอบว่าเป็นเจ้าของโพสต์หรือไม่
    if (jobPost.authorId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }

    await prisma.jobPost.delete({ where: { id } });

    res.status(200).json({ message: 'Job post deleted successfully.' });
  } catch (error) {
    console.error('Error deleting job post:', error);
    res.status(500).json({ message: 'Error deleting job post.' });
  }
};

// --- Job Application Controller ---
exports.applyForJob = async (req, res) => {
    const { id: jobPostId } = req.params;
    const applicantId = req.userId;
    try {
        // เช็คว่าเคยสมัครไปแล้วหรือยัง
        const existingApplication = await prisma.jobApplication.findUnique({
            where: { jobPostId_applicantId: { jobPostId, applicantId } }
        });
        if (existingApplication) {
            return res.status(409).json({ message: "You have already applied for this job." });
        }
        const application = await prisma.jobApplication.create({
            data: { jobPostId, applicantId }
        });
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: "Error applying for job." });
    }
};

// --- Comment Controllers ---
exports.getComments = async (req, res) => {
    const { id: jobPostId } = req.params;
    try {
        const comments = await prisma.comment.findMany({
            where: { jobPostId },
            include: { author: { select: { id: true, username: true, profileImageUrl: true }}},
            orderBy: { createdAt: 'asc' }
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments." });
    }
};

exports.addComment = async (req, res) => {
    const { id: jobPostId } = req.params;
    const { content } = req.body;
    const authorId = req.userId;
    try {
        const comment = await prisma.comment.create({
            data: { content, jobPostId, authorId },
            include: { author: { select: { id: true, username: true, profileImageUrl: true }}}
        });
        res.status(201).json(comment);
    } catch(error) {
        res.status(500).json({ message: "Error adding comment." });
    }
};
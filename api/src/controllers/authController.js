// src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
    const { username, email, password, firstName, lastName, phone, address } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                address,
            },
        });
        res.status(201).json({ message: 'User registered successfully!', userId: newUser.id });
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') { // Unique constraint failed
            return res.status(409).json({ message: `This ${error.meta.target.join(', ')} is already taken.` });
        }
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials Email Password ไม่ถูกต้อง' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // ไม่ส่งรหัสผ่านกลับไป
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
};
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, password, role, name, email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            name,
            email
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        console.log('🔐 Login attempt:', { email, role });

        // Find user by email or username (ID)
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email } // 'email' field in request body might hold the ID
            ]
        });
        console.log('👤 User found:', user ? `Yes (${user.email}, ${user.role})` : 'No');

        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('🔑 Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('❌ Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify role matches
        console.log('🎭 Role check:', { requested: role, actual: user.role });
        if (user.role.toLowerCase() !== role.toLowerCase()) {
            console.log('❌ Role mismatch');
            return res.status(403).json({
                message: `Access denied: You are not registered as a ${role}. Your registered role is ${user.role}`
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('✅ Login successful for:', user.email || user.username);
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err: any) {
        console.error('💥 Login error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Verify token
router.get('/verify', authenticateToken, async (req: AuthRequest, res) => {
    try {
        const user = await User.findById(req.user?.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            // For security, don't reveal if email exists or not
            return res.json({ message: 'If the email exists, a reset link has been sent' });
        }

        // Generate password reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // In a real application, you would:
        // 1. Save the reset token to the database
        // 2. Send an email with the reset link
        // For now, we'll just log it
        console.log(`Password reset link for ${email}: http://localhost:5000/reset-password?token=${resetToken}`);

        res.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Contact Admin
router.post('/contact-admin', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // In a real application, you would:
        // 1. Save the message to a database
        // 2. Send an email notification to admin
        // 3. Create a ticket in a support system
        // For now, we'll just log it
        console.log('Contact Admin Request:');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);

        res.json({ message: 'Your message has been sent to the administrator' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

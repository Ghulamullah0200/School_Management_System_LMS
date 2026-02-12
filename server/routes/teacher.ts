import express from 'express';
import { Teacher } from '../models/Teacher';
import { User } from '../models/User';
import { sendCredentials } from '../services/emailService';
import { stringify } from 'csv-stringify';
import { generateTeacherId } from '../utils/idGenerator';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Helper to generate random password
const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Create Teacher
router.post('/', async (req, res) => {
    try {
        const teacherData = req.body;

        // Auto-generate teacherId if not provided
        if (!teacherData.teacherId) {
            teacherData.teacherId = await generateTeacherId();
        }

        const teacher = new Teacher(teacherData);
        await teacher.save();

        // Create User account for Teacher
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set Username to teacherId for ID-based login
        const loginId = teacher.teacherId;

        const newUser = new User({
            username: loginId,
            password: hashedPassword,
            role: 'teacher',
            name: teacher.name,
            email: teacher.email,
            details: { teacherId: teacher._id }
        });

        await newUser.save();

        // Send email
        await sendCredentials(teacher.email, loginId, password, teacher.name, 'teacher');

        res.status(201).json(teacher);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Export Teachers to CSV
router.get('/export', async (req, res) => {
    try {
        const teachers = await Teacher.find({ isActive: true });

        const data = teachers.map(t => ({
            'Teacher ID': t.teacherId,
            'Name': t.name,
            'Subject': t.subject,
            'Phone': t.phone,
            'Email': t.email,
            'Designation': t.qualification || '', // Assuming qualification maps to designation/title
            'Salary': t.salary
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=teachers.csv');

        stringify(data, { header: true }).pipe(res);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get all Teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find({ isActive: true });
        res.json(teachers);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Teacher
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id).populate('assignedClasses');
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update Teacher
router.put('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(teacher);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Teacher (Soft delete)
router.delete('/:id', async (req, res) => {
    try {
        await Teacher.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

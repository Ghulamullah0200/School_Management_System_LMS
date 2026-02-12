import express from 'express';
import { Class } from '../models/Class';
import { User } from '../models/User';

const router = express.Router();

// Get all classes
router.get('/classes', async (req, res) => {
    try {
        const classes = await Class.find().populate('teacher', 'name').populate('students', 'name');
        res.json(classes);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Create Class
router.post('/classes', async (req, res) => {
    try {
        const { name, subject, period, timings, teacherId, studentIds } = req.body;
        const newClass = new Class({
            name,
            subject,
            period,
            timings,
            teacher: teacherId,
            students: studentIds
        });
        await newClass.save();
        res.status(201).json(newClass);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }, 'name _id');
        res.json(teachers);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get all students
router.get('/students', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }, 'name _id');
        res.json(students);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

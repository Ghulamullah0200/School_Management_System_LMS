import express from 'express';
import { Class } from '../models/Class';

const router = express.Router();

// Create Class
router.post('/', async (req, res) => {
    try {
        // TODO: specific timing conflict checks can be added here
        const newClass = new Class(req.body);
        await newClass.save();
        res.status(201).json(newClass);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get all Classes
router.get('/', async (req, res) => {
    try {
        const classes = await Class.find({ isActive: true })
            .populate('classTeacher', 'name')
            .populate('subjects.subject', 'name code')
            .populate('subjects.teacher', 'name');
        res.json(classes);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Class
router.get('/:id', async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id)
            .populate('classTeacher', 'name')
            .populate('subjects.subject')
            .populate('subjects.teacher');
        if (!classData) return res.status(404).json({ message: 'Class not found' });
        res.json(classData);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update Class (e.g. Assign Subjects, Teachers, Routine)
router.put('/:id', async (req, res) => {
    try {
        const classData = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(classData);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Class
router.delete('/:id', async (req, res) => {
    try {
        await Class.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ message: 'Class deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

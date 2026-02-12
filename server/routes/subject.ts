import express from 'express';
import { Subject } from '../models/Subject';

const router = express.Router();

// Create Subject
router.post('/', async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json(subject);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get all Subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find().populate('teachers', 'name');
        res.json(subjects);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update Subject
router.put('/:id', async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(subject);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Subject
router.delete('/:id', async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

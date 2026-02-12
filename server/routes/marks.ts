import express from 'express';
import { Marks } from '../models/Marks';

const router = express.Router();

// Get marks for a student
router.get('/student/:studentId', async (req, res) => {
    try {
        const marks = await Marks.find({ student: req.params.studentId })
            .populate('class', 'name subject')
            .sort({ createdAt: -1 });
        res.json(marks);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Post marks (Teacher only)
router.post('/', async (req, res) => {
    try {
        const { studentId, classId, subject, marksObtained, totalMarks, examType, remarks, teacherId } = req.body;
        const newMark = new Marks({
            student: studentId,
            class: classId,
            subject,
            marksObtained,
            totalMarks,
            examType,
            remarks,
            teacher: teacherId
        });
        await newMark.save();
        res.status(201).json(newMark);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;

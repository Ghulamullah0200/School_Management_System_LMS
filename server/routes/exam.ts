import express from 'express';
import { Exam } from '../models/Exam';
import { Marks } from '../models/Marks';

const router = express.Router();

// --- EXAMS ---

// Create Exam
router.post('/', async (req, res) => {
    try {
        const exam = new Exam(req.body);
        await exam.save();
        res.status(201).json(exam);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get all Exams
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.find().populate('classes', 'name');
        res.json(exams);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// --- MARKS ---

// Add Marks for a student
router.post('/marks', async (req, res) => {
    try {
        const marks = new Marks(req.body);
        await marks.save();
        res.status(201).json(marks);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get Marks for a student or exam
router.get('/marks', async (req, res) => {
    try {
        const { studentId, examId, classId } = req.query;
        let query: any = {};
        if (studentId) query.student = studentId;
        if (examId) query.exam = examId;
        if (classId) query.class = classId;

        const results = await Marks.find(query)
            .populate('student', 'name rollNo')
            .populate('subject', 'name')
            .populate('exam', 'name');
        res.json(results);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

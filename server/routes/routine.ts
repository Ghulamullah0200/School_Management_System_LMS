import express from 'express';
import { Class } from '../models/Class';

const router = express.Router();

// Get today's classes for a teacher or student based on recurring schedule
router.get('/today', async (req, res) => {
    try {
        const { userId, role } = req.query; // userId and role ('teacher' or 'student')
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];

        const query: any = {
            'schedule.day': today,
            'schedule.active': true
        };

        if (role === 'teacher') {
            query.teacher = userId;
        } else if (role === 'student') {
            query.students = userId;
        }

        const classes = await Class.find(query).populate('teacher', 'name');
        res.json(classes);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

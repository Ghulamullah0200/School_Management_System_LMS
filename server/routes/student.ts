import express from 'express';
import { Student } from '../models/Student';
import { User } from '../models/User';
import { sendCredentials } from '../services/emailService';
import { generateStudentId } from '../utils/idGenerator';
import { stringify } from 'csv-stringify';
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

// Create Student
router.post('/', async (req, res) => {
    try {
        const studentData = req.body;

        // Auto-generate studentId if not provided
        if (!studentData.studentId) {
            studentData.studentId = await generateStudentId();
        }

        const student = new Student(studentData);
        await student.save();

        // Create User account for Student
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set Username to studentId for ID-based login
        const loginId = student.studentId;

        const newUser = new User({
            username: loginId,
            password: hashedPassword,
            role: 'student',
            name: student.name,
            email: student.email || `${student.studentId}@school.com`, // Fallback email
            details: { studentId: student._id }
        });

        await newUser.save();

        // Send email if student has one
        if (student.email) {
            await sendCredentials(student.email, loginId, password, student.name, 'student');
        }

        res.status(201).json(student);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Export Students to CSV
router.get('/export', async (req, res) => {
    try {
        const students = await Student.find({ isActive: true }).populate('class', 'name');

        const data = students.map(s => ({
            'Student ID': s.studentId,
            'Name': s.name,
            'Father Name': s.fatherName,
            'Class': (s.class as any)?.name || 'N/A',
            'Section': s.section,
            'Roll No': s.rollNo,
            'Contact': s.contact,
            'Email': s.email || '',
            'Fee Status': s.feeStatus
        }));

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=students.csv');

        stringify(data, { header: true }).pipe(res);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get all Students
router.get('/', async (req, res) => {
    try {
        const { classId, section } = req.query;
        let query: any = { isActive: true };
        if (classId) query.class = classId;
        if (section) query.section = section;

        const students = await Student.find(query).populate('class', 'name');
        res.json(students);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get Student Count
router.get('/count', async (req, res) => {
    try {
        const count = await Student.countDocuments({ isActive: true });
        res.json({ count });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Get Single Student
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('class');
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update Student
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(student);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Student (Soft delete)
router.delete('/:id', async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, { isActive: false });
        res.json({ message: 'Student deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

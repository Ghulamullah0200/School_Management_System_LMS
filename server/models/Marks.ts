import mongoose from 'mongoose';

const marksSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    grade: { type: String }, // Auto-calculated logic will live in controller
    remarks: { type: String },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, { timestamps: true });

// Prevent duplicate marks for same exam/student/subject
marksSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });

export const Marks = mongoose.model('Marks', marksSchema);

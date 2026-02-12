import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Final Term 2024"
    type: { type: String, enum: ['Quiz', 'Midterm', 'Final', 'Assignment'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }], // Exams assigned to classes
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Exam = mongoose.model('Exam', examSchema);

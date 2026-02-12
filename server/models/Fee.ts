import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
    voucherId: { type: String, required: true, unique: true }, // Auto-generated e.g. V-CUSTOM-ID
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    type: { type: String, enum: ['Tuition', 'Transport', 'Hostel', 'Exam', 'Other'], required: true },
    month: { type: String, required: true }, // e.g. "January 2025"
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
    paymentDate: { type: Date },
    paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Online'], default: 'Cash' },
    description: { type: String }
}, { timestamps: true });

export const Fee = mongoose.model('Fee', feeSchema);

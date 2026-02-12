import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    email: { type: String },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    section: { type: String, required: true },
    rollNo: { type: String, required: true },
    contact: { type: String, required: true },
    admissionDate: { type: Date, default: Date.now },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dob: { type: Date },
    address: { type: String },
    feeStatus: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);

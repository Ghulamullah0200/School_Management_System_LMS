import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
    teacherId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true }, // Main subject specialization
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    timings: {
        start: { type: String, required: true }, // e.g. "08:00"
        end: { type: String, required: true }    // e.g. "14:00"
    },
    salary: { type: Number, required: true },
    address: { type: String },
    qualification: { type: String },
    joiningDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Teacher = mongoose.model('Teacher', teacherSchema);

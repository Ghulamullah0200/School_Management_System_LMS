import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    date: { type: Date, required: true },
    // We can store an array of records for a single class-date entry for efficiency, 
    // or store individual documents per student.
    // Storing per student per day is easier for querying history per student.
    records: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        status: { type: String, enum: ['Present', 'Absent', 'Late', 'Leave'], default: 'Present' },
        remarks: { type: String }
    }],
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' } // or User
}, { timestamps: true });

// Ensure unique attendance per class per date
attendanceSchema.index({ class: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);

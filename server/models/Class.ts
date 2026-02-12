import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    classId: { type: String, required: true, unique: true }, // Auto-generated ID e.g. CLS-01
    name: { type: String, required: true }, // e.g. "Class 10"
    section: { type: String, required: true }, // e.g. "A"
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },

    // Subjects assigned to this class, potentially with specific teachers for those subjects
    subjects: [{
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
    }],

    routine: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        slots: [{
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
        }]
    }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Class = mongoose.model('Class', classSchema);

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin
    recipientType: { type: String, enum: ['All', 'Student', 'Teacher', 'Class'], required: true },
    // specific recipient if type is Student, Teacher, or Class
    recipientStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    recipientTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    recipientClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },

    subject: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);

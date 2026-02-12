import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    credits: { type: Number, default: 0 },
    // A subject can be taught by multiple teachers
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
}, { timestamps: true });

export const Subject = mongoose.model('Subject', subjectSchema);

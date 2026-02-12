import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student', 'parent'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    details: { type: Object }, // For additional info like student class, teacher subject etc.
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

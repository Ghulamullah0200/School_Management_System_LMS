import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduprime';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users to avoid duplicates during seeding
        await User.deleteMany({});
        console.log('Cleared existing users');

        const passwordHash = await bcrypt.hash('admin123', 10);
        const teacherHash = await bcrypt.hash('teacher123', 10);
        const studentHash = await bcrypt.hash('student123', 10);
        const parentHash = await bcrypt.hash('parent123', 10);

        const users = [
            {
                username: 'admin',
                password: passwordHash,
                role: 'admin',
                name: 'System Admin',
                email: 'admin@example.com'
            },
            {
                username: 'teacher',
                password: teacherHash,
                role: 'teacher',
                name: 'John Doe',
                email: 'teacher@example.com'
            },
            {
                username: 'student',
                password: studentHash,
                role: 'student',
                name: 'Jane Smith',
                email: 'student@example.com'
            },
            {
                username: 'parent',
                password: parentHash,
                role: 'parent',
                name: 'Mary Smith',
                email: 'parent@example.com'
            }
        ];

        await User.insertMany(users);
        console.log('Database seeded successfully!');

        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();

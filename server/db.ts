import mongoose from 'mongoose';
import { log } from './index';

export async function connectDB() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduprime';
    try {
        await mongoose.connect(MONGODB_URI);
        log('Connected to MongoDB');
    } catch (err) {
        log(`MongoDB connection error: ${err}`);
        process.exit(1);
    }
}

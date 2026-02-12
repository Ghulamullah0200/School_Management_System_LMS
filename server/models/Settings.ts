import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    instituteName: { type: String, default: "EduPrime Institute" },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    logoUrl: { type: String },
    currentSession: { type: String, required: true }, // e.g. "2024-2025"
    currency: { type: String, default: "USD" },
    language: { type: String, default: "en" }
}, { timestamps: true });

export const Settings = mongoose.model('Settings', settingsSchema);

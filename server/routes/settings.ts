import express from 'express';
import { Settings } from '../models/Settings';

const router = express.Router();

// Get Settings
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if not exists
            settings = new Settings({ currentSession: '2024-2025' });
            await settings.save();
        }
        res.json(settings);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update Settings
router.put('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
            await settings.save();
        } else {
            settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
        }
        res.json(settings);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;

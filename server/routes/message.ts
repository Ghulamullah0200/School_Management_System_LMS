import express from 'express';
import { Message } from '../models/Message';

const router = express.Router();

// Send Message
router.post('/', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get Messages (Inbox / Sent)
router.get('/', async (req, res) => {
    try {
        const { recipientId, senderId, type } = req.query;
        let query: any = {};

        // Logic to filter messages for a specific user based on their ID and type
        // This is a simplified version. Real world filtering would be more complex (OR recipientType='All')
        if (recipientId) {
            query.$or = [
                { recipientStudent: recipientId },
                { recipientTeacher: recipientId },
                { recipientType: 'All' }
            ];
            if (type === 'Student') query.$or.push({ recipientType: 'Student' });
            if (type === 'Teacher') query.$or.push({ recipientType: 'Teacher' });
        }

        if (senderId) query.sender = senderId;

        const messages = await Message.find(query).sort({ date: -1 });
        res.json(messages);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

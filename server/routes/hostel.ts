import express from 'express';
import { HostelRoom } from '../models/HostelRoom';

const router = express.Router();

// Create Room
router.post('/', async (req, res) => {
    try {
        const room = new HostelRoom(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get Rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await HostelRoom.find().populate('occupants', 'name');
        res.json(rooms);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Allocate Room
router.put('/:id/allocate', async (req, res) => {
    try {
        const { studentId } = req.body;
        const room = await HostelRoom.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({ message: 'Room is full' });
        }

        room.occupants.push(studentId);
        await room.save();
        res.json(room);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;

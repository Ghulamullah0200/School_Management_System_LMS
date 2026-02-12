import express from 'express';
import { TransportRoute } from '../models/TransportRoute';

const router = express.Router();

// Create Route
router.post('/', async (req, res) => {
    try {
        const route = new TransportRoute(req.body);
        await route.save();
        res.status(201).json(route);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get Routes
router.get('/', async (req, res) => {
    try {
        const routes = await TransportRoute.find().populate('students', 'name');
        res.json(routes);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Update Route (e.g. assign student)
router.put('/:id', async (req, res) => {
    try {
        // If assigning a student, we might push to students array
        const route = await TransportRoute.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(route);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

export default router;

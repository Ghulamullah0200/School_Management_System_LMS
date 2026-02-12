import express from 'express';
import { Fee } from '../models/Fee';

const router = express.Router();

// Generate Fee Voucher (Single or Bulk logic can be handled here)
router.post('/generate', async (req, res) => {
    try {
        // Simple single creation for now. Bulk creation logic would go here.
        const fee = new Fee(req.body);
        await fee.save();
        res.status(201).json(fee);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Get Fees (Filter by student, status, month)
router.get('/', async (req, res) => {
    try {
        const { studentId, status, month } = req.query;
        let query: any = {};
        if (studentId) query.student = studentId;
        if (status) query.status = status;
        if (month) query.month = month;

        const fees = await Fee.find(query).populate('student', 'name class');
        res.json(fees);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

// Mark as Paid
router.put('/:id/pay', async (req, res) => {
    try {
        const { paymentMethod, paymentDate } = req.body;
        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            {
                status: 'Paid',
                paymentDate: paymentDate || new Date(),
                paymentMethod: paymentMethod
            },
            { new: true }
        );
        res.json(fee);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const totalCollected = await Fee.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const pendingFees = await Fee.countDocuments({ status: 'Unpaid' });

        res.json({
            totalCollected: totalCollected[0]?.total || 0,
            pendingCount: pendingFees
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

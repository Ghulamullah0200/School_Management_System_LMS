import mongoose from 'mongoose';

const hostelRoomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['1 Seater', '2 Seater', '4 Seater', 'Dormitory'], required: true },
    capacity: { type: Number, required: true },
    occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Students assigned
    feePerMonth: { type: Number, required: true },
    amenities: [String],
    floor: { type: String }
}, { timestamps: true });

export const HostelRoom = mongoose.model('HostelRoom', hostelRoomSchema);

import mongoose from 'mongoose';

const transportRouteSchema = new mongoose.Schema({
    routeId: { type: String, required: true, unique: true }, // e.g. TR-01
    routeName: { type: String, required: true }, // e.g. "City Center to Campus"
    vehicleNumber: { type: String, required: true },
    driverName: { type: String, required: true },
    driverContact: { type: String, required: true },
    monthlyFee: { type: Number, required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Students assigned to this route
    pickUpPoints: [String],
    timings: { type: String }
}, { timestamps: true });

export const TransportRoute = mongoose.model('TransportRoute', transportRouteSchema);

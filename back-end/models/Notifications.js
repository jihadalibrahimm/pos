import mongoose from 'mongoose';

const notificationsSchema = new mongoose.Schema({
  message: { type: String, required: true },
  cashier: { type: String, enum: ['low_stock', 'invoices', 'info'], required: true },
  seen: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notifications", notificationsSchema);

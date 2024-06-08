import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: "Property",
      required: true,
    },
    paymentId: String,
    total_amount: Number,
    date: { type: String, default: () => new Date().toLocaleDateString() },
    time: { type: String, default: () => new Date().toLocaleTimeString() },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;

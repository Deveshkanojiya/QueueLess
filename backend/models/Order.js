const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuItem',
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Canteen QR'],
      required: true,
    },
    // track overall order status (kitchen flow)
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Ready for Pickup', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    // track payment lifecycle separately to avoid overloading `status`
    paymentStatus: {
      type: String,
      enum: ['Payment Pending', 'Awaiting Verification', 'Paid'],
      default: 'Payment Pending',
    },
    // when staff cancels an order, save a human-readable reason for the student
    cancellationReason: {
      type: String,
    },
    tokenNumber: {
      type: Number,
    },
    qrCode: {
      type: String, // base64 data URL
    },
    estimatedPrepTime: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

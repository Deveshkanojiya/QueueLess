const Order = require('../models/Order');
const QRCode = require('qrcode');

// Generate daily token: counts today's orders and adds 1
const generateTokenNumber = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const count = await Order.countDocuments({ createdAt: { $gte: startOfDay } });
  return count + 1;
};

// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const tokenNumber = await generateTokenNumber();

    // Create order first to get MongoDB _id
    const order = await Order.create({
      student: req.user._id,
      items,
      totalPrice,
      paymentMethod,
      // set initial payment status — cash remains 'Payment Pending' until staff confirms;
      // QR payment is also 'Payment Pending' until the student clicks "I Have Paid" (then "Awaiting Verification")
      paymentStatus: 'Payment Pending',
      tokenNumber,
    });

    // Generate QR code from order ID
    const qrCode = await QRCode.toDataURL(order._id.toString());
    order.qrCode = qrCode;
    await order.save();

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my  — last 10 orders for logged-in student
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/orders/:id/cancel — cancel order only if Pending
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only the student who placed it can cancel
    if (order.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only Pending orders can be cancelled' });
    }

    order.status = 'Cancelled';
    order.cancellationReason = 'Cancelled by student';
    await order.save();

    res.json({ success: true, message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/orders/:id/confirm-payment — student says they have paid (marks Awaiting Verification)
const confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Only the student who placed it can mark as paid
    if (order.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Only allow if not already Paid
    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ success: false, message: 'Payment already marked as paid' });
    }

    order.paymentStatus = 'Awaiting Verification';
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, cancelOrder, confirmPayment };

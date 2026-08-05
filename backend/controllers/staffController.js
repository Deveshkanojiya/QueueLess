const Order = require('../models/Order');

// GET /api/staff/orders — all orders, optionally filtered by status
const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;

    let orders = await Order.find(query)
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    // Search by token number or order ID
    if (search) {
      const term = search.trim().toLowerCase();
      orders = orders.filter((o) => {
        const matchToken = o.tokenNumber?.toString() === term;
        const matchId = o._id.toString().includes(term);
        return matchToken || matchId;
      });
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/staff/orders/:id/status — move order to next status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Preparing', 'Completed', 'Cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('student', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/staff/orders/:id/verify-payment — staff verifies payment and marks Paid
const verifyPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('student', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentStatus = 'Paid';
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/staff/orders/:id/cancel — staff cancels order with a reason
const staffCancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    // Predefined reasons
    const predefinedReasons = [
      'Out of Stock',
      'Ingredients Not Available',
      'Kitchen Closed',
      'Technical Issue',
      'Item Unavailable',
      'Other',
    ];

    // Accept predefined reasons or any custom text (which means user selected "Other")
    if (!reason || (typeof reason !== 'string')) {
      return res.status(400).json({ success: false, message: 'Invalid cancellation reason' });
    }

    const finalReason = reason.trim();
    if (!finalReason) {
      return res.status(400).json({ success: false, message: 'Cancellation reason cannot be empty' });
    }

    const order = await Order.findById(req.params.id).populate('student', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = 'Cancelled';
    order.cancellationReason = finalReason;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET /api/staff/stats — summary counts for dashboard cards
const getStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [pending, preparing, completedToday] = await Promise.all([
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Preparing' }),
      Order.countDocuments({ status: 'Completed', createdAt: { $gte: startOfDay } }),
    ]);

    res.json({ success: true, stats: { pending, preparing, completedToday } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllOrders, updateOrderStatus, getStats, verifyPayment, staffCancelOrder };

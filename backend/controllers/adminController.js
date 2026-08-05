const User = require('../models/User');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// ── User Management ──────────────────────────────

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const query = {};
    if (role) query.role = role;

    let users = await User.find(query).select('-password').sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      users = users.filter(
        (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      );
    }

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/users — create staff/admin account
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });

    const user = await User.create({ name, email, password, role: role || 'staff' });
    res.status(201).json({
      success: true,
      message: 'User created',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Orders ───────────────────────────────────────

// GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;

    let orders = await Order.find(query)
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);

    if (search) {
      const term = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o._id.toString().includes(term) ||
          o.tokenNumber?.toString() === term ||
          o.student?.name?.toLowerCase().includes(term)
      );
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, totalUsers, totalMenuItems, pendingOrders] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      User.countDocuments({ role: 'student' }),
      MenuItem.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
    ]);

    res.json({ success: true, stats: { totalOrders, todayOrders, totalUsers, totalMenuItems, pendingOrders } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getAllOrders, getAdminStats };

const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus, getStats, verifyPayment, staffCancelOrder } = require('../controllers/staffController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// All staff routes require login + staff role only
router.use(protect, authorizeRoles('staff'));

router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
// staff: verify payment and cancel with reason
router.patch('/orders/:id/verify-payment', verifyPayment);
router.patch('/orders/:id/cancel', staffCancelOrder);

module.exports = router;

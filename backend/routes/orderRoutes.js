const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, cancelOrder, confirmPayment } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order routes require login
router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.delete('/:id', protect, cancelOrder);
router.post('/:id/confirm-payment', protect, confirmPayment);

module.exports = router;

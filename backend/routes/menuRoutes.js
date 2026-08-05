const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getCanteenQr } = require('../controllers/menuController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public — students can view menu without logging in
router.get('/', getMenuItems);
router.get('/canteen-qr', getCanteenQr);

// Protected — Admin only
router.post('/', protect, authorizeRoles('admin'), createMenuItem);
router.put('/:id', protect, authorizeRoles('admin'), updateMenuItem);
router.delete('/:id', protect, authorizeRoles('admin'), deleteMenuItem);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, getAllOrders, getAdminStats } = require('../controllers/adminController');
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// All admin routes require login + admin role
router.use(protect, authorizeRoles('admin'));

// Stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Orders (read-only for admin dashboard)
router.get('/orders', getAllOrders);

// Menu management (admin has full CRUD)
router.get('/menu', getMenuItems);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

module.exports = router;

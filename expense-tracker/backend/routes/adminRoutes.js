const express = require('express');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
  getAllExpenses,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/expenses', getAllExpenses);

module.exports = router;

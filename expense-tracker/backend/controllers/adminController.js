const User = require('../models/User');
const Expense = require('../models/Expense');

// @desc    Get platform-wide dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, totalExpenseRecords, totals] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isActive: true }),
      Expense.countDocuments(),
      Expense.aggregate([{ $group: { _id: '$type', total: { $sum: '$amount' } } }]),
    ]);

    const income = totals.find((t) => t._id === 'income')?.total || 0;
    const expense = totals.find((t) => t._id === 'expense')?.total || 0;

    const recentExpenses = await Expense.find()
      .populate('user', 'name email')
      .populate('category', 'name icon color')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalExpenseRecords,
        totalIncome: income,
        totalExpense: expense,
        recentExpenses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).sort('-createdAt').skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user with their expense summary
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const expenseCount = await Expense.countDocuments({ user: user._id });
    const totals = await Expense.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);

    res.json({
      success: true,
      data: {
        user,
        expenseCount,
        totalIncome: totals.find((t) => t._id === 'income')?.total || 0,
        totalExpense: totals.find((t) => t._id === 'expense')?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate / deactivate a user
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot change status of an admin account' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user (and their expenses)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete an admin account' });
    }
    await Expense.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all expenses across all users (with filters)
// @route   GET /api/admin/expenses
// @access  Private/Admin
const getAllExpenses = async (req, res, next) => {
  try {
    const { userId, page = 1, limit = 15 } = req.query;
    const query = {};
    if (userId) query.user = userId;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 15, 1);
    const skip = (pageNum - 1) * limitNum;

    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .populate('user', 'name email')
        .populate('category', 'name icon color')
        .sort('-date')
        .skip(skip)
        .limit(limitNum),
      Expense.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: expenses.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getUsers, getUserById, toggleUserStatus, deleteUser, getAllExpenses };

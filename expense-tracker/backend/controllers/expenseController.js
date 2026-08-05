const Expense = require('../models/Expense');

// @desc    Get all expenses for logged in user (with filters, pagination)
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const { category, type, startDate, endDate, search, page = 1, limit = 10, sort = '-date' } = req.query;

    const query = { user: req.user._id };

    if (category) query.category = category;
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const [expenses, total] = await Promise.all([
      Expense.find(query).populate('category', 'name icon color').sort(sort).skip(skip).limit(limitNum),
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

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id }).populate('category', 'name icon color');
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, description, paymentMethod } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ success: false, message: 'Title, amount and category are required' });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date,
      description,
      paymentMethod,
    });

    const populated = await expense.populate('category', 'name icon color');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const fields = ['title', 'amount', 'type', 'category', 'date', 'description', 'paymentMethod'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) expense[field] = req.body[field];
    });

    await expense.save();
    const populated = await expense.populate('category', 'name icon color');
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    await expense.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary stats (totals, by category, by month) for logged in user
// @route   GET /api/expenses/stats/summary
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const totals = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);

    const byCategory = await Expense.aggregate([
      { $match: { user: userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $sort: { total: -1 } },
    ]);

    const byMonth = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const income = totals.find((t) => t._id === 'income')?.total || 0;
    const expense = totals.find((t) => t._id === 'expense')?.total || 0;

    res.json({
      success: true,
      data: {
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
        byCategory,
        byMonth,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExpenses, getExpense, createExpense, updateExpense, deleteExpense, getStats };

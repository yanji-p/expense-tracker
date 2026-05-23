const db = require('../config/db');

exports.getExpenses = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        e.*, 
        c.name AS category_name, 
        c.color AS category_color
       FROM expenses e
       LEFT JOIN categories c 
       ON e.category_id = c.id
       WHERE e.user_id = ?
       ORDER BY e.date DESC`,
      [req.userId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { title, amount, date, category_id, note } = req.body;

    await db.query(
      `INSERT INTO expenses
      (user_id, category_id, title, amount, date, note)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        category_id || null,
        title,
        amount,
        date,
        note || null
      ]
    );

    res.status(201).json({
      message: 'Expense added'
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, date, category_id, note } = req.body;

    await db.query(
      `UPDATE expenses
       SET title = ?,
           amount = ?,
           date = ?,
           category_id = ?,
           note = ?
       WHERE id = ?
       AND user_id = ?`,
      [
        title,
        amount,
        date,
        category_id || null,
        note || null,
        req.params.id,
        req.userId
      ]
    );

    res.json({
      message: 'Expense updated'
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {

    await db.query(
      `DELETE FROM expenses
       WHERE id = ?
       AND user_id = ?`,
      [req.params.id, req.userId]
    );

    res.json({
      message: 'Expense deleted'
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

exports.getSummary = async (req, res) => {
  try {

    // CATEGORY SUMMARY
    const [byCategoryRaw] = await db.query(
      `SELECT
        c.id,
        c.name,
        c.color,
        SUM(e.amount) AS total
       FROM expenses e
       INNER JOIN categories c
       ON e.category_id = c.id
       WHERE e.user_id = ?
       GROUP BY c.id, c.name, c.color`,
      [req.userId]
    );

    // MONTH SUMMARY
    const [byMonthRaw] = await db.query(
      `SELECT
        DATE_FORMAT(date, '%Y-%m') AS month,
        SUM(amount) AS total
       FROM expenses
       WHERE user_id = ?
       GROUP BY month
       ORDER BY month DESC
       LIMIT 6`,
      [req.userId]
    );

    // CONVERT STRING TOTALS TO NUMBERS
    const byCategory = byCategoryRaw.map(item => ({
      name: item.name || 'Other',
      color: item.color || '#94a3b8',
      total: Number(item.total)
    }));

    const byMonth = byMonthRaw.map(item => ({
      month: item.month,
      total: Number(item.total)
    }));

    res.json({
      byCategory,
      byMonth
    });

  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};
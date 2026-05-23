const db = require('../config/db');

exports.getCategories = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categories WHERE user_id = ?', [req.userId]);
  res.json(rows);
};

exports.createCategory = async (req, res) => {
  const { name, color } = req.body;
  await db.query('INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)',
    [req.userId, name, color || '#3B82F6']);
  res.status(201).json({ message: 'Category created' });
};

exports.deleteCategory = async (req, res) => {
  await db.query('DELETE FROM categories WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId]);
  res.json({ message: 'Category deleted' });
};
const router = require('express').Router();
const auth = require('../middleware/auth');
const { getExpenses, createExpense, updateExpense, deleteExpense, getSummary } = require('../controllers/expenseController');
router.get('/', auth, getExpenses);
router.post('/', auth, createExpense);
router.put('/:id', auth, updateExpense);
router.delete('/:id', auth, deleteExpense);
router.get('/summary', auth, getSummary);
module.exports = router;
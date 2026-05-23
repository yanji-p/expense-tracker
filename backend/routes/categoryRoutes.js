const router = require('express').Router();
const auth = require('../middleware/auth');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
router.get('/', auth, getCategories);
router.post('/', auth, createCategory);
router.delete('/:id', auth, deleteCategory);
module.exports = router;
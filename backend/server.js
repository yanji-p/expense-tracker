const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// IMPORTANT MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
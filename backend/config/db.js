const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log("❌ MySQL ERROR:", err.message);
  } else {
    console.log("✅ MySQL CONNECTED");
    connection.release();
  }
});

module.exports = pool.promise();
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "153.92.15.34",
  user: process.env.DB_USER || "u695341692_miitpos",
  password: process.env.DB_PASS || "Ms111988!",
  database: process.env.DB_NAME || "u695341692_miitpos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;

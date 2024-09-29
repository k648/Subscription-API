
require('dotenv').config()
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: process.env.name,
  user: process.env.DB_USER,
  password:"",
  database: process.env.DB_NAME,
  port:3306,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
 
});

module.exports = connection;
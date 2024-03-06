const mysql = require("mysql2");
const config = require("../config/config");
/**
 * DB connection
 */
const connection = mysql.createConnection({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DATABASE,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("Database Connected");
});

module.exports = connection;

const mysql = require("mysql2/promise");
const config = require("../src/config/config");

module.exports = {
  setupDB: async () => {
    try {
      await mysql.createConnection({
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DATABASE,
      });

      console.log("Successfully connected to MySQL database");

      // Your tests can use `connection` for database interactions
    } catch (error) {
      console.error("Failed to connect to MySQL database:", error);
      throw error; // Re-throw the error for test failure
    } finally {
      // Optionally, close the connection after tests are complete
      await connection.end();
    }
  },
};

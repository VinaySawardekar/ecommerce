const mysql = require("mysql2/promise");

module.exports = {
  setupDB: async () => {
    try {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "ecommerce",
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

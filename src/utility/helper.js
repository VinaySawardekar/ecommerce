const conn = require("./db");
/**
 * @ Custom Response Helper
 */
const customResponse = ({ code = 200, message = "", data = {}, err = {} }) => {
  const responseStatus = code < 300 ? "success" : "failure";
  return {
    status: responseStatus,
    code: code,
    message: message,
    data: data,
    error: err,
  };
};

/**
 * This Function will create Tables in Database if not there.
 */
async function initial() {
  try {
    const [checkTables] = await conn.promise().query("SHOW TABLES");
    const expectedTables = ["users", "products", "orders"];
    const existingTables = checkTables.map((row) => row.Tables_in_ecommerce);
    const missingTables = expectedTables.filter(
      (table) => !existingTables.includes(table)
    );
    if (missingTables.length > 0) {
      console.log(`Creating missing tables: ${missingTables}`);
      await conn
        .promise()
        .query(
          "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, address TEXT, mobile VARCHAR(10) NOT NULL)"
        );
      await conn
        .promise()
        .query(
          "CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, stock INT NOT NULL, price INT NOT NULL)"
        );
      await conn
        .promise()
        .query(
          "CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, product_id INT NOT NULL, order_quantity INT NOT NULL, total_price INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id),FOREIGN KEY (product_id) REFERENCES products(id))"
        );
    } else {
      console.log("All expected tables exist.");
    }
  } catch (error) {
    console.log("Error while Creating tables: " + error);
  }
}

module.exports = {
  customResponse,
  initial,
};

const conn = require("../../utility/db");
const { customResponse } = require("../../utility/helper");
const { HTTP_CODES } = require("../../utility/constants");

const getAllProduct = async (req, res) => {
  /**
   * #swagger.tags = ["Product"]
   */
  try {
    const productData = await conn.promise().query("SELECT * FROM products");
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Product Details fetched Successfully!",
      data: productData[0],
    });
    return res.status(HTTP_CODES.SUCCESS).send(resData);
  } catch (error) {
    message = "Internal Server Error";
    const resData = customResponse({
      code: HTTP_CODES.INTERNAL_SERVER_ERROR,
      message,
    });
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(resData);
  }
};

const getProduct = async (req, res) => {
  /**
   * #swagger.tags = ["Product"]
   */
  try {
    const productId = req.params.id;
    const productData = await conn
      .promise()
      .query(`SELECT * FROM products WHERE id = ${productId}`);
    if (productData[0].length === 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "Product Not Found!",
        data: {},
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Product Details fetched Successfully!",
      data: productData[0],
    });
    return res.status(HTTP_CODES.SUCCESS).send(resData);
  } catch (error) {
    message = "Internal Server Error";
    const resData = customResponse({
      code: HTTP_CODES.INTERNAL_SERVER_ERROR,
      message,
    });
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(resData);
  }
};

const updateProduct = async (req, res) => {
  /**
   * #swagger.tags = ["Product"]
   */
  try {
    const productId = req.params.id;
    const product = {
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
    };
    const productData = await conn
      .promise()
      .query(
        "UPDATE products SET name = ?, description = ?,stock = ?, price = ? WHERE id = ?",
        [
          product["name"],
          product["description"],
          product["stock"],
          product["price"],
          productId,
        ]
      );
    if (productData[0].affectedRows == 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "Product Updated Successfully!",
        data: productData,
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const res1 = await fetchProduct(productId);
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Product Updated Successfully!",
      data: res1,
    });
    return res.status(HTTP_CODES.SUCCESS).send(resData);
  } catch (error) {
    message = "Internal Server Error";
    const resData = customResponse({
      code: HTTP_CODES.INTERNAL_SERVER_ERROR,
      message,
    });
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(resData);
  }
};

const deleteProduct = async (req, res) => {
  /**
   * #swagger.tags = ["Product"]
   */
  try {
    const productId = req.params.id;
    const productData = await conn
      .promise()
      .query(`DELETE FROM products WHERE id = ${productId}`);
    if (productData[0].affectedRows == 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "Product Not Found!",
        data: {},
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Product Deleted Successfully!",
      data: {},
    });
    return res.status(HTTP_CODES.SUCCESS).send(resData);
  } catch (error) {
    console.log(error);
    message = "Internal Server Error";
    const resData = customResponse({
      code: HTTP_CODES.INTERNAL_SERVER_ERROR,
      message,
    });
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(resData);
  }
};

const createProduct = async (req, res) => {
  /**
   * #swagger.tags = ["Product"]
   */
  try {
    const product = {
      name: req.body.name,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
    };
    const productData = await conn
      .promise()
      .query(
        "INSERT INTO products (name, description, stock, price) VALUES (?, ?, ?, ?)",
        [product.name, product.description, product.stock, product.price]
      );

    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Product Created Successfully!",
      data: await fetchProduct(productData[0].insertId),
    });
    return res.status(HTTP_CODES.SUCCESS).send(resData);
  } catch (error) {
    message = "Internal Server Error";
    const resData = customResponse({
      code: HTTP_CODES.INTERNAL_SERVER_ERROR,
      message,
    });
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(resData);
  }
};

const fetchProduct = async (id) => {
  try {
    const productId = id;
    const productData = await conn
      .promise()
      .query(`SELECT * FROM products WHERE id = ${productId}`);
    return productData[0];
  } catch (error) {
    return [];
  }
};

module.exports = {
  getProduct,
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  fetchProduct,
};

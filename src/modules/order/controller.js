const conn = require("../../utility/db");
const { customResponse } = require("../../utility/helper");
const { HTTP_CODES } = require("../../utility/constants");
const { fetchProduct } = require("../product/controller");

const getAllOrders = async (req, res) => {
  /**
   * #swagger.tags = ["Order"]
   */
  try {
    const orderData = await conn.promise().query("SELECT * FROM orders");
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Order Details fetched Successfully!",
      data: orderData[0],
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

const getOrder = async (req, res) => {
  /**
   * #swagger.tags = ["Order"]
   */
  try {
    const orderId = req.params.id;
    const orderData = await conn
      .promise()
      .query(`SELECT * FROM orders WHERE id = ${orderId}`);
    if (orderData[0].length === 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "Order Not Found!",
        data: {},
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Order Details fetched Successfully!",
      data: orderData[0],
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

const updateOrder = async (req, res) => {
  /**
   * #swagger.tags = ["Order"]
   */
  try {
    const orderId = req.params.id;
    const fetchOrderData = await fetchOrder(orderId);
    const productDetails = await fetchProduct(fetchOrderData[0].product_id);
    const order = {
      user_id: fetchOrderData[0].user_id,
      product_id: fetchOrderData[0].product_id,
      order_quantity: req.body.order_quantity,
      total_price: productDetails[0].price * req.body.order_quantity,
    };
    const orderData = await conn
      .promise()
      .query(
        "UPDATE orders SET user_id = ?, product_id = ?,order_quantity = ?, total_price = ? WHERE id = ?",
        [
          order["user_id"],
          order["product_id"],
          order["order_quantity"],
          order["total_price"],
          orderId,
        ]
      );
    if (orderData[0].affectedRows == 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "Order Updated Successfully!",
        data: orderData,
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const res1 = await fetchOrder(orderId);
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Order Updated Successfully!",
      data: res1,
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

const deleteOrder = async (req, res) => {
  /**
   * #swagger.tags = ["Order"]
   */
  try {
    const orderId = req.params.id;
    const orderData = await conn
      .promise()
      .query(`DELETE FROM orders WHERE id = ${orderId}`);
    if (orderData[0].affectedRows == 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "Order Not Found!",
        data: {},
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Order Deleted Successfully!",
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

const createOrder = async (req, res) => {
  /**
   * #swagger.tags = ["Order"]
   */
  try {
    const productData = await fetchProduct(req.body.product_id);
    if (!productData) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "Invalid Product Order Placed",
      });
      res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const order = {
      user_id: req.body.user_id,
      product_id: req.body.product_id,
      order_quantity: req.body.order_quantity,
      total_price: productData[0].price * req.body.order_quantity,
    };
    const orderData = await conn
      .promise()
      .query(
        "INSERT INTO orders (user_id, product_id, order_quantity, total_price) VALUES (?, ?, ?, ?)",
        [
          order.user_id,
          order.product_id,
          order.order_quantity,
          order.total_price,
        ]
      );

    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "Order Created Successfully!",
      data: await fetchOrder(orderData[0].insertId),
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

const fetchOrder = async (id) => {
  try {
    const orderId = id;
    const orderData = await conn
      .promise()
      .query(`SELECT * FROM orders WHERE id = ${orderId}`);
    return orderData[0];
  } catch (error) {
    return [];
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrder,
  getOrder,
  deleteOrder,
};

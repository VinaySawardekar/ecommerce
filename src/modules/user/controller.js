const conn = require("../../utility/db");
const { customResponse } = require("../../utility/helper");
const { HTTP_CODES } = require("../../utility/constants");

const getAllUser = async (req, res) => {
  /**
   * #swagger.tags = ["User"]
   */
  try {
    const userData = await conn.promise().query("SELECT * FROM users");
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "User Details fetched Successfully!",
      data: userData[0],
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

const getUser = async (req, res) => {
  /**
   * #swagger.tags = ["User"]
   */
  try {
    const userId = req.params.id;
    const userData = await conn
      .promise()
      .query(`SELECT * FROM users WHERE id = ${userId}`);

    if (userData[0].length === 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "User Not Found!",
        data: {},
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "User Details fetched Successfully!",
      data: userData[0],
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

const updateUser = async (req, res) => {
  /**
   * #swagger.tags = ["User"]
   */
  try {
    const userId = req.params.id;
    const customer = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
    };
    const userData = await conn
      .promise()
      .query(
        "UPDATE users SET name = ?, email = ?,mobile = ?, address = ? WHERE id = ?",
        [
          customer["name"],
          customer["email"],
          customer["mobile"],
          customer["address"],
          userId,
        ]
      );
    if (userData[0].affectedRows == 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "User Updated Failed!",
        data: {},
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const res1 = await fetchUser(userId);
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "User Updated Successfully!",
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

const deleteUser = async (req, res) => {
  /**
   * #swagger.tags = ["User"]
   */
  try {
    const userId = req.params.id;
    const userData = await conn
      .promise()
      .query(`DELETE FROM users WHERE id = ${userId}`);
    if (userData[0].affectedRows == 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "User Not Found!",
        data: {},
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "User Deleted Successfully!",
      data: {},
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

const createUser = async (req, res) => {
  /**
   * #swagger.tags = ["User"]
   */
  try {
    const customer = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      address: req.body.address,
    };
    const userExist = await conn
      .promise()
      .query("SELECT * FROM users WHERE email = " + `'${req.body.email}'`);
    if (userExist[0].length !== 0) {
      const resData = customResponse({
        code: HTTP_CODES.BAD_REQUEST,
        message: "User Creation Failed! Duplicate Email!",
        data: {},
      });
      return res.status(HTTP_CODES.BAD_REQUEST).send(resData);
    }
    const userData = await conn
      .promise()
      .query(
        "INSERT INTO users (name, email, mobile, address) VALUES (?, ?, ?, ?)",
        [customer.name, customer.email, customer.mobile, customer.address]
      );

    const resData = customResponse({
      code: HTTP_CODES.SUCCESS,
      message: "User Created Successfully!",
      data: await fetchUser(userData[0].insertId),
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

const fetchUser = async (id) => {
  try {
    const userId = id;
    const userData = await conn
      .promise()
      .query(`SELECT * FROM users WHERE id = ${userId}`);
    return userData[0];
  } catch (error) {
    return [];
  }
};

module.exports = {
  createUser,
  getAllUser,
  updateUser,
  getUser,
  deleteUser,
};

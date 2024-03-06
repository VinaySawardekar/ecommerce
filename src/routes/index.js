const express = require("express");
const router = express.Router();

const morgan = require("morgan");
const morganTiny = morgan("tiny");

const userRoutes = require("../modules/user/route");
const orderRoutes = require("../modules/order/route");
const productRoutes = require("../modules/product/route");

router.use("/user", morganTiny, userRoutes);
router.use("/product", morganTiny, productRoutes);
router.use("/order", morganTiny, orderRoutes);

module.exports = router;

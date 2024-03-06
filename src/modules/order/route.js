var express = require("express");
var router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrder,
  getOrder,
  deleteOrder,
} = require("./controller");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.put("/:id", updateOrder);
router.get("/:id", getOrder);
router.delete("/:id", deleteOrder);

module.exports = router;

var express = require("express");
var router = express.Router();

const {
  getProduct,
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("./controller");

router.post("/", createProduct);
router.get("/", getAllProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

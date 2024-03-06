var express = require("express");
var router = express.Router();

const {
  createUser,
  getAllUser,
  updateUser,
  getUser,
  deleteUser,
} = require("./controller");

router.post("/", createUser);
router.get("/", getAllUser);
router.put("/:id", updateUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

module.exports = router;

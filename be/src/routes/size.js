const express = require("express");

const SizeController = require("../controllers/SizeController");

let router = express.Router();

router.post("/create", SizeController.create);
router.delete("/delete/:id", SizeController.deleteSize);

router.get("/list", SizeController.list);

module.exports = router;

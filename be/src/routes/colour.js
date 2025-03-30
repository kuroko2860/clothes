const express = require("express");

const ColourController = require("../controllers/ColourController");
const { route } = require("./category");

let router = express.Router();

router.post("/create", ColourController.create);
router.delete("/delete/:id", ColourController.deleteColor);

router.get("/list", ColourController.list);

module.exports = router;

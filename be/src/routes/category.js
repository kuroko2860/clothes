const express = require("express");

const CategoryController = require("../controllers/CategoryController");

let router = express.Router();

router.post("/create-level1", CategoryController.createLevel1);

router.post("/create-level2", CategoryController.createLevel2);

router.delete("/delete-level1/:id", CategoryController.deleteLevel1);
router.delete("/delete-level2/:id", CategoryController.deleteLevel2);

router.get("/nest-list", CategoryController.nestList);

router.get("/list", CategoryController.list);

router.get("/list-level1", CategoryController.listLevel1);

module.exports = router;

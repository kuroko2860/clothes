const express = require("express");
const PaymentController = require("../controllers/PaymentController");

const router = express.Router();

// VNPay routes
router.post("/create-vnpay-payment", PaymentController.createVnpayPayment);
router.get("/vnpay-return", PaymentController.vnpayReturn);

module.exports = router;

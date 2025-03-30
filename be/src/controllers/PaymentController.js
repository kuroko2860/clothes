const paymentService = require("../services/paymentService");
const Order = require("../models/order");
const { v4: uuidv4 } = require("uuid");

class PaymentController {
  // Create VNPay payment URL
  async createVnpayPayment(req, res) {
    try {
      const { orderId, amount, orderInfo } = req.body;

      if (!orderId || !amount || !orderInfo) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const paymentUrl = paymentService.createVnpayPaymentUrl(
        orderId,
        amount,
        orderInfo
      );
      console.log("VNPay payment URL:", paymentUrl);

      return res.status(200).json({ paymentUrl });
    } catch (error) {
      console.error("Error creating VNPay payment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Handle VNPay return
  async vnpayReturn(req, res) {
    try {
      const vnpParams = req.query;

      // Verify payment
      const isValidSignature = paymentService.verifyVnpayReturn(vnpParams);

      if (!isValidSignature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      // Check payment status
      const vnp_ResponseCode = vnpParams.vnp_ResponseCode;
      const orderId = vnpParams.vnp_TxnRef;

      if (vnp_ResponseCode === "00") {
        // Payment successful
        // Update order status in database
        await Order.update(
          { payment_status: "paid", payment_method: "vnpay" },
          { where: { order_id: orderId } }
        );

        return res.status(200).json({
          success: true,
          message: "Payment successful",
          data: vnpParams,
        });
      } else {
        // Payment failed
        return res.status(400).json({
          success: false,
          message: "Payment failed",
          data: vnpParams,
        });
      }
    } catch (error) {
      console.error("Error handling VNPay return:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new PaymentController();

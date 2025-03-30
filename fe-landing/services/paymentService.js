import axiosClient from "@/services/axiosClient";

const paymentService = {
  // Create VNPay payment
  createVnpayPayment: async (orderId, amount, orderInfo) => {
    try {
      const response = await axiosClient.post(`/payment/create-vnpay-payment`, {
        orderId,
        amount,
        orderInfo,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create MOMO payment
  createMomoPayment: async (orderId, amount, orderInfo) => {
    try {
      const response = await axiosClient.post(`/payment/create-momo-payment`, {
        orderId,
        amount,
        orderInfo,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;

const crypto = require("crypto");
const querystring = require("querystring");
const moment = require("moment");

class PaymentService {
  constructor() {
    this.vnpayConfig = {
      vnp_TmnCode: "JSNAX8Z9", // Replace with your VNPay merchant code
      vnp_HashSecret: "KJD3PUKFLUZE14FK81AEYU0SJQGXW66S", // Replace with your VNPay secret key
      vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", // Sandbox URL (use production URL for live)
      vnp_ReturnUrl: "http://localhost:3001/payment/vnpay-return", // Frontend return URL
    };
  }

  // Create VNPay payment URL
  createVnpayPaymentUrl(orderId, amount, orderInfo) {
    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");

    const ipAddr = "127.0.0.1"; // You might want to get the actual IP address
    let vnpUrl = this.vnpayConfig.vnp_Url;
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = this.vnpayConfig.vnp_TmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = this.vnpayConfig.vnp_ReturnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = this.sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", this.vnpayConfig.vnp_HashSecret);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }

  // Verify VNPay return
  verifyVnpayReturn(vnpParams) {
    const secureHash = vnpParams.vnp_SecureHash;

    // Remove secure hash from params
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;

    // Sort params
    const sortedParams = this.sortObject(vnpParams);

    // Create signature
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", this.vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    // Compare signatures
    return secureHash === signed;
  }

  // Helper method to sort object by key
  sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}

module.exports = new PaymentService();

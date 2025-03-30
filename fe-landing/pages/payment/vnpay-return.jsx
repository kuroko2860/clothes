import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Result, Button, Spin } from "antd";
import Link from "next/link";
import axiosClient from "@/services/axiosClient";

const VnpayReturn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const { vnp_ResponseCode, vnp_TxnRef } = router.query;

      setOrderId(vnp_TxnRef);

      if (vnp_ResponseCode === "00") {
        setPaymentStatus("success");
        axiosClient.put(`/order/change-payment-status/${vnp_TxnRef}`, {
          payment_status: "Thành công",
        });
      } else {
        setPaymentStatus("failed");
        axiosClient.put(`/order/change-payment-status/${vnp_TxnRef}`, {
          payment_status: "Thất bại",
        });
      }

      setLoading(false);
    }
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <Spin size="large" />
        <p className="mt-3">Đang xử lý kết quả thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {paymentStatus === "success" ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={`Đơn hàng #${orderId} đã được thanh toán thành công qua VNPay.`}
          extra={[
            <Link href={`/get-order/${orderId}`} key="order-detail">
              <Button type="primary">Xem chi tiết đơn hàng</Button>
            </Link>,
            <Link href="/" key="home">
              <Button>Về trang chủ</Button>
            </Link>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Thanh toán thất bại!"
          subTitle="Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."
          extra={[
            <Link href={`/get-order/${orderId}`} key="order-detail">
              <Button type="primary">Xem chi tiết đơn hàng</Button>
            </Link>,
            <Link href="/" key="home">
              <Button>Về trang chủ</Button>
            </Link>,
          ]}
        />
      )}
    </div>
  );
};

export default VnpayReturn;

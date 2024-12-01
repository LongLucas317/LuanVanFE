import classNames from "classnames/bind";
import style from "./ViewOrderComponent.module.scss";

import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { useRef } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { convertPrice, formatDate } from "~/utils";

const cx = classNames.bind(style);

function ViewOrderComponent(props) {
  const { data, handleCloseViewOrderDetail } = props;

  // DownLoad Đơn hàng ==============================================
  const pdfRef = useRef();

  const handleDownloadPDF = () => {
    const input = pdfRef.current;

    // Sử dụng html2canvas-pro với cấu hình tùy chỉnh nếu cần
    html2canvas(input, { scale: 5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.height;
      const imgWidth = 400; // Width of the image on PDF page
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Dynamic height for each page
      let heightLeft = imgHeight;
      let position = 10;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Đơn hàng_${data.id}.pdf`);
    });
  };

  // ================================================================

  return (
    <div className={cx("viewOreder__block")}>
      <div className={cx("orderDetail__block")}>
        <div className={cx("orderDetail__header")}>
          <h2>Chi tiết đơn hàng: {data?.id}</h2>

          <FontAwesomeIcon
            onClick={handleCloseViewOrderDetail}
            className={cx("close__btn")}
            icon={faXmark}
          />
        </div>

        <div ref={pdfRef} className={cx("order__infor")}>
          <div className={cx("order__status")}>
            <div className={cx("delevery__status")}>
              <h4 className={cx("delivery__header")}>Trạng thái:</h4>
              <p>{data?.isDelivered}</p>
            </div>

            <div className={cx("paypal__method")}>
              <h4 className={cx("paypal__header")}>Phương thức thanh toán:</h4>

              <p style={{ padding: "0px 8px" }}>
                {data?.paymentMethod === "paypal"
                  ? "Thanh toán qua Paypal"
                  : "Thanh toán khi nhận hàng"}
              </p>

              <p
                style={{
                  borderLeft: "1px solid #cccccc",
                  paddingLeft: "8px",
                }}
              >
                {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
              </p>
            </div>
          </div>

          <div className={cx("order__address")}>
            <h3 className={cx("address__header")}>Thông tin vận chuyển:</h3>

            <div className={cx("user__infor")}>
              <div className={cx("user__name")}>
                <h4>Họ tên người nhận:</h4>
                <p>{data?.shippingAddress?.fullName}</p>
              </div>

              <div className={cx("user__phone")}>
                <h4>Số điện thoại:</h4>
                <p>{data?.shippingAddress?.phone}</p>
              </div>

              <div className={cx("user__address")}>
                <h4>Địa chỉ nhận hàng:</h4>
                <p>{data?.shippingAddress?.address}</p>
              </div>
            </div>
          </div>

          <div className={cx("order__details")}>
            <h3>Thông tin sản phẩm</h3>
            <table className={cx("order__table")}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Hình ảnh</th>
                  <th>Màu sắc</th>
                  <th>Phiên bản</th>
                  <th>Số lượng</th>
                  <th>Giá sản phẩm</th>
                  <th>Tổng</th>
                  <th>Ngày đặt hàng</th>
                </tr>
              </thead>
              <tbody>
                {data?.orderItems?.map((item) => {
                  return (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        <img src={item.image} alt={item.name} />
                      </td>
                      <td>{item.color}</td>
                      <td>
                        {item.ram}/{item.storage}
                      </td>
                      <td>{item.amount}</td>
                      <td style={{ color: "#f54040", fontWeight: "550" }}>
                        {item.discount
                          ? convertPrice(
                              item.price * ((100 - item.discount) / 100)
                            )
                          : convertPrice(item.price)}
                      </td>
                      <td style={{ color: "#f54040", fontWeight: "550" }}>
                        {item.discount
                          ? convertPrice(
                              item.price *
                                ((100 - item.discount) / 100) *
                                item.amount
                            )
                          : convertPrice(item.price * item.amount)}
                      </td>
                      <td>{formatDate(data?.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={cx("summary")}>
            <h3>Tóm tắt đơn hàng</h3>

            <h4>
              Quyền lợi hội viên: <p>Giảm {data?.memberDiscount}%</p>
            </h4>

            <h4>
              Tổng giá trị {data?.orderItems?.length} mặt hàng:{" "}
              <p>{convertPrice(data?.itemsPrice)}</p>
            </h4>

            <h4>
              Tổng giá trị đơn hàng: <p>{convertPrice(data?.totalPrice)}</p>
            </h4>
          </div>
        </div>
      </div>

      <div className={cx("btn__wrapper")}>
        <button onClick={handleDownloadPDF} className={cx("download__btn")}>
          Tải xuống Đơn hàng
        </button>
      </div>
    </div>
  );
}

export default ViewOrderComponent;

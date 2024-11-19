import classNames from "classnames/bind";
import styles from "./OrderSuccess.module.scss";

import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

import { convertPrice } from "~/utils";

const cx = classNames.bind(styles);

function OrderSuccess() {
  const location = useLocation();
  const { state } = location;

  console.log("state: ", state);

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

      pdf.save(`Đơn hàng_của_bạn.pdf`);
    });
  };

  // ================================================================

  return (
    <div className={cx("orderSuccess__block")}>
      <div ref={pdfRef} className={cx("orderSuccess__wrapper")}>
        <h2 className={cx("orderSuccess__header")}>Chi tiết hóa đơn</h2>

        <div className={cx("orderSuccess__body")}>
          <div className={cx("order__details")}>
            <h3>Thông tin sản phẩm</h3>
            <table className={cx("order__table")}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Hình ảnh</th>
                  <th>Màu sắc</th>
                  <th>Phiên bản</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {state?.order?.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>{order.name}</td>
                      <td>
                        <img src={order.image} alt={order.name} />
                      </td>
                      <td>{order?.color}</td>
                      <td>
                        {order?.ram} / {order?.storage}
                      </td>
                      <td style={{ color: "red", fontWeight: "550" }}>
                        {order?.discount
                          ? convertPrice(
                              order?.price * ((100 - order?.discount) / 100)
                            )
                          : convertPrice(order?.price)}
                      </td>
                      <td>{order.amount} sản phẩm</td>
                      <td>
                        {order?.discount
                          ? convertPrice(
                              order?.price *
                                ((100 - order?.discount) / 100) *
                                order.amount
                            )
                          : convertPrice(order?.price * order.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className={cx("cart__infor__mobile")}>
              <div className={cx("product__list")}>
                {state?.order?.map((order, index) => {
                  return (
                    <div key={index} className={cx("product__group")}>
                      <div className={cx("product__wrapper")}>
                        <div className={cx("product__img__wrapper")}>
                          <img src={order?.image} alt={order?.name} />
                        </div>

                        <div className={cx("product__infor")}>
                          <h3 className={cx("product__name")}>{order?.name}</h3>

                          <div className={cx("product__version")}>
                            {order?.color}
                            <p style={{ marginTop: "4px" }}>
                              {order?.ram} / {order?.storage}
                            </p>
                          </div>

                          <div className={cx("quatity__section")}>
                            {order?.amount} sản phẩm
                          </div>

                          <p className={cx("product__price")}>
                            {order?.discount === 0
                              ? convertPrice(order?.price * order?.amount)
                              : convertPrice(
                                  order?.price *
                                    ((100 - order?.discount) / 100) *
                                    order?.amount
                                )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={cx("customer__info")}>
            <h3>Thông tin khách hàng</h3>
            <p>
              <strong>Tên:</strong> {state?.user?.name}
            </p>
            <p>
              <strong>Điện thoại:</strong> {state?.user?.phone}
            </p>
            <p>
              <strong>Địa chỉ giao hàng:</strong> {state?.user?.address} -{" "}
              {state?.user?.city}
            </p>
          </div>

          <div className={cx("summary")}>
            <h3>Tóm tắt đơn hàng</h3>

            <h4>
              Quyền lời hội viên: <p>-{state?.memberDiscount}%</p>
            </h4>

            <h4>
              Tổng giá trị {state?.order?.length} mặt hàng:{" "}
              <p>{convertPrice(state?.priceMemo)}</p>
            </h4>

            <h4>
              Tổng giá trị đơn hàng:{" "}
              <p>{convertPrice(state?.totalPriceMemo)}</p>
            </h4>
          </div>
        </div>
      </div>

      <div className={cx("download__btn__wrapper")}>
        <button onClick={handleDownloadPDF} className={cx("download__btn")}>
          Tải xuống Đơn hàng
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;

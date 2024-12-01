import classNames from "classnames/bind";
import styles from "./ViewSoldOutProduct.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function ViewSoldOutProduct(props) {
  const { data, isCloseView } = props;

  console.log("data: ", data);

  return (
    <div className={cx("viewSoldOut__block")}>
      <div className={cx("viewSoldOut__wrapper")}>
        <div className={cx("viewSoldOut__header")}>
          <h2>Sản phẩm sắp hết hàng</h2>

          <FontAwesomeIcon
            onClick={isCloseView}
            className={cx("close__btn")}
            icon={faXmark}
          />
        </div>

        <div className={cx("viewSoldOut__body")}>
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Thương hiệu</th>
                <th>Số lượng</th>
                <th>Màu sắc</th>
                <th>Phiên bản</th>
                <th>Giá trị</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((item) => {
                return item?.options?.map((product) => {
                  if (product.quantity <= 10) {
                    return (
                      <tr>
                        <td>{item.name}</td>
                        <td style={{ width: "150px" }}>
                          <div className={cx("img__wrapper")}>
                            <img src={product.image} alt={item.name} />
                          </div>
                        </td>
                        <td>{item.brand}</td>
                        <td>
                          <p style={{ color: "red", fontWeight: "550" }}>
                            {product.quantity} sản phẩm
                          </p>
                        </td>
                        <td>{product.color}</td>
                        <td>
                          {product.ram}/{product.storage}
                        </td>
                        <td>
                          <p style={{ color: "red" }}>{product.price}</p>
                        </td>
                      </tr>
                    );
                  }
                });
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewSoldOutProduct;

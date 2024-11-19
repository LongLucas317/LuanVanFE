import classNames from "classnames/bind";
import styles from "./OrderComponent.module.scss";

import emptyImg from "~/assets/img/dont_have_order.png";
import productImg from "~/assets/img/ip.webp";

const cx = classNames.bind(styles);

function OrderComponent() {
  return (
    <div className={cx("order")}>
      <h2 className={cx("order__header")}>Tổng giá trị đơn hàng: </h2>

      <div className={cx("order__list")}>
        {/* <div className={cx("order__empty")}>
          <div className={cx("empty__img")}>
            <img src={emptyImg} alt="Empty Image" />
          </div>

          <p className={cx("empty__text")}>Bạn chưa đặt đơn hàng nào</p>
        </div> */}

        <div className={cx("order__group")}>
          <div className={cx("order__wrapper")}>
            <div className={cx("product__img")}>
              <img src={productImg} alt="Product Image" />
            </div>

            <div className={cx("product__infor")}>
              <h4 className={cx("product__name")}>Iphone 15</h4>

              <p className={cx("product__price")}>22.000.000đ</p>
            </div>
          </div>

          <div className={cx("order__wrapper")}>
            <div className={cx("product__img")}>
              <img src={productImg} alt="Product Image" />
            </div>

            <div className={cx("product__infor")}>
              <h4 className={cx("product__name")}>Iphone 15</h4>

              <p className={cx("product__price")}>22.000.000đ</p>
            </div>
          </div>

          <div className={cx("product__action")}>
            <button className={cx("action__btn")}>Hủy đơn hàng</button>
            <button className={cx("action__btn")}>Chi tiết đơn hàng</button>
          </div>
        </div>

        <div className={cx("order__group")}>
          <div className={cx("order__wrapper")}>
            <div className={cx("product__img")}>
              <img src={productImg} alt="Product Image" />
            </div>

            <div className={cx("product__infor")}>
              <h4 className={cx("product__name")}>Iphone 15</h4>

              <p className={cx("product__price")}>22.000.000đ</p>
            </div>
          </div>

          {/* <div className={cx("order__wrapper")}>
            <div className={cx("product__img")}>
              <img src={productImg} alt="Product Image" />
            </div>

            <div className={cx("product__infor")}>
              <h4 className={cx("product__name")}>Iphone 15</h4>

              <p className={cx("product__price")}>22.000.000đ</p>
            </div>
          </div> */}

          <div className={cx("product__action")}>
            <button className={cx("action__btn")}>Hủy đơn hàng</button>
            <button className={cx("action__btn")}>Chi tiết đơn hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderComponent;

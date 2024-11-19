import classNames from "classnames/bind";
import styles from "./CardProduct.module.scss";

import saleImg from "~/assets/img/sale__img.png";

import { useNavigate } from "react-router-dom";
import { convertPrice } from "~/utils";

const cx = classNames.bind(styles);

function CardProduct(props) {
  const navigate = useNavigate();
  const {
    countInStock,
    description,
    image,
    name,
    price,
    brand,
    discount,
    selled,
    id,
  } = props;

  const handleNavigateDetailProduct = (id) => {
    navigate(`/product-detail/${id}`);
  };

  return (
    <div
      onClick={() => handleNavigateDetailProduct(id)}
      className={cx("cardProduct__wrapper")}
    >
      <div className={cx("product__img")}>
        <img src={image} alt={name} />
      </div>

      <div className={cx("product__infor")}>
        <h4 className={cx("product__name")}>{name}</h4>

        <div className={cx("product__price")}>
          <p className={cx("product__show")}>
            {discount !== 0
              ? convertPrice(price * ((100 - discount) / 100))
              : convertPrice(price)}
          </p>
          <p
            style={discount !== 0 ? { display: "block" } : { display: "none" }}
            className={cx("product__through")}
          >
            {convertPrice(price)}
          </p>
        </div>

        <p className={cx("product__des")}>Đã bán {selled || 0} sản phẩm</p>
      </div>

      <div
        style={discount !== 0 ? { display: "block" } : { display: "none" }}
        className={cx("sale__img")}
      >
        <img src={saleImg} alt="Sale" />
        <p className={cx("sale__text")}>Giảm {discount}%</p>
      </div>
    </div>
  );
}

export default CardProduct;

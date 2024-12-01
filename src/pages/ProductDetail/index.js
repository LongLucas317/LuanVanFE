import classNames from "classnames/bind";
import styles from "./ProductDetail.module.scss";

import ProductDetailComponent from "~/component/ProductDetailComponent";
import { useParams } from "react-router-dom";

const cx = classNames.bind(styles);

function ProductDetail() {
  const { id } = useParams();

  return (
    <div className={cx("product__infor")}>
      <ProductDetailComponent idProduct={id} />
    </div>
  );
}

export default ProductDetail;

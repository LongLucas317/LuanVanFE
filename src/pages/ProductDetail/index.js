import classNames from "classnames/bind";
import styles from "./ProductDetail.module.scss";

// import CardProduct from "~/components/CardProduct";
import ProductDetailComponent from "~/component/ProductDetailComponent";
import { useParams } from "react-router-dom";

const cx = classNames.bind(styles);

function ProductDetail() {
  const { id } = useParams();
  // const navigate, = useNavigate();

  // const handleAddToCart = () => {
  //   navigate("/cart");
  // };
  // onClick = { handleAddToCart };

  return (
    <div className={cx("product__infor")}>
      <ProductDetailComponent idProduct={id} />

      {/* <div className={cx("comment__section")}>
        <h3 className={cx("comment__header")}>Khách hàng đánh giá</h3>
      </div> */}

      {/* <div className={cx("same__product")}>
        <h3 className={cx("sameProduct__name")}>Sản phẩm tương tự</h3>
        <div className={cx("sameProduct__infor")}>
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
        </div>
      </div> */}
    </div>
  );
}

export default ProductDetail;

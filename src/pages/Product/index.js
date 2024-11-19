import classNames from "classnames/bind";
import styles from "./Product.module.scss";

import {
  faChevronDown,
  faArrowDownShortWide,
  faArrowDownWideShort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import CardProduct from "~/component/CardProduct";
import * as ProductService from "~/services/ProductService";

const cx = classNames.bind(styles);

function Product() {
  const { state } = useLocation();
  let productsCount = 0;
  const [limit, setLimit] = useState(2);
  const [products, setProducts] = useState([]);
  const [productBeforeHandle, setProductsBeforeHandle] = useState([]);
  const [isMaxProducts, setIsMaxProducts] = useState(false);

  const fetchAllProducts = async () => {
    const res = await ProductService.getAllProduct();

    productsCount = res?.data?.filter(
      (product) => product.brand === state
    ).length;

    if (productsCount > limit) {
      setIsMaxProducts(true);
    } else {
      setIsMaxProducts(false);
    }
  };

  const fetchProductBrand = async (
    brand,
    limit,
    asc = false,
    desc = false,
    filterSale = false
  ) => {
    const res = await ProductService.getProductBrand(brand, limit);

    if (res?.status == "OK") {
      setProductsBeforeHandle(res?.data);

      if (asc) {
        setProducts(
          productBeforeHandle.sort((sp1, sp2) => sp2.price - sp1.price)
        );
      } else if (desc) {
        setProducts(
          productBeforeHandle.sort((sp1, sp2) => sp1.price - sp2.price)
        );
      } else if (filterSale) {
        setProducts(
          productBeforeHandle.filter((product) => product.discount !== 0)
        );
      } else {
        setProducts(res?.data);
      }
    } else {
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchProductBrand(state, limit);
  }, [state, limit]);

  const handleLoadMoreProduct = () => {
    setLimit(limit + 4);
  };

  const handleSortASC = () => {
    fetchProductBrand(state, limit, true);
  };

  const handleSortDESC = () => {
    fetchProductBrand(state, limit, false, true);
  };

  const handleFilterProductSale = () => {
    fetchProductBrand(state, limit, false, false, true);
  };

  return (
    <div className={cx("product__section")}>
      <div className={cx("filter__wrapper")}>
        <h4 className={cx("filter__header")}>Sắp xếp</h4>

        <div className={cx("filter__list")}>
          <div onClick={handleSortASC} className={cx("filter__group")}>
            <FontAwesomeIcon icon={faArrowDownWideShort} />
            <p className={cx("filter__text")}>Giá Cao - Thấp</p>
          </div>

          <div onClick={handleSortDESC} className={cx("filter__group")}>
            <FontAwesomeIcon icon={faArrowDownShortWide} />
            <p className={cx("filter__text")}>Giá Thấp - Cao</p>
          </div>

          <div
            onClick={handleFilterProductSale}
            className={cx("filter__group")}
          >
            <div style={{ display: "flex" }}>
              <svg
                width="14px"
                height="14px"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5 2.5 2.5 9.5"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 5a1.5 1.5 0 1 0 0 -3 1.5 1.5 0 0 0 0 3"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 10a1.5 1.5 0 1 0 0 -3 1.5 1.5 0 0 0 0 3"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className={cx("filter__text")}>Đang khuyến mãi</p>
          </div>
        </div>
      </div>

      <div className={cx("product__list")}>
        {products?.map((product) => {
          return (
            <CardProduct
              key={product._id}
              id={product._id}
              countInStock={product.countInStock}
              description={product.description}
              image={product.image}
              name={product.name}
              price={product.price}
              type={product.type}
              discount={product.discount}
            />
          );
        })}
      </div>

      {isMaxProducts && (
        <div onClick={handleLoadMoreProduct} className={cx("showmore__btn")}>
          <button className={cx("showmore__product__btn")}>Xem thêm</button>
          <FontAwesomeIcon className={cx("arrow__icon")} icon={faChevronDown} />
        </div>
      )}
    </div>
  );
}

export default Product;

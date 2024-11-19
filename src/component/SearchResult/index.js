import classNames from "classnames/bind";
import styles from "./SearchResult.module.scss";

import { useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";
import { useDebounceHook } from "~/hooks/useDebounceHook";
import * as ProductService from "~/services/ProductService";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function SearchResult({ handleCloseSearchResult }) {
  const navigate = useNavigate();
  const searchProductValue = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounceHook(searchProductValue, 1000);
  const searchRef = useRef();
  const [stateProduct, setStateProduct] = useState([]);

  const fetchProductAll = async (search) => {
    const res = await ProductService.getAllProduct(search);

    setStateProduct(res?.data);
  };

  useEffect(() => {
    if (searchRef.current) {
      fetchProductAll(searchDebounce);
    }
    searchRef.current = true;
  }, [searchDebounce]);

  const handleNavigateDetailProduct = (id) => {
    navigate(`/product-detail/${id}`);
    handleCloseSearchResult();
  };

  return (
    <div className={cx("search__result")}>
      {stateProduct?.length > 0 ? (
        <h4 className={cx("searcheResult__header")}>
          Đã tìm thấy {stateProduct.length} sản phẩm
        </h4>
      ) : (
        <h4 className={cx("no__searchData")}>
          Không tìm thấy sản phẩm tương tự
        </h4>
      )}

      <div
        style={
          stateProduct?.length > 0
            ? { display: "block", height: "230px", overflowY: "scroll" }
            : { display: "none" }
        }
        className={cx("search__list")}
      >
        {stateProduct?.map((product) => {
          return (
            <div
              onClick={() => handleNavigateDetailProduct(product._id)}
              key={product._id}
              className={cx("search__group")}
            >
              <div className={cx("result__img")}>
                <img src={product.image} alt={product.name} />
              </div>

              <div className={cx("result__infor")}>
                <h3 className={cx("result__header")}>{product.name}</h3>

                <div className={cx("result__price")}>
                  <p className={cx("result__show")}>
                    {product.discount !== 0
                      ? product.price * ((100 - product.discount) / 100)
                      : product.price}
                    đ
                  </p>

                  <p
                    style={
                      product.discount !== 0
                        ? { display: "block" }
                        : { display: "none" }
                    }
                    className={cx("result__through")}
                  >
                    {product.price}đ
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchResult;

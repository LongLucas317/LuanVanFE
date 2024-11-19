import classNames from "classnames/bind";
import styles from "./ProductDetailComponent.module.scss";

import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addOrderProduct } from "~/redux/slides/orderSlide";
import { convertPrice } from "~/utils";
import CardProduct from "../CardProduct";

import * as ProductService from "~/services/ProductService";
import * as message from "~/component/Message";
import ProductConfig from "../ProductConfig";

const cx = classNames.bind(styles);

function ProductDetailComponent({ idProduct }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.order);

  const [numProduct, setNumProduct] = useState(1);
  const [similarProduct, setSimilarProducts] = useState([]);

  const onChangeQuatity = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { data: productDetail } = useQuery({
    queryKey: ["product-detail", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });

  const [optionChoosen, setOptionChoosen] = useState({});

  const [viewThumnail, setViewThumnail] = useState("");

  useEffect(() => {
    setOptionChoosen(productDetail?.options[0]);
    setViewThumnail(productDetail?.options[0]?.image);
  }, [productDetail]);

  const handleOnChangeOption = (index) => {
    setViewThumnail(productDetail?.options[index]?.image);
    setOptionChoosen(productDetail?.options[index]);
    if (numProduct > productDetail?.options[index]?.quantity) {
      setNumProduct(productDetail?.options[index]?.quantity);
    }
  };

  const mergeSubImage = () => {
    return [productDetail.image, ...productDetail.images];
  };

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct();

    return res;
  };

  const { isLoading, data: products } = useQuery({
    queryKey: ["product"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    const similar = products?.data?.filter((product) => {
      return (
        product.brand === productDetail?.brand &&
        product.name !== productDetail?.name
      );
    });

    setSimilarProducts(similar);
  }, [isLoading]);

  //Add to Cart ===============================================
  const location = useLocation();

  const handleAddToCart = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
      return;
    }

    let itemExists = false;

    if (orders?.orderItems?.length !== 0) {
      orders?.orderItems.forEach((order) => {
        const isSameProductAndOption =
          order.name === productDetail?.name &&
          order.color === optionChoosen?.color &&
          order.ram === optionChoosen?.ram &&
          order.storage === optionChoosen?.storage;

        const isDifferentOption =
          order.name === productDetail?.name &&
          (order.color !== optionChoosen?.color ||
            order.ram !== optionChoosen?.ram ||
            order.storage !== optionChoosen?.storage);

        if (isSameProductAndOption) {
          if (order.amount + numProduct <= optionChoosen?.quantity) {
            dispatch(
              addOrderProduct({
                orderItem: {
                  ...order,
                  amount: order.amount + numProduct,
                },
              })
            );
            message.success("Thêm sản phẩm thành công");
          } else {
            message.error(
              "Số lượng sản phẩm đã chọn lớn hơn số lượng sản phẩm trong kho"
            );
          }
          itemExists = true;
        } else if (isDifferentOption && !itemExists) {
          dispatch(
            addOrderProduct({
              orderItem: {
                name: productDetail?.name,
                amount: numProduct,
                image: optionChoosen?.image,
                price: optionChoosen?.price,
                product: productDetail?._id,
                discount: productDetail?.discount,
                optionId: optionChoosen?.id,
                color: optionChoosen?.color,
                ram: optionChoosen?.ram,
                storage: optionChoosen?.storage,
                countInStock: optionChoosen?.quantity,
              },
            })
          );
          message.success("Thêm sản phẩm thành công");
          itemExists = true;
        }
      });
    }

    if (!itemExists) {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetail?.name,
            amount: numProduct,
            image: optionChoosen?.image,
            price: optionChoosen?.price,
            product: productDetail?._id,
            discount: productDetail?.discount,
            optionId: optionChoosen?.id,
            color: optionChoosen?.color,
            ram: optionChoosen?.ram,
            storage: optionChoosen?.storage,
            countInStock: optionChoosen?.quantity,
          },
        })
      );
      message.success("Thêm sản phẩm thành công");
    }
  };

  // ==========================================================

  // Open Config Moadal========================================
  const [isOpenConfigModal, setIsOpenConfigModal] = useState(false);

  const handleOpenConfigModal = () => {
    setIsOpenConfigModal(true);
  };

  const handleCloseConfigModal = () => {
    setIsOpenConfigModal(false);
  };

  // ==========================================================

  return (
    <div className={cx("productDetail__block")}>
      <div className={cx("productDetail__wrapper")}>
        <h2 className={cx("product__name")}>{productDetail?.name}</h2>

        <div className={cx("productDetail__section")}>
          <div className={cx("images__section")}>
            <div className={cx("img__center__wrapper")}>
              <img
                src={viewThumnail ? viewThumnail : productDetail?.image}
                className={cx("image__center")}
                alt={productDetail?.name}
              />
            </div>

            <div className={cx("sub__image")}>
              {!!productDetail?.images?.length &&
                mergeSubImage()?.map((image, index) => {
                  return (
                    <div
                      onClick={() => setViewThumnail(image)}
                      key={index}
                      className={
                        viewThumnail === image
                          ? cx("sub__img__wrapper", "checked")
                          : cx("sub__img__wrapper")
                      }
                    >
                      <img
                        src={image}
                        className={cx("image__small")}
                        alt={productDetail?.name}
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          <div className={cx("product__detail")}>
            <div className={cx("option__section")}>
              <h4 className={cx("option__header")}>Lựa chọn phiên bản </h4>

              <div className={cx("option__list")}>
                {productDetail?.options?.map((option, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => handleOnChangeOption(index)}
                      className={
                        optionChoosen?.id === option?.id
                          ? cx("option__group", "active")
                          : cx("option__group")
                      }
                    >
                      <div className={cx("option__img")}>
                        <img src={option?.image} alt={productDetail?.name} />
                      </div>

                      <div className={cx("option__infor")}>
                        <p className={cx("option__name")}>
                          {option?.ram} / {option?.storage}
                        </p>

                        <p className={cx("option__price")}>
                          {convertPrice(option?.price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={cx("price__section")}>
              <p className={cx("product__show")}>
                {productDetail?.discount !== 0
                  ? convertPrice(
                      optionChoosen?.price *
                        ((100 - productDetail?.discount) / 100)
                    )
                  : convertPrice(optionChoosen?.price)}
              </p>

              <p
                style={
                  productDetail?.discount !== 0
                    ? { display: "block" }
                    : { display: "none" }
                }
                className={cx("product__through")}
              >
                {convertPrice(productDetail?.price)}
              </p>
            </div>

            <span className={cx("product__quatityInStock")}>
              Hiện có {optionChoosen?.quantity} sản phẩm
            </span>

            <div className={cx("quatity__section")}>
              <div className={cx("quatity__text")}>Số lượng</div>
              <div className={cx("quatity__content")}>
                <button
                  onClick={() =>
                    handleChangeCount("decrease", numProduct === 1)
                  }
                  className={cx("plus__btn")}
                >
                  <FontAwesomeIcon
                    className={cx("plus__icon")}
                    icon={faMinus}
                  />
                </button>
                <input
                  className={cx("quatity__input")}
                  value={numProduct}
                  onChange={onChangeQuatity}
                  type="number"
                />
                <button
                  onClick={() =>
                    handleChangeCount(
                      "increase",
                      numProduct === optionChoosen?.quantity
                    )
                  }
                  className={cx("minus__btn")}
                >
                  <FontAwesomeIcon
                    className={cx("minus__icon")}
                    icon={faPlus}
                  />
                </button>
              </div>
            </div>

            <div className={cx("add__to_cart")}>
              <button onClick={handleAddToCart} className={cx("cart__btn")}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={cx("similar")}>
        <h2 className={cx("similar__header")}>Sản phẩm tương tự</h2>

        <div className={cx("similar__product")}>
          {similarProduct?.map((product) => {
            return (
              <CardProduct
                key={product._id}
                id={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                type={product.brand}
                discount={product.discount}
                selled={product.selled}
              />
            );
          })}
        </div>
      </div>

      <div className={cx("productDetail__infor")}>
        <div className={cx("comment")}>Comment</div>

        <div className={cx("configuration")}>
          <h2 className={cx("config__header")}>Cấu hình thiết bị</h2>

          <ul className={cx("config__list")}>
            <li>
              <p className={cx("config__des")}>Kích thước màn hình:</p>
              <div className={cx("config__infor")}>
                <p>{productDetail?.specifications?.screen?.size}</p>
              </div>
            </li>

            <li className={cx("even__li")}>
              <p className={cx("config__des")}>Công nghệ màn hình:</p>
              <div className={cx("config__infor")}>
                <p>{productDetail?.specifications?.screen?.technology}</p>
              </div>
            </li>

            <li>
              <p className={cx("config__des")}>Độ phân giải màn hình:</p>
              <div className={cx("config__infor")}>
                <p>{productDetail?.specifications?.screen?.resolution}</p>
              </div>
            </li>

            <li className={cx("even__li")}>
              <p className={cx("config__des")}>Tần số quét màn hình:</p>
              <div className={cx("config__infor")}>
                <p>{productDetail?.specifications?.screen?.pwm}</p>
              </div>
            </li>

            <li>
              <p className={cx("config__des")}>Camera sau:</p>
              <div className={cx("config__infor")}>
                <p>
                  Camera chính:{" "}
                  {productDetail?.specifications?.camera?.rear?.main},
                </p>

                <p>
                  Camera góc siêu rộng:{" "}
                  {productDetail?.specifications?.camera?.rear?.ultraWide}{" "}
                </p>
              </div>
            </li>

            <li className={cx("even__li")}>
              <p className={cx("config__des")}>Camera trước:</p>
              <div className={cx("config__infor")}>
                <p>
                  Độ phân giải:{" "}
                  {productDetail?.specifications?.camera?.front?.resolution}
                </p>
              </div>
            </li>

            <li>
              <p className={cx("config__des")}>Chipset:</p>
              <div className={cx("config__infor")}>
                <p>{productDetail?.specifications?.processor?.chipset}</p>
              </div>
            </li>

            <li className={cx("even__li")}>
              <p className={cx("config__des")}>Công nghệ NFC:</p>
              <div className={cx("config__infor")}>
                <p>
                  {productDetail?.specifications?.connectivity?.nfc
                    ? "Có"
                    : "Không có"}
                </p>
              </div>
            </li>

            <li>
              <p className={cx("config__des")}>Hệ điều hành:</p>
              <div className={cx("config__infor")}>
                <p>IOS 18</p>
              </div>
            </li>
          </ul>

          <button
            onClick={handleOpenConfigModal}
            className={cx("config__detail__btn")}
          >
            Xem chi tiết cấu hình
            <svg
              width="20px"
              height="14px"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h48v48H0z" fill="none" />
              <g id="Shopicon">
                <polygon points="24,29.172 9.414,14.586 6.586,17.414 24,34.828 41.414,17.414 38.586,14.586 	" />
              </g>
            </svg>
          </button>
        </div>
      </div>

      {isOpenConfigModal && (
        <ProductConfig
          data={productDetail?.specifications}
          handleCloseConfigModal={handleCloseConfigModal}
        />
      )}
    </div>
  );
}

export default ProductDetailComponent;

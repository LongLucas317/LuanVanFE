import classNames from "classnames/bind";
import styles from "./Home.module.scss";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getBase64 } from "~/utils";
import CardProduct from "~/component/CardProduct";
import SliderComponent from "~/component/SliderComponent";
import * as ProductService from "~/services/ProductService";
import * as SliderService from "~/services/SliderService";
import * as message from "~/component/Message";
import Loading from "~/component/LoadingComponent";
import { useMutationHook } from "~/hooks/useMutationHook";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

function Home() {
  const user = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [saleProduct, setSaleProduct] = useState([]);
  const [maxEndTime, setMaxEndTime] = useState([]);

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct();

    return res;
  };

  const { data: products } = useQuery({
    queryKey: ["product"],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
  });

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllBrandProduct();

    setCategories(res?.data);
  };

  useEffect(() => {
    setDataProduct(() => {
      return products?.data?.filter((product) => product.isPublic);
    });

    setSaleProduct(() => {
      return products?.data?.filter((product) => product.isSale);
    });
    // =============================================================================

    const sortedByEndTime = products?.data
      ?.filter((product) => product.isSale)
      ?.sort(
        (a, b) => new Date(b.discountEndTime) - new Date(a.discountEndTime)
      );

    const endTime = sortedByEndTime?.filter((time, i) => {
      if (i === 0) return time.discountEndTime;
    });

    setMaxEndTime(endTime?.map((min) => min.discountEndTime));
  }, [products]);

  // Get Slider Image ===============================================
  const [formCreate] = Form.useForm();

  const fetchSliderImage = async () => {
    const res = await SliderService.getAllSliderImage();

    return res;
  };

  const querySlider = useQuery({
    queryKey: ["slider"],
    queryFn: fetchSliderImage,
  });

  const { data: sliderImg } = querySlider;

  // ================================================================

  // Create Slider Image ============================================
  const [isOpenCreateSlider, setIsOpenCreateSlider] = useState(false);
  const [sliderImage, setSliderImage] = useState({ url: [] });

  const handleOpenCreateSliderModal = () => {
    setIsOpenCreateSlider(true);
  };

  const handleCloseCreateSliderModal = () => {
    setIsOpenCreateSlider(false);
    setSliderImage({
      url: "",
    });
    formCreate.resetFields();
  };

  const handleAddImageSlider = async (e) => {
    const files = Array.from(e.target.files);

    const imageBase64List = await Promise.all(
      files.map((file) => getBase64(file))
    );

    setSliderImage((prevState) => ({
      ...prevState,
      url: [...prevState.url, ...imageBase64List],
    }));
  };

  const handleRemoveImageSlider = (index) => {
    setSliderImage((prevState) => ({
      ...prevState,
      url: prevState.url.filter((_, i) => i !== index),
    }));
  };

  const mutation = useMutationHook((data) => {
    const res = SliderService.createSliderImage(data);
    return res;
  });

  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Thêm Hình ảnh Thành công");
      handleCloseCreateSliderModal();
      window.location.reload();
    } else if (isError) {
      message.error("Thêm Hình ảnh Thất bại");
    }
  }, [isSuccess]);

  const onCreateSliderImage = () => {
    mutation.mutate(
      {
        url: sliderImage.url,
      },
      {
        onSettled: () => {
          querySlider.refetch();
        },
      }
    );
  };

  const [isShowSlider, setIsShowSlider] = useState(true);

  const handleCheckSliderLength = () => {
    sliderImg?.map((image) => {
      image.url.length === 0 ? setIsShowSlider(false) : setIsShowSlider(true);
    });
  };
  // ================================================================

  // Countdown ======================================================

  const timeEnd = new Date(maxEndTime?.map((time) => time));

  const endSale = timeEnd.getTime();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endSale));

  // Hàm tính toán thời gian còn lại
  function calculateTimeLeft(endTime) {
    const now = new Date().getTime();
    const difference = endTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endSale));
    }, 1000);

    // Dọn dẹp timer khi component unmount
    return () => clearInterval(timer);
  }, [endSale]);

  // ================================================================

  useEffect(() => {
    fetchAllTypeProduct();
    handleCheckSliderLength();
  }, []);

  return (
    <div className={cx("home__wrapper")}>
      {(isShowSlider || user.isAdmin) && (
        <div className={cx("slider__block")}>
          <SliderComponent
            data={sliderImg}
            openCreateSlider={handleOpenCreateSliderModal}
            querySlider={querySlider}
          />
        </div>
      )}

      {isOpenCreateSlider && (
        <div className={cx("form__slider")}>
          <div className={cx("form__slider__block")}>
            <div className={cx("form__slider__wrapper")}>
              <div className={cx("sliderForm__header")}>
                <h2>Thêm mới Banner</h2>

                <FontAwesomeIcon
                  onClick={handleCloseCreateSliderModal}
                  className={cx("close__btn")}
                  icon={faXmark}
                />
              </div>

              <Form
                className={cx("form__section")}
                name="create"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 32 }}
                onFinish={onCreateSliderImage}
                autoComplete="off"
                form={formCreate}
              >
                <div className={cx("slider__img")}>
                  {sliderImage?.url?.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                      className={cx("slider__img__group")}
                    >
                      <img
                        src={image}
                        alt={`Slider Image ${index}`}
                        style={{
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                      <DeleteOutlined
                        onClick={() => handleRemoveImageSlider(index)}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          cursor: "pointer",
                          color: "red",
                          fontSize: "18px",
                          padding: "5px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  ))}

                  <div className={cx("sliderImgUpload__btn")}>
                    <label
                      htmlFor="sliderImgOptions"
                      className={cx("upload__btn")}
                    >
                      <svg
                        fill="#000000"
                        width="35px"
                        height="35px"
                        viewBox="0 0 24 24"
                        id="plus"
                        data-name="Line Color"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon line-color"
                      >
                        <path
                          id="primary"
                          d="M5,12H19M12,5V19"
                          style={{
                            fill: "none",
                            stroke: "rgb(0, 0, 0)",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2px",
                          }}
                        ></path>
                      </svg>
                      Thêm ảnh
                    </label>
                  </div>

                  <input
                    id="sliderImgOptions"
                    type="file"
                    multiple
                    onChange={handleAddImageSlider}
                    style={{ display: "none" }}
                  />
                </div>

                <Form.Item className={cx("sliderForm__footer")}>
                  <button type="submit">Tạo mới</button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )}

      {saleProduct?.length !== 0 && (
        <div className={cx("flash__sale")}>
          <div className={cx("flash__header")}>
            <h2 className={cx("flash__text")}>Flash Sale</h2>

            <div className={cx("countdown__section")}>
              <div className={cx("countdown")}>
                <span>
                  {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
                </span>
              </div>
              <span>Ngày</span>

              <div className={cx("countdown")}>
                <span>
                  {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
                </span>
              </div>
              <span>Giờ</span>

              <div className={cx("countdown")}>
                <span>
                  {timeLeft.minutes < 10
                    ? `0${timeLeft.minutes}`
                    : timeLeft.minutes}
                </span>
              </div>
              <span>Phút</span>

              <div className={cx("countdown")}>
                <span>
                  {timeLeft.seconds < 10
                    ? `0${timeLeft.seconds}`
                    : timeLeft.seconds}
                </span>
              </div>
              <span>Giây</span>
            </div>
          </div>

          <div className={cx("product__body", "sale__product")}>
            {saleProduct?.map((data) => {
              return (
                <CardProduct
                  key={data._id}
                  id={data._id}
                  countInStock={data.countInStock}
                  description={data.description}
                  image={data.image}
                  name={data.name}
                  price={data.price}
                  type={data.brand}
                  discount={data.discount}
                  selled={data.selled}
                />
              );
            })}
          </div>
        </div>
      )}

      {categories?.map((productBrand, index) => {
        let brand = dataProduct?.filter(
          (product) => product.brand === productBrand
        );

        return (
          <div
            key={index}
            style={
              brand?.length !== 0 ? { display: "block" } : { display: "none" }
            }
            className={cx("product__section")}
          >
            <h2 className={cx("product__header")}>
              Sản phẩm từ {productBrand}
            </h2>

            <div className={cx("product__body")}>
              {brand?.map((data) => {
                return (
                  <CardProduct
                    key={data._id}
                    id={data._id}
                    countInStock={data.countInStock}
                    description={data.description}
                    image={data.image}
                    name={data.name}
                    price={data.price}
                    type={data.brand}
                    discount={data.discount}
                    selled={data.selled}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;

import classNames from "classnames/bind";
import style from "./ViewProductComponent.module.scss";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { convertPrice, formatDate } from "~/utils";
import { useEffect, useState } from "react";

const cx = classNames.bind(style);

function ViewproductDetail(props) {
  const { data, handleCloseViewProductDetail } = props;
  const [thumnailSrc, setThumnailSrc] = useState("");

  useEffect(() => {
    setThumnailSrc(data?.image);
  }, [data?.image]);

  const handleChangeImage = (src) => {
    setThumnailSrc(src);
  };

  return (
    <div className={cx("viewProduct__block")}>
      <div className={cx("viewProduct__wrapper")}>
        <div className={cx("viewProduct__header")}>
          <h2>{data?.name}</h2>

          <FontAwesomeIcon
            onClick={handleCloseViewProductDetail}
            className={cx("close__btn")}
            icon={faXmark}
          />
        </div>

        <div className={cx("infor__wrapper")}>
          <div className={cx("viewProduct__section")}>
            <div className={cx("product__image")}>
              <div className={cx("product__thumnail")}>
                {data?.image && (
                  <div className={cx("thumnail__wrapper")}>
                    <img src={thumnailSrc} alt={data?.name} />
                  </div>
                )}
              </div>

              <div className={cx("product__img")}>
                {data?.images?.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      marginRight: "10px",
                      marginBottom: "10px",
                    }}
                    className={cx("product__img__group")}
                    onClick={() => handleChangeImage(image)}
                  >
                    <img
                      src={image}
                      alt={data?.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={cx("product__infor")}>
              <div className={cx("form__left")}>
                <div className={cx("form__group")}>
                  <label className={cx("form__label")}>Thương hiệu:</label>

                  <h4 className={cx("form__data")}>{data?.brand}</h4>
                </div>

                <div className={cx("form__group")}>
                  <label className={cx("form__label")}>Hệ điều hành:</label>

                  <h4 className={cx("form__data")}>{data?.operatingSystem}</h4>
                </div>

                <div className={cx("form__group")}>
                  <label className={cx("form__label")}>
                    Thời gian bắt đầu giảm giá:
                  </label>

                  <h4 className={cx("form__data")}>
                    {data?.timeStartDiscount}{" "}
                    {formatDate(data?.discountStartTime)}
                  </h4>
                </div>
              </div>

              <div className={cx("form__right")}>
                <div className={cx("form__group")}>
                  <label className={cx("form__label")}>
                    Trạng thái sản phẩm:
                  </label>

                  <h4 className={cx("form__data")}>
                    {data?.isPublic ? "Công khai" : "Không công khai"}
                  </h4>
                </div>

                <div className={cx("form__group")}>
                  <label className={cx("form__label")}>
                    Tổng số lượng của tất cả phiên bản:
                  </label>
                  <h4 className={cx("form__data")}>{data?.countInStock}</h4>
                </div>

                <div className={cx("form__group")}>
                  <label className={cx("form__label")}>Giảm giá(Nếu có):</label>

                  <h4 className={cx("form__data")}>{data?.discountAmount}%</h4>
                </div>

                <div className={cx("form__group")}>
                  <label className={cx("form__label")}>
                    Thời gian kết thúc giảm giá:
                  </label>

                  <h4 className={cx("form__data")}>
                    {data?.timeEndDiscount} {formatDate(data?.discountEndTime)}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className={cx("specifications__section")}>
            <div className={cx("specification__side")}>
              <h3 className={cx("specification__header")}>
                Thông tin cấu hình*:
              </h3>

              <div className={cx("form__item")}>
                <div className={cx("form__left")}>
                  <h4 className={cx("form__data")}>Màn hình:</h4>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Kích thước(inches):
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.screen?.size}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Công nghệ:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.screen?.technology}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Độ phân giải(pixels):
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.screen?.resolution}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Tần số quét(Hz):
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.screen?.pwm}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Tính năng:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.screen?.features}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Thiết kế:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.screen?.design}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className={cx("form__right")}>
                  <h4 className={cx("form__data")}>Camera:</h4>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Camera sau:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.camera?.rear?.main}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Camera gốc rộng:
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.camera?.rear?.ultraWide}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Chất lượng video:
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.camera?.rear?.video}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Tính năng Cam sau:
                      </label>

                      <div className={cx("features__list")}>
                        {data?.specifications?.camera?.rear?.features?.map(
                          (feature, index) => {
                            return (
                              <h4 key={index} className={cx("feature__group")}>
                                {feature}
                              </h4>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Camera trước:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.camera?.front?.resolution}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Tính năng Camera trước:
                      </label>

                      <div className={cx("features__list")}>
                        {data?.specifications?.camera?.front?.features?.map(
                          (feature, index) => {
                            return (
                              <h4 key={index} className={cx("feature__group")}>
                                {feature}
                              </h4>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================== */}

              <div className={cx("form__item")}>
                <div className={cx("form__left")}>
                  <h4 className={cx("form__data")}>Vi xử lý & đồ họa:</h4>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Chipset:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.processor?.chipset}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>CPU:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.processor?.cpu}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>GPU:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.processor?.gpu}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className={cx("form__right")}>
                  <h4 className={cx("form__data")}>Giao tiếp & kết nối:</h4>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Công nghệ NFC:
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.connectivity?.nfc
                          ? "Có"
                          : "Không"}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Thẻ Sim:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.connectivity?.sim}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Hỗ trợ mạng:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.connectivity?.network}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Bluetooth:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.connectivity?.bluetooth}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================== */}

              <div className={cx("form__item")}>
                <div className={cx("form__left")}>
                  <h4 className={cx("form__data")}>RAM & Lưu trữ:</h4>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Dung lượng RAM(GB):
                      </label>

                      <div className={cx("options__list")}>
                        {data?.specifications?.memory?.ram?.map(
                          (ram, index) => {
                            return (
                              <h4 key={index} className={cx("option__group")}>
                                {ram}
                              </h4>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Bộ nhớ trong(GB):
                      </label>

                      <div className={cx("options__list")}>
                        {data?.specifications?.memory?.storage?.map(
                          (storage, index) => {
                            return (
                              <h4 key={index} className={cx("option__group")}>
                                {storage}
                              </h4>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cx("form__right")}>
                  <h4 className={cx("form__data")}>Pin & công nghệ sạc:</h4>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Dung lượng Pin(mAh):
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.battery?.capacity}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Loại sạc:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.battery?.typeCharging}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Sạc có dây(W):
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.battery?.wiredCharging}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Sạc không dây(W):
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.battery?.wirelessChargin}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Cổng sạc:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.battery?.portCharging}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================== */}

              <div className={cx("form__item")}>
                <div className={cx("form__left")}>
                  <h4 className={cx("form__data")}>Thiết kế & Trọng lượng:</h4>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Kích thước(mm):
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.design?.dimensions}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Trọng lượng(G):
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.design?.weight}
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Màu sắc:</label>

                      <div className={cx("options__list")}>
                        {data?.specifications?.design?.colors?.map(
                          (color, index) => {
                            return (
                              <h4 key={index} className={cx("option__group")}>
                                {color}
                              </h4>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>
                        Chất liệu khung:
                      </label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.design?.frameMaterial}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className={cx("form__right")}>
                  <h4 className={cx("form__data")}>Thông số khác:</h4>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Kháng nước:</label>

                      <h4 className={cx("form__data")}>
                        {
                          data?.specifications?.additionalFeatures
                            ?.waterResistance
                        }
                      </h4>
                    </div>
                  </div>

                  <div className={cx("form__group")}>
                    <div className={cx("item__wrapper")}>
                      <label className={cx("form__label")}>Âm thanh:</label>

                      <h4 className={cx("form__data")}>
                        {data?.specifications?.additionalFeatures?.audio}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={cx("options__side")}>
              <h4 className={cx("options__header")}>Phiên bản sản phẩm*:</h4>

              <div className={cx("options__section")}>
                {data?.options.map((option, index) => {
                  return (
                    <div key={index} className={cx("option__group")}>
                      <div className={cx("option__group__header")}>
                        <div className={cx("header__wrapper")}>
                          <div className={cx("form__group")}>
                            <div className={cx("item__wrapper")}>
                              <label className={cx("form__label")}>RAM:</label>

                              <h5 className={cx("form__data")}>
                                {option?.ram}
                              </h5>
                            </div>
                          </div>

                          <div className={cx("form__group")}>
                            <div className={cx("item__wrapper")}>
                              <label className={cx("form__label")}>
                                Bộ nhớ trong:
                              </label>

                              <h5 className={cx("form__data")}>
                                {option?.storage}
                              </h5>
                            </div>
                          </div>

                          <div className={cx("form__group")}>
                            <div className={cx("item__wrapper")}>
                              <label className={cx("form__label")}>
                                Màu sắc:
                              </label>

                              <h5 className={cx("form__data")}>
                                {option?.color}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={cx("input__group")}>
                        <div className={cx("option__img")}>
                          {option?.image && (
                            <div className={cx("img__wrapper")}>
                              <img src={option?.image} alt={data?.name} />
                            </div>
                          )}
                        </div>

                        <div className={cx("input__wrapper")}>
                          <div className={cx("form__group")}>
                            <div className={cx("item__wrapper")}>
                              <label className={cx("form__label")}>
                                Số lượng phiên bản:
                              </label>

                              <h4 className={cx("form__data")}>
                                {option?.quantity}
                              </h4>
                            </div>
                          </div>

                          <div className={cx("form__group")}>
                            <div className={cx("item__wrapper")}>
                              <label className={cx("form__label")}>
                                Giá trị phiên bản(VNĐ):
                              </label>

                              <h4
                                className={cx("form__data")}
                                style={{ color: "red" }}
                              >
                                {convertPrice(option?.price)}
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewproductDetail;

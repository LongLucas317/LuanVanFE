import classNames from "classnames/bind";
import styles from "./UpdateProductForm.module.scss";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Upload } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { useState } from "react";
const cx = classNames.bind(styles);

function UpdateProductForm(props) {
  const {
    isCloseDrawer,
    onUpdateProduct,
    formUpdate,
    stateProductDetails,
    toggleButton,
    handleOnChangeDetails,
    handleOnchangeProductImgDetails,
    changeSelectBrand,
    brandArr,
    brandSelect,
    ramSelect,
    storageSelect,
    colorSelect,
    handleOnChangeOption,
    handleRemoveOption,
    handleAddOption,
    handleRemoveVersion,
    handleChangeProductOptionImg,
    handleImageSelect,
    handleRemoveImage,
    handleSelectOption,
    handleAddFeatures,
    handleRemoveFeatures,
  } = props;

  const [formData, setFormData] = useState({
    ram: "",
    storage: "",
    color: "",
  });

  const [featuresData, setFeaturesData] = useState({
    frontFeatures: "",
    rearFeatures: "",
    screenFeatures: "",
  });

  const handleChangeFeatures = (e) => {
    const { name, value } = e.target;

    setFeaturesData({
      ...featuresData,
      [name]: value,
    });
  };

  const handleAddFeaturesCamera = (
    value,
    field,
    subField,
    subSubField,
    subSubSubField
  ) => {
    handleAddFeatures(value, field, subField, subSubField, subSubSubField);

    if (subSubField === "front") {
      setFeaturesData({
        ...featuresData,
        frontFeatures: "",
      });
    } else if (subSubField === "rear") {
      setFeaturesData({
        ...featuresData,
        rearFeatures: "",
      });
    } else if (subSubField === "features") {
      setFeaturesData({
        ...featuresData,
        screenFeatures: "",
      });
    }
  };

  const handleChangeOptions = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddRamOption = (e) => {
    e.preventDefault();

    handleSelectOption(formData.ram, "specifications", "memory", "ram");

    setFormData({
      ...formData,
      ram: "",
    });
  };

  const handleAddStorageOption = (e) => {
    e.preventDefault();

    handleSelectOption(formData.storage, "specifications", "memory", "storage");

    setFormData({
      ...formData,
      storage: "",
    });
  };

  const handleAddColorOption = (e) => {
    e.preventDefault();

    handleSelectOption(formData.color, "specifications", "design", "colors");

    setFormData({
      ...formData,
      color: "",
    });
  };

  return (
    <div className={cx("CreateProductForm__block")}>
      <div className={cx("CreateProductForm__wrapper")}>
        <div className={cx("CreateProductForm__header")}>
          <h2>Cập nhật sản phẩm</h2>

          <FontAwesomeIcon
            onClick={isCloseDrawer}
            className={cx("close__btn")}
            icon={faXmark}
          />
        </div>

        <Form
          className={cx("form__section")}
          name="create"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          onFinish={onUpdateProduct}
          autoComplete="off"
          form={formUpdate}
        >
          <div className={cx("form__wrapper")}>
            <div className={cx("CreateProductForm__section")}>
              <div className={cx("product__image")}>
                <Form.Item
                  name="image"
                  className={cx("product__thumnail")}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Cần thêm Hình ảnh của sản phẩm!",
                  //   },
                  // ]}
                >
                  {stateProductDetails?.image && (
                    <div className={cx("thumnail__wrapper")}>
                      <img
                        src={stateProductDetails?.image}
                        alt={stateProductDetails?.name}
                      />
                    </div>
                  )}

                  <Upload
                    showUploadList={false}
                    onChange={handleOnchangeProductImgDetails}
                    maxCount={1}
                    className={cx("productImg__btn")}
                  >
                    <Button className={cx("upload__btn")}>
                      <svg
                        fill="#000000"
                        width="14px"
                        height="14px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.71,7.71,11,5.41V15a1,1,0,0,0,2,0V5.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-4-4a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-4,4A1,1,0,1,0,8.71,7.71ZM21,12a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V13a1,1,0,0,0-2,0v6a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12Z" />
                      </svg>{" "}
                      Chọn File
                    </Button>
                  </Upload>
                </Form.Item>

                <div className={cx("product__img")}>
                  {stateProductDetails?.images.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        marginRight: "10px",
                        marginBottom: "10px",
                      }}
                      className={cx("product__img__group")}
                    >
                      <img
                        src={image}
                        alt={stateProductDetails?.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                      <DeleteOutlined
                        onClick={() => handleRemoveImage(index)}
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

                  <div className={cx("productImgUpload__btn")}>
                    <label
                      htmlFor="productImgOptions"
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
                    id="productImgOptions"
                    type="file"
                    multiple
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className={cx("product__infor")}>
                <div className={cx("form__left")}>
                  <Form.Item
                    className={cx("form__group")}
                    name="name"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Cần thêm Tên Sản phẩm!",
                    //   },
                    // ]}
                  >
                    <label className={cx("form__label")}>Tên sản phẩm*:</label>

                    <input
                      value={stateProductDetails?.name}
                      onChange={(e) => handleOnChangeDetails(e, "name")}
                      name="name"
                      className={cx("form__input")}
                      type="text"
                      placeholder="Tên của sản phẩm"
                    />
                  </Form.Item>

                  <Form.Item
                    className={cx("form__group")}
                    name="brand"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Cần chọn Thương hiệu cho Sản phẩm!",
                    //   },
                    // ]}
                  >
                    <label className={cx("form__label")}>Thương hiệu:</label>

                    <select
                      name="brand"
                      className={cx("form__input")}
                      value={stateProductDetails.brand}
                      onChange={(e) => changeSelectBrand(e.target.value)}
                    >
                      <option value={""}>Thương Hiệu</option>
                      <option value={"new_brand"}>Thêm mới</option>
                      {brandArr?.map((brand, index) => {
                        return (
                          <option key={index} value={brand}>
                            {brand}
                          </option>
                        );
                      })}
                    </select>
                  </Form.Item>

                  {brandSelect === "new_brand" && (
                    <Form.Item
                      className={cx("form__group")}
                      name="newBrand"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Hãy nhập Thương hiệu của sản phẩm!",
                      //   },
                      // ]}
                    >
                      <label className={cx("form__label")}>
                        Thương hiệu mới*:
                      </label>
                      <input
                        value={stateProductDetails?.newBrand}
                        onChange={(e) => handleOnChangeDetails(e, "newBrand")}
                        name="newBrand"
                        className={cx("form__input")}
                        type="text"
                        placeholder="Thương hiệu của sản phẩm"
                      />
                    </Form.Item>
                  )}

                  <Form.Item
                    className={cx("form__group")}
                    name="operatingSystem"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Hãy nhập Thương hiệu của sản phẩm!",
                    //   },
                    // ]}
                  >
                    <label className={cx("form__label")}>Hệ điều hành:</label>
                    <input
                      value={stateProductDetails?.operatingSystem}
                      onChange={(e) =>
                        handleOnChangeDetails(e, "operatingSystem")
                      }
                      name="operatingSystem"
                      className={cx("form__input")}
                      type="text"
                      placeholder="Hệ điều hành của sản phẩm"
                    />
                  </Form.Item>

                  <Form.Item className={cx("form__group")} name="name">
                    <label className={cx("form__label")}>
                      Thời gian bắt đầu giảm giá:
                    </label>

                    <div style={{ display: "flex", gap: "4px" }}>
                      <input
                        value={stateProductDetails?.discountStartTime}
                        onChange={(e) =>
                          handleOnChangeDetails(e, "discountStartTime")
                        }
                        name="discountStartTime"
                        className={cx("form__input")}
                        type="date"
                      />

                      <input
                        value={stateProductDetails?.timeStartDiscount}
                        onChange={(e) =>
                          handleOnChangeDetails(e, "timeStartDiscount")
                        }
                        name="timeStartDiscount"
                        className={cx("form__input")}
                        type="time"
                      />
                    </div>
                  </Form.Item>
                </div>

                <div className={cx("form__right")}>
                  {/* ========================== */}
                  <div className={cx("form__group")}>
                    <label className={cx("form__label")}>
                      Trạng thái sản phẩm:
                    </label>

                    <div
                      className={cx("form__group")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        padding: "5.5px 0px",
                      }}
                    >
                      <label className={cx("form__label")}>
                        {stateProductDetails?.isPublic
                          ? "Công khai"
                          : "Không công khai"}
                        :
                      </label>
                      <div
                        className={cx(
                          "toggle-switch",
                          stateProductDetails?.isPublic ? "on" : "off"
                        )}
                        onClick={toggleButton}
                      >
                        <div className={cx("toggle-knob")}></div>
                      </div>
                    </div>
                  </div>
                  {/* ===================== */}

                  <Form.Item
                    className={cx("form__group")}
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Hãy nhập tên Sản phẩm!",
                    //   },
                    // ]}
                  >
                    <label className={cx("form__label")}>
                      Tổng số lượng của tất cả phiên bản:
                    </label>
                    <input
                      disabled
                      value={stateProductDetails?.countInStock}
                      className={cx("form__input")}
                      type="text"
                    />
                  </Form.Item>

                  <Form.Item
                    className={cx("form__group")}
                    name="discountAmount"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Hãy nhập tên Sản phẩm!",
                    //   },
                    // ]}
                  >
                    <label className={cx("form__label")}>
                      Giảm giá(Nếu có):
                    </label>
                    <input
                      value={stateProductDetails?.discountAmount}
                      onChange={(e) =>
                        handleOnChangeDetails(e, "discountAmount")
                      }
                      name="discountAmount"
                      className={cx("form__input")}
                      type="text"
                      placeholder="Phần trăm giảm giá của sản phẩm"
                    />
                  </Form.Item>

                  <Form.Item
                    className={cx("form__group")}
                    name="discountEndTime"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Hãy nhập tên Sản phẩm!",
                    //   },
                    // ]}
                  >
                    <label className={cx("form__label")}>
                      Thời gian kết thúc giảm giá:
                    </label>

                    <div style={{ display: "flex", gap: "4px" }}>
                      <input
                        value={stateProductDetails?.discountEndTime}
                        onChange={(e) =>
                          handleOnChangeDetails(e, "discountEndTime")
                        }
                        name="discountEndTime"
                        className={cx("form__input")}
                        type="date"
                      />

                      <input
                        value={stateProductDetails?.timeEndDiscount}
                        onChange={(e) =>
                          handleOnChangeDetails(e, "timeEndDiscount")
                        }
                        name="timeEndDiscount"
                        className={cx("form__input")}
                        type="time"
                      />
                    </div>
                  </Form.Item>
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
                    <h4>Màn hình:</h4>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Kích thước(inches):
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.screen.size
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "screen",
                              "size"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Kích thước màn hình"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Công nghệ:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.screen
                              .technology
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "screen",
                              "technology"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Loại màn hình"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Độ phân giải(pixels):
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.screen
                              .resolution
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "screen",
                              "resolution"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Độ phân giải"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Tần số quét(Hz):
                        </label>

                        <input
                          value={stateProductDetails?.specifications.screen.pwm}
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "screen",
                              "pwm"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Tần số quét"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Tính năng Màn hình:
                        </label>

                        <div
                          style={{
                            width: "50.6%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <textarea
                            value={featuresData.screenFeatures}
                            onChange={handleChangeFeatures}
                            name="screenFeatures"
                            className={cx("form__input")}
                            type="text"
                            placeholder="Tính năng Màn hình"
                            style={{
                              width: "100%",
                              margin: "0px",
                              resize: "none",
                            }}
                          ></textarea>

                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              handleAddFeaturesCamera(
                                featuresData.screenFeatures,
                                "specifications",
                                "screen",
                                "features"
                              );
                            }}
                            className={cx("add__btn")}
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </Form.Item>

                    {stateProductDetails?.specifications.screen.features
                      .length !== 0 && (
                      <div className={cx("features__choosen")}>
                        <label>Tính năng đã chọn</label>

                        <div className={cx("options__list")}>
                          {stateProductDetails?.specifications.screen.features.map(
                            (feature, index) => {
                              return (
                                <div
                                  key={index}
                                  className={cx("option__group")}
                                >
                                  <span>
                                    <strong>{feature}</strong>
                                  </span>
                                  <div
                                    onClick={() =>
                                      handleRemoveFeatures(
                                        index,
                                        "specifications",
                                        "screen",
                                        "features"
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14px"
                                      height="14px"
                                      color="white"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#000000"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Thiết kế:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.screen.design
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "screen",
                              "design"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Thiết kế"
                        />
                      </div>
                    </Form.Item>
                  </div>

                  <div className={cx("form__right")}>
                    <h4>Camera:</h4>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Camera sau:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.camera.rear.main
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "camera",
                              "rear",
                              "main"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Độ phân giải"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Camera gốc rộng:
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.camera.rear
                              .ultraWide
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "camera",
                              "rear",
                              "ultraWide"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Độ phân giải"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Chất lượng video:
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.camera.rear
                              .video
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "camera",
                              "rear",
                              "video"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Chất lượng video"
                        />
                      </div>
                    </Form.Item>

                    {/* ===================================== */}

                    <Form.Item
                      name="rearFeatures"
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Tính năng Cam sau:
                        </label>

                        <div
                          style={{
                            width: "50.6%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <textarea
                            value={featuresData.rearFeatures}
                            onChange={handleChangeFeatures}
                            name="rearFeatures"
                            className={cx("form__input")}
                            type="text"
                            placeholder="Tính năng Cam sau"
                            style={{
                              width: "100%",
                              margin: "0px",
                              resize: "none",
                            }}
                          ></textarea>

                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              handleAddFeaturesCamera(
                                featuresData.rearFeatures,
                                "specifications",
                                "camera",
                                "rear",
                                "features"
                              );
                            }}
                            className={cx("add__btn")}
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </Form.Item>

                    {stateProductDetails?.specifications.camera.rear.features
                      .length !== 0 && (
                      <div className={cx("features__choosen")}>
                        <label>Tính năng đã chọn</label>

                        <div className={cx("options__list")}>
                          {stateProductDetails?.specifications.camera.rear.features.map(
                            (feature, index) => {
                              return (
                                <div
                                  key={index}
                                  className={cx("option__group")}
                                >
                                  <span>
                                    <strong>{feature}</strong>
                                  </span>
                                  <div
                                    onClick={() =>
                                      handleRemoveFeatures(
                                        index,
                                        "specifications",
                                        "camera",
                                        "rear",
                                        "features"
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14px"
                                      height="14px"
                                      color="white"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#000000"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* ===================================== */}

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Camera trước:
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.camera.front
                              .resolution
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "camera",
                              "front",
                              "resolution"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Độ phân giải"
                        />
                      </div>
                    </Form.Item>

                    {/* ===================================== */}
                    <Form.Item
                      className={cx("form__group")}
                      name="frontFeatures"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Tính năng Cam trước:
                        </label>

                        <div
                          style={{
                            width: "50.6%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <textarea
                            value={featuresData.frontFeatures}
                            onChange={handleChangeFeatures}
                            name="frontFeatures"
                            className={cx("form__input")}
                            type="text"
                            placeholder="Tính năng Cam trước"
                            style={{
                              width: "100%",
                              margin: "0px",
                              resize: "none",
                            }}
                          ></textarea>

                          <button
                            onClick={(e) => {
                              e.preventDefault();

                              handleAddFeaturesCamera(
                                featuresData.frontFeatures,
                                "specifications",
                                "camera",
                                "front",
                                "features"
                              );
                            }}
                            className={cx("add__btn")}
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </Form.Item>

                    {stateProductDetails?.specifications.camera.front.features
                      .length !== 0 && (
                      <div className={cx("features__choosen")}>
                        <label>Tính năng đã chọn</label>

                        <div className={cx("options__list")}>
                          {stateProductDetails?.specifications.camera.front.features.map(
                            (feature, index) => {
                              return (
                                <div
                                  key={index}
                                  className={cx("option__group")}
                                >
                                  <span>
                                    <strong>{feature}</strong>
                                  </span>
                                  <div
                                    onClick={() =>
                                      handleRemoveFeatures(
                                        index,
                                        "specifications",
                                        "camera",
                                        "front",
                                        "features"
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14px"
                                      height="14px"
                                      color="white"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#000000"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* ===================================== */}
                  </div>
                </div>

                {/* ===================================== */}

                <div className={cx("form__item")}>
                  <div className={cx("form__left")}>
                    <h4>Vi xử lý & đồ họa:</h4>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Chipset:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.processor
                              .chipset
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "processor",
                              "chipset"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Chipset"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>CPU:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.processor.cpu
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "processor",
                              "cpu"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Loại CPU"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>GPU:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.processor.gpu
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "processor",
                              "gpu"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Loại GPU"
                        />
                      </div>
                    </Form.Item>
                  </div>

                  <div className={cx("form__right")}>
                    <h4>Giao tiếp & kết nối:</h4>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Công nghệ NFC:
                        </label>

                        <select
                          value={
                            stateProductDetails?.specifications.connectivity.nfc
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "connectivity",
                              "nfc"
                            )
                          }
                          className={cx("form__input")}
                        >
                          <option value={""}>Chọn NFC</option>
                          <option value={true}>Có</option>
                          <option value={false}>Không</option>
                        </select>
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Thẻ Sim:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.connectivity.sim
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "connectivity",
                              "sim"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Thẻ Sim"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Hỗ trợ mạng:
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.connectivity
                              .network
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "connectivity",
                              "network"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Loại mạng"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Bluetooth:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.connectivity
                              .bluetooth
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "connectivity",
                              "bluetooth"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Bluetooth"
                        />
                      </div>
                    </Form.Item>
                  </div>
                </div>

                {/* ===================================== */}

                <div className={cx("form__item")}>
                  <div className={cx("form__left")}>
                    <h4>RAM & Lưu trữ:</h4>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Dung lượng RAM(GB):
                        </label>

                        <select
                          value={stateProductDetails?.specifications.memory.ram}
                          onChange={(e) =>
                            handleSelectOption(
                              e.target.value,
                              "specifications",
                              "memory",
                              "ram"
                            )
                          }
                          className={cx("form__input")}
                        >
                          <option value={""}>Dung Lượng</option>
                          <option value={"new_RAM"}>Thêm RAM</option>
                          <option value={"4GB"}>4 GB</option>
                          <option value={"6GB"}>6 GB</option>
                        </select>
                      </div>
                    </Form.Item>

                    {ramSelect === "new_RAM" && (
                      <Form.Item
                        className={cx("form__group")}
                        name="ram"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Cần thêm Tên Sản phẩm!",
                        //   },
                        // ]}
                      >
                        <div className={cx("item__wrapper")}>
                          <label className={cx("form__label")}>
                            Thêm dung lượng(GB):
                          </label>

                          <div
                            style={{
                              width: "50.6%",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <input
                              value={formData.ram}
                              onChange={handleChangeOptions}
                              name="ram"
                              className={cx("form__input")}
                              style={{ width: "100%", margin: "0px" }}
                              type="text"
                              placeholder="Dung lượng RAM"
                            />

                            <button
                              onClick={handleAddRamOption}
                              className={cx("add__btn")}
                            >
                              Thêm
                            </button>
                          </div>
                        </div>
                      </Form.Item>
                    )}

                    {stateProductDetails?.specifications.memory.ram.length !==
                      0 && (
                      <div className={cx("ram__choosen")}>
                        <label>RAM đã chọn</label>

                        <div className={cx("options__list")}>
                          {stateProductDetails?.specifications.memory.ram.map(
                            (ram, index) => {
                              return (
                                <div
                                  key={index}
                                  className={cx("option__group")}
                                >
                                  <span>
                                    <strong>{ram}</strong>
                                  </span>
                                  <div
                                    onClick={() =>
                                      handleRemoveOption(
                                        index,
                                        "specifications",
                                        "memory",
                                        "ram"
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14px"
                                      height="14px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#000000"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* ============================== */}

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Bộ nhớ trong(GB):
                        </label>

                        <select
                          value={
                            stateProductDetails?.specifications.memory.storage
                          }
                          onChange={(e) =>
                            handleSelectOption(
                              e.target.value,
                              "specifications",
                              "memory",
                              "storage"
                            )
                          }
                          className={cx("form__input")}
                        >
                          <option value={""}>Dung Lượng</option>
                          <option value={"new_storage"}>Thêm mới</option>
                          <option value={"128GB"}>128 GB</option>
                          <option value={"256GB"}>256 GB</option>
                        </select>
                      </div>
                    </Form.Item>

                    {storageSelect === "new_storage" && (
                      <Form.Item
                        className={cx("form__group")}
                        name="storage"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Cần thêm Tên Sản phẩm!",
                        //   },
                        // ]}
                      >
                        <div className={cx("item__wrapper")}>
                          <label className={cx("form__label")}>
                            Bộ nhớ trong(GB):
                          </label>

                          <div
                            style={{
                              width: "50.6%",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <input
                              value={formData.storage}
                              onChange={handleChangeOptions}
                              name="storage"
                              className={cx("form__input")}
                              style={{ width: "100%", margin: "0px" }}
                              type="text"
                              placeholder="Bộ nhớ trong"
                            />

                            <button
                              onClick={handleAddStorageOption}
                              className={cx("add__btn")}
                            >
                              Thêm
                            </button>
                          </div>
                        </div>
                      </Form.Item>
                    )}

                    {stateProductDetails?.specifications.memory.storage
                      .length !== 0 && (
                      <div className={cx("ram__choosen")}>
                        <label>Bộ nhớ đã chọn</label>

                        <div className={cx("options__list")}>
                          {stateProductDetails?.specifications.memory.storage.map(
                            (storage, index) => {
                              return (
                                <div
                                  key={index}
                                  className={cx("option__group")}
                                  style={{ gap: "2px" }}
                                >
                                  <span>
                                    <strong>{storage}</strong>
                                  </span>
                                  <div
                                    onClick={() =>
                                      handleRemoveOption(
                                        index,
                                        "specifications",
                                        "memory",
                                        "storage"
                                      )
                                    }
                                    style={{ paddingLeft: "2px" }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14px"
                                      height="14px"
                                      color="white"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#000000"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={cx("form__right")}>
                    <h4>Pin & công nghệ sạc:</h4>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Dung lượng Pin(mAh):
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.battery.capacity
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "battery",
                              "capacity"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Dung lượng Pin"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Loại sạc:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.battery
                              .typeCharging
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "battery",
                              "typeCharging"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Loại sạc"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Sạc có dây(W):
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.battery
                              .wiredCharging
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "battery",
                              "wiredCharging"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Công xuất"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Sạc không dây(W):
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.battery
                              .wirelessCharging
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "battery",
                              "wirelessCharging"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Công suất"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Cổng sạc:</label>

                        <input
                          value={
                            stateProductDetails?.specifications.battery
                              .portCharging
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "battery",
                              "portCharging"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Loại cổng sạc"
                        />
                      </div>
                    </Form.Item>
                  </div>
                </div>

                {/* ===================================== */}

                <div className={cx("form__item")}>
                  <div className={cx("form__left")}>
                    <h4>Thiết kế & Trọng lượng:</h4>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Kích thước(mm):
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.design
                              .dimensions
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "design",
                              "dimensions"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Kích thước"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Trọng lượng(G):
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.design.weight
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "design",
                              "weight"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Trọng lượng"
                        />
                      </div>
                    </Form.Item>
                    {/* ========================== */}

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Màu sắc:</label>

                        <select
                          value={
                            stateProductDetails?.specifications.design.colors
                          }
                          onChange={(e) =>
                            handleSelectOption(
                              e.target.value,
                              "specifications",
                              "design",
                              "colors"
                            )
                          }
                          className={cx("form__input")}
                        >
                          <option value={""}>Màu sắc</option>
                          <option value={"new_color"}>Thêm mới</option>
                          <option value={"Xanh dương"}>Xanh dương</option>
                          <option value={"Đen"}>Đen</option>
                          {/* {stateProductDetails?.specifications?.memory?.ram?.map(
                              (ram) => {
                                return <option value={ram}>{ram} GB</option>;
                              }
                            )} */}
                        </select>
                      </div>
                    </Form.Item>

                    {colorSelect === "new_color" && (
                      <Form.Item
                        className={cx("form__group")}
                        name="color"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Cần thêm Tên Sản phẩm!",
                        //   },
                        // ]}
                      >
                        <div className={cx("item__wrapper")}>
                          <label className={cx("form__label")}>
                            Thêm mới Màu sắc:
                          </label>
                          <div
                            style={{
                              width: "50.6%",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <input
                              value={formData.color}
                              onChange={handleChangeOptions}
                              name="color"
                              style={{ width: "100%", margin: "0px" }}
                              className={cx("form__input")}
                              type="text"
                              placeholder="Màu sắc"
                            />

                            <button
                              onClick={handleAddColorOption}
                              className={cx("add__btn")}
                            >
                              Thêm
                            </button>
                          </div>
                        </div>
                      </Form.Item>
                    )}

                    {stateProductDetails?.specifications.design.colors
                      .length !== 0 && (
                      <div className={cx("ram__choosen")}>
                        <label>Màu đã đã chọn</label>

                        <div className={cx("options__list")}>
                          {stateProductDetails?.specifications.design.colors.map(
                            (color, index) => {
                              return (
                                <div
                                  key={index}
                                  className={cx("option__group")}
                                  style={{ gap: "2px" }}
                                >
                                  <strong>{color}</strong>
                                  <div
                                    onClick={() =>
                                      handleRemoveOption(
                                        index,
                                        "specifications",
                                        "design",
                                        "colors"
                                      )
                                    }
                                    style={{ paddingLeft: "2px" }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14px"
                                      height="14px"
                                      color="white"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="#000000"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {/* ========================== */}

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>
                          Chất liệu khung:
                        </label>

                        <input
                          value={
                            stateProductDetails?.specifications.design
                              .frameMaterial
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "design",
                              "frameMaterial"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Chất liệu khung"
                        />
                      </div>
                    </Form.Item>
                  </div>

                  <div className={cx("form__right")}>
                    <h4>Thông số khác:</h4>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Kháng nước:</label>

                        <input
                          value={
                            stateProductDetails?.specifications
                              .additionalFeatures.waterResistance
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "additionalFeatures",
                              "waterResistance"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Chỉ số kháng nước"
                        />
                      </div>
                    </Form.Item>

                    <Form.Item
                      className={cx("form__group")}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Cần thêm Tên Sản phẩm!",
                      //   },
                      // ]}
                    >
                      <div className={cx("item__wrapper")}>
                        <label className={cx("form__label")}>Âm thanh:</label>

                        <input
                          value={
                            stateProductDetails?.specifications
                              .additionalFeatures.audio
                          }
                          onChange={(e) =>
                            handleOnChangeDetails(
                              e,
                              "specifications",
                              "additionalFeatures",
                              "audio"
                            )
                          }
                          className={cx("form__input")}
                          type="text"
                          placeholder="Công nghệ âm thanh"
                        />
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className={cx("options__side")}>
                <div className={cx("options__header")}>
                  <h3>Phiên bản sản phẩm*:</h3>

                  <button onClick={handleAddOption}>Thêm Options</button>
                </div>

                <div className={cx("options__section")}>
                  {stateProductDetails?.options.map((option, index) => {
                    return (
                      <div key={index} className={cx("option__group")}>
                        <div className={cx("option__group__header")}>
                          <div className={cx("header__wrapper")}>
                            <Form.Item
                              className={cx("form__group")}
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Cần thêm Giá Sản phẩm!",
                              //   },
                              // ]}
                            >
                              <div className={cx("item__wrapper")}>
                                <label className={cx("form__label")}>
                                  RAM:
                                </label>

                                <select
                                  value={option.ram}
                                  onChange={(e) => {
                                    handleOnChangeOption(
                                      e,
                                      "options",
                                      "ram",
                                      option.id
                                    );
                                  }}
                                  className={cx("form__input")}
                                >
                                  <option value={""}>RAM</option>
                                  {stateProductDetails?.specifications.memory.ram.map(
                                    (ram, index) => {
                                      return (
                                        <option key={index} value={ram}>
                                          {ram}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </Form.Item>

                            <Form.Item
                              className={cx("form__group")}
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Cần thêm Giá Sản phẩm!",
                              //   },
                              // ]}
                            >
                              <div className={cx("item__wrapper")}>
                                <label className={cx("form__label")}>
                                  Bộ nhớ trong:
                                </label>

                                <select
                                  value={option.storage}
                                  onChange={(e) => {
                                    handleOnChangeOption(
                                      e,
                                      "options",
                                      "storage",
                                      option.id
                                    );
                                  }}
                                  className={cx("form__input")}
                                >
                                  <option value={""}>Bộ nhớ</option>
                                  {stateProductDetails?.specifications.memory.storage.map(
                                    (storage, index) => {
                                      return (
                                        <option key={index} value={storage}>
                                          {storage}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </Form.Item>

                            <Form.Item
                              className={cx("form__group")}
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Cần thêm Giá Sản phẩm!",
                              //   },
                              // ]}
                            >
                              <div className={cx("item__wrapper")}>
                                <label className={cx("form__label")}>
                                  Màu sắc:
                                </label>

                                <select
                                  value={option.color}
                                  onChange={(e) => {
                                    handleOnChangeOption(
                                      e,
                                      "options",
                                      "color",
                                      option.id
                                    );
                                  }}
                                  className={cx("form__input")}
                                >
                                  <option value={""}>Màu sắc</option>
                                  {stateProductDetails?.specifications.design.colors.map(
                                    (color, index) => {
                                      return (
                                        <option key={index} value={color}>
                                          {color}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            </Form.Item>
                          </div>

                          <div
                            onClick={() => handleRemoveVersion(option.id)}
                            className={cx("remove__option")}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </div>
                        </div>

                        <div className={cx("input__group")}>
                          <Upload
                            showUploadList={false}
                            onChange={(e) => {
                              handleChangeProductOptionImg(e, index);
                            }}
                            maxCount={1}
                            className={cx("productImgOptionUpload__btn")}
                          >
                            <div className={cx("option__img")}>
                              {option.image && (
                                <div className={cx("img__wrapper")}>
                                  <img
                                    src={option.image}
                                    alt={stateProductDetails?.name}
                                  />
                                </div>
                              )}

                              <Button
                                className={cx("upload__btn")}
                                style={{ marginTop: "12px" }}
                              >
                                <svg
                                  fill="#000000"
                                  width="14px"
                                  height="14px"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M8.71,7.71,11,5.41V15a1,1,0,0,0,2,0V5.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-4-4a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-4,4A1,1,0,1,0,8.71,7.71ZM21,12a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V13a1,1,0,0,0-2,0v6a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12Z" />
                                </svg>{" "}
                                Chọn File
                              </Button>
                            </div>
                          </Upload>

                          <div className={cx("input__wrapper")}>
                            <Form.Item
                              className={cx("form__group")}
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Cần thêm Tên Sản phẩm!",
                              //   },
                              // ]}
                            >
                              <div className={cx("item__wrapper")}>
                                <label className={cx("form__label")}>
                                  Số lượng phiên bản:
                                </label>

                                <input
                                  value={option.quantity}
                                  onChange={(e) =>
                                    handleOnChangeOption(
                                      e,
                                      "options",
                                      "quantity",
                                      option.id
                                    )
                                  }
                                  className={cx("form__input")}
                                  type="number"
                                  placeholder="Số lượng"
                                />
                              </div>
                            </Form.Item>

                            <Form.Item
                              className={cx("form__group")}
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: "Cần thêm Tên Sản phẩm!",
                              //   },
                              // ]}
                            >
                              <div className={cx("item__wrapper")}>
                                <label className={cx("form__label")}>
                                  Giá trị phiên bản(VNĐ):
                                </label>

                                <input
                                  value={option.price}
                                  onChange={(e) =>
                                    handleOnChangeOption(
                                      e,
                                      "options",
                                      "price",
                                      option.id
                                    )
                                  }
                                  className={cx("form__input")}
                                  type="number"
                                  placeholder="Giá trị phiên bản"
                                />
                              </div>
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <Form.Item className={cx("CreateProductForm__footer")}>
            <button type="submit">Cập nhật</button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default UpdateProductForm;

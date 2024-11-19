import classNames from "classnames/bind";
import style from "./SliderComponent.module.scss";

import {
  faPenToSquare,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Form } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import { getBase64 } from "~/utils";
import * as SliderService from "~/services/SliderService";
import * as message from "~/component/Message";
import { useMutationHook } from "~/hooks/useMutationHook";
import ModalComponent from "../ModalComponent";

const cx = classNames.bind(style);

function SliderComponent(props) {
  const { data, openCreateSlider, querySlider } = props;

  const user = useSelector((state) => state.user);
  const [sliderId, setSliderId] = useState(null);

  // Update Slider Image ============================================
  const [sliderData, setSliderData] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    data?.map((img) => {
      setSliderData(img.url);
      setSliderId(img._id);
    });
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) =>
        prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Chuyển ảnh sau mỗi 3 giây

    return () => clearInterval(interval);
  }, [sliderData]);

  // ================================================================

  // Update Slider Image ============================================
  const [formUpdate] = Form.useForm();

  const [isOpenUpdateSlider, setIsOpenUpdateSlider] = useState(false);
  const [sliderUpdateImage, setSliderUpdateImage] = useState({
    url: "",
  });

  const handleOpenUpdateSliderModal = (sliderId) => {
    data?.map((img) => {
      setSliderUpdateImage(img);
    });

    setIsOpenUpdateSlider(true);
  };

  const handleCloseUpdateSliderModal = () => {
    setIsOpenUpdateSlider(false);
    setSliderUpdateImage({
      url: "",
    });
    formUpdate.resetFields();
  };

  const handleAddImageSlider = async (e) => {
    const files = Array.from(e.target.files);

    const imageBase64List = await Promise.all(
      files.map((file) => getBase64(file))
    );

    setSliderUpdateImage((prevState) => ({
      ...prevState,
      url: [...prevState.url, ...imageBase64List],
    }));
  };

  const handleRemoveImageSlider = (index) => {
    setSliderUpdateImage((prevState) => ({
      ...prevState,
      url: prevState.url.filter((_, i) => i !== index),
    }));
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, ...image } = data;
    const res = SliderService.updateSliderImage(id, { ...image });
    return res;
  });

  const { data: dataUpdate, isSuccess, isError } = mutationUpdate;

  useEffect(() => {
    if (isSuccess && dataUpdate?.status === "OK") {
      message.success("Cập nhật Hình ảnh Thành công");
      handleCloseUpdateSliderModal();
    } else if (isError) {
      message.error("Cập nhật Hình ảnh Thất bại");
    }
  }, [isSuccess]);

  const onUpdateSliderImage = () => {
    mutationUpdate.mutate(
      {
        id: sliderId,
        url: sliderUpdateImage.url,
      },
      {
        onSettled: () => {
          querySlider.refetch();
        },
      }
    );
  };

  // ================================================================

  // Delete Slider ==================================================
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);

  const handleOpenDeleteModal = (id) => {
    setIsOpenModalDelete(true);
  };

  const handleCancelDelete = () => {
    setIsOpenModalDelete(false);
  };

  const handleDeleteSlider = () => {
    mutationDelete.mutate(
      { id: sliderId },
      {
        onSettled: () => {
          querySlider.refetch();
        },
      }
    );
  };

  const mutationDelete = useMutationHook((data) => {
    const { id } = data;
    const res = SliderService.deleteSliderImage(id);
    return res;
  });

  const { data: dataDeleted, isSuccess: isSuccessDeleted } = mutationDelete;

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      handleCancelDelete();
      setSliderId(null);
      window.location.reload();
    }
  }, [isSuccessDeleted]);

  // ================================================================

  return (
    <>
      {!!sliderData?.length && (
        <div className={cx("slider__section")}>
          <div className={cx("slider__img")}>
            <img src={sliderData[currentImage]} alt="slider" />
          </div>

          {user?.isAdmin && (
            <div
              onClick={() => handleOpenUpdateSliderModal(sliderId)}
              className={cx("changeImg__btn")}
            >
              <FontAwesomeIcon
                className={cx("change__icon")}
                icon={faPenToSquare}
              />

              <h2>Chỉnh sửa</h2>
            </div>
          )}

          <div
            onClick={() => handleOpenDeleteModal(sliderId)}
            className={cx("deleteImg__btn")}
          >
            <FontAwesomeIcon className={cx("delete__icon")} icon={faTrash} />

            <h4>Xóa Banner</h4>
          </div>
        </div>
      )}

      {sliderData?.length === 0 && user?.isAdmin && (
        <div onClick={openCreateSlider} className={cx("addImg__btn")}>
          <FontAwesomeIcon className={cx("add__icon")} icon={faPlus} />

          <h2>Thêm ảnh</h2>
        </div>
      )}

      {isOpenUpdateSlider && (
        <div className={cx("form__slider")}>
          <div className={cx("form__slider__block")}>
            <div className={cx("form__slider__wrapper")}>
              <div className={cx("sliderForm__header")}>
                <h2>Cập nhật Banner</h2>

                <FontAwesomeIcon
                  onClick={handleCloseUpdateSliderModal}
                  className={cx("close__btn")}
                  icon={faXmark}
                />
              </div>

              <Form
                className={cx("form__section")}
                name="create"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 32 }}
                onFinish={onUpdateSliderImage}
                autoComplete="off"
                form={formUpdate}
              >
                <div className={cx("slider__img")}>
                  {sliderUpdateImage?.url?.map((image, index) => (
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
                        alt=""
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
                  <button type="submit">Cập nhật</button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )}

      <ModalComponent
        title="Xóa sản phẩm"
        open={isOpenModalDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteSlider}
        forceRender
      >
        <div className={cx("delete__text")}>
          Bạn có chắc muốn xóa Banner này không???
        </div>
      </ModalComponent>
    </>
  );
}

export default SliderComponent;

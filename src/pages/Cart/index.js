import classNames from "classnames/bind";
import styles from "./Cart.module.scss";

import { Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { convertPrice } from "~/utils";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "~/redux/slides/orderSlide";

import ModalComponent from "~/component/ModalComponent";
import { updateUser } from "~/redux/slides/userSlide";
import { useEffect, useMemo, useState } from "react";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as message from "~/component/Message";
import * as UserServices from "~/services/UserServices";
import * as ProductService from "~/services/ProductService";

import emptyCart from "~/assets/img/empty_cart.jpg";
import Loading from "~/component/LoadingComponent";
const cx = classNames.bind(styles);

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.order);
  const [listChecked, setListChecked] = useState("");
  const [orderChecked, setOrderChecked] = useState("");

  const onCheckProduct = (e) => {
    if (listChecked.includes(+e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== +e.target.value
      );
      setListChecked(newListChecked);

      const newOrderChecked = orderChecked.filter(
        (item) => item !== e.target.value
      );
      setOrderChecked(newOrderChecked);
    } else {
      setListChecked([...listChecked, +e.target.value]);
      setOrderChecked([...orderChecked, e.target.value]);
    }
  };

  const onCheckAllProduct = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      orders?.orderItems?.forEach((item) => {
        newListChecked.push(item?.optionId);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  const handleChangeCount = (
    type,
    idProduct,
    colorProduct,
    ramProduct,
    storageProduct,
    limited
  ) => {
    if (type === "increace") {
      if (!limited) {
        dispatch(
          increaseAmount({
            idProduct,
            colorProduct,
            ramProduct,
            storageProduct,
          })
        );
      }
    } else {
      if (!limited) {
        dispatch(
          decreaseAmount({
            idProduct,
            colorProduct,
            ramProduct,
            storageProduct,
          })
        );
      }
    }
  };

  const handleDeleteOrder = (
    idProduct,
    colorProduct,
    ramProduct,
    storageProduct
  ) => {
    dispatch(
      removeOrderProduct({
        idProduct,
        colorProduct,
        ramProduct,
        storageProduct,
      })
    );
  };

  const handleDeleteAllOrder = () => {
    if (listChecked?.length >= 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct();
    return res.data;
  };

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });

  const { isLoading: isLoadingAllProduct, data: products } = queryProduct;

  const onDisabled = (name) => {
    const orderItemName = orders?.orderItems?.map((order) => {
      return order.name;
    });

    const data = products?.filter((product) => {
      return orderItemName?.includes(product.name);
    });

    const checkOrder = data?.find((order) => {
      return order.name === name;
    });

    return checkOrder?.countInStock;
  };

  // Price bill ======================================================
  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  const priceMemo = useMemo(() => {
    const result = orders?.orderItemsSelected?.reduce((total, curr) => {
      return total + curr.price * ((100 - curr.discount) / 100) * curr.amount;
    }, 0);

    if (Number(result)) {
      return result;
    } else {
      return 0;
    }
  }, [orders]);

  const memberDiscountPrice = useMemo(() => {
    if (priceMemo > 0) {
      if (user?.rank === "Đồng") {
        return 5;
      } else if (user?.rank === "Bạc") {
        return 10;
      } else if (user?.rank === "Vàng") {
        return 15;
      }
    } else return 0;
  }, [priceMemo]);

  const totalPrice = useMemo(() => {
    return Number(priceMemo * ((100 - memberDiscountPrice) / 100));
  }, [priceMemo, memberDiscountPrice]);

  //==================================================================

  // Create Order ====================================================
  const handleCreateOrder = () => {
    if (!user?.name || !user.address || !user.phone) {
      setIsOpenModalInfor(true);
    } else if (!orders?.orderItemsSelected?.length) {
      message.error("Hãy chọn sản phẩm muốn thanh toán");
    } else {
      navigate("/payment");
    }
  };

  //==================================================================

  // Update User =====================================================
  const [form] = Form.useForm();

  const [isOpenModalInfor, setIsOpenModalInfor] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalInfor) {
      setStateUserDetails({
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
      });
    }
  }, [isOpenModalInfor]);

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalInfor(false);
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserServices.updateUser(id, token, { ...rests });
    return res;
  });

  const { isPending } = mutationUpdate;

  const handleUpdateUserInfor = () => {
    const { name, phone, address } = stateUserDetails;
    if (name && phone && address) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, phone, address }));
            setIsOpenModalInfor(false);
            message.success("Cập nhật thông tin thành công");
          },
        }
      );
    }
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAddress = () => {
    setIsOpenModalInfor(true);
  };

  //==================================================================

  return (
    <div className={cx("cart__block")}>
      <div className={cx("cart__wrapper")}>
        <div className={cx("cart__header")}>
          <h2>Giỏ hàng của bạn </h2>
          {orders?.orderItems?.length !== 0 ? (
            <h2>(Tổng {orders?.orderItems?.length} sản phẩm)</h2>
          ) : (
            <h2>(Chưa có sản phẩm nào)</h2>
          )}
        </div>

        {orders?.orderItems?.length !== 0 ? (
          <div className={cx("cart__infor")}>
            <div className={cx("product__list")}>
              <table className={cx("product__table")}>
                <thead className={cx("product__header")}>
                  <tr>
                    <th>
                      <input
                        onChange={onCheckAllProduct}
                        checked={
                          listChecked?.length === orders?.orderItems?.length
                        }
                        className={cx("product__checkAll")}
                        type="checkbox"
                      />
                    </th>
                    <th>
                      <p className={cx("productInfor__Img")}>Hình ảnh</p>
                    </th>
                    <th>
                      <p className={cx("productInfor__name")}>Tên sản phẩm</p>
                    </th>
                    <th>
                      <p className={cx("productInfor__name")}>Phiên bản</p>
                    </th>
                    <th>
                      <p className={cx("productInfor__price")}>Thành tiền</p>
                    </th>
                    <th>
                      <p className={cx("productInfor__quatity")}>Số lượng</p>
                    </th>
                    <th
                      className={cx("delete__all__product__btn")}
                      onClick={handleDeleteAllOrder}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </th>
                  </tr>
                </thead>

                <tbody className={cx("product__section")}>
                  {orders?.orderItems?.map((order, index) => {
                    const isDisabled = true;
                    // const isDisabled = onDisabled(order?.name);

                    return (
                      <tr
                        key={index}
                        disabled={!isDisabled}
                        style={!isDisabled ? { cursor: "not-allowed" } : {}}
                        className={cx("product__group")}
                      >
                        <td>
                          <input
                            value={order?.optionId}
                            onChange={onCheckProduct}
                            checked={listChecked.includes(order?.optionId)}
                            className={cx("product__checkbox")}
                            type="checkbox"
                            disabled={!isDisabled}
                            style={!isDisabled ? { cursor: "not-allowed" } : {}}
                          />
                        </td>
                        <td className={cx("product__img")}>
                          <div className={cx("product__img__wrapper")}>
                            <img src={order?.image} alt={order?.name} />
                          </div>
                        </td>
                        <td className={cx("product__name")}>{order?.name}</td>

                        <td>
                          {order?.color}
                          <p style={{ marginTop: "4px" }}>
                            {order?.ram} / {order?.storage}
                          </p>
                        </td>
                        <td className={cx("product__price")}>
                          {order?.discount === 0
                            ? convertPrice(order?.price * order?.amount)
                            : convertPrice(
                                order?.price *
                                  ((100 - order?.discount) / 100) *
                                  order?.amount
                              )}
                        </td>
                        <td className={cx("product__quatity")}>
                          <div className={cx("quatity__section")}>
                            <button
                              onClick={() =>
                                handleChangeCount(
                                  "decreace",
                                  order?.product,
                                  order?.color,
                                  order?.ram,
                                  order?.storage,
                                  order?.amount === 1
                                )
                              }
                              className={cx("plus__btn")}
                              disabled={!isDisabled}
                              style={
                                !isDisabled ? { cursor: "not-allowed" } : {}
                              }
                            >
                              <FontAwesomeIcon
                                className={cx("plus__icon")}
                                icon={faMinus}
                              />
                            </button>
                            <input
                              className={cx("quatity__input")}
                              value={order?.amount}
                              type="number"
                              min={1}
                              max={order?.countInStock}
                              disabled={!isDisabled}
                              style={
                                !isDisabled ? { cursor: "not-allowed" } : {}
                              }
                            />
                            <button
                              onClick={() =>
                                handleChangeCount(
                                  "increace",
                                  order?.product,
                                  order?.color,
                                  order?.ram,
                                  order?.storage,
                                  order?.amount === order?.countInStock
                                )
                              }
                              className={cx("minus__btn")}
                              disabled={!isDisabled}
                              style={
                                !isDisabled ? { cursor: "not-allowed" } : {}
                              }
                            >
                              <FontAwesomeIcon
                                className={cx("minus__icon")}
                                icon={faPlus}
                              />
                            </button>
                          </div>
                        </td>
                        <td
                          onClick={() =>
                            handleDeleteOrder(
                              order?.product,
                              order?.color,
                              order?.ram,
                              order?.storage
                            )
                          }
                          className={cx("delete__product__btn")}
                        >
                          <FontAwesomeIcon
                            className={cx("delete__icon")}
                            icon={faTrash}
                          />
                        </td>

                        {!isDisabled && (
                          <p className={cx("sold__out")}>
                            Sản phẩm đang hết hàng
                          </p>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={cx("total__price")}>
              <h3 className={cx("total__header")}>Giá trị tạm tính</h3>

              <div className={cx("address__section")}>
                <p className={cx("addess__header")}>Địa chỉ:</p>
                <div className={cx("address__wrapper")}>
                  <p>{user?.address}</p>
                  <span
                    onClick={handleChangeAddress}
                    className={cx("change__btn")}
                  >
                    Thay đổi
                  </span>
                </div>
              </div>

              <div className={cx("provisional__price")}>
                <div className={cx("product__price")}>
                  <p className={cx("price__header")}>Tạm tính:</p>
                  <p className={cx("price__value")}>
                    {convertPrice(priceMemo)}
                  </p>
                </div>

                <div className={cx("product__ship")}>
                  <p className={cx("ship__header")}>Quyền lời hội viên:</p>
                  <p className={cx("ship__value")}>
                    Giảm {memberDiscountPrice}%
                  </p>
                </div>
              </div>

              <div className={cx("total__action")}>
                <div className={cx("total")}>
                  <p className={cx("total__price__header")}>Tổng tiền:</p>
                  <p className={cx("total__price__value")}>
                    {convertPrice(totalPrice)}
                  </p>
                </div>

                <button
                  onClick={() => handleCreateOrder()}
                  className={cx("order__btn")}
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={cx("no__product")}>
            <img
              className={cx("cart__empty__img")}
              src={emptyCart}
              alt="Cart Empty"
            />

            <div>
              <button
                onClick={() => navigate("/")}
                className={cx("cart__empty__btn")}
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        )}

        {orders?.orderItems?.length !== 0 ? (
          <div className={cx("cart__infor__mobile")}>
            <div className={cx("product__list")}>
              {orders?.orderItems?.map((order, index) => {
                const isDisabled = true;

                return (
                  <div key={index} className={cx("product__group")}>
                    <div className={cx("product__checkbox")}>
                      <input
                        value={order?.optionId}
                        onChange={onCheckProduct}
                        checked={listChecked.includes(order?.optionId)}
                        className={cx("product__checkbox")}
                        type="checkbox"
                        disabled={!isDisabled}
                        style={!isDisabled ? { cursor: "not-allowed" } : {}}
                      />
                    </div>

                    <div className={cx("product__wrapper")}>
                      <div className={cx("product__img__wrapper")}>
                        <img src={order?.image} alt={order?.name} />
                      </div>

                      <div className={cx("product__infor")}>
                        <h3 className={cx("product__name")}>{order?.name}</h3>

                        <div className={cx("version__wrapper")}>
                          <div className={cx("product__version")}>
                            {order?.color}
                            <p style={{ marginTop: "4px" }}>
                              {order?.ram} / {order?.storage}
                            </p>
                          </div>

                          <div className={cx("quatity__section")}>
                            <button
                              onClick={() =>
                                handleChangeCount(
                                  "decreace",
                                  order?.product,
                                  order?.color,
                                  order?.ram,
                                  order?.storage,
                                  order?.amount === 1
                                )
                              }
                              className={cx("plus__btn")}
                              disabled={!isDisabled}
                              style={
                                !isDisabled ? { cursor: "not-allowed" } : {}
                              }
                            >
                              <FontAwesomeIcon
                                className={cx("plus__icon")}
                                icon={faMinus}
                              />
                            </button>
                            <input
                              className={cx("quatity__input")}
                              value={order?.amount}
                              type="number"
                              min={1}
                              max={order?.countInStock}
                              disabled={!isDisabled}
                              style={
                                !isDisabled ? { cursor: "not-allowed" } : {}
                              }
                            />
                            <button
                              onClick={() =>
                                handleChangeCount(
                                  "increace",
                                  order?.product,
                                  order?.color,
                                  order?.ram,
                                  order?.storage,
                                  order?.amount === order?.countInStock
                                )
                              }
                              className={cx("minus__btn")}
                              disabled={!isDisabled}
                              style={
                                !isDisabled ? { cursor: "not-allowed" } : {}
                              }
                            >
                              <FontAwesomeIcon
                                className={cx("minus__icon")}
                                icon={faPlus}
                              />
                            </button>
                          </div>
                        </div>

                        <p className={cx("product__price")}>
                          {order?.discount === 0
                            ? convertPrice(order?.price * order?.amount)
                            : convertPrice(
                                order?.price *
                                  ((100 - order?.discount) / 100) *
                                  order?.amount
                              )}
                        </p>

                        {!isDisabled && (
                          <p className={cx("sold__out")}>
                            Sản phẩm đang hết hàng
                          </p>
                        )}
                      </div>

                      <div
                        onClick={() =>
                          handleDeleteOrder(
                            order?.product,
                            order?.color,
                            order?.ram,
                            order?.storage
                          )
                        }
                        className={cx("delete__product__btn")}
                      >
                        <FontAwesomeIcon
                          className={cx("delete__icon")}
                          icon={faTrash}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={cx("total__price")}>
              <h3 className={cx("total__header")}>Giá trị tạm tính</h3>

              <div className={cx("address__section")}>
                <p className={cx("addess__header")}>Địa chỉ:</p>
                <div className={cx("address__wrapper")}>
                  <p>{user?.address}</p>
                  <span
                    onClick={handleChangeAddress}
                    className={cx("change__btn")}
                  >
                    Thay đổi
                  </span>
                </div>
              </div>

              <div className={cx("provisional__price")}>
                <div className={cx("product__price")}>
                  <p className={cx("price__header")}>Tạm tính:</p>
                  <p className={cx("price__value")}>
                    {convertPrice(priceMemo)}
                  </p>
                </div>

                <div className={cx("product__ship")}>
                  <p className={cx("ship__header")}>Quyền lời hội viên:</p>
                  <p className={cx("ship__value")}>-{memberDiscountPrice}%</p>
                </div>
              </div>

              <div className={cx("total__action")}>
                <div className={cx("total")}>
                  <p className={cx("total__price__header")}>Tổng tiền:</p>
                  <p className={cx("total__price__value")}>
                    {convertPrice(totalPrice)}
                  </p>
                </div>

                <button
                  onClick={() => handleCreateOrder()}
                  className={cx("order__btn")}
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={cx("no__product__mobile")}>
            <img
              className={cx("cart__empty__img")}
              src={emptyCart}
              alt="Cart Empty"
            />

            <div>
              <button
                onClick={() => navigate("/")}
                className={cx("cart__empty__btn")}
              >
                Quay lại trang chủ
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalComponent
        title="Hãy cập nhật những thông tin cần thiết đã nhé ^-^"
        open={isOpenModalInfor}
        onCancel={handleCancleUpdate}
        onOk={handleUpdateUserInfor}
        forceRender
      >
        <Loading isPending={isPending}>
          <Form
            className={cx("form__section")}
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 32 }}
            // onFinish={onUpdateUser}
            autoComplete="off"
            labelAlign="left"
            form={form}
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên người nhận!",
                },
              ]}
            >
              <Input
                name="name"
                value={stateUserDetails.name}
                onChange={handleOnChangeDetails}
              />
            </Form.Item>

            <Form.Item
              label="Điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập số điện thoại người nhận!",
                },
              ]}
            >
              <Input
                name="phone"
                value={stateUserDetails.phone}
                onChange={handleOnChangeDetails}
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập địa chỉ nhận hàng!",
                },
              ]}
            >
              <Input
                name="address"
                value={stateUserDetails.address}
                onChange={handleOnChangeDetails}
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
}

export default Cart;

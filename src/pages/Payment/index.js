import classNames from "classnames/bind";
import style from "./Payment.module.scss";

import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import { useQuery } from "@tanstack/react-query";

import { convertPrice } from "~/utils";
import { updateUser } from "~/redux/slides/userSlide";
import { useMutationHook } from "~/hooks/useMutationHook";
import { removeAllOrderProduct } from "~/redux/slides/orderSlide";
import Loading from "~/component/LoadingComponent";
import ModalComponent from "~/component/ModalComponent";
import * as message from "~/component/Message";
import * as UserService from "~/services/UserServices";
import * as OrderService from "~/services/OrderService";
import * as PaymentService from "~/services/PaymentService";
import * as RevenueService from "~/services/RevenueService";
import * as RankService from "~/services/RankService";

const cx = classNames.bind(style);

function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.order);

  // Price bill ======================================================

  // Get All Rank ===================================================
  const getAllRank = async () => {
    const res = await RankService.getAllRank();

    return res;
  };

  const queryRank = useQuery({
    queryKey: ["rank"],
    queryFn: getAllRank,
  });

  const { data: ranks } = queryRank;

  // ================================================================

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
    const rankDiscount = ranks?.data?.find((rank) => rank?.name === user?.rank);
    if (rankDiscount) {
      return rankDiscount?.amount;
    } else return 0;
  }, [priceMemo]);

  const totalPrice = useMemo(() => {
    return Number(priceMemo * ((100 - memberDiscountPrice) / 100));
  }, [priceMemo, memberDiscountPrice]);

  const totalPaypalPrice = useMemo(() => {
    return Number((totalPrice / 25345).toFixed(2));
  }, [totalPrice]);

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

  const mutationUpdateUser = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const { isPending, data } = mutationUpdateUser;

  const handleUpdateUserInfor = () => {
    const { name, phone, address } = stateUserDetails;
    if (name && phone && address) {
      mutationUpdateUser.mutate(
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
            window.location.reload();
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

  // Create Order ====================================================

  // Revenue =========================================================
  const currentMonth = new Date().getMonth(); // Tháng hiện tại (0-11)
  const currentYear = new Date().getFullYear();

  const getRevenueCurrentMonth = async () => {
    const res = await RevenueService.getRevenueData(
      currentYear,
      currentMonth + 1
    );
    return res;
  };

  const queryRevenueCurrentMonth = useQuery({
    queryKey: ["current-month-revenue"],
    queryFn: getRevenueCurrentMonth,
  });

  const { data: currentMonthRevenue } = queryRevenueCurrentMonth;

  const mutationUpdateRavenue = useMutationHook((data) => {
    const res = RevenueService.updateRevenue(data);
    return res;
  });

  const { data: ravenueData, isSuccess: isRavenueSuccess } =
    mutationUpdateRavenue;

  // =================================================================

  const [payment, setPayment] = useState("direct");

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const handleCreateOrder = () => {
    if (
      user?.access_token &&
      orders?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      priceMemo &&
      user?.id
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationCreateOrder.mutate({
        token: user?.access_token,
        orderItems: orders?.orderItemsSelected,
        fullName: user?.name,
        phone: user?.phone,
        address: user?.address,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        memberDiscount: memberDiscountPrice,
        totalPrice: totalPrice,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  const mutationCreateOrder = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder(token, { ...rests });
    return res;
  });

  const {
    isPending: isPendingCreateOrder,
    data: dataCreateOrder,
    isSuccess: isCreateOrederSuccess,
  } = mutationCreateOrder;

  useEffect(() => {
    if (isCreateOrederSuccess && dataCreateOrder?.status === "OK") {
      message.notificationSuccess("Đặt hàng thành công");
      const arrOrdered = [];
      orders?.orderItemsSelected?.forEach((element) => {
        arrOrdered.push(element.optionId);
      });

      dispatch(removeAllOrderProduct({ listChecked: arrOrdered }));

      navigate("/order-success", {
        state: {
          payment,
          user,
          order: orders?.orderItemsSelected,
          priceMemo: priceMemo,
          memberDiscount: memberDiscountPrice,
          totalPriceMemo: totalPrice,
        },
      });
    }
  }, [isCreateOrederSuccess]);

  // Paypal ==========================================================

  const [sdkReady, setSDKReady] = useState(false);

  const handleAddPaypalScript = async () => {
    const res = await PaymentService.getConfigPayment();

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://sandbox.paypal.com/sdk/js?client-id=${res.data}`;
    script.async = true;
    script.onload = () => {
      setSDKReady(true);
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!window.paypal) {
      handleAddPaypalScript();
    } else {
      setSDKReady(true);
    }
  }, []);

  const handlePaypalSuccess = (detail, data) => {
    mutationCreateOrder.mutate({
      token: user?.access_token,
      orderItems: orders?.orderItemsSelected,
      fullName: user?.name,
      phone: user?.phone,
      address: user?.address,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      memberDiscount: memberDiscountPrice,
      totalPrice: totalPrice,
      user: user?.id,
      email: user?.email,
      isPaid: true,
    });
  };

  //==================================================================

  return (
    <Loading isPending={isPendingCreateOrder}>
      <div className={cx("payment__block")}>
        <div className={cx("payment__wrapper")}>
          <div className={cx("payment__header__section")}>
            <h3 className={cx("payment__header")}>
              <FontAwesomeIcon
                style={{ fontSize: "14px" }}
                icon={faLocationDot}
              />{" "}
              Địa chỉ nhận hàng
            </h3>

            <div className={cx("address__section")}>
              <p className={cx("payment__address")}>
                {`${user?.name} | ${user?.phone} | ${user?.address}`}
              </p>

              <p
                onClick={handleChangeAddress}
                className={cx("changeAdress_btn")}
              >
                Thay đổi
              </p>
            </div>
          </div>

          <div className={cx("cart__infor")}>
            <div className={cx("product__list")}>
              <table className={cx("product__table")}>
                <thead className={cx("product__header")}>
                  <tr>
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
                  </tr>
                </thead>

                <tbody className={cx("product__section")}>
                  {orders?.orderItemsSelected?.map((order, index) => {
                    return (
                      <tr key={index} className={cx("product__group")}>
                        <td className={cx("product__img")}>
                          <div className={cx("product__img__wrapper")}>
                            <img src={order?.image} alt="IMG" />
                          </div>
                        </td>
                        <td className={cx("product__name")}>{order?.name}</td>
                        <td className={cx("product__name")}>
                          {order?.color} {order?.ram} {order?.storage}
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
                          {order?.amount} sản phẩm
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className={cx("cart__infor__mobile")}>
                <div className={cx("product__list")}>
                  {orders?.orderItems?.map((order, index) => {
                    return (
                      <div key={index} className={cx("product__group")}>
                        <div className={cx("product__wrapper")}>
                          <div className={cx("product__img__wrapper")}>
                            <img src={order?.image} alt={order?.name} />
                          </div>

                          <div className={cx("product__infor")}>
                            <h3 className={cx("product__name")}>
                              {order?.name}
                            </h3>

                            <div className={cx("product__version")}>
                              {order?.color}
                              <p style={{ marginTop: "4px" }}>
                                {order?.ram} / {order?.storage}
                              </p>
                            </div>

                            <div className={cx("quatity__section")}>
                              {order?.amount} sản phẩm
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
            </div>

            <div className={cx("payment__section")}>
              <div className={cx("method__section")}>
                <div className={cx("payment__method")}>
                  <h4 className={cx("payment__header")}>
                    Phương thức thanh toán:
                  </h4>

                  <div className={cx("payment__choosen")}>
                    <div className={cx("payment__group")}>
                      <input
                        onChange={handlePayment}
                        value="direct"
                        type="radio"
                        name="payment"
                        checked={payment === "direct"}
                      />{" "}
                      Thanh toán khi nhận hàng
                    </div>

                    <div className={cx("payment__group")}>
                      <input
                        onChange={handlePayment}
                        value="paypal"
                        type="radio"
                        name="payment"
                        checked={payment === "paypal"}
                      />{" "}
                      Thanh toán bằng Paypal
                    </div>
                  </div>
                </div>
              </div>

              <div className={cx("total__price")}>
                <h3 className={cx("total__header")}>Giá trị đơn hàng</h3>

                <div className={cx("provisional__price")}>
                  <div className={cx("product__price")}>
                    <p className={cx("price__header")}>Giá trị sản phẩm:</p>
                    <p className={cx("price__value")}>
                      {convertPrice(priceMemo)}
                    </p>
                  </div>

                  <div className={cx("product__ship")}>
                    <p className={cx("ship__header")}>Quyền lợi hội viên:</p>
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

                  {payment === "paypal" && sdkReady ? (
                    <PayPalButton
                      amount={totalPaypalPrice}
                      onSuccess={handlePaypalSuccess}
                      onError={() => {
                        alert("Fail to Purchare");
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => handleCreateOrder()}
                      className={cx("order__btn")}
                    >
                      Đặt hàng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
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
    </Loading>
  );
}

export default Payment;

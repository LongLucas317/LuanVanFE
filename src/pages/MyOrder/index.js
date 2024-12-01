import classNames from "classnames/bind";
import styles from "./MyOrder.module.scss";

import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import * as OrderService from "~/services/OrderService";

import { updateUser } from "~/redux/slides/userSlide";
import { convertPrice } from "~/utils";
import { useEffect, useState } from "react";
import { useMutationHook } from "~/hooks/useMutationHook";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Loading from "~/component/LoadingComponent";
import ModalComponent from "~/component/ModalComponent";
const cx = classNames.bind(styles);

function MyOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const location = useLocation();
  const { state } = location;

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res?.data;
  };

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: fetchMyOrder });

  const { data } = queryOrder;

  const mutationCancelOrder = useMutationHook((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutationCancelOrder.mutate(
      {
        id: order._id,
        token: state?.token,
        orderItems: order?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  const {
    data: dataOrderDelete,
    isPending: isPendingOrderDelete,
    isSuccess: isSuccessOrderDelete,
    isError: isErrorOrderDelete,
  } = mutationCancelOrder;

  useEffect(() => {
    if (isSuccessOrderDelete && dataOrderDelete.status === 200) {
      message.success("Hủy đơn đặt hàng thành công");

      window.location.reload();
    } else if (isErrorOrderDelete) {
      message.error("Hủy đơn đặt hàng thất bại");
    }
  }, [isSuccessOrderDelete, isErrorOrderDelete]);

  // Update Order ======================================================
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [idOrderUpdate, setIdOrderUpdate] = useState(null);
  const [dataOrderUpdate, setDataOrderUpdate] = useState("");

  const handleOpenUpdateOrderModal = (id, data) => {
    setIdOrderUpdate(id);
    setDataOrderUpdate(data);
    setIsOpenModal(true);
  };

  const handleCloseUpdateOrderModal = () => {
    setIdOrderUpdate(null);
    setDataOrderUpdate("");
    setIsOpenModal(false);
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token } = data;

    const res = OrderService.updateOrder(id, token, { ...data });
    return res;
  });

  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdate,
  } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật đơn hàng Thành công");
      handleCloseUpdateOrderModal();
    } else if (isErrorUpdate) {
      message.error("Cập nhật đơn hàng Thất bại");
    }
  }, [isSuccessUpdated, isErrorUpdate]);

  const onUpdateOrder = () => {
    mutationUpdate.mutate(
      {
        id: idOrderUpdate,
        token: user?.access_token,
        isDelivered: dataOrderUpdate,
      },
      {
        onSettled: () => {
          queryOrder.refetch();
        },
      }
    );
  };

  // ===================================================================

  return (
    <Loading isPending={isPendingOrderDelete}>
      <div className={cx("myOrder__block")}>
        <div className={cx("myOrder__header")}>
          <h2 className={cx("header__Text")}>Đơn hàng của bạn:</h2>
          <p className={cx("header__total__price")}>
            (Tổng giá trị toàn bộ đơn hàng:
            <span style={{ color: "red", marginLeft: "12px" }}>
              {convertPrice(user.totalInvoice)}
            </span>
            )
          </p>
        </div>

        <div className={cx("myOrder__section")}>
          <div className={cx("myOrder__list")}>
            {data?.length !== 0 &&
              data?.map((order) => {
                return (
                  <div className={cx("myOrder__group")} key={order._id}>
                    <h3 className={cx("order__group__header")}>
                      Đơn hàng: {order._id}
                    </h3>

                    <table className={cx("order__infor")}>
                      <thead className={cx("order__infor__header")}>
                        <tr>
                          <th>Tên sản phẩm</th>
                          <th>Hình ảnh</th>
                          <th>Màu</th>
                          <th>Phiên bản</th>
                          <th>Số lượng</th>
                          <th>Giá</th>
                          <th>Trạng thái</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>

                      <tbody className={cx("order__infor__body")}>
                        {order?.orderItems?.map((item) => {
                          return (
                            <tr key={item._id}>
                              <td>{item.name}</td>
                              <td>
                                <div className={cx("product__img")}>
                                  <img src={item.image} alt={item.name} />
                                </div>
                              </td>
                              <td>{item.color}</td>
                              <td>
                                {item.ram}/{item.storage}
                              </td>
                              <td>{item.amount}</td>
                              <td>
                                <p style={{ color: "red", fontWeight: "550" }}>
                                  {item.discount
                                    ? convertPrice(
                                        item.price *
                                          ((100 - item.discount) / 100)
                                      )
                                    : convertPrice(item.price)}
                                </p>
                              </td>
                              <td>
                                <p>{order.isDelivered}</p>
                                <p style={{ marginTop: "8px" }}>
                                  {order.isPaid
                                    ? "Đã thanh toán"
                                    : "Chưa thanh toán"}
                                </p>
                              </td>
                              <td>
                                <p style={{ color: "red", fontWeight: "550" }}>
                                  {item.discount
                                    ? convertPrice(
                                        item.price *
                                          ((100 - item.discount) / 100) *
                                          item.amount
                                      )
                                    : convertPrice(item.price * item.amount)}
                                </p>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className={cx("total__price")}>
                      <div className={cx("price__section")}>
                        <h4>Tổng giá trị đơn hàng: </h4>
                        <p style={{ color: "red", fontWeight: "550" }}>
                          {convertPrice(order.totalPrice)}
                        </p>
                      </div>

                      <div className={cx("action__section")}>
                        {order.isDelivered === "Chưa giao" && (
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className={cx("action__btn")}
                          >
                            Hủy đặt hàng
                          </button>
                        )}

                        <button
                          onClick={() =>
                            navigate(`/order-detail/${order._id}`, {
                              state: {
                                token: state?.token,
                              },
                            })
                          }
                          className={cx("action__btn")}
                        >
                          Xem chi tiết
                        </button>

                        {order.isDelivered ===
                          "Đã giao cho đơn vị vận chuyển" && (
                          <button
                            onClick={() =>
                              handleOpenUpdateOrderModal(
                                order._id,
                                "Đã nhận được hàng"
                              )
                            }
                            className={cx("action__btn")}
                          >
                            Đã nhận hàng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <ModalComponent
          title="Hoàn thành sản phẩm"
          open={isOpenModal}
          onCancel={handleCloseUpdateOrderModal}
          onOk={onUpdateOrder}
          forceRender
        >
          <div className={cx("delete__text")}>Bạn đã nhận được hàng???</div>
        </ModalComponent>
      </div>
    </Loading>
  );
}

export default MyOrder;

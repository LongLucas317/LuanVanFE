import classNames from "classnames/bind";
import styles from "./TableComponent.module.scss";
import React from "react";

import { Pagination } from "antd";
import Loading from "../LoadingComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function TableComponent(props) {
  const {
    keySelect,
    handleUpdate,
    handleDelete,
    handleViewDetail,
    handleOpenUpdateOrderModal,
    handleOpenUpdateOrderModalReceive,
    data: dataSource = [],
    columns = [],
    isLoadingAllProduct = false,
  } = props;

  const renderAction = (id) => {
    return (
      <div className={cx("action__wrapper")}>
        {(keySelect === "product" ||
          keySelect === "user" ||
          keySelect === "userRank") && (
          <FontAwesomeIcon
            style={{
              color: "#318ef2",
              fontSize: "18px",
              cursor: "pointer",
            }}
            icon={faPen}
            onClick={() => handleUpdate(id)}
          />
        )}

        {(keySelect === "product" ||
          keySelect === "user" ||
          keySelect === "userRank") && (
          <FontAwesomeIcon
            style={{
              margin: "0px 8px",
              color: "#ff3e3e",
              fontSize: "18px",
              cursor: "pointer",
            }}
            icon={faTrash}
            onClick={() => handleDelete(id)}
          />
        )}

        {(keySelect === "product" || keySelect === "order") && (
          <FontAwesomeIcon
            style={{
              color: "#10d717",
              fontSize: "18px",
              cursor: "pointer",
            }}
            icon={faEye}
            onClick={() => handleViewDetail(id)}
          />
        )}
      </div>
    );
  };

  const renderChangeStatus = (order) => {
    return (
      <div className={cx("status__wrapper")}>
        {order?._id !== null ? (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleOpenUpdateOrderModalReceive(order, "Đã nhận đơn");
              }}
              className={cx("receive__btn")}
              disabled={order?.isDelivered === "Đã nhận đơn"}
              style={
                order?.isDelivered === "Đã nhận đơn"
                  ? { cursor: "not-allowed" }
                  : {}
              }
            >
              Đã Nhận Đơn
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleOpenUpdateOrderModal(
                  order?._id,
                  "Đã giao cho đơn vị vận chuyển"
                );
              }}
              className={cx("ship__btn")}
              disabled={order?.isDelivered === "Đã giao cho đơn vị vận chuyển"}
              style={
                order?.isDelivered === "Đã giao cho đơn vị vận chuyển"
                  ? { cursor: "not-allowed" }
                  : {}
              }
            >
              Đã Giao
            </button>
          </>
        ) : (
          <div>Đơn hàng đã hoàn thành</div>
        )}
      </div>
    );
  };

  return (
    <Loading isPending={isLoadingAllProduct}>
      <div className={cx("tableComponent__wrapper")}>
        <div>
          <table className={cx("data__table")}>
            <thead>
              <tr>
                {columns?.map((column, index) => {
                  return <th key={index}>{column?.title}</th>;
                })}
              </tr>
            </thead>

            <tbody>
              {dataSource?.reverse()?.map((data) => {
                return (
                  <tr key={data?._id}>
                    {columns?.map((column, index) => {
                      const renderData =
                        column?.dataIndex === "isPublic"
                          ? data?.[column?.dataIndex]
                            ? "Công khai"
                            : "Không công khai"
                          : column?.dataIndex === "isPaid"
                          ? data?.[column?.dataIndex]
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"
                          : column?.dataIndex === "updateOrder"
                          ? data?.["isDelivered"] !== "Đã nhận được hàng"
                            ? renderChangeStatus(data)
                            : renderChangeStatus(null)
                          : column?.dataIndex !== "action"
                          ? data?.[column?.dataIndex]
                          : renderAction(data?._id);

                      return (
                        <td
                          key={index}
                          style={
                            column?.dataIndex === "name" ||
                            column?.dataIndex === "userName"
                              ? {
                                  color: "blue",
                                  fontWeight: "550",
                                  textAlign: "left",
                                }
                              : column?.dataIndex === "totalPrice"
                              ? { color: "red" }
                              : {}
                          }
                        >
                          <p>{renderData}</p>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Loading>
  );
}

export default TableComponent;

import classNames from "classnames/bind";
import styles from "./TableComponent.module.scss";
import React from "react";

import { Table } from "antd";
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
    data: dataSource = [],
    columns = [],
    isLoadingAllProduct = false,
  } = props;

  const renderAction = (id) => {
    return (
      <div className={cx("action__wrapper")}>
        {(keySelect === "product" || keySelect === "user") && (
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

        {(keySelect === "product" || keySelect === "user") && (
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

  const renderChangeStatus = (id) => {
    return (
      <div className={cx("status__wrapper")}>
        {id !== null ? (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleOpenUpdateOrderModal(id, "Đã nhận đơn");
              }}
              className={cx("receive__btn")}
            >
              Đã Nhận Đơn
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleOpenUpdateOrderModal(id, "Đã giao cho đơn vị vận chuyển");
              }}
              className={cx("ship__btn")}
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
              {dataSource?.map((data) => {
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
                            ? renderChangeStatus(data?._id)
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

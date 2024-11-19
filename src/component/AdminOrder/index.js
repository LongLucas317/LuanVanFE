import classNames from "classnames/bind";
import styles from "./AdminOrder.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { Button, Input, Space } from "antd";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import * as message from "~/component/Message";
import TableComponent from "../TableComponent";
import ModalComponent from "../ModalComponent";
import DrawerComponent from "../DrawerComponent";
import * as OrderService from "~/services/OrderService";
import { convertPrice } from "~/utils";
import ViewOrderComponent from "../ViewOrderComponent";
import { useMutationHook } from "~/hooks/useMutationHook";

const cx = classNames.bind(styles);

function AdminOrder({ keySelect }) {
  const user = useSelector((state) => state?.user);

  // Create Order========================================================

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const { data: orders } = queryOrder;

  // ==========================================================================

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

  // Get Order Detail==========================================================
  const initial = {
    id: "",
    isDelivered: "",
    isPaid: false,
    itemsPrice: "",
    orderItems: [
      {
        amount: "",
        color: "",
        discount: "",
        image: "",
        name: "",
        optionId: "",
        price: "",
        product: "",
        ram: "",
        storage: "",
      },
    ],
    paymentMethod: "",
    shippingAddress: {
      fullName: "",
      address: "",
      city: "",
      phone: "",
    },
    memberDiscount: "",
    totalPrice: "",
    user: "",
  };

  const [isOpenViewOrder, setIsOpenViewOrder] = useState(false);
  const [viewOrderData, setViewOrderData] = useState(initial);

  const fetchDetailsOrder = async (id, token) => {
    const res = await OrderService.getDetailsOrder(id, token);

    if (res?.data) {
      setViewOrderData({
        id: res?.data?._id,
        isDelivered: res?.data?.isDelivered,
        isPaid: res?.data?.isPaid,
        itemsPrice: res?.data?.itemsPrice,
        orderItems: res?.data?.orderItems,
        paymentMethod: res?.data?.paymentMethod,
        shippingAddress: {
          fullName: res?.data?.shippingAddress?.fullName,
          address: res?.data?.shippingAddress?.address,
          city: res?.data?.shippingAddress?.city,
          phone: res?.data?.shippingAddress?.phone,
        },
        memberDiscount: res?.data?.memberDiscount,
        totalPrice: res?.data?.totalPrice,
        user: res?.data?.user,
      });
    }
  };

  const handleViewOrderDetail = (id) => {
    if (id) {
      fetchDetailsOrder(id, user?.access_token);
    }
    setIsOpenViewOrder(true);
  };

  const handleCloseViewOrderDetail = () => {
    setViewOrderData(initial);
    setIsOpenViewOrder(false);
  };

  // ===================================================================

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "userName",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      filters: [
        {
          text: "Đã giao",
          value: true,
        },
        {
          text: "Chưa giao",
          value: false,
        },
      ],
      onFilter: (value, record) => {
        if (value === true) {
          return record.isDelivered === "Đã giao";
        }
        return record.isDelivered === "Chưa giao";
      },
    },
    {
      title: "Giao hàng",
      dataIndex: "isDelivered",
      filters: [
        {
          text: "Đã giao",
          value: true,
        },
        {
          text: "Chưa giao",
          value: false,
        },
      ],
      onFilter: (value, record) => {
        if (value === true) {
          return record.isDelivered === "Đã giao";
        }
        return record.isDelivered === "Chưa giao";
      },
    },
    // {
    //   title: "Sản phẩm",
    //   dataIndex: "productName",
    //   ...getColumnSearchProps("productName"),
    // },
    {
      title: "Cập nhật trạng thái",
      dataIndex: "updateOrder",
      ...getColumnSearchProps("productName"),
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        productName:
          order?.orderItems?.length > 1
            ? order?.orderItems
                ?.map((item) => {
                  return `${item.name} ${item.amount} sản phẩm`;
                })
                .join(" và ")
            : order?.orderItems?.map((item) => {
                return `${item.name} ${item.amount} sản phẩm`;
              }),
        address: `${order?.shippingAddress?.address} - ${order?.shippingAddress?.city}`,
        phone: order?.shippingAddress?.phone,
        isDelivered: order?.isDelivered,
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  return (
    <div className={cx("adminUser__wrapper")}>
      <h2 className={cx("adminUser__header")}>Quản lý đơn hàng</h2>

      <div className={cx("table__section")}>
        <TableComponent
          handleViewDetail={(id) => handleViewOrderDetail(id)}
          keySelect={keySelect}
          columns={columns}
          data={dataTable}
          handleOpenUpdateOrderModal={handleOpenUpdateOrderModal}
        />
      </div>

      {isOpenViewOrder && (
        <ViewOrderComponent
          data={viewOrderData}
          handleCloseViewOrderDetail={handleCloseViewOrderDetail}
        />
      )}

      <ModalComponent
        title="Hoàn thành sản phẩm"
        open={isOpenModal}
        onCancel={handleCloseUpdateOrderModal}
        onOk={onUpdateOrder}
        forceRender
      >
        <div className={cx("delete__text")}>Bạn đã hoàn thành đơn này???</div>
      </ModalComponent>
    </div>
  );
}

export default AdminOrder;

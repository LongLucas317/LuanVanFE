import classNames from "classnames/bind";
import styles from "./AdminOrder.module.scss";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { convertPrice } from "~/utils";
import { useMutationHook } from "~/hooks/useMutationHook";
import TableComponent from "../TableComponent";
import ModalComponent from "../ModalComponent";
import * as message from "~/component/Message";
import * as OrderService from "~/services/OrderService";
import * as RankService from "~/services/RankService";
import * as RevenueService from "~/services/RevenueService";
import * as UserServices from "~/services/UserServices";
import ViewOrderComponent from "../ViewOrderComponent";

const cx = classNames.bind(styles);

function AdminOrder({ keySelect }) {
  const user = useSelector((state) => state?.user);

  // Create Order====================================================
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user?.access_token);

    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const { data: orders } = queryOrder;

  // ================================================================

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

  const handleUpdateRevenue = (amount) => {
    if (currentMonthRevenue?.status === "ERR") {
      mutationUpdateRavenue.mutate({
        year: currentYear,
        month: currentMonth + 1,
        amount: amount,
      });
    } else {
      const revenueAmount = currentMonthRevenue?.data?.find(
        (_, index) => index === 0
      );

      mutationUpdateRavenue.mutate({
        year: currentYear,
        month: currentMonth + 1,
        amount: revenueAmount?.amount + amount,
      });
    }
  };

  // =================================================================

  // Get All User ====================================================

  const getAllUser = async () => {
    const res = await UserServices.getAllsUser(user?.access_token, "");
    return res;
  };

  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: getAllUser,
  });

  const { data: users } = queryUser;

  const mutationUpdateUser = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserServices.updateUser(id, token, { ...rests });
    return res;
  });

  const handleCheckUpdateUser = (userId, total) => {
    const userData = users?.data?.find((user) => user?._id === userId);

    mutationUpdateUser.mutate(
      {
        id: userData?._id,
        token: user?.access_token,
        totalInvoice: userData?.totalInvoice + total,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );

    ranks?.data?.forEach((rank) => {
      if (userData?.rank !== rank?.name) {
        if (
          userData?.totalInvoice + total > rank?.min &&
          userData?.totalInvoice + total <= rank?.max
        ) {
          mutationUpdateUser.mutate(
            {
              id: userData?._id,
              token: user?.access_token,
              rank: rank?.name,
            },
            {
              onSettled: () => {
                queryUser.refetch();
              },
            }
          );
        }
      }
    });
  };

  // ================================================================

  // Update Order ======================================================
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalReceive, setIsOpenModalReceive] = useState(false);
  const [idOrderUpdate, setIdOrderUpdate] = useState(null);
  const [idUserUpdate, setIdUserUpdate] = useState(null);
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

  const handleOpenUpdateOrderModalReceive = (order, data) => {
    setIdUserUpdate(order?.user);
    setIdOrderUpdate(order._id);
    setDataOrderUpdate(data);
    setIsOpenModalReceive(true);
  };

  const handleCloseUpdateOrderModalReceive = () => {
    setIdOrderUpdate(null);
    setIdUserUpdate(null);
    setDataOrderUpdate("");
    setIsOpenModalReceive(false);
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
      handleCloseUpdateOrderModalReceive();
    } else if (isErrorUpdate) {
      message.error("Cập nhật đơn hàng Thất bại");
    }
  }, [isSuccessUpdated, isErrorUpdate]);

  const onUpdateOrder = () => {
    const theOrder = orders?.data?.find(
      (order) => order?._id === idOrderUpdate
    );

    if (dataOrderUpdate === "Đã nhận đơn") {
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

      handleCheckUpdateUser(idUserUpdate, theOrder?.totalPrice);
      handleUpdateRevenue(theOrder?.totalPrice);
    } else {
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
    }
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

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "userName",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
    },
    {
      title: "Giao hàng",
      dataIndex: "isDelivered",
    },
    {
      title: "Cập nhật trạng thái",
      dataIndex: "updateOrder",
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
        address: order?.shippingAddress?.address,
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
          handleOpenUpdateOrderModalReceive={handleOpenUpdateOrderModalReceive}
        />
      </div>

      {isOpenViewOrder && (
        <ViewOrderComponent
          data={viewOrderData}
          handleCloseViewOrderDetail={handleCloseViewOrderDetail}
        />
      )}

      <ModalComponent
        title="Đã nhận đơn"
        open={isOpenModalReceive}
        onCancel={handleCloseUpdateOrderModalReceive}
        onOk={onUpdateOrder}
        forceRender
      >
        <div className={cx("delete__text")}>Xác nhận đơn này???</div>
      </ModalComponent>

      <ModalComponent
        title="Hoàn thành đơn hàng"
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

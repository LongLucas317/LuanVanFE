import classNames from "classnames/bind";
import style from "./AdminUserRank.module.scss";

import { useEffect, useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { convertPrice } from "~/utils";
import { useQuery } from "@tanstack/react-query";
import { useMutationHook } from "~/hooks/useMutationHook";
import TableComponent from "../TableComponent";
import ModalComponent from "../ModalComponent";
import DrawerComponent from "../DrawerComponent";
import * as message from "~/component/Message";
import * as RankService from "~/services/RankService";
import * as UserServices from "~/services/UserServices";
import useSelection from "antd/es/table/hooks/useSelection";
import { Button, Input, Form } from "antd";

const cx = classNames.bind(style);

function AdminDashboard({ keySelect }) {
  const user = useSelection((state) => state.user);

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

  const handleCheckUpdateRank = (stateRankDetails) => {
    ranks?.data?.forEach((rank) => {
      users?.data?.forEach((user) => {
        if (user?.rank === stateRankDetails?.name) {
          if (
            user?.totalInvoice > stateRankDetails?.min &&
            user?.totalInvoice <= stateRankDetails?.max
          ) {
            mutationUpdateUser.mutate(
              {
                id: user?._id,
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
    });
  };

  // ================================================================

  // Create Rank ====================================================
  const [formCreate] = Form.useForm();
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);

  const [stateRank, setStateRank] = useState({
    name: "",
    amount: "",
    min: "",
    max: "",
    level: "",
  });

  const handleCloseCreateRank = () => {
    setStateRank({
      name: "",
      amount: "",
      min: "",
      max: "",
      level: "",
    });
    formCreate.resetFields();
    setIsOpenModalCreate(false);
  };

  const handleOnChange = (e) => {
    setStateRank({
      ...stateRank,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutationHook((data) => {
    const { name, amount, min, max, level } = data;
    const res = RankService.createRank({
      name,
      amount,
      min,
      max,
      level,
    });
    return res;
  });

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Thêm Bậc xếp hạng Thành công");
      handleCloseCreateRank();
    } else if (isError) {
      message.error("Thêm Bậc xếp hạng Thất bại");
    }
  }, [isSuccess]);

  const onCreateRank = () => {
    const params = {
      name: stateRank.name,
      amount: stateRank.amount,
      min: stateRank.min,
      max: stateRank.max,
      level: stateRank.level,
    };

    mutation.mutate(params, {
      onSettled: () => {
        queryRank.refetch();
      },
    });

    handleCheckUpdateRank(stateRank);
  };
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

  const columns = [
    {
      title: "Tên bậc",
      dataIndex: "name",
    },
    {
      title: "Giới hạn dưới",
      dataIndex: "min",
    },
    {
      title: "Ưu đãi",
      dataIndex: "amount",
    },
    {
      title: "Giới hạn trên",
      dataIndex: "max",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const dataTable =
    ranks?.data?.length &&
    ranks?.data?.map((rank) => {
      return {
        ...rank,
        min: convertPrice(rank.min),
        max: convertPrice(rank.max),
        amount: `${rank.amount}%`,
        key: rank._id,
      };
    });
  // ================================================================

  // Update Rank ====================================================

  // Get Detail Rank ================================================
  const [formUpdate] = Form.useForm();
  const [idRankUpdate, setIdRankUpdate] = useState(null);
  const [isOpenUpdateRank, setIsOpenUpdateRank] = useState(false);
  const [stateRankDetails, setStateRankDetails] = useState({
    name: "",
    amount: "",
    min: "",
    max: "",
    level: "",
  });

  const handleOnChangeDetails = (e) => {
    setStateRankDetails({
      ...stateRankDetails,
      [e.target.name]: e.target.value,
    });
  };

  const fetchGetDetailsRank = async (id) => {
    const res = await RankService.getDetailsRank(id);
    if (res?.data) {
      setStateRankDetails({
        name: res?.data?.name,
        amount: res?.data?.amount,
        min: res?.data?.min,
        max: res?.data?.max,
        level: res?.data?.level,
      });
    }
  };

  // ================================================================

  useEffect(() => {
    formUpdate.setFieldsValue(stateRankDetails);
  }, [formUpdate, stateRankDetails]);

  const handleOpenDetailRank = (id) => {
    if (id) {
      fetchGetDetailsRank(id);
      setIdRankUpdate(id);
    }
    setIsOpenUpdateRank(true);
  };

  const handleCloseDetailRank = () => {
    setIsOpenUpdateRank(false);
    setStateRankDetails({
      name: "",
      amount: "",
      min: "",
      max: "",
      level: "",
    });
    setIdRankUpdate(null);
    formUpdate.resetFields();
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = RankService.updateRank(id, token, { ...rests });
    return res;
  });

  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      handleCloseDetailRank();
      setIdRankUpdate(null);
      message.success("Cập nhật Bậc xếp hạng thành công");
    } else if (isErrorUpdated) {
      message.error("Cập nhật Bậc xếp hạng thất bại");
      handleCloseDetailRank();
      setIdRankUpdate(null);
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  const onUpdateRank = () => {
    mutationUpdate.mutate(
      {
        id: idRankUpdate,
        token: user?.access_token,
        ...stateRankDetails,
      },
      {
        onSettled: () => {
          queryRank.refetch();
        },
      }
    );

    handleCheckUpdateRank(stateRankDetails);
  };

  // ================================================================

  // Delete Rank ====================================================
  const [idDeleteRank, setIdDeleteRank] = useState(null);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const handleOpenModalDelete = (id) => {
    setIdDeleteRank(id);
    setIsModalOpenDelete(true);
  };

  const handleCancelDelete = () => {
    setIdDeleteRank(null);
    setIsModalOpenDelete(false);
  };

  const handleDeleteRank = () => {
    mutationDelete.mutate(
      { id: idDeleteRank, token: user?.access_token },
      {
        onSettled: () => {
          queryRank.refetch();
        },
      }
    );
  };

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = RankService.deleteRank(id, token);
    return res;
  });

  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      handleCancelDelete();
      message.success("Xóa Bậc xếp hạng thành công");
    } else if (isErrorDeleted) {
      handleCancelDelete();
      message.error("Xóa Bậc xếp hạng thất bại");
    }
  }, [isSuccessDeleted, isErrorDeleted]);

  // ================================================================

  return (
    <div className={cx("adminDashboard__wrapper")}>
      <h2>Xếp hàng người dùng</h2>

      <div className={cx("adminProduct__header__block")}>
        <div
          onClick={() => setIsOpenModalCreate(true)}
          className={cx("add__icon")}
        >
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>

      <div className={cx("table__section")}>
        <TableComponent
          keySelect={keySelect}
          handleUpdate={(id) => handleOpenDetailRank(id)}
          handleDelete={(id) => handleOpenModalDelete(id)}
          columns={columns}
          data={dataTable}
          // isPending={isLoadingAllProduct}
        />
      </div>

      <ModalComponent
        title="Thêm Bậc xếp hạng"
        open={isOpenModalCreate}
        onCancel={handleCloseCreateRank}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 32 }}
          onFinish={onCreateRank}
          autoComplete="off"
          labelAlign="left"
          form={formCreate}
        >
          <Form.Item label="Cấp bậc" name="level">
            <Input
              name="level"
              value={stateRank.level}
              onChange={handleOnChange}
            />
          </Form.Item>

          <Form.Item
            label="Ưu đãi"
            name="amount"
            rules={[
              {
                required: true,
                message: "Ưu đãi là bắt buộc!",
              },
            ]}
          >
            <Input
              name="amount"
              value={stateRank.amount}
              onChange={handleOnChange}
            />
          </Form.Item>

          <Form.Item
            label="Tên bậc xếp hạng"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên bậc là bắc buộc!",
              },
            ]}
          >
            <Input
              name="name"
              value={stateRank.name}
              onChange={handleOnChange}
            />
          </Form.Item>

          <Form.Item
            label="Giới hạn dưới của Bậc hạng"
            name="min"
            rules={[
              {
                required: true,
                message: "Giới hạn này là bắt buộc!",
              },
            ]}
          >
            <Input name="min" value={stateRank.min} onChange={handleOnChange} />
          </Form.Item>

          <Form.Item
            label="Giới hạn trên của Bậc hạng"
            name="max"
            rules={[
              {
                required: true,
                message: "Giới hạn này là bắt buộc!",
              },
            ]}
          >
            <Input name="max" value={stateRank.max} onChange={handleOnChange} />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 20,
              span: 18,
            }}
          >
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </ModalComponent>

      <DrawerComponent
        title="Chi tiết xếp hạng"
        isOpen={isOpenUpdateRank}
        onClose={() => setIsOpenUpdateRank(false)}
      >
        <Form
          className={cx("form__section")}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          onFinish={onUpdateRank}
          autoComplete="off"
          labelAlign="left"
          form={formUpdate}
        >
          <Form.Item label="Cấp bậc" name="level">
            <Input
              name="level"
              value={stateRankDetails.level}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item
            label="Ưu đãi"
            name="amount"
            rules={[
              {
                required: true,
                message: "Ưu đãi là bắt buộc!",
              },
            ]}
          >
            <Input
              name="amount"
              value={stateRankDetails.amount}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item
            label="Tên bậc xếp hạng"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên bậc là bắc buộc!",
              },
            ]}
          >
            <Input
              name="name"
              value={stateRankDetails.name}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item
            label="Giới hạn dưới của Bậc hạng"
            name="min"
            rules={[
              {
                required: true,
                message: "Giới hạn này là bắt buộc!",
              },
            ]}
          >
            <Input
              name="min"
              value={stateRankDetails.min}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item
            label="Giới hạn trên của Bậc hạng"
            name="max"
            rules={[
              {
                required: true,
                message: "Giới hạn này là bắt buộc!",
              },
            ]}
          >
            <Input
              name="max"
              value={stateRankDetails.max}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 20,
              span: 18,
            }}
          >
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>

      <ModalComponent
        title="Xóa Bậc xếp hạng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteRank}
        forceRender
      >
        <div className={cx("delete__text")}>
          Bạn có chắc muốn Bậc xếp hạng này không???
        </div>
      </ModalComponent>
    </div>
  );
}

export default AdminDashboard;

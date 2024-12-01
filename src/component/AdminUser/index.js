import classNames from "classnames/bind";
import styles from "./AdminUser.module.scss";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { Button, Form, Input } from "antd";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useMutationHook } from "~/hooks/useMutationHook";

import TableComponent from "../TableComponent";
import ModalComponent from "../ModalComponent";
import DrawerComponent from "../DrawerComponent";
import * as UserServices from "~/services/UserServices";
import * as message from "~/component/Message";

const cx = classNames.bind(styles);

function AdminUser({ keySelect }) {
  const [form] = Form.useForm();
  const user = useSelector((state) => state?.user);

  // Get All User ===================================================
  const [usersData, setUsersData] = useState([]);

  const getAllUser = async (filter = "") => {
    let res = {};
    if (filter.length > 0) {
      res = await UserServices.getAllsUser(user?.access_token, filter);
    } else {
      res = await UserServices.getAllsUser(user?.access_token, "");
    }

    if (res?.status === "OK") {
      setUsersData(res);
    }
    // return res;
  };

  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: getAllUser,
  });

  const { data: users } = queryUser;

  // ================================================================

  // Search Data ====================================================
  const [searchDataInput, setSearchInput] = useState("");
  const [isShowRemoveIcon, setIsShowRemoveIcon] = useState(false);

  const handleOnchangeSearchInput = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value.trim().length > 0) {
      setIsShowRemoveIcon(true);
    }
  };

  const handleSearchData = () => {
    getAllUser(searchDataInput);
  };

  const handleClearInput = () => {
    getAllUser();
    setSearchInput("");
    setIsShowRemoveIcon(false);
  };
  // ================================================================

  // Update User========================================================
  const [idUserUpdate, setIdUserUpdate] = useState(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isAdmin: false,
  });

  const toggleButton = () => {
    setStateUserDetails({
      ...stateUserDetails,
      isAdmin: !stateUserDetails?.isAdmin,
    });
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const fetchGetDetailsUser = async (id) => {
    const res = await UserServices.getDetailUser(id);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        address: res?.data?.address,
        isAdmin: res?.data?.isAdmin,
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const handleDetailsUser = (id) => {
    if (id) {
      fetchGetDetailsUser(id);
      setIdUserUpdate(id);
    }
    setIsOpenDrawer(true);
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserServices.updateUser(id, token, { ...rests });
    return res;
  });

  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      handleCloseDrawer();
      setIdUserUpdate(null);
      message.success("Cập nhật tài khoản thành công");
    } else if (isErrorUpdated) {
      message.error("Cập nhật tài khoản thất bại");
      handleCloseDrawer();
      setIdUserUpdate(null);
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setIdUserUpdate(null);

    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      isAdmin: false,
    });
    form.resetFields();
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: idUserUpdate,
        token: user?.access_token,
        ...stateUserDetails,
      },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  // ===================================================================

  // Delete User========================================================
  const [idDeleteUser, setIdDeleteUser] = useState(null);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const handleOpenModalDelete = (id) => {
    setIdDeleteUser(id);
    setIsModalOpenDelete(true);
  };

  const handleCancelDelete = () => {
    setIdDeleteUser(null);
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: idDeleteUser, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = UserServices.deleteUser(id, token);
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
      message.success("Xóa tài khoản thành công");
    } else if (isErrorDeleted) {
      handleCancelDelete();
      message.error("Xóa tài khoản thất bại");
    }
  }, [isSuccessDeleted, isErrorDeleted]);

  // ===================================================================

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
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
      title: "Xếp hạng",
      dataIndex: "rank",
    },
    {
      title: "Vai trò",
      dataIndex: "isAdmin",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const dataTable =
    usersData?.data?.length &&
    usersData?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user?.isAdmin ? "Admin" : "Member",
      };
    });

  return (
    <div className={cx("adminUser__wrapper")}>
      <h2 className={cx("adminUser__header")}>Quản lý người dùng</h2>

      <div className={cx("search__section")}>
        <input
          value={searchDataInput}
          onChange={handleOnchangeSearchInput}
          className={cx("search__input")}
          placeholder="Tên tài khoản"
        />
        {isShowRemoveIcon && (
          <FontAwesomeIcon
            onClick={handleClearInput}
            className={cx("removeInput__icon")}
            icon={faXmark}
          />
        )}
        <button onClick={handleSearchData} className={cx("search__btn")}>
          Tìm kiếm
        </button>
      </div>

      <div className={cx("table__section")}>
        <TableComponent
          keySelect={keySelect}
          handleUpdate={(id) => handleDetailsUser(id)}
          handleDelete={handleOpenModalDelete}
          columns={columns}
          data={dataTable}
        />
      </div>

      <ModalComponent
        title="Thêm Bậc xếp hạng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
        forceRender
      >
        <Form
          className={cx("form__section")}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          onFinish={onUpdateUser}
          autoComplete="off"
          labelAlign="left"
          form={form}
        >
          <Form.Item name="isAdmin">
            <div className={cx("form__group")}>
              <label className={cx("form__label")}>Vai trò tài khoản:</label>

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
                  {stateUserDetails?.isAdmin ? "Admin" : "Member"}:
                </label>
                <div
                  className={cx(
                    "toggle-switch",
                    stateUserDetails?.isAdmin ? "on" : "off"
                  )}
                  onClick={toggleButton}
                >
                  <div className={cx("toggle-knob")}></div>
                </div>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            label="Tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên người dùng là bắc buộc!",
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
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email là bắt buộc!",
              },
            ]}
          >
            <Input
              name="email"
              value={stateUserDetails.email}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item label="Điện thoại" name="phone">
            <Input
              name="phone"
              value={stateUserDetails.phone}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input
              name="address"
              value={stateUserDetails.address}
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
      </ModalComponent>

      <DrawerComponent
        title="Chi tiết người dùng"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
      >
        <Form
          className={cx("form__section")}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
          onFinish={onUpdateUser}
          autoComplete="off"
          labelAlign="left"
          form={form}
        >
          <Form.Item name="isAdmin">
            <div className={cx("form__group")}>
              <label className={cx("form__label")}>Vai trò tài khoản:</label>

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
                  {stateUserDetails?.isAdmin ? "Admin" : "Member"}:
                </label>
                <div
                  className={cx(
                    "toggle-switch",
                    stateUserDetails?.isAdmin ? "on" : "off"
                  )}
                  onClick={toggleButton}
                >
                  <div className={cx("toggle-knob")}></div>
                </div>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            label="Tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên người dùng là bắc buộc!",
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
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email là bắt buộc!",
              },
            ]}
          >
            <Input
              name="email"
              value={stateUserDetails.email}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item label="Điện thoại" name="phone">
            <Input
              name="phone"
              value={stateUserDetails.phone}
              onChange={handleOnChangeDetails}
            />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input
              name="address"
              value={stateUserDetails.address}
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
        title="Xóa tài khoản"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
        forceRender
      >
        <div className={cx("delete__text")}>
          Bạn có chắc muốn xóa tài khoản này không???
        </div>
      </ModalComponent>
    </div>
  );
}

export default AdminUser;

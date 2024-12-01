import classNames from "classnames/bind";
import styes from "./Profile.module.scss";

//---------------------------------------------
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import defaultAvt from "~/assets/img/avt.jpg";
import { Upload } from "antd";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import * as UserServices from "~/services/UserServices";
import { getBase64 } from "~/utils";
import * as message from "~/component/Message";
import Loading from "~/component/LoadingComponent";
import React, { useState, useEffect } from "react";

import { updateUser } from "~/redux/slides/userSlide";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "~/hooks/useMutationHook";

const cx = classNames.bind(styes);

function Profile() {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [avatar, setAvatar] = useState(user.avatar);
  const [userRank, setUserRank] = useState(user.avatar);

  const dispatch = useDispatch();

  const mutation = useMutationHook((data) => {
    const { id, access_token, ...rests } = data;
    UserServices.updateUser(id, access_token, rests);
  });
  const { isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setAvatar(user?.avatar);
    setPhone(user?.phone);
    setAddress(user?.address);
    setUserRank(user?.rank);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      message.success("Cập nhật thành công");
      handleGetDetailUser(user?.id, user?.access_token);
      setInterval(() => {
        window.location.reload();
      }, 2000);

      clearInterval();
    } else if (isError) {
      message.success("Cập nhật thất bại");
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, token) => {
    const res = await UserServices.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleChangeName = (value) => {
    setName(value);
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
  };

  const handleChangeAddress = (value) => {
    setAddress(value);
  };

  const handleChangePhone = (value) => {
    setPhone(value);
  };

  const handleChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setAvatar(file.preview);
  };

  const handleUpdateUser = () => {
    mutation.mutate({
      id: user?.id,
      name,
      email,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };

  // const handleUpdateUserAVT = () => {
  //   mutation.mutate({
  //     // id: user?.id,
  //     // name,
  //     // email,
  //     // phone,
  //     // address,
  //     avatar,
  //     // access_token: user?.access_token,
  //   });
  // };

  // const cancelUpdateAvt = () => {
  //   setAvatar(avatar);
  // };

  return (
    <Loading isPending={isPending}>
      <div className={cx("profile__wrapper")}>
        <div className={cx("profile__section")}>
          <div className={cx("avt__section")}>
            <div className={cx("img__section")}>
              {/* <img
                className={cx("img__avatar")}
                src={avatar ? avatar : defaultAvt}
                alt="Avatar"
              /> */}

              <img
                className={cx("img__avatar")}
                src={avatar ? avatar : defaultAvt}
                alt="Avatar"
              />
            </div>

            {/* {isUpdateAvt ? (
              <div>
                <button>Cập nhật</button>
                <button onClick={cancelUpdateAvt}>Hủy</button>
              </div>
            ) : ( */}
            <Upload
              showUploadList={false}
              onChange={handleChangeAvatar}
              maxCount={1}
              onRemove={true}
              style={{ textAlign: "center" }}
            >
              <button className={cx("choose__btn")}>
                <FontAwesomeIcon icon={faUpload} /> Chọn Avatar
              </button>
            </Upload>
            {/* )} */}

            <div className={cx("ranking__title")}>
              <p>Hội viên</p>
              <h4
                className={
                  userRank === "Vàng"
                    ? cx("ranking", "gold")
                    : userRank === "Bạc"
                    ? cx("ranking", "silver")
                    : cx("ranking")
                }
              >
                {userRank}
              </h4>
            </div>
          </div>

          <div className={cx("infor__section")}>
            <div className={cx("profile__infor")}>
              <div className={cx("profile__group")}>
                <label className={cx("profile__label")}>Họ và Tên</label>
                <input
                  value={name}
                  onChange={(e) => handleChangeName(e.target.value)}
                  className={cx("profile__input")}
                  type="text"
                  placeholder="Họ và tên"
                />
              </div>

              <div className={cx("profile__group")}>
                <label className={cx("profile__label")}>Email</label>
                <input
                  value={email}
                  onChange={(e) => handleChangeEmail(e.target.value)}
                  className={cx("profile__input")}
                  type="text"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className={cx("profile__infor")}>
              <div className={cx("profile__group")}>
                <label className={cx("profile__label")}>Địa chỉ</label>
                <input
                  value={address}
                  onChange={(e) => handleChangeAddress(e.target.value)}
                  className={cx("profile__input")}
                  type="text"
                  placeholder="Địa chỉ"
                />
              </div>

              <div className={cx("profile__group")}>
                <label className={cx("profile__label")}>Số điện thoại</label>
                <input
                  value={phone}
                  onChange={(e) => handleChangePhone(e.target.value)}
                  className={cx("profile__input")}
                  type="text"
                  placeholder="Số điện thoại"
                />
              </div>
            </div>

            <button onClick={handleUpdateUser} className={cx("update__btn")}>
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default Profile;

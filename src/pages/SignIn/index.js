import classNames from "classnames/bind";
import styles from "./SignIn.module.scss";

import * as UserServices from "~/services/UserServices";
import * as message from "~/component/Message";
import Loading from "~/component/LoadingComponent";
import { useMutationHook } from "~/hooks/useMutationHook";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "~/redux/slides/userSlide";

const cx = classNames.bind(styles);

function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleOnchangeEmail = (e) => {
    setEmail(e.currentTarget.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.currentTarget.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isEmail = reg.test(email);

    if (!email || !password) {
      message.error("Hãy nhập thông tin đăng nhập");
    } else if (!isEmail) {
      message.error("Email sai định dạng");
    } else {
      const infor = {
        email,
        password,
      };

      mutation.mutate(infor);
    }
  };

  const mutation = useMutationHook((data) => UserServices.loginUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      if (location?.state) {
        message.toastSuccess("Đăng nhập thành công");

        navigate(location?.state);
      } else {
        message.success("Đăng nhập thành công");
        navigate("/");
      }

      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token);
        }
      }
    } else if (data?.status === "ERR") {
      message.error("Đăng nhập thất bại");
    }
  }, [isSuccess, isError]);

  const handleCheckUserRank = (total) => {
    let rankResult = "";
    if (total >= 0 && total <= 10000000) {
      rankResult = "Đồng";
    } else if (total > 10000000 && total <= 20000000) {
      rankResult = "Bạc";
    } else if (total > 20000000) {
      rankResult = "Vàng";
    }

    return rankResult;
  };

  const mutationUpdate = useMutationHook((data) => {
    const { id, access_token, ...rests } = data;
    UserServices.updateUser(id, access_token, rests);
  });

  const handleGetDetailUser = async (id, token) => {
    const res = await UserServices.getDetailUser(id, token);

    if (res?.data && res?.status === "OK") {
      const userRank = handleCheckUserRank(res?.data?.totalInvoice);

      mutationUpdate.mutate({
        id: id,
        access_token: token,
        rank: userRank,
      });

      dispatch(
        updateUser({ ...res?.data, access_token: token, rank: userRank })
      );
    }
  };

  return (
    <Loading isPending={isPending}>
      <div className={cx("form__wrapper")}>
        <div className={cx("form__container")}>
          <form
            onSubmit={handleSubmit}
            action=""
            className={cx("form__section")}
          >
            <h1 className={cx("form__header")}>Đăng nhập</h1>

            <div className={cx("form__group")}>
              <label htmlFor="email" className={cx("form__label")}>
                Email
              </label>
              <input
                value={email}
                onChange={handleOnchangeEmail}
                type="text"
                id="email"
                name="email"
                placeholder="VD: abc@gmail.com"
                className={cx("form__input")}
              />
            </div>

            <div className={cx("form__group")}>
              <label htmlFor="password" className={cx("form__label")}>
                Mật khẩu
              </label>
              <input
                value={password}
                onChange={handleOnchangePassword}
                id="password"
                type={isShowPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                className={cx("form__input")}
              />
              <span
                onClick={() => setIsShowPassword(!isShowPassword)}
                className={cx("form__eye")}
              >
                {isShowPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </span>
            </div>

            <button className={cx("form__submit")}>Đăng nhập</button>
          </form>

          <div className={cx("no__account")}>
            <p className={cx("signUp__text")}>
              Chưa có tài khoản?
              <span onClick={() => navigate("/sign-up")}>Tạo tài khoản</span>
            </p>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default SignIn;

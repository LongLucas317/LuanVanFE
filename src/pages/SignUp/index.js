import classNames from "classnames/bind";
import styles from "./SignUp.module.scss";

import * as UserServices from "~/services/UserServices";
import * as message from "~/component/Message";
import Loading from "~/component/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useMutationHook } from "~/hooks/useMutationHook";
import { useEffect } from "react";

const cx = classNames.bind(styles);

function SignUp() {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowPasswordConfirm, setIsShowPasswordConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnchangeName = (e) => {
    setName(e.currentTarget.value);
  };

  const handleOnchangeEmail = (e) => {
    setEmail(e.currentTarget.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.currentTarget.value);
  };

  const handleOnchangeConfirmPassword = (e) => {
    setConfirmPassword(e.currentTarget.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isEmail = reg.test(email);

    if (!name || !email || !password || !confirmPassword) {
      message.error("Hãy nhập thông tin đăng ký");
    } else if (!isEmail) {
      message.error("Email sai định dạng");
    } else if (password !== confirmPassword) {
      message.error("Mật khẩu không khớp");
    } else {
      const infor = {
        name,
        email,
        password,
        confirmPassword,
      };

      mutation.mutate(infor);
    }
  };

  const mutation = useMutationHook((data) => UserServices.signUpUser(data));
  const { isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success("Đăng ký thành công");
      navigate("/sign-in");
    } else if (isError) {
      message.error("Đăng ký thất bại");
    }
  }, [isSuccess, isError]);

  return (
    <Loading isPending={isPending}>
      <div className={cx("form__wrapper")}>
        <div className={cx("form__container")}>
          <form
            onSubmit={handleSubmit}
            action=""
            className={cx("form__section")}
          >
            <h1 className={cx("form__header")}>Đăng ký</h1>

            <div className={cx("form__group")}>
              <label htmlFor="fullname" className={cx("form__label")}>
                Họ và Tên:
              </label>
              <input
                value={name}
                onChange={handleOnchangeName}
                type="text"
                id="fullname"
                name="fullname"
                className={cx("form__input")}
                placeholder="VD: Nguyễn Văn A"
              />
              <small className={cx("form__message")}></small>
            </div>

            <div className={cx("form__group")}>
              <label htmlFor="email" className={cx("form__label")}>
                Email:
              </label>
              <input
                value={email}
                onChange={handleOnchangeEmail}
                type="text"
                id="email"
                name="email"
                className={cx("form__input")}
                placeholder="VD: abc@gmail.com"
              />
              <small className={cx("form__message", "email__input")}></small>
            </div>

            <div className={cx("form__group")}>
              <label htmlFor="password" className={cx("form__label")}>
                Mật khẩu:
              </label>
              <input
                value={password}
                onChange={handleOnchangePassword}
                type={isShowPassword ? "text" : "password"}
                id="password"
                name="password"
                className={cx("form__input")}
                placeholder="Nhập mật khẩu"
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
              <small className={cx("form__message")}></small>
            </div>

            <div className={cx("form__group")}>
              <label htmlFor="confirmpassword" className={cx("form__label")}>
                Xác nhận mật khẩu:
              </label>
              <input
                value={confirmPassword}
                onChange={handleOnchangeConfirmPassword}
                type={isShowPasswordConfirm ? "text" : "password"}
                id="confirmpassword"
                name="confirmPassword"
                className={cx("form__input")}
                placeholder="Xác nhận mật khẩu"
              />

              <span
                onClick={() => setIsShowPasswordConfirm(!isShowPasswordConfirm)}
                className={cx("form__eye")}
              >
                {isShowPasswordConfirm ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </span>
              <small className={cx("form__message")}></small>
            </div>

            <button className={cx("form__submit")}>Đăng ký</button>
          </form>

          <div className={cx("got__account")}>
            <p className={cx("signIn__text")}>
              Đã có tài khoản?
              <span onClick={() => navigate("/sign-in")}>Đăng nhập</span>
            </p>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default SignUp;

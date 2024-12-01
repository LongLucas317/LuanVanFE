import classNames from "classnames/bind";
import styles from "./Header.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartShopping,
  faMagnifyingGlass,
  faSortDown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import * as UserServices from "~/services/UserServices";
import * as ProductService from "~/services/ProductService";
import { resetUser } from "~/redux/slides/userSlide";
import { searchProduct } from "~/redux/slides/productSlide";

import defaultAvt from "~/assets/img/avt.jpg";
import SearchResult from "~/component/SearchResult";
import { Badge } from "antd";
const cx = classNames.bind(styles);

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInput = useRef();
  const order = useSelector((state) => state.order);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(false);
  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const user = useSelector((state) => state.user);

  const handleCloseSearchResult = () => {
    setSearchValue("");
    setSearchResult(false);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    dispatch(searchProduct(searchValue));

    searchInput.current.focus();
    if (searchValue !== "") {
      setSearchResult(true);
    } else {
      setSearchResult(false);
    }
  };

  const handleLogout = async () => {
    navigate("/");
    await UserServices.logoutUser();
    dispatch(resetUser());
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllBrandProduct();

    setCategories(res?.data);
  };

  const handleNavigateBrandPage = (brand) => {
    navigate(
      `/product/${brand
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: brand }
    );
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  return (
    <div className={cx("header__wrapper")}>
      <h1 onClick={() => navigate("/")} className={cx("logo")}>
        HLMobile
      </h1>

      <div className={cx("menu__section")}>
        <ul className={cx("menu__list")}>
          <li className={cx("type__btn")}>
            Danh Mục
            <FontAwesomeIcon className={cx("more__icon")} icon={faSortDown} />
            <ul style={{ width: "120px" }} className={cx("types__list")}>
              {categories.map((item, index) => {
                return (
                  <li key={index} onClick={() => handleNavigateBrandPage(item)}>
                    {item}
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </div>

      <div className={cx("search__section")}>
        <input
          ref={searchInput}
          value={searchValue}
          onChange={handleSearch}
          className={cx("search__input")}
          type="text"
          placeholder="Bạn cần tìm gì?"
        />

        <div className={cx("search__icon")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>

        {searchValue !== "" && searchResult && (
          <SearchResult handleCloseSearchResult={handleCloseSearchResult} />
        )}
      </div>

      <div className={cx("action__section")}>
        <Badge
          color={"#186b6b"}
          offset={[-10, 4]}
          count={order?.orderItems?.length}
        >
          <div
            onClick={() => navigate("/cart")}
            className={cx("cart__section")}
          >
            <FontAwesomeIcon
              className={cx("cart__icon")}
              icon={faCartShopping}
            />
          </div>
        </Badge>

        <div className={cx("user__section")}>
          {user?.access_token ? (
            <Fragment>
              <div
                onClick={() => setIsOpenDropDown((prev) => !prev)}
                className={cx("user__avt")}
              >
                <img
                  className={cx("avt__img")}
                  src={user?.avatar ? user?.avatar : defaultAvt}
                  alt="Avatar"
                />
              </div>

              {isOpenDropDown && (
                <ul className={cx("user__dropDown")}>
                  <div
                    onClick={() => {
                      navigate("/profile");
                      setIsOpenDropDown((prev) => !prev);
                    }}
                    className={cx("user__infor")}
                  >
                    <div className={cx("avt__wrapper")}>
                      <img
                        className={cx("avatar")}
                        src={user?.avatar ? user?.avatar : defaultAvt}
                        alt="Avatar"
                      />
                    </div>

                    <div className={cx("infor")}>
                      <li className={cx("infor__firstChild")}>{user.name}</li>
                      <li className={cx("infor__lastChild")}>{user.email}</li>
                    </div>
                  </div>
                  <hr />

                  <div className={cx("user__action")}>
                    <li
                      onClick={() => {
                        navigate("/profile");
                        setIsOpenDropDown((prev) => !prev);
                      }}
                    >
                      Trang cá nhân
                    </li>
                    <li
                      onClick={() => {
                        navigate("/my-order", {
                          state: {
                            id: user?.id,
                            token: user?.access_token,
                          },
                        });
                        setIsOpenDropDown((prev) => !prev);
                      }}
                    >
                      Đơn mua
                    </li>

                    {user?.isAdmin && (
                      <li
                        onClick={() => {
                          navigate("/system");
                          setIsOpenDropDown(!isOpenDropDown);
                        }}
                      >
                        Hệ thống
                      </li>
                    )}
                  </div>
                  <hr />

                  <li
                    onClick={() => handleLogout()}
                    className={cx("logout__btn")}
                  >
                    Đăng xuất
                  </li>
                </ul>
              )}
            </Fragment>
          ) : (
            <p
              onClick={() => navigate("/sign-in")}
              className={cx("user__text")}
            >
              Đăng nhập
            </p>
          )}
        </div>
      </div>

      <div onClick={() => setIsOpenMenu(true)} className={cx("menu__btn")}>
        <FontAwesomeIcon className={cx("menu__icon")} icon={faBars} />
      </div>

      {isOpenMenu && (
        <div className={cx("menu__wrapper")}>
          <div className={cx("menu__block")}>
            <div
              onClick={() => setIsOpenMenu(false)}
              className={cx("close__btn")}
            >
              <FontAwesomeIcon className={cx("close__icon")} icon={faXmark} />
            </div>

            <div className={cx("user__section")}>
              {user?.access_token ? (
                <Fragment>
                  <ul className={cx("user__dropDown")}>
                    <div
                      onClick={() => {
                        navigate("/profile");
                        setIsOpenDropDown((prev) => !prev);
                      }}
                      className={cx("user__infor")}
                    >
                      <div className={cx("avt__wrapper")}>
                        <img
                          className={cx("avatar")}
                          src={user?.avatar ? user?.avatar : defaultAvt}
                          alt="Avatar"
                        />
                      </div>

                      <div className={cx("infor")}>
                        <li className={cx("infor__firstChild")}>{user.name}</li>
                        <li className={cx("infor__lastChild")}>{user.email}</li>
                      </div>
                    </div>
                    <hr />

                    <div className={cx("user__action")}>
                      <li
                        onClick={() => {
                          navigate("/profile");
                          setIsOpenDropDown((prev) => !prev);
                        }}
                      >
                        Trang cá nhân
                      </li>
                      <li
                        onClick={() => {
                          navigate("/my-order", {
                            state: {
                              id: user?.id,
                              token: user?.access_token,
                            },
                          });
                          setIsOpenDropDown((prev) => !prev);
                        }}
                      >
                        Đơn mua
                      </li>

                      {user?.isAdmin && (
                        <li
                          onClick={() => {
                            navigate("/system");
                            setIsOpenDropDown(!isOpenDropDown);
                          }}
                        >
                          Hệ thống
                        </li>
                      )}
                    </div>
                    <hr />

                    <li
                      onClick={() => handleLogout()}
                      className={cx("logout__btn")}
                    >
                      Đăng xuất
                    </li>
                  </ul>
                </Fragment>
              ) : (
                <p
                  onClick={() => navigate("/sign-in")}
                  className={cx("user__text")}
                >
                  Đăng nhập
                </p>
              )}
            </div>

            <div className={cx("menu__categories")}>
              <ul className={cx("categories__list")}>
                <li className={cx("type__btn")}>
                  Danh Mục
                  <FontAwesomeIcon
                    className={cx("more__icon")}
                    icon={faSortDown}
                  />
                </li>
                {categories.map((item, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => handleNavigateBrandPage(item)}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;

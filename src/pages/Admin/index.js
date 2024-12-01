import classNames from "classnames/bind";
import styles from "./Admin.module.scss";

import { useState } from "react";
import { Menu } from "antd";
import { getItem } from "~/utils";
import AdminDashboard from "~/component/AdminDashboard";
import AdminUser from "~/component/AdminUser";
import AdminUserRank from "~/component/AdminUserRank";
import AdminProduct from "~/component/AdminProduct";
import AdminOrder from "~/component/AdminOrder";

import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBorderAll,
  faDolly,
  faRankingStar,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cx = classNames.bind(styles);

function Admin() {
  const [keySelected, setKeySelected] = useState("dashboard");
  const renderPage = (key) => {
    switch (key) {
      case "dashboard":
        return <AdminDashboard />;
      case "user":
        return <AdminUser keySelect={keySelected} />;
      case "userRank":
        return <AdminUserRank keySelect={keySelected} />;
      case "product":
        return <AdminProduct keySelect={keySelected} />;
      case "order":
        return <AdminOrder keySelect={keySelected} />;
      default:
        return <></>;
    }
  };

  const items = [
    getItem("Dashboard", "dashboard", <FontAwesomeIcon icon={faBorderAll} />),
    getItem("Người dùng", "user", <FontAwesomeIcon icon={faUser} />),
    getItem(
      "Xếp hạng người dùng",
      "userRank",
      <FontAwesomeIcon icon={faRankingStar} />
    ),
    getItem("Sản phẩm", "product", <FontAwesomeIcon icon={faDolly} />),
    getItem("Đơn hàng", "order", <FontAwesomeIcon icon={faWallet} />),
  ];

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  return (
    <div className={cx("admin__wrapper")}>
      <Menu
        onClick={handleOnClick}
        className={cx("menu__section")}
        mode="inline"
        items={items}
      />
      {/* <div className={cx("render__section")}>Render</div> */}
      <div className={cx("render__section")}>{renderPage(keySelected)}</div>
    </div>
  );
}

export default Admin;

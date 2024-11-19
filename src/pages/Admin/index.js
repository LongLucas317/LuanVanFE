import classNames from "classnames/bind";
import styles from "./Admin.module.scss";

import { useState } from "react";
import { Menu } from "antd";
import { getItem } from "~/utils";
import AdminUser from "~/component/AdminUser";
import AdminProduct from "~/component/AdminProduct";
import AdminOrder from "~/component/AdminOrder";

import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBorderAll, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminDashboard from "~/component/AdminDashboard";

const cx = classNames.bind(styles);

function Admin() {
  const [keySelected, setKeySelected] = useState("dashboar");
  const renderPage = (key) => {
    switch (key) {
      case "dashboar":
        return <AdminDashboard />;
      case "user":
        return <AdminUser keySelect={keySelected} />;
      case "product":
        return <AdminProduct keySelect={keySelected} />;
      case "order":
        return <AdminOrder keySelect={keySelected} />;
      default:
        return <></>;
    }
  };

  const items = [
    getItem("Dashboar", "dashboar", <FontAwesomeIcon icon={faUser} />),
    getItem("Người dùng", "user", <FontAwesomeIcon icon={faUser} />),
    getItem("Sản phẩm", "product", <FontAwesomeIcon icon={faBorderAll} />),
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

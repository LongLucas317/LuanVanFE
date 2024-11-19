import classNames from "classnames/bind";
import styles from "./DrawerComponent.module.scss";

import { Drawer } from "antd";

const cx = classNames.bind(styles);

function DrawerComponent({
  title = "Drawer",
  placement = "right",
  isOpen = false,
  children,
  ...rest
}) {
  return (
    <>
      <Drawer
        width="800px"
        title={title}
        placement={placement}
        open={isOpen}
        {...rest}
      >
        {children}
      </Drawer>
    </>
  );
}

export default DrawerComponent;

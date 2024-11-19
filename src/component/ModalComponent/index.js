import classNames from "classnames/bind";
import styles from "./ModalComponent.module.scss";
import { Modal } from "antd";

const cx = classNames.bind(styles);

function ModalComponent({
  title = "Modal",
  isOpen = false,
  children,
  ...rests
}) {
  return (
    <Modal title={title} open={isOpen} {...rests}>
      {children}
    </Modal>
  );
}

export default ModalComponent;

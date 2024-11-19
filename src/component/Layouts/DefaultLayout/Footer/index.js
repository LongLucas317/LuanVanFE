import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTiktok,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const cx = classNames.bind(styles);

function Footer() {
  return (
    <footer className={cx("footer__wrapper")}>
      <div className={cx("footer__section")}>
        <div className={cx("about__section")}>
          <h3 className={cx("about__header")}>Thông tin liên lạc</h3>

          <div className={cx("infor__section")}>
            <div className={cx("address__section")}>
              <FontAwesomeIcon
                className={cx("location__icon")}
                icon={faLocationDot}
              />
              <p className={cx("location__context")}>
                Đại học Cần Thơ, Thành phố Cần Thơ
              </p>
            </div>

            <div className={cx("phone__section")}>
              <FontAwesomeIcon className={cx("phone__icon")} icon={faPhone} />
              <p className={cx("phone__context")}>
                Số điện thoại: <a href="tel: +0123456789">0123456789</a>
              </p>
            </div>

            <div className={cx("email__section")}>
              <FontAwesomeIcon
                className={cx("email__icon")}
                icon={faEnvelope}
              />
              <p className={cx("email__context")}>
                Email: <a href="mailto:abc@gmail.com">abc@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className={cx("social__media")}>
          <h3 className={cx("social__header")}>Mạng xã hội</h3>
          <div className={cx("social__icon")}>
            <FontAwesomeIcon
              className={cx("facebook__icon")}
              icon={faFacebook}
            />
            <FontAwesomeIcon
              className={cx("instagram__icon")}
              icon={faInstagram}
            />
            <FontAwesomeIcon className={cx("tiktok__icon")} icon={faTiktok} />
            <FontAwesomeIcon
              className={cx("twitter__icon")}
              icon={faXTwitter}
            />
          </div>
        </div>

        <div className={cx("store__location")}>
          <h3 className={cx("location__header")}>Hệ thống cửa hàng</h3>
          <p className={cx("store__context")}>
            Hiện tại SHOP chỉ hoạt động kinh doanh qua các kênh trực tuyến:
            Website, Facebook, Instagram, Shopee, Lazada & Tiktok shop.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

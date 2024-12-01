import classNames from "classnames/bind";
import style from "./ProductConfig.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);

function ProductConfig({ data, handleCloseConfigModal }) {
  return (
    <div className={cx("productConfig__block")}>
      <div className={cx("productConfig__wrapper")}>
        <div className={cx("productConfig__header")}>
          <h3>Thông số kỹ thuật</h3>

          <FontAwesomeIcon
            onClick={handleCloseConfigModal}
            className={cx("close__btn")}
            icon={faXmark}
          />
        </div>

        <div className={cx("productConfig__section")}>
          <ul className={cx("config__list")}>
            <li>
              <h4 className={cx("config__des")}>Màn hình:</h4>

              <div className={cx("config__infor")}>
                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Kích thước màn hình:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.screen?.size}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Công nghệ màn hình:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.screen?.technology}</p>
                  </div>
                </div>

                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Độ phân giải màn hình:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.screen?.resolution}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Tính năng màn hình:</p>
                  <div className={cx("item__block")}>
                    <p>
                      {data?.screen?.features?.map((feature, index) => {
                        return <p key={index}>{feature}</p>;
                      })}
                    </p>
                  </div>
                </div>

                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Tầm số quét màn hình:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.screen?.pwm}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Kiểu màn hình:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.screen?.design}</p>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <h4 className={cx("config__des")}>Camera sau:</h4>

              <div className={cx("config__infor")}>
                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Camera sau:</p>
                  <div className={cx("item__block")}>
                    <p>Camera chính: {data?.camera?.rear?.main}</p>
                    <p>Camera góc rộng: {data?.camera?.rear?.ultraWide}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Quay video:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.camera?.rear?.video}</p>
                  </div>
                </div>

                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Tính năng camera:</p>
                  <div className={cx("item__block")}>
                    {data?.camera?.rear?.features?.map((feature, index) => {
                      return <p key={index}>{feature}</p>;
                    })}
                  </div>
                </div>
              </div>
            </li>

            <li>
              <h4 className={cx("config__des")}>Camera trước:</h4>

              <div className={cx("config__infor")}>
                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Camera trước:</p>
                  <div className={cx("item__block")}>
                    <p>Camera chính: {data?.camera?.front?.resolution}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Tính năng camera:</p>
                  <div className={cx("item__block")}>
                    {data?.camera?.front?.features?.map((feature, index) => {
                      return <p key={index}>{feature}</p>;
                    })}
                  </div>
                </div>
              </div>
            </li>

            <li>
              <h4 className={cx("config__des")}>Vi xử lý & đồ họa:</h4>

              <div className={cx("config__infor")}>
                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Chipset:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.processor?.chipset}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>CPU:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.processor?.cpu}</p>
                  </div>
                </div>

                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>GPU:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.processor?.gpu}</p>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <h4 className={cx("config__des")}>Giao tiếp & kết nối:</h4>

              <div className={cx("config__infor")}>
                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>NFC:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.connectivity?.nfc ? "Có" : "Không"}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Thẻ Sim:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.connectivity?.sim}</p>
                  </div>
                </div>

                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Hỗ trợ mạng:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.connectivity?.network}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Wifi:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.connectivity?.wifi}</p>
                  </div>
                </div>

                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Bluetooth:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.connectivity?.bluetooth}</p>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <h4 className={cx("config__des")}>Pin & công nghệ sạc:</h4>

              <div className={cx("config__infor")}>
                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Dung lượng pin:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.battery?.capacity}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Công nghệ sạc:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.battery?.typeCharging}</p>
                    <p>Sạc có dây: {data?.battery?.wiredCharging}</p>
                    <p>Sạc không dây: {data?.battery?.wirelessCharging}</p>
                  </div>
                </div>

                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Cổng sạc:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.battery?.portCharging}</p>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <h4 className={cx("config__des")}>Thiết kế & Trọng lượng:</h4>

              <div className={cx("config__infor")}>
                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Kích thước:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.design?.dimensions}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Trọng lượng:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.design?.weight}</p>
                  </div>
                </div>

                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Chất liệu khung viền:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.design?.frameMaterial}</p>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <h4 className={cx("config__des")}>Thông số khác:</h4>

              <div className={cx("config__infor")}>
                <div className={cx("item__list")}>
                  <p className={cx("item__header")}>Chỉ số kháng nước:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.additionalFeatures?.waterResistance}</p>
                  </div>
                </div>

                <div className={cx("item__list", "even__item")}>
                  <p className={cx("item__header")}>Công nghệ âm thanh:</p>
                  <div className={cx("item__block")}>
                    <p>{data?.additionalFeatures?.audio}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProductConfig;

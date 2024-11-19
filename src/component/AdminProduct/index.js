import classNames from "classnames/bind";
import styles from "./AdminProduct.module.scss";

import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Space } from "antd";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { convertPrice, getBase64 } from "~/utils";
import Loading from "../LoadingComponent";
import TableComponent from "../TableComponent";
import ModalComponent from "../ModalComponent";
import { useMutationHook } from "~/hooks/useMutationHook";
import * as message from "~/component/Message";
import * as ProductService from "~/services/ProductService";
import CreateProductForm from "../CreateProductForm";
import UpdateProductForm from "../UpdateProductForm";
import ViewproductDetail from "../ViewProductComponent";

const cx = classNames.bind(styles);

function AdminProduct({ keySelect }) {
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();

  const user = useSelector((state) => state?.user);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const initial = {
    name: "",
    isPublic: true,
    operatingSystem: "",
    brand: "",
    newBrand: "",
    image: "",
    images: [],
    countInStock: 0,
    discountAmount: "",
    timeStartDiscount: "",
    discountStartTime: "",
    timeEndDiscount: "",
    discountEndTime: "",
    specifications: {
      screen: {
        size: "",
        technology: "",
        resolution: "",
        features: [],
        pwm: "",
        design: "",
      },
      camera: {
        rear: {
          main: "",
          ultraWide: "",
          video: "",
          features: [],
        },
        front: {
          resolution: "",
          features: [],
        },
      },
      processor: {
        chipset: "",
        cpu: "",
        gpu: "",
      },
      connectivity: {
        nfc: "",
        sim: "",
        network: "",
        wifi: "",
        bluetooth: "",
      },
      memory: {
        ram: [],
        storage: [],
      },
      battery: {
        capacity: "",
        typeCharging: "",
        wiredCharging: "",
        wirelessCharging: "",
        portCharging: "",
      },
      design: {
        dimensions: "",
        weight: "",
        colors: [],
        frameMaterial: "",
      },
      additionalFeatures: {
        waterResistance: "",
        audio: "",
      },
    },
    options: [
      {
        id: Date.now(),
        image: "",
        ram: "",
        storage: "",
        color: "",
        quantity: "",
        price: "",
      },
    ],
  };

  const [stateProduct, setStateProduct] = useState(initial);

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setStateProduct(initial);
    formCreate.resetFields();
  };

  // Creat Product ==================================================
  const [brandSelect, setBrandSelect] = useState("");
  const [ramSelect, setRamSelect] = useState("");
  const [storageSelect, setStorageSelect] = useState("");
  const [colorSelect, setColorSelect] = useState("");

  const toggleButton = () => {
    setStateProduct({ ...stateProduct, isPublic: !stateProduct?.isPublic });
  };

  const handleOnChange = (e, field, subField, subSubField, subSubSubField) => {
    const value = e.target.value;

    setStateProduct((prevData) => {
      const updatedData = { ...prevData };

      if (subSubSubField) {
        updatedData[field][subField][subSubField][subSubSubField] = value;
      } else if (subSubField) {
        updatedData[field][subField][subSubField] = value;
      } else if (subField) {
        updatedData[field][subField] = value;
      } else {
        updatedData[field] = value;
      }

      return updatedData;
    });
  };

  const handleChangeProductImg = async ({ fileList }) => {
    const file = fileList[0];

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
    handleChangeProductOptionImg({ fileList }, 0);
  };

  const handleAddOption = (e) => {
    e.preventDefault();

    setStateProduct((prevData) => {
      return {
        ...prevData,
        options: [
          ...stateProduct.options,
          {
            id: Date.now(),
            image: "",
            ram: "",
            storage: "",
            color: "",
            quantity: "",
            price: "",
          },
        ],
      };
    });
  };

  const handleRemoveVersion = (index) => {
    setStateProduct((prevData) => {
      return {
        ...prevData,
        options: stateProduct.options.filter((option) => option.id !== index),
      };
    });
  };

  const handleOnChangeOption = (e, field, subField, index) => {
    const value = e.target.value;
    setStateProduct((prevData) => {
      const updatedData = { ...prevData };
      updatedData[field].map((option) => {
        if (option.id === index) {
          option[subField] = value;
        } else {
          return option;
        }
      });

      return updatedData;
    });
  };

  const handleChangeProductOptionImg = async ({ fileList }, index) => {
    const file = fileList[0];

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProduct((prevData) => {
      const updateData = { ...prevData };

      updateData["options"].map((option, i) => {
        if (i === index) {
          option.image = file.preview;
        } else return option;
      });

      return updateData;
    });
  };

  // Sub Image =====================================
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);

    const imageBase64List = await Promise.all(
      files.map((file) => getBase64(file))
    );

    setStateProduct((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...imageBase64List],
    }));
  };

  const handleRemoveImage = (index) => {
    setStateProduct((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };
  // ===============================================

  const handleChangeBrandSelect = (value) => {
    if (value !== "new_brand") {
      setBrandSelect("");
      setStateProduct({
        ...stateProduct,
        brand: value,
      });
    } else {
      setBrandSelect("new_brand");
    }
  };

  const handleRemoveOption = (index, field, subField, subSubField) => {
    setStateProduct((prevData) => {
      const updateData = { ...prevData };

      updateData[field][subField][subSubField] = updateData[field][subField][
        subSubField
      ].filter((_, i) => i !== index);

      return updateData;
    });
  };

  const handleSelectOption = (value, field, subField, subSubField) => {
    if (
      value !== "new_RAM" &&
      value !== "new_storage" &&
      value !== "new_color" &&
      value !== ""
    ) {
      setRamSelect("");
      setStorageSelect("");
      setColorSelect("");

      setStateProduct((prevData) => {
        const updatedData = { ...prevData };

        if (!updatedData[field][subField][subSubField].includes(value)) {
          updatedData[field][subField][subSubField].push(value);
        }
        return updatedData;
      });
    } else {
      value === "new_RAM"
        ? setRamSelect(value)
        : value === "new_storage"
        ? setStorageSelect(value)
        : setColorSelect(value);
    }
  };

  const handleAddFeatures = (
    value,
    field,
    subField,
    subSubField,
    subSubSubField
  ) => {
    setStateProduct((prevData) => {
      const updateData = { ...prevData };

      if (subSubSubField) {
        if (
          !updateData[field][subField][subSubField][subSubSubField].includes(
            value
          ) &&
          value.trim() !== ""
        ) {
          updateData[field][subField][subSubField][subSubSubField].push(value);
        }
      } else {
        if (
          !updateData[field][subField][subSubField].includes(value) &&
          value.trim() !== ""
        ) {
          updateData[field][subField][subSubField].push(value);
        }
      }
      return updateData;
    });
  };

  const handleRemoveFeatures = (
    index,
    field,
    subField,
    subSubField,
    subSubSubField
  ) => {
    setStateProduct((prevData) => {
      const updateData = { ...prevData };

      if (subSubSubField) {
        updateData[field][subField][subSubField][subSubSubField] = updateData[
          field
        ][subField][subSubField][subSubSubField].filter((_, i) => i !== index);
      } else {
        updateData[field][subField][subSubField] = updateData[field][subField][
          subSubField
        ].filter((_, i) => i !== index);
      }

      return updateData;
    });
  };

  const mutation = useMutationHook((data) => {
    const {
      name,
      isPublic,
      operatingSystem,
      brand,
      countInStock,
      discount,
      image,
      images,
      discountAmount,
      discountStartTime,
      discountEndTime,
      specifications,
      options,
    } = data;
    const res = ProductService.createProduct({
      name,
      isPublic,
      operatingSystem,
      brand,
      countInStock,
      discount,
      discountAmount,
      discountStartTime,
      discountEndTime,
      image,
      images,
      specifications,
      options,
    });
    return res;
  });

  const { data, isLoading, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Thêm sản phẩm thành công");
      handleCloseModal();
    } else if (isError) {
      message.error("Thất bại");
    }
  }, [isSuccess]);

  const onCreateProduct = () => {
    const params = {
      name: stateProduct.name,
      isPublic: stateProduct.isPublic,
      operatingSystem: stateProduct.operatingSystem,
      brand:
        brandSelect === "new_brand"
          ? stateProduct.newBrand
          : stateProduct.brand,
      countInStock: stateProduct.options.reduce((total, option) => {
        total += +option.quantity;

        return total;
      }, 0),
      discountAmount: stateProduct.discountAmount,
      discountStartTime: `${stateProduct.discountStartTime}T${stateProduct.timeStartDiscount}:00.000+00:00`,
      discountEndTime: `${stateProduct.discountEndTime}T${stateProduct.timeStartDiscount}:00.000+00:00`,
      image: stateProduct.image,
      images: stateProduct.images,
      specifications: {
        screen: {
          size: stateProduct.specifications.screen.size,
          technology: stateProduct.specifications.screen.technology,
          resolution: stateProduct.specifications.screen.resolution,
          features: stateProduct.specifications.screen.features,
          pwm: stateProduct.specifications.screen.pwm,
          design: stateProduct.specifications.screen.design,
        },
        camera: {
          rear: {
            main: stateProduct.specifications.camera.rear.main,
            ultraWide: stateProduct.specifications.camera.rear.ultraWide,
            video: stateProduct.specifications.camera.rear.video,
            features: stateProduct.specifications.camera.rear.features,
          },
          front: {
            resolution: stateProduct.specifications.camera.front.resolution,
            features: stateProduct.specifications.camera.front.features,
          },
        },
        processor: {
          chipset: stateProduct.specifications.processor.chipset,
          cpu: stateProduct.specifications.processor.cpu,
          gpu: stateProduct.specifications.processor.gpu,
        },
        connectivity: {
          nfc: stateProduct.specifications.connectivity.nfc,
          sim: stateProduct.specifications.connectivity.sim,
          network: stateProduct.specifications.connectivity.network,
          wifi: stateProduct.specifications.connectivity.wifi,
          bluetooth: stateProduct.specifications.connectivity.bluetooth,
        },
        memory: {
          ram: stateProduct.specifications.memory.ram,
          storage: stateProduct.specifications.memory.storage,
        },
        battery: {
          capacity: stateProduct.specifications.battery.capacity,
          typeCharging: stateProduct.specifications.battery.typeCharging,
          wiredCharging: stateProduct.specifications.battery.wiredCharging,
          wirelessCharging:
            stateProduct.specifications.battery.wirelessCharging,
          portCharging: stateProduct.specifications.battery.portCharging,
        },
        design: {
          dimensions: stateProduct.specifications.design.dimensions,
          weight: stateProduct.specifications.design.weight,
          colors: stateProduct.specifications.design.colors,
          frameMaterial: stateProduct.specifications.design.frameMaterial,
        },
        additionalFeatures: {
          waterResistance:
            stateProduct.specifications.additionalFeatures.waterResistance,
          audio: stateProduct.specifications.additionalFeatures.audio,
        },
      },
      options: stateProduct.options,
    };

    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  // ================================================================

  // Update Product =================================================
  const [idUpdateProduct, setIdUpdateProduct] = useState(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [stateProductDetails, setStateProductDetails] = useState(initial);

  const [brandSelectDetail, setBrandSelectDetail] = useState("");
  const [ramSelectDetail, setRamSelectDetail] = useState("");
  const [storageSelectDetail, setStorageSelectDetail] = useState("");
  const [colorSelectDetail, setColorSelectDetail] = useState("");

  const toggleDetailButton = () => {
    setStateProductDetails({
      ...stateProductDetails,
      isPublic: !stateProductDetails?.isPublic,
    });
  };

  const handleOnChangeDetails = (
    e,
    field,
    subField,
    subSubField,
    subSubSubField
  ) => {
    const value = e.target.value;

    setStateProductDetails((prevData) => {
      const updatedData = { ...prevData };

      if (subSubSubField) {
        updatedData[field][subField][subSubField][subSubSubField] = value;
      } else if (subSubField) {
        updatedData[field][subField][subSubField] = value;
      } else if (subField) {
        updatedData[field][subField] = value;
      } else {
        updatedData[field] = value;
      }

      return updatedData;
    });
  };

  const handleOnchangeProductImgDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });

    handleChangeProductOptionImgDetail({ fileList }, 0);
  };

  const handleAddOptionDetail = (e) => {
    e.preventDefault();

    setStateProductDetails((prevData) => {
      return {
        ...prevData,
        options: [
          ...stateProductDetails.options,
          {
            id: Date.now(),
            image: "",
            ram: "",
            storage: "",
            color: "",
            quantity: "",
            price: "",
          },
        ],
      };
    });
  };

  const handleRemoveVersionDetail = (index) => {
    setStateProductDetails((prevData) => {
      return {
        ...prevData,
        options: stateProductDetails.options.filter(
          (option) => option.id !== index
        ),
      };
    });
  };

  const handleOnChangeOptionDetail = (e, field, subField, index) => {
    const value = e.target.value;

    setStateProductDetails((prevData) => {
      const updatedData = { ...prevData };
      updatedData[field].map((option) => {
        if (option.id === index) {
          option[subField] = value;
        } else {
          return option;
        }
      });

      return updatedData;
    });
  };

  const handleChangeProductOptionImgDetail = async ({ fileList }, index) => {
    const file = fileList[0];

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateProductDetails((prevData) => {
      const updateData = { ...prevData };

      updateData["options"].map((option, i) => {
        if (i === index) {
          option.image = file.preview;
        } else return option;
      });

      return updateData;
    });
  };

  // Sub Image =====================================
  const handleImageSelectDetail = async (e) => {
    const files = Array.from(e.target.files);

    const imageBase64List = await Promise.all(
      files.map((file) => getBase64(file))
    );

    setStateProductDetails((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...imageBase64List],
    }));
  };

  const handleRemoveImageDetail = (index) => {
    setStateProductDetails((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  };
  // ===============================================

  const handleChangeBrandDetail = (value) => {
    if (value !== "new_brand") {
      setBrandSelectDetail("");

      setStateProductDetails({
        ...stateProductDetails,
        brand: value,
      });
    } else {
      setStateProductDetails({
        ...stateProductDetails,
        brand: "new_brand",
      });
      setBrandSelectDetail("new_brand");
    }
  };

  const handleRemoveOptionDetail = (index, field, subField, subSubField) => {
    setStateProduct((prevData) => {
      const updateData = { ...prevData };

      updateData[field][subField][subSubField] = updateData[field][subField][
        subSubField
      ].filter((_, i) => i !== index);

      return updateData;
    });
  };

  const handleSelectOptionDetail = (value, field, subField, subSubField) => {
    if (
      value !== "new_RAM" &&
      value !== "new_storage" &&
      value !== "new_color" &&
      value !== ""
    ) {
      setRamSelectDetail("");
      setStorageSelectDetail("");
      setColorSelectDetail("");

      setStateProductDetails((prevData) => {
        const updatedData = { ...prevData };

        if (!updatedData[field][subField][subSubField].includes(value)) {
          updatedData[field][subField][subSubField].push(value);
        }
        return updatedData;
      });
    } else {
      value === "new_RAM"
        ? setRamSelectDetail(value)
        : value === "new_storage"
        ? setStorageSelectDetail(value)
        : setColorSelectDetail(value);
    }
  };

  const handleAddFeaturesDetail = (
    value,
    field,
    subField,
    subSubField,
    subSubSubField
  ) => {
    setStateProductDetails((prevData) => {
      const updateData = { ...prevData };

      if (subSubSubField) {
        if (
          !updateData[field][subField][subSubField][subSubSubField].includes(
            value
          ) &&
          value.trim() !== ""
        ) {
          updateData[field][subField][subSubField][subSubSubField].push(value);
        }
      } else {
        if (
          !updateData[field][subField][subSubField].includes(value) &&
          value.trim() !== ""
        ) {
          updateData[field][subField][subSubField].push(value);
        }
      }
      return updateData;
    });
  };

  const handleRemoveFeaturesDetail = (
    index,
    field,
    subField,
    subSubField,
    subSubSubField
  ) => {
    setStateProductDetails((prevData) => {
      const updateData = { ...prevData };

      if (subSubSubField) {
        updateData[field][subField][subSubField][subSubSubField] = updateData[
          field
        ][subField][subSubField][subSubSubField].filter((_, i) => i !== index);
      } else {
        updateData[field][subField][subSubField] = updateData[field][subField][
          subSubField
        ].filter((_, i) => i !== index);
      }

      return updateData;
    });
  };

  const handleCloseDrawer = () => {
    setStateProductDetails(initial);
    formUpdate.resetFields();
    setIsOpenDrawer(false);
  };

  const fetchGetDetailsProduct = async (id) => {
    const res = await ProductService.getDetailsProduct(id);
    if (res?.data) {
      // Time Start ===============================
      const ISOStringStart = res?.data?.discountStartTime;
      const dateObjectStart = new Date(ISOStringStart);

      const yearStart = dateObjectStart.getUTCFullYear();
      const monthStart = String(dateObjectStart.getUTCMonth() + 1).padStart(
        2,
        "0"
      ); // Tháng bắt đầu từ 0
      const dayStart = String(dateObjectStart.getUTCDate()).padStart(2, "0");
      const hoursStart = String(dateObjectStart.getUTCHours()).padStart(2, "0");
      const minutesStart = String(dateObjectStart.getUTCMinutes()).padStart(
        2,
        "0"
      );

      // Time End ===============================
      const ISOStringEnd = res?.data?.discountEndTime;
      const dateObjectEnd = new Date(ISOStringEnd);

      const yearEnd = dateObjectEnd.getUTCFullYear();
      const monthEnd = String(dateObjectEnd.getUTCMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
      const dayEnd = String(dateObjectEnd.getUTCDate()).padStart(2, "0");
      const hoursEnd = String(dateObjectEnd.getUTCHours()).padStart(2, "0");
      const minutesEnd = String(dateObjectEnd.getUTCMinutes()).padStart(2, "0");

      setStateProductDetails({
        name: res?.data?.name,
        isPublic: res?.data?.isPublic,
        price: res?.data?.price,
        discount: res?.data?.discount,
        image: res?.data?.image,
        images: res?.data?.images,
        brand: res?.data?.brand,
        countInStock: res?.data?.countInStock,
        discountAmount: res?.data?.discountAmount,
        timeStartDiscount: `${hoursStart}:${minutesStart}`,
        discountStartTime: `${yearStart}-${monthStart}-${dayStart}`,
        timeEndDiscount: `${hoursEnd}:${minutesEnd}`,
        discountEndTime: `${yearEnd}-${monthEnd}-${dayEnd}`,
        specifications: {
          screen: {
            size: res?.data?.specifications?.screen?.size,
            technology: res?.data?.specifications?.screen?.technology,
            resolution: res?.data?.specifications?.screen?.resolution,
            features: res?.data?.specifications?.screen?.features,
            pwm: res?.data?.specifications?.screen?.pwm,
            design: res?.data?.specifications?.screen?.design,
          },
          camera: {
            rear: {
              main: res?.data?.specifications?.camera?.rear?.main,
              ultraWide: res?.data?.specifications?.camera?.rear?.ultraWide,
              video: res?.data?.specifications?.camera?.rear?.video,
              features: res?.data?.specifications?.camera?.rear?.features,
            },
            front: {
              resolution: res?.data?.specifications?.camera?.front?.resolution,
              features: res?.data?.specifications?.camera?.front?.features,
            },
          },
          processor: {
            chipset: res?.data?.specifications?.processor?.chipset,
            cpu: res?.data?.specifications?.processor?.cpu,
            gpu: res?.data?.specifications?.processor?.gpu,
          },
          connectivity: {
            nfc: res?.data?.specifications?.connectivity?.nfc,
            sim: res?.data?.specifications?.connectivity?.sim,
            network: res?.data?.specifications?.connectivity?.network,
            wifi: res?.data?.specifications?.connectivity?.wifi,
            bluetooth: res?.data?.specifications?.connectivity?.bluetooth,
          },
          memory: {
            ram: res?.data?.specifications?.memory?.ram,
            storage: res?.data?.specifications?.memory?.storage,
          },
          battery: {
            capacity: res?.data?.specifications?.battery?.capacity,
            typeCharging: res?.data?.specifications?.battery?.typeCharging,
            wiredCharging: res?.data?.specifications?.battery?.wiredCharging,
            wirelessCharging:
              res?.data?.specifications?.battery?.wirelessCharging,
            portCharging: res?.data?.specifications?.battery?.portCharging,
          },
          design: {
            dimensions: res?.data?.specifications?.design?.dimensions,
            weight: res?.data?.specifications?.design?.weight,
            colors: res?.data?.specifications?.design?.colors,
            frameMaterial: res?.data?.specifications?.design?.frameMaterial,
          },
          additionalFeatures: {
            waterResistance:
              res?.data?.specifications?.additionalFeatures?.waterResistance,
            audio: res?.data?.specifications?.additionalFeatures?.audio,
          },
        },
        options: res?.data?.options,
      });
    }
  };

  useEffect(() => {
    if (!isOpenDrawer) {
      formUpdate.setFieldsValue(stateProductDetails);
    } else {
      formUpdate.setFieldsValue(initial);
    }
  }, [formUpdate, stateProductDetails, isOpenDrawer]);

  const handleDetailsProduct = (id) => {
    if (id) {
      fetchGetDetailsProduct(id);
      setIdUpdateProduct(id);
    }
    setIsOpenDrawer(true);
  };

  const mutationUpdate = useMutationHook((data) => {
    const {
      id,
      token,
      name,
      isPublic,
      operatingSystem,
      brand,
      countInStock,
      discount,
      discountAmount,
      discountStartTime,
      discountEndTime,
      image,
      images,
      specifications,
      options,
    } = data;

    const res = ProductService.updateProduct(id, token, {
      name,
      isPublic,
      operatingSystem,
      brand,
      countInStock,
      discount,
      discountAmount,
      discountStartTime,
      discountEndTime,
      image,
      images,
      specifications,
      options,
    });
    return res;
  });

  const { data: dataUpdated, isSuccess: isSuccessUpdated } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật sản phẩm Thành công");
      setIdUpdateProduct(null);
      handleCloseDrawer();
    } else if (isError) {
      message.error("Cập nhật sản phẩm Thất bại");
    }
  }, [isSuccessUpdated]);

  const onUpdateProduct = () => {
    const params = {
      name: stateProductDetails.name,
      isPublic: stateProductDetails.isPublic,
      operatingSystem: stateProductDetails.operatingSystem,
      brand:
        brandSelectDetail === "new_brand"
          ? stateProductDetails.newBrand
          : stateProductDetails.brand,
      countInStock: stateProductDetails.options.reduce((total, option) => {
        total += +option.quantity;

        return total;
      }, 0),
      discountAmount: stateProductDetails.discountAmount,
      discountStartTime: `${stateProductDetails.discountStartTime}T${stateProductDetails.timeStartDiscount}:00.000+00:00`,
      discountEndTime: `${stateProductDetails.discountEndTime}T${stateProductDetails.timeEndDiscount}:00.000+00:00`,
      image: stateProductDetails.image,
      images: stateProductDetails.images,
      specifications: {
        screen: {
          size: stateProductDetails.specifications.screen.size,
          technology: stateProductDetails.specifications.screen.technology,
          resolution: stateProductDetails.specifications.screen.resolution,
          features: stateProductDetails.specifications.screen.features,
          pwm: stateProductDetails.specifications.screen.pwm,
          design: stateProductDetails.specifications.screen.design,
        },
        camera: {
          rear: {
            main: stateProductDetails.specifications.camera.rear.main,
            ultraWide: stateProductDetails.specifications.camera.rear.ultraWide,
            video: stateProductDetails.specifications.camera.rear.video,
            features: stateProductDetails.specifications.camera.rear.features,
          },
          front: {
            resolution:
              stateProductDetails.specifications.camera.front.resolution,
            features: stateProductDetails.specifications.camera.front.features,
          },
        },
        processor: {
          chipset: stateProductDetails.specifications.processor.chipset,
          cpu: stateProductDetails.specifications.processor.cpu,
          gpu: stateProductDetails.specifications.processor.gpu,
        },
        connectivity: {
          nfc: stateProductDetails.specifications.connectivity.nfc,
          sim: stateProductDetails.specifications.connectivity.sim,
          network: stateProductDetails.specifications.connectivity.network,
          wifi: stateProductDetails.specifications.connectivity.wifi,
          bluetooth: stateProductDetails.specifications.connectivity.bluetooth,
        },
        memory: {
          ram: stateProductDetails.specifications.memory.ram,
          storage: stateProductDetails.specifications.memory.storage,
        },
        battery: {
          capacity: stateProductDetails.specifications.battery.capacity,
          typeCharging: stateProductDetails.specifications.battery.typeCharging,
          wiredCharging:
            stateProductDetails.specifications.battery.wiredCharging,
          wirelessCharging:
            stateProductDetails.specifications.battery.wirelessCharging,
          portCharging: stateProductDetails.specifications.battery.portCharging,
        },
        design: {
          dimensions: stateProductDetails.specifications.design.dimensions,
          weight: stateProductDetails.specifications.design.weight,
          colors: stateProductDetails.specifications.design.colors,
          frameMaterial:
            stateProductDetails.specifications.design.frameMaterial,
        },
        additionalFeatures: {
          waterResistance:
            stateProductDetails.specifications.additionalFeatures
              .waterResistance,
          audio: stateProductDetails.specifications.additionalFeatures.audio,
        },
      },
      options: stateProductDetails.options,
    };

    mutationUpdate.mutate(
      {
        id: idUpdateProduct,
        token: user?.access_token,
        ...params,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  // ================================================================

  // Delete Product =================================================
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [idDeleteProduct, setIdDeleteProduct] = useState(null);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleOpenDeleteModal = (id) => {
    setIsModalOpenDelete(true);
    setIdDeleteProduct(id);
  };

  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: idDeleteProduct, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const { data: dataDeleted, isSuccess: isSuccessDeleted } = mutationDelete;

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      handleCancelDelete();
      setIdDeleteProduct(null);
    }
  }, [isSuccessDeleted]);

  // ================================================================

  // Delete Many ====================================================
  const handleDeleteManyProduct = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const mutationDeleteMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  // ================================================================

  // View Product====================================================
  const [productView, setProductView] = useState(initial);
  const [isOpenProductView, setIsOpenProductView] = useState(false);

  const fetchViewDetailsProduct = async (id) => {
    const res = await ProductService.getDetailsProduct(id);
    if (res?.data) {
      // Time Start ===============================
      const ISOStringStart = res?.data?.discountStartTime;
      const dateObjectStart = new Date(ISOStringStart);

      const yearStart = dateObjectStart.getUTCFullYear();
      const monthStart = String(dateObjectStart.getUTCMonth() + 1).padStart(
        2,
        "0"
      ); // Tháng bắt đầu từ 0
      const dayStart = String(dateObjectStart.getUTCDate()).padStart(2, "0");
      const hoursStart = String(dateObjectStart.getUTCHours()).padStart(2, "0");
      const minutesStart = String(dateObjectStart.getUTCMinutes()).padStart(
        2,
        "0"
      );

      // Time End ===============================
      const ISOStringEnd = res?.data?.discountEndTime;
      const dateObjectEnd = new Date(ISOStringEnd);

      const yearEnd = dateObjectEnd.getUTCFullYear();
      const monthEnd = String(dateObjectEnd.getUTCMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
      const dayEnd = String(dateObjectEnd.getUTCDate()).padStart(2, "0");
      const hoursEnd = String(dateObjectEnd.getUTCHours()).padStart(2, "0");
      const minutesEnd = String(dateObjectEnd.getUTCMinutes()).padStart(2, "0");

      setProductView({
        name: res?.data?.name,
        isPublic: res?.data?.isPublic,
        price: res?.data?.price,
        discount: res?.data?.discount,
        image: res?.data?.image,
        images: res?.data?.images,
        brand: res?.data?.brand,
        countInStock: res?.data?.countInStock,
        discountAmount: res?.data?.discountAmount,
        timeStartDiscount: `${hoursStart}:${minutesStart}`,
        discountStartTime: `${yearStart}-${monthStart}-${dayStart}`,
        timeEndDiscount: `${hoursEnd}:${minutesEnd}`,
        discountEndTime: `${yearEnd}-${monthEnd}-${dayEnd}`,
        specifications: {
          screen: {
            size: res?.data?.specifications?.screen?.size,
            technology: res?.data?.specifications?.screen?.technology,
            resolution: res?.data?.specifications?.screen?.resolution,
            features: res?.data?.specifications?.screen?.features,
            pwm: res?.data?.specifications?.screen?.pwm,
            design: res?.data?.specifications?.screen?.design,
          },
          camera: {
            rear: {
              main: res?.data?.specifications?.camera?.rear?.main,
              ultraWide: res?.data?.specifications?.camera?.rear?.ultraWide,
              video: res?.data?.specifications?.camera?.rear?.video,
              features: res?.data?.specifications?.camera?.rear?.features,
            },
            front: {
              resolution: res?.data?.specifications?.camera?.front?.resolution,
              features: res?.data?.specifications?.camera?.front?.features,
            },
          },
          processor: {
            chipset: res?.data?.specifications?.processor?.chipset,
            cpu: res?.data?.specifications?.processor?.cpu,
            gpu: res?.data?.specifications?.processor?.gpu,
          },
          connectivity: {
            nfc: res?.data?.specifications?.connectivity?.nfc,
            sim: res?.data?.specifications?.connectivity?.sim,
            network: res?.data?.specifications?.connectivity?.network,
            wifi: res?.data?.specifications?.connectivity?.wifi,
            bluetooth: res?.data?.specifications?.connectivity?.bluetooth,
          },
          memory: {
            ram: res?.data?.specifications?.memory?.ram,
            storage: res?.data?.specifications?.memory?.storage,
          },
          battery: {
            capacity: res?.data?.specifications?.battery?.capacity,
            typeCharging: res?.data?.specifications?.battery?.typeCharging,
            wiredCharging: res?.data?.specifications?.battery?.wiredCharging,
            wirelessCharging:
              res?.data?.specifications?.battery?.wirelessCharging,
            portCharging: res?.data?.specifications?.battery?.portCharging,
          },
          design: {
            dimensions: res?.data?.specifications?.design?.dimensions,
            weight: res?.data?.specifications?.design?.weight,
            colors: res?.data?.specifications?.design?.colors,
            frameMaterial: res?.data?.specifications?.design?.frameMaterial,
          },
          additionalFeatures: {
            waterResistance:
              res?.data?.specifications?.additionalFeatures?.waterResistance,
            audio: res?.data?.specifications?.additionalFeatures?.audio,
          },
        },
        options: res?.data?.options,
      });
    }
  };

  const handleViewProductDetail = (id) => {
    if (id) {
      fetchViewDetailsProduct(id);
    }
    setIsOpenProductView(true);
  };

  const handleCloseViewProductDetail = () => {
    setProductView(initial);
    setIsOpenProductView(false);
  };

  // ================================================================

  // Get Data =======================================================

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct("", 100);
    return res;
  };

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });

  const { isLoading: isLoadingAllProduct, data: products } = queryProduct;

  const fetchAllBrandProduct = async () => {
    const res = await ProductService.getAllBrandProduct();
    return res.data;
  };

  const productBrands = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllBrandProduct,
  });

  const fetchAllOptionsProduct = async () => {
    const res = await ProductService.getAllOptionsProduct();
    return res.data;
  };

  const productOptions = useQuery({
    queryKey: ["options-product"],
    queryFn: fetchAllOptionsProduct,
  });

  const ramArr = productOptions?.data?.reduce((acc, current) => {
    const x = acc.find((item) => item.ram === current.ram);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);

  const storageArr = productOptions?.data?.reduce((acc, current) => {
    const x = acc.find((item) => item.storage === current.storage);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);

  const colorArr = productOptions?.data?.reduce((acc, current) => {
    const x = acc.find((item) => item.color === current.color);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);

  const handleGetProductSoldOut = () => {
    const data = products?.data?.filter((product) => {
      const option = product?.options?.filter((item) => {
        if (item?.quantity <= 10) {
          return item;
        }
      });

      if (option.length !== 0) {
        if (product?.countInStock <= 10) {
          return product;
        } else {
          return option;
        }
      }
    });

    return data;
  };

  const onCheckProductOptionsQuantity = () => {
    const data = products?.data?.filter((product) => {
      const option = product?.options?.filter((item) => {
        if (item?.quantity <= 10) {
          return item;
        }
      });

      if (option.length !== 0) {
        if (product?.countInStock <= 10) {
          return product;
        } else {
          return option;
        }
      }
    });

    return data?.length;
  };

  useEffect(() => {
    handleGetProductSoldOut();
    onCheckProductOptionsQuantity();
  }, []);

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Nhãn hiệu",
      dataIndex: "brand",
    },
    {
      title: "Trạng thái",
      dataIndex: "isPublic",
      sorter: (a, b) => a.price - b.price,
      // filters: [
      //   {
      //     text: ">= 100",
      //     value: ">=",
      //   },
      //   {
      //     text: "<= 100",
      //     value: "<=",
      //   },
      // ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        }
        return record.price <= 50;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "countInStock",
      sorter: (a, b) => a.countInStock - b.countInStock,
    },
    {
      title: "Đã bán",
      dataIndex: "selled",
      sorter: (a, b) => a.countInStock - b.countInStock,
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return {
        ...product,
        price: convertPrice(product.price),
        key: product._id,
      };
    });

  // ================================================================

  return (
    <div className={cx("adminProduct__wrapper")}>
      <div>
        <h2 className={cx("adminProduct__header")}>Quản lý Sản phẩm</h2>

        <div className={cx("adminProduct__header__block")}>
          <div
            onClick={() => setIsOpenModal(!isOpenModal)}
            className={cx("add__icon")}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>

          <div className={cx("check__product")}>
            <div className={cx("check__group")}>
              <h3>Tổng có {products?.data?.length} sản phẩm</h3>
            </div>

            <div
              style={{ backgroundColor: "#ad2929" }}
              className={cx("check__group")}
            >
              <h3>{onCheckProductOptionsQuantity()} sản phẩm sắp hết hàng</h3>
            </div>
          </div>
        </div>

        <div className={cx("table__section")}>
          <TableComponent
            keySelect={keySelect}
            handleUpdate={(id) => handleDetailsProduct(id)}
            handleDelete={(id) => handleOpenDeleteModal(id)}
            handleViewDetail={(id) => handleViewProductDetail(id)}
            handleDeleteMany={handleDeleteManyProduct}
            columns={columns}
            data={dataTable}
            isPending={isLoadingAllProduct}
          />
        </div>

        {isOpenModal && (
          <CreateProductForm
            isCloseModal={handleCloseModal}
            onCreateProduct={onCreateProduct}
            formCreate={formCreate}
            stateProduct={stateProduct}
            toggleButton={toggleButton}
            ramArr={ramArr}
            storageArr={storageArr}
            colorArr={colorArr}
            handleOnChange={handleOnChange}
            handleChangeProductImg={handleChangeProductImg}
            changeSelectBrand={handleChangeBrandSelect}
            brandArr={productBrands.data}
            brandSelect={brandSelect}
            ramSelect={ramSelect}
            storageSelect={storageSelect}
            colorSelect={colorSelect}
            handleOnChangeOption={handleOnChangeOption}
            handleRemoveOption={handleRemoveOption}
            handleAddOption={handleAddOption}
            handleRemoveVersion={handleRemoveVersion}
            handleChangeProductOptionImg={handleChangeProductOptionImg}
            handleImageSelect={handleImageSelect}
            handleRemoveImage={handleRemoveImage}
            handleSelectOption={handleSelectOption}
            handleAddFeatures={handleAddFeatures}
            handleRemoveFeatures={handleRemoveFeatures}
          />
        )}

        {isOpenDrawer && (
          <UpdateProductForm
            isCloseDrawer={handleCloseDrawer}
            onUpdateProduct={onUpdateProduct}
            formUpdate={formUpdate}
            stateProductDetails={stateProductDetails}
            toggleButton={toggleDetailButton}
            handleOnChangeDetails={handleOnChangeDetails}
            handleOnchangeProductImgDetails={handleOnchangeProductImgDetails}
            changeSelectBrand={handleChangeBrandDetail}
            brandArr={productBrands.data}
            brandSelect={brandSelectDetail}
            ramSelect={ramSelectDetail}
            storageSelect={storageSelectDetail}
            colorSelect={colorSelectDetail}
            handleOnChangeOption={handleOnChangeOptionDetail}
            handleRemoveOption={handleRemoveOptionDetail}
            handleAddOption={handleAddOptionDetail}
            handleRemoveVersion={handleRemoveVersionDetail}
            handleChangeProductOptionImg={handleChangeProductOptionImgDetail}
            handleImageSelect={handleImageSelectDetail}
            handleRemoveImage={handleRemoveImageDetail}
            handleSelectOption={handleSelectOptionDetail}
            handleAddFeatures={handleAddFeaturesDetail}
            handleRemoveFeatures={handleRemoveFeaturesDetail}
          />
        )}

        {isOpenProductView && (
          <ViewproductDetail
            data={productView}
            handleCloseViewProductDetail={handleCloseViewProductDetail}
          />
        )}

        <ModalComponent
          title="Xóa sản phẩm"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteProduct}
          forceRender
        >
          <div className={cx("delete__text")}>
            Bạn có chắc muốn xóa sản phẩm này không???
          </div>
        </ModalComponent>
      </div>
    </div>
  );
}

export default AdminProduct;

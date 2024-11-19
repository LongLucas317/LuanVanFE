import axios from "axios";
import { axiosJWT } from "./UserServices";

export const getAllSliderImage = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/slider/all-image`
  );
  return res.data;
};

export const createSliderImage = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/slider/add-image`,
    data
  );
  return res.data;
};

export const updateSliderImage = async (id, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/slider/update/${id}`,
    data
  );
  return res.data;
};

export const deleteSliderImage = async (id) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/slider/delete/${id}`
  );
  return res.data;
};

import axios from "axios";
import { axiosJWT } from "./UserServices";

export const getAllRank = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/rank/getAll`);
  return res.data;
};

export const getDetailsRank = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/rank/getDetail/${id}`
  );
  return res.data;
};

export const createRank = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/rank/create`,
    data
  );
  return res.data;
};

export const updateRank = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/rank/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteRank = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/rank/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

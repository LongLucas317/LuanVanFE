import axios from "axios";
import { axiosJWT } from "./UserServices";

export const getAllProduct = async (search = "", limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?filter=name&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?limit=${limit}`
    );
  }
  return res.data;
};

export const getProductBrand = async (brand, limit) => {
  if (brand) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/getAll?filter=brand&filter=${brand}&limit=${limit}`
    );
    return res.data;
  }
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create`,
    data
  );
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/getDetail/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/product/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/product/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyProduct = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/product/deleteMany`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllBrandProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/getAll-brand`
  );
  return res.data;
};

export const getAllOptionsProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/getAll-options`
  );
  return res.data;
};

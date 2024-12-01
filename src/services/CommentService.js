import { axiosJWT } from "./UserServices";

export const createComment = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/comment/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateComment = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/comment/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllComment = async (access_token, id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/comment/getAll/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteComment = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/comment/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteCommentByProductId = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/comment/deleteAll/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

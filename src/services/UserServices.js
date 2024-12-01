import axios from "axios";
export const axiosJWT = axios.create();

export const signUpUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-up`,
    data
  );
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-in`,
    data
  );
  return res.data;
};

export const logoutUser = async () => {
  localStorage.removeItem("access_token");
  window.location.reload();
};

export const getDetailUser = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/user/getDetail/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllsUser = async (access_token, search = "") => {
  let res = {};
  if (search.trim() !== "") {
    res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}/user/getAll?filter=name&filter=${search}`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
  } else {
    res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/getAll`, {
      headers: {
        token: `Bearer ${access_token}`,
      },
    });
  }
  return res.data;
};

export const refreshToken = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/refresh-token`,
    {
      withCredentials: false,
    }
  );
  return res.data;
};

export const updateUser = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/user/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteUser = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/user/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyUser = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/user/deleteMany`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

import axios from "axios";

export const getRevenueData = async (year = "", month = "") => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/revenue/get-revenue?year=${year}&month=${month}`
  );
  return res.data;
};

export const updateRevenue = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/revenue/update-revenue`,
    data
  );
  return res.data;
};

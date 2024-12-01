import classNames from "classnames/bind";
import style from "./AdminDashboard.module.scss";

import RevenueChart from "../RevenueChart";
import * as RevenueService from "~/services/RevenueService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const cx = classNames.bind(style);

function AdminDashboard() {
  const [revenueDecemberLastYear, setRevenueDecemberLastYear] = useState(0);
  const [revenueLastYear, setRevenueLastYear] = useState([]);
  const [revenueCurrentYear, setRevenueCurrentYear] = useState([]);

  const currentYear = new Date().getFullYear();
  const monthlyRevenue = [
    1000000, 1200000, 1500000, 1300000, 1600000, 1800000, 2000000, 2100000,
    1900000, 2200000, 2400000, 2600000,
  ];

  const queryRevenueLastYear = async () => {
    const res = await RevenueService.getRevenueData(currentYear - 1);

    if (res?.status === "OK") {
      const lastRevenueArr = res?.data?.map((revenue) => {
        return revenue?.amount;
      });

      setRevenueLastYear(lastRevenueArr);

      const decemberLastYearRevenue = res?.data?.find(
        (revenue) => revenue.month === 12
      );

      setRevenueDecemberLastYear(decemberLastYearRevenue?.amount);
    }

    return res;
  };

  useEffect(() => {
    queryRevenueLastYear();
  }, []);

  const getRevenueCurrentYear = async () => {
    const res = await RevenueService.getRevenueData(currentYear);

    if (res?.status === "OK") {
      const currentRevenueArr = res?.data?.map((revenue) => revenue.amount);
      setRevenueCurrentYear(currentRevenueArr);
    }
  };

  useEffect(() => {
    getRevenueCurrentYear();
  }, []);

  return (
    <div className={cx("adminDashboard__wrapper")}>
      <h2>Biểu đồ doanh thu</h2>

      <div className={cx("chart__section")}>
        <RevenueChart
          monthlyRevenue={
            revenueCurrentYear !== undefined
              ? revenueCurrentYear
              : monthlyRevenue
          }
          previousYearDecemberRevenue={revenueDecemberLastYear}
          monthlyRevenueCurrentYear={revenueCurrentYear}
          monthlyRevenueLastYear={revenueLastYear}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;

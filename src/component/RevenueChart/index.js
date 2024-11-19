import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

function RevenueChart({
  monthlyRevenue,
  previousYearDecemberRevenue,
  monthlyRevenueCurrentYear,
  monthlyRevenueLastYear,
}) {
  // Lấy tháng hiện tại và tháng trước
  const currentMonth = new Date().getMonth(); // Tháng hiện tại (0-11)
  const currentYear = new Date().getFullYear();

  const previousMonthRevenue =
    currentMonth === 0
      ? previousYearDecemberRevenue
      : monthlyRevenue[currentMonth - 1];

  // Dữ liệu cho biểu đồ cột so sánh doanh thu
  const monthBarData = {
    labels: [`Tháng ${currentMonth}`, `Tháng ${currentMonth + 1}`],
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: [previousMonthRevenue || 0, monthlyRevenue[currentMonth]],
        backgroundColor: ["#7bd2e5", "#06aa0c"], // Màu cho tháng trước và tháng hiện tại
      },
    ],
  };

  const monthBarOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `So sánh doanh thu tháng ${currentMonth} và tháng ${
          currentMonth + 1
        }`,
      },
    },
  };

  // Dữ liệu cho biểu đồ đường theo từng tháng trong năm hiện tại
  const yearLineData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: `Doanh thu hàng tháng trong năm ${currentYear} (VNĐ)`,
        data: monthlyRevenue,
        borderColor: "#06aa0c",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const yearLineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Doanh thu theo từng tháng trong năm ${currentYear}`,
      },
    },
  };

  // Dữ liệu cho biểu đồ cột so sánh doanh thu giữa năm hiện tại và năm trước
  const barData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: `Doanh thu năm ${currentYear - 1} (VNĐ)`,
        data: monthlyRevenueLastYear,
        backgroundColor: "#7bd2e5", // Màu cho năm trước
      },
      {
        label: `Doanh thu năm ${currentYear} (VNĐ)`,
        data: monthlyRevenueCurrentYear,
        backgroundColor: "#06aa0c", // Màu cho năm hiện tại
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Doanh thu theo từng tháng của năm ${
          currentYear - 1
        } và năm ${currentYear}`,
      },
    },
  };

  // Dữ liệu cho biểu đồ đường so sánh doanh thu năm trước và năm hiện tại
  const lineData = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: `Doanh thu năm ${currentYear - 1} (VNĐ)`,
        data: monthlyRevenueLastYear,
        borderColor: "#7bd2e5",
        fill: false,
        tension: 0.1,
      },
      {
        label: `Doanh thu năm ${currentYear} (VNĐ)`,
        data: monthlyRevenueCurrentYear,
        borderColor: "#06aa0c",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: `Doanh thu theo từng tháng của năm ${
          currentYear - 1
        } và năm ${currentYear}`,
      },
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ width: "40%", margin: "0 auto" }}>
          <Bar data={monthBarData} options={monthBarOptions} />
        </div>
        <div style={{ width: "60%", margin: "0 auto" }}>
          <Line data={yearLineData} options={yearLineOptions} />
        </div>
      </div>

      <div style={{ border: "0.5px solid #ccc", margin: "12px 0px" }}></div>

      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ width: "40%", margin: "0 auto" }}>
          <Bar data={barData} options={barOptions} />
        </div>
        <div style={{ width: "60%", margin: "0 auto" }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;

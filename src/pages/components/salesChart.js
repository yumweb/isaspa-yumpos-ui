import { useState, useEffect } from "react";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Form } from "react-bootstrap";
import clientAdapter from "../../lib/clientAdapter"; // Make sure this correctly points to your API service

const SalesChart = () => {
  const [graphType, setGraphType] = useState("weekly");
  const [salesData, setSalesData] = useState([]);

  const getSalesReportData = async (type) => {
    let startDate, endDate;

    if (type === "monthly") {
      startDate = moment().startOf("month").format("YYYY-MM-DD");
      endDate = moment().endOf("month").format("YYYY-MM-DD");
    } else {
      startDate = moment().startOf("isoWeek").format("YYYY-MM-DD");
      endDate = moment().endOf("isoWeek").format("YYYY-MM-DD");
    }

    try {
      const res = await clientAdapter.getSaleDataReport(startDate, endDate);

      // Map the API response to the format needed by the chart
      const formattedData = res.map((item) => ({
        date: moment(item.sale_date).format("Do MMM"), // Formats the date to "1st Sep"
        total: Number(item.daily_sales_count), // Converts count to a number
      }));

      setSalesData(formattedData);
    } catch (error) {
      console.error("Error fetching sales report data:", error);
    }
  };

  useEffect(() => {
    getSalesReportData(graphType);
  }, [graphType]);

  const handleGraphTypeChange = (e) => {
    setGraphType(e.target.value);
  };

  return (
    <>
      {/* Dropdown to select Monthly or Weekly view */}
      <div className="text-center mt-3 mb-3">
        <Form.Select value={graphType} onChange={handleGraphTypeChange}>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Form.Select>
      </div>

      {/* Bar chart to show sales data */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default SalesChart;

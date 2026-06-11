import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import clientAdapter from "../../../lib/clientAdapter";
import moment from "moment";
import { Button } from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const DetailedInventoryTable = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get("itemId");
  const showManualAdjustmentsOnly = searchParams.get("showManualAdjustmentsOnly") === "true";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await clientAdapter.getDetailedInventoryReport(
          startDate,
          endDate,
          itemId,
          showManualAdjustmentsOnly
        );
        setData(res || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [itemId, showManualAdjustmentsOnly, startDate, endDate]);

  const formatQuantity = (qty) => {
    const num = parseFloat(qty);
    return num > 0 ? `+${num}` : num;
  };

  const formatDate = (date) => {
    return moment(date).format("DD-MM-YYYY hh:mm A");
  };

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <Button
          variant="secondary"
          onClick={() => navigate("/inventory/report-form/detailed")}
        >
          <ArrowBackIcon fontSize="small" /> Back
        </Button>
      </div>

      <div className="card shadow-lg border-0 w-100">
        <div className="card-header bg-dark text-light text-center py-4">
          <h2 className="mb-0">Detailed Inventory Report</h2>
          <p className="mb-0 text-light">
            {moment(startDate).format("DD-MM-YYYY")} to{" "}
            {moment(endDate).format("DD-MM-YYYY")}
            {showManualAdjustmentsOnly && " (Manual Adjustments Only)"}
          </p>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="bg-primary text-light">
                  <tr>
                    <th scope="col">Item ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Item Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Item Number</th>
                    <th scope="col">Product ID</th>
                    <th scope="col">Size</th>
                    <th scope="col">Quantity (+/-)</th>
                    <th scope="col">Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{item.itemId}</td>
                        <td>{formatDate(item.transDate)}</td>
                        <td>{item.itemName}</td>
                        <td>{item.categoryName || "-"}</td>
                        <td>{item.itemNumber || "-"}</td>
                        <td>{item.productId || "-"}</td>
                        <td>{item.size || "-"}</td>
                        <td
                          className={
                            parseFloat(item.quantity) > 0
                              ? "text-success fw-bold"
                              : "text-danger fw-bold"
                          }
                        >
                          {formatQuantity(item.quantity)}
                        </td>
                        <td>{item.comment || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import clientAdapter from "../../../lib/clientAdapter";

export const ReceivingsTable = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientAdapter.getInventoryReceivingsReport(
          fromDate,
          toDate,
          category
        );
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 w-100">
        <div className="card-header bg-dark text-light text-center py-4">
          <h2 className="mb-0">Inventory Receivings</h2>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <p className="mb-1">
                <strong>From Date:</strong> {fromDate}
              </p>
            </div>
            <div className="col-md-6">
              <p className="mb-1">
                <strong>To Date:</strong> {toDate}
              </p>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="bg-primary">
                <tr>
                  <th scope="col" style={{ color: "white" }}>Item Name</th>
                  <th scope="col" style={{ color: "white" }}>Quantity Purchased</th>
                  <th scope="col" style={{ color: "white" }}>Item Cost Price</th>
                  <th scope="col" style={{ color: "white" }}>Company Name</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>{Number(item.quantityPurchased).toFixed(2)}</td>
                      <td>{Number(item.itemCostPrice).toFixed(2)}</td>
                      <td>{item.supplierName}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

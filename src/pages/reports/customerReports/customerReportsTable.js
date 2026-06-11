import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import clientAdapter from "../../../lib/clientAdapter";

export const CustomerReportsTable = () => {
  const [searchParams] = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const itemId = searchParams.get("itemId");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientAdapter.customerServicesReport(
          fromDate,
          toDate,
          itemId
        );
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fromDate, toDate, itemId]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 w-100">
        <div className="card-header bg-dark text-light text-center py-4">
          <h2 className="mb-0">Customer Reports</h2>
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
              <thead className="bg-primary text-light">
                <tr>
                  <th scope="col text-light">Customer ID</th>
                  <th scope="col text-light">First Name</th>
                  <th scope="col text-light">Phone Number</th>
                  <th scope="col text-light">Repeat Count</th>
                  <th scope="col text-light">Total Bill Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>{customer.customer_id}</td>
                      <td>{customer.first_name}</td>
                      <td>{customer.phone_number}</td>
                      <td>{customer.repeat_count}</td>
                      <td>
                        ₹{parseFloat(customer.total_bill_amount).toFixed(2)}
                      </td>
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

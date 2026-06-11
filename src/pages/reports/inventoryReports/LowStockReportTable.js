import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import clientAdapter from "../../../lib/clientAdapter";

export const LowStockReportTable = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clientAdapter.getLowStockReport(category);
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
          <h2 className="mb-0">Low Stock Reports</h2>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="bg-primary text-light">
                <tr>
                  <th scope="col text-light">Category</th>
                  <th scope="col text-light">Name</th>
                  <th scope="col text-light">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.category_name}>
                      <td>{item.category_name}</td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
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

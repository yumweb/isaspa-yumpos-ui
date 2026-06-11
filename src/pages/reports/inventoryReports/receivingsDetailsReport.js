import React, { useEffect, useState } from "react";
import clientAdapter from "../../../lib/clientAdapter";
import moment from "moment";

const formatDate = (d) => moment(d).format("YYYY-MM-DD HH:mm:ss");

const ReceivingsDetailsReport = () => {
  const [rows, setRows] = useState([]);
  const [from, setFrom] = useState(formatDate(moment().startOf("month")));
  const [to, setTo] = useState(formatDate(moment().endOf("month")));
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await clientAdapter.getReceivingsDetailsReport(from, to);
      setRows(res || []);
    } catch (e) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Receivings - Detailed Report</h3>

      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-4">
          <label className="form-label">From</label>
          <input
            type="text"
            className="form-control"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">To</label>
          <input
            type="text"
            className="form-control"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={fetchData}>
            {loading ? "Loading..." : "Run Report"}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-light">
            <tr>
              <th>Receiving ID</th>
              <th>Date</th>
              <th>Items Ordered</th>
              <th>Quantity Received</th>
              <th>Received By</th>
              <th>Supplied By</th>
              <th>Subtotal</th>
              <th>Total</th>
              <th>Tax</th>
              <th>Payment Type</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {rows && rows.length ? (
              rows.map((r) => (
                <tr key={r.receivingId}>
                  <td>{r.receivingId}</td>
                  <td>{moment(r.date).format("YYYY-MM-DD HH:mm")}</td>
                  <td>{r.itemsOrdered}</td>
                  <td>{r.quantityReceived}</td>
                  <td>{r.receivedBy}</td>
                  <td>{r.suppliedBy}</td>
                  <td>{Number(r.subtotal).toFixed(2)}</td>
                  <td>{Number(r.total).toFixed(2)}</td>
                  <td>{Number(r.tax).toFixed(2)}</td>
                  <td>{r.paymentType}</td>
                  <td>{r.comments}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceivingsDetailsReport;


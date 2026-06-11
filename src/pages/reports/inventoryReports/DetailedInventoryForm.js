import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Container,
  FormGroup,
  FormCheck,
} from "react-bootstrap";
import clientAdapter from "../../../lib/clientAdapter";
import moment from "moment";

export const DetailedInventoryForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({ name: "All Items", id: -1 });
  const [showManualAdjustmentsOnly, setShowManualAdjustmentsOnly] = useState(false);
  const [startDate, setStartDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchItems() {
      try {
        const itemsList = await clientAdapter.getAllItemsWithoutSignal();
        setItems(itemsList || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }

    fetchItems();
  }, []);

  const handleSubmit = () => {
    const params = new URLSearchParams({
      itemId: selectedItem.id,
      showManualAdjustmentsOnly: showManualAdjustmentsOnly,
      startDate: moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
      endDate: moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    });
    navigate(`/inventory/report/detailed?${params.toString()}`);
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Detailed Inventory Report</h3>

      <Row className="mb-3">
        <Col md={6}>
          <FormGroup>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <FormGroup>
            <label className="form-label">Select Item</label>
            <select
              className="form-select"
              value={selectedItem.id}
              onChange={(e) => {
                const item = items.find(
                  (i) => i.itemId === parseInt(e.target.value)
                );
                setSelectedItem(
                  item
                    ? { name: item.name, id: item.itemId }
                    : { name: "All Items", id: -1 }
                );
              }}
            >
              <option value={-1}>All Items</option>
              {items.map((item) => (
                <option key={item.itemId} value={item.itemId}>
                  {item.name}
                </option>
              ))}
            </select>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup className="mt-4">
            <FormCheck
              type="checkbox"
              label="Show Manual Adjustments Only"
              checked={showManualAdjustmentsOnly}
              onChange={(e) => setShowManualAdjustmentsOnly(e.target.checked)}
            />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <p className="text-muted">
            Selected Item: <strong>{selectedItem.name}</strong>
          </p>
        </Col>
      </Row>

      <Button variant="primary" onClick={handleSubmit}>
        Generate Report
      </Button>
    </Container>
  );
};

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownButton,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import * as moment from "moment";

export const CustomerReport = () => {
  const [timePeriod, setTimePeriod] = useState();
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  const handleSelect = (eventKey) => {
    setTimePeriod(eventKey);
    if (eventKey === "Custom") {
      setIsCustomDate(true);
    } else {
      setIsCustomDate(false);
    }
  };

  const handleSubmit = () => {
    if (timePeriod === "Custom" && (!fromDate || !toDate)) {
      return;
    }
    if (timePeriod === "Custom") {
      navigate(`/customer-report?fromDate=${fromDate}&toDate=${toDate}`);
    } else if (timePeriod === "This Month") {
      const fromDate = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
      const toDate = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");
      navigate(`/customer-report?fromDate=${fromDate}&toDate=${toDate}`);
    } else if (timePeriod === "Last Month") {
      const fromDate = moment()
        .subtract(1, "month")
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      const toDate = moment()
        .subtract(1, "month")
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      navigate(`/customer-report?fromDate=${fromDate}&toDate=${toDate}`);
    } else if (timePeriod === "This Year") {
      const fromDate = moment().startOf("year").format("YYYY-MM-DD HH:mm:ss");
      const toDate = moment().endOf("year").format("YYYY-MM-DD HH:mm:ss");
      navigate(`/customer-report?fromDate=${fromDate}&toDate=${toDate}`);
    } else if (timePeriod === "Last Year") {
      const fromDate = moment()
        .subtract(1, "year")
        .startOf("year")
        .format("YYYY-MM-DD HH:mm:ss");
      const toDate = moment()
        .subtract(1, "year")
        .endOf("year")
        .format("YYYY-MM-DD HH:mm:ss");
      navigate(`/customer-report?fromDate=${fromDate}&toDate=${toDate}`);
    } else {
      return;
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Customer Report</h3>

      <h1>{timePeriod}</h1>

      <Row className="mb-3">
        <Col>
          <DropdownButton
            title="Select a time period here"
            onSelect={handleSelect}
            className="mb-3"
          >
            <Dropdown.Item eventKey="This Month">This Month</Dropdown.Item>
            <Dropdown.Item eventKey="Last Month">Last Month</Dropdown.Item>
            <Dropdown.Item eventKey="This Year">This Year</Dropdown.Item>
            <Dropdown.Item eventKey="Last Year">Last Year</Dropdown.Item>
            <Dropdown.Item eventKey="Custom">Custom Date</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      {isCustomDate && (
        <Form className="mb-4">
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      )}

      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
};

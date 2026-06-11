import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownButton,
  Form,
  Button,
  Row,
  Col,
  Container,
  InputGroup,
} from "react-bootstrap";
import * as moment from "moment";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import clientAdapter from "../../../lib/clientAdapter";
import is from "date-fns/locale/is/index";

export const ReceivingsForm = () => {
  const [timePeriod, setTimePeriod] = useState();
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isExcelReport, setIsExcelReport] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    name: "",
    id: "",
  });
  const navigate = useNavigate();

  const handleSelect = (eventKey) => {
    setTimePeriod(eventKey);
    if (eventKey === "Custom") {
      setIsCustomDate(true);
    } else {
      setIsCustomDate(false);
    }
  };

  const handleSelectCategory = (eventKey) => {
    const category = JSON.parse(eventKey);
    setSelectedCategory(category);
  };

  useEffect(() => {
    async function fetchCategories() {
      const categories = await clientAdapter.getAllCategoriesNames();
      setCategories(categories);
    }

    fetchCategories();
  }, []);

  const getCsvReport = async (fromDate, toDate) => {
    const res = await clientAdapter.getInventoryReceivingsReportCSV(
      fromDate,
      toDate,
      selectedCategory.id
    );

    const url = window.URL.createObjectURL(res);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (timePeriod === "Custom" && (!fromDate || !toDate)) {
      return;
    }
    if (timePeriod === "Custom") {
      if (isExcelReport) {
        getCsvReport(fromDate, toDate);
        return;
      }
      navigate(
        `/inventory/report/receiving?fromDate=${fromDate}&toDate=${toDate}&category=${selectedCategory.id}`
      );
    } else if (timePeriod === "This Month") {
      const fromDate = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
      const toDate = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");
      if (isExcelReport) {
        getCsvReport(fromDate, toDate);
        return;
      }
      navigate(
        `/inventory/report/receiving?fromDate=${fromDate}&toDate=${toDate}&category=${selectedCategory.id}`
      );
    } else if (timePeriod === "Last Month") {
      const fromDate = moment()
        .subtract(1, "month")
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      const toDate = moment()
        .subtract(1, "month")
        .endOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      if (isExcelReport) {
        getCsvReport(fromDate, toDate);
        return;
      }
      navigate(
        `/inventory/report/receiving?fromDate=${fromDate}&toDate=${toDate}&category=${selectedCategory.id}`
      );
    } else if (timePeriod === "This Year") {
      const fromDate = moment().startOf("year").format("YYYY-MM-DD HH:mm:ss");
      const toDate = moment().endOf("year").format("YYYY-MM-DD HH:mm:ss");
      if (isExcelReport) {
        getCsvReport(fromDate, toDate);
        return;
      }
      navigate(
        `/inventory/report/receiving?fromDate=${fromDate}&toDate=${toDate}&category=${selectedCategory.id}`
      );
    } else if (timePeriod === "Last Year") {
      const fromDate = moment()
        .subtract(1, "year")
        .startOf("year")
        .format("YYYY-MM-DD HH:mm:ss");
      const toDate = moment()
        .subtract(1, "year")
        .endOf("year")
        .format("YYYY-MM-DD HH:mm:ss");
      if (isExcelReport) {
        getCsvReport(fromDate, toDate);
        return;
      }
      navigate(
        `/inventory/report/receiving?fromDate=${fromDate}&toDate=${toDate}&category=${selectedCategory.id}`
      );
    } else {
      return;
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Receivings Report</h3>

      <h1>{timePeriod}</h1>

      <Row className="mb-3">
        <Col>
          <DropdownButton
            title="Click to select a time period here"
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

      {selectedCategory.name && (
        <h5>Selected Category: {selectedCategory.name || "None"}</h5>
      )}

      <Row className="mb-3">
        <Col>
          <DropdownButton
            title="Click to select a Category"
            onSelect={handleSelectCategory}
            className="mb-3"
          >
            {categories.map((cat) => (
              <Dropdown.Item
                eventKey={JSON.stringify({ name: cat.name, id: cat.id })}
                key={cat.id}
              >
                {cat.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>
      </Row>

      <Form className="mb-4">
        <Form.Group>
          <Form.Label>Report Format</Form.Label>
          <div>
            <Form.Check
              inline
              label="Web"
              name="reportFormat"
              type="radio"
              id="normalReport"
              onChange={() => setIsExcelReport(false)}
              checked={!isExcelReport}
            />
            <Form.Check
              inline
              label="Excel"
              name="reportFormat"
              type="radio"
              id="excelReport"
              onChange={() => setIsExcelReport(true)}
              checked={isExcelReport}
            />
          </div>
        </Form.Group>
      </Form>

      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
};

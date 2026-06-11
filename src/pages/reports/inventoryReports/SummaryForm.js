import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownButton,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import clientAdapter from "../../../lib/clientAdapter";

export const InventorySummaryReport = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState({
    name: "",
    id: "",
  });
  const navigate = useNavigate();

  const handleSelect = (eventKey) => {
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

  const handleSubmit = () => {
    navigate(`/inventory/report/summary?category=${selectedCategory.id}`);
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Inventory summary Report</h3>

      <h5>Selected Category: {selectedCategory.name || "None"}</h5>

      <Row className="mb-3">
        <Col>
          <DropdownButton
            title="Select a Category"
            onSelect={handleSelect}
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

      <Button variant="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Container>
  );
};

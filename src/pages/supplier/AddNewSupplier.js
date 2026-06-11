import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "@themesberg/react-bootstrap";
import clientAdapter from "../../lib/clientAdapter";

export const AddNewSupplier = ({
  showModal,
  handleCloseModal,
  setSnackBar,
  onSuccess,
}) => {
  const initialData = {
    companyName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    comments: "",
  };

  const [supplierData, setSupplierData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!supplierData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (supplierData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supplierData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (supplierData.phoneNumber && !/^[\d\s\-+()]+$/.test(supplierData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData({
      ...supplierData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSaveChanges = async () => {
    setValidated(true);
    if (!validateForm()) {
      return;
    }

    try {
      await clientAdapter.createSupplier(supplierData);
      setSnackBar({
        open: true,
        severity: "success",
        message: "Successfully created Supplier",
      });
      // Reset form
      setSupplierData(initialData);
      setErrors({});
      setValidated(false);
      handleCloseModal();
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      setSnackBar({
        open: true,
        severity: "error",
        message: e.message || "Error in Creating Supplier",
      });
    }
  };

  const handleClose = () => {
    setSupplierData(initialData);
    setErrors({});
    setValidated(false);
    handleCloseModal();
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Add New Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Row>
            <Col md={12}>
              <Form.Group controlId="companyName" className="mb-3">
                <Form.Label>
                  Company Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter company name"
                  name="companyName"
                  value={supplierData.companyName}
                  onChange={handleChange}
                  isInvalid={validated && !!errors.companyName}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.companyName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="firstName" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                  value={supplierData.firstName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lastName" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  name="lastName"
                  value={supplierData.lastName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="phone" className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  name="phoneNumber"
                  value={supplierData.phoneNumber}
                  onChange={handleChange}
                  isInvalid={validated && !!errors.phoneNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={supplierData.email}
                  onChange={handleChange}
                  isInvalid={validated && !!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="address1" className="mb-3">
                <Form.Label>Address 1</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address 1"
                  name="address1"
                  value={supplierData.address1}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="address2" className="mb-3">
                <Form.Label>Address 2</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address 2"
                  name="address2"
                  value={supplierData.address2}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="city" className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  name="city"
                  value={supplierData.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="state" className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter state"
                  name="state"
                  value={supplierData.state}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="zipCode" className="mb-3">
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter zip code"
                  name="zipCode"
                  value={supplierData.zipCode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="country" className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country"
                  name="country"
                  value={supplierData.country}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="comments" className="mb-3">
                <Form.Label>Comments</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter comments"
                  name="comments"
                  value={supplierData.comments}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

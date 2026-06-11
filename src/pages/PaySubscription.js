import React from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";

const SubscriptionAlert = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Alert variant="danger">
            <Alert.Heading>Subscription Expired</Alert.Heading>
            <p>
              It looks like your franchise has not paid the subscription for
              Yumpos. To continue enjoying our services, please contact the
              corporate office to renew your subscription.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button
                variant="outline-danger"
                onClick={() =>
                  (window.location.href = "mailto:corporate@yourcompany.com")
                }
              >
                Contact Corporate
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default SubscriptionAlert;

import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  Container,
  InputGroup,
  Modal,
} from "@themesberg/react-bootstrap";
import BgImage from "../../assets/img/illustrations/signin.svg";
import clientAdapter from "../../lib/clientAdapter";
import "../../scss/signin.page.scss";
import { useNavigate, Link } from "react-router-dom";
import { AppRoutes } from "../../routes";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDefault, setShowDefault] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem("yumpos_token");
    const locationId = window.localStorage.getItem("yumpos_location");
    if (token && locationId) {
      navigate("/dashboard");
    }
  }, []);

  const loginUser = async () => {
    try {
      const res = await clientAdapter.loginEmployee({ username, password });
      if (res.token) {
        window.localStorage.setItem("yumpos_token", res.token);
        const getLocations = await clientAdapter.getUserLocations();
        setLocationList(getLocations.locations);
        setShowDefault(true);
      } else {
        setError("Incorrect username or password.");
      }
    } catch (err) {
      console.log("eror from login", err);
    }
  };

  const setLocation = async (location) => {
    const res = await clientAdapter.setUserLocation(location.locationId);
    if (res.token) {
      window.localStorage.setItem("yumpos_token", res.token);
      window.localStorage.setItem("yumpos_location", JSON.stringify(location));
      window.localStorage.setItem(
        "yumpos_user_info",
        JSON.stringify(res.userInfo)
      );
      window.location.href = "dashboard";
    } else {
      setError("Some error occurred. Please try again later.");
      setShowDefault(false);
    }
  };

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row
            className="justify-content-center form-bg-image"
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">YumPOS</h3>
                  <div className="text-danger">{error}</div>
                </div>
                <Form className="mt-4">
                  <Form.Group id="email" className="mb-4">
                    <Form.Label>Username</Form.Label>
                    <InputGroup>
                      <Form.Control
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        required
                        type="text"
                        placeholder="username"
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <Form.Control
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          type="password"
                          placeholder="Password"
                        />
                      </InputGroup>
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Card.Link
                        as={Link}
                        to={AppRoutes.ForgotPassword.path}
                        className="small text-end"
                      >
                        Lost password?
                      </Card.Link>
                    </div>
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={loginUser}
                  >
                    Sign in
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <React.Fragment>
        <Modal as={Modal.Dialog} centered show={showDefault}>
          <Modal.Header>
            <Modal.Title className="h6 text-center">
              Select Location
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="store-list-body">
              <ul className="store-list">
                {locationList.map((l) => (
                  <Button
                    className="btn-store-select mb-2"
                    key={l.locationId.toString()}
                    onClick={() => setLocation(l)}
                  >
                    <li key={l.locationId.toString()}>{l.name}</li>
                  </Button>
                ))}
              </ul>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </main>
  );
};

export default SignIn;

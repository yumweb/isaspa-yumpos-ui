import { useState } from "react";
import { AppRoutes } from "../../routes";
import clientAdapter from "../../lib/clientAdapter";
import { Link, useNavigate } from 'react-router-dom';
import { Backdrop, Box, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup, Alert } from '@themesberg/react-bootstrap';

export default () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (username.trim() === "") {
      setShowMessage(true);
      return;
    }

    setLoading(true);
    try {
      const data = {
        username,
      }
      const res = await clientAdapter.resetEmail(data);
      if (res === 201) {
          navigate('/reset-password-notify');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="bg-soft d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center">
            <p className="text-center">
              <Card.Link as={Link} to={AppRoutes.SignIn.path} className="text-gray-700">
                <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to sign in
              </Card.Link>
            </p>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="signin-inner my-3 my-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                {showMessage && (
                  <Alert variant="danger">
                    <b>Error:</b> The field cannot be empty
                  </Alert>
                )}
                <h3>Forgot your password?</h3>
                <p className="mb-4">Don't fret! Just type in your username and we will send you a code to reset your password!</p>
                <Box>
                  <div className="mb-4">
                    <Form.Label htmlFor="text">Your Username</Form.Label>
                    <InputGroup id="text">
                      <Form.Control
                        required 
                        autoFocus 
                        type="text" 
                        value={username}
                        placeholder="john" 
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    onClick={handleSubmit}
                  >
                    Recover password
                  </Button>
                </Box>
                <Backdrop 
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={loading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

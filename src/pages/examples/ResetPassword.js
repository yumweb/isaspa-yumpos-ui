import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup, Alert } from '@themesberg/react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppRoutes } from "../../routes";
import { useEffect, useState } from "react";
import { Box, Snackbar } from "@mui/material";
import clientAdapter from "../../lib/clientAdapter";

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const token = queryParameters.get('token');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const isTokenValid = (token) => {
    return !!token;
  };

  useEffect(() => {
    if (!token || !isTokenValid(token)) {
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [token]);

  const handleResetPassword = async() => {
    if( password !== confirmPassword ) {
      setPwdConfirm(true);
      return;
    }

    try {
      const data = {
        token,
        password,
      }
      const res = await clientAdapter.resetPassword(data);

      if (res === 201) {
        setOpen(true);
        setSnackbarText("Password Reset Successful!");
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  }

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
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                {pwdConfirm && (
                  <Alert variant="danger">
                    Password and Confirm Password are not Same
                  </Alert>
                )}
                <h3 className="mb-4">Reset password</h3>
                <Box>
                  <Form.Group id="password" className="mb-4">
                    <Form.Label>Your Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ height: '43.5px' }}>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control 
                        required 
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group id="confirmPassword" className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={{ height: '43.5px' }}>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control 
                        required 
                        placeholder="Confirm Password" 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    onClick={handleResetPassword}
                  >
                    Reset password
                  </Button>
                </Box>
              </div>
            </Col>
          </Row>
        </Container>
        <Snackbar 
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
        >
          <Alert        
            onClose={handleClose}
            variant="success"
            sx={{ width: "100%" }}
          >
            {snackbarText}
          </Alert>
        </Snackbar>
      </section>
    </main>
  );
};

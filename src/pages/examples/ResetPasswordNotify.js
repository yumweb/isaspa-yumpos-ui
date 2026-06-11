import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../routes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { 
  Col, 
  Row, 
  Card, 
  Button, 
  Container, 
  Alert
} from '@themesberg/react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();

  const handleResend = async () => {
    navigate('/forgot-password');
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
                <Alert variant="success">
                  <b>Success</b> A password reset e-mail has been sent to your e-mail. Please check your e-mail and click the link.
                </Alert>
                <Box>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    onClick={handleResend}
                  >
                    Resend Email
                  </Button>
                </Box>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  )
}
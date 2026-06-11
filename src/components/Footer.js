import moment from "moment-timezone";
import { Row, Col, Card } from "@themesberg/react-bootstrap";

export default () => {
  const currentYear = moment().get("year");

  return (
      <footer className="footer section py-5">
        <Row>
          <Col xs={12} lg={6} className="mb-4 mb-lg-0">
            <p className="mb-0 text-center text-xl-left">
              Copyright &copy; 2019-{`${currentYear} `}
              <Card.Link
                href="https://yumweb.com"
                target="_blank"
                className="text-blue text-decoration-none fw-normal"
              >
                YumWeb
              </Card.Link>
            </p>
          </Col>
        </Row>
      </footer>
  );
};

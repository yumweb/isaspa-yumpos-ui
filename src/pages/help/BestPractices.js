import React, { useEffect } from "react";
import { Card, Table, Container, Row, Col } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faFileAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "./help.scss";

// Static document list
const documents = [
  { id: "client-interaction-sop", title: "Client Interaction SOP", category: "Customer Service", description: "Standard operating procedures for client interactions" },
  { id: "customer-care-protocol", title: "Customer Care Protocol", category: "Customer Service", description: "Guidelines for customer care and support" },
  { id: "daily-checklists", title: "Daily Checklists", category: "Operations", description: "Daily operational checklists for staff" },
  { id: "discounting-guidelines", title: "Discounting Guidelines", category: "Sales", description: "Rules and procedures for applying discounts" },
  { id: "email-etiquettes", title: "Email Etiquettes", category: "Communication", description: "Best practices for email communication" },
  { id: "house-rules", title: "House Rules", category: "Operations", description: "General salon rules and policies" },
  { id: "sanitization-and-sterilization", title: "Sanitization & Sterilization", category: "Hygiene", description: "Hygiene and safety protocols" },
  { id: "tele-calling-guidelines", title: "Tele-calling Guidelines", category: "Communication", description: "Guidelines for phone outreach calls" },
  { id: "telephone-etiquettes", title: "Telephone Etiquettes", category: "Communication", description: "Best practices for phone communication" },
];

const BestPractices = () => {
  const navigate = useNavigate();

  // Disable copy, select, download, save options
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts (Ctrl+C, Ctrl+S, Ctrl+A, Ctrl+P, Ctrl+U)
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || e.key === "C" ||
         e.key === "s" || e.key === "S" ||
         e.key === "a" || e.key === "A" ||
         e.key === "p" || e.key === "P" ||
         e.key === "u" || e.key === "U")
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag
    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return (
    <Container fluid className="best-practices-page py-2">
      {/* Header */}
      <Row className="mb-2">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">
                <FontAwesomeIcon icon={faBook} className="me-2 text-primary" />
                Best Practices & SOPs
              </h5>
            </div>
          </div>
        </Col>
      </Row>

      {/* Documents Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0 documents-table">
            <thead className="bg-light">
              <tr>
                <th style={{ width: "50%" }}>Document</th>
                <th style={{ width: "35%" }}>Description</th>
                <th style={{ width: "15%" }} className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="document-row"
                  onClick={() => navigate(`/best-practices/${doc.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="doc-icon me-3">
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          className="text-primary"
                        />
                      </div>
                      <h6 className="mb-0">{doc.title}</h6>
                    </div>
                  </td>
                  <td>
                    <span className="text-muted small">{doc.description}</span>
                  </td>
                  <td className="text-center">
                    <Link
                      to={`/best-practices/${doc.id}`}
                      className="btn btn-sm btn-outline-secondary"
                      onClick={(e) => e.stopPropagation()}
                      style={{ borderColor: "#6c757d", color: "#6c757d" }}
                    >
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BestPractices;

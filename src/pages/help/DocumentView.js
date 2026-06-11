import React, { useState, useEffect, lazy, Suspense } from "react";
import { Card, Spinner, Badge } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFileAlt,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import "./help.scss";

// Static content components - lazy loaded
const contentComponents = {
  "client-interaction-sop": lazy(() => import("./content/ClientInteractionContent")),
  "customer-care-protocol": lazy(() => import("./content/CustomerCareContent")),
  "daily-checklists": lazy(() => import("./content/DailyChecklistsContent")),
  "discounting-guidelines": lazy(() => import("./content/DiscountingContent")),
  "email-etiquettes": lazy(() => import("./content/EmailEtiquettesContent")),
  "house-rules": lazy(() => import("./content/HouseRulesContent")),
  "sanitization-and-sterilization": lazy(() => import("./content/SanitizationContent")),
  "tele-calling-guidelines": lazy(() => import("./content/TeleCallingContent")),
  "telephone-etiquettes": lazy(() => import("./content/TelephoneEtiquettesContent")),
};

// Document metadata
const documentMeta = {
  "client-interaction-sop": {
    title: "Client Interaction SOP",
    category: "Customer Service",
    description: "Standard operating procedures for client interactions",
  },
  "customer-care-protocol": {
    title: "Customer Care Protocol",
    category: "Customer Service",
    description: "Guidelines for customer care and support",
  },
  "daily-checklists": {
    title: "Daily Checklists",
    category: "Operations",
    description: "Daily operational checklists for staff",
  },
  "discounting-guidelines": {
    title: "Discounting Guidelines",
    category: "Sales",
    description: "Rules and procedures for applying discounts",
  },
  "email-etiquettes": {
    title: "Email Etiquettes",
    category: "Communication",
    description: "Best practices for email communication",
  },
  "house-rules": {
    title: "House Rules",
    category: "Operations",
    description: "General salon rules and policies",
  },
  "sanitization-and-sterilization": {
    title: "Sanitization & Sterilization",
    category: "Hygiene",
    description: "Hygiene and safety protocols",
  },
  "tele-calling-guidelines": {
    title: "Tele-calling Guidelines",
    category: "Communication",
    description: "Guidelines for phone outreach calls",
  },
  "telephone-etiquettes": {
    title: "Telephone Etiquettes",
    category: "Communication",
    description: "Best practices for phone communication",
  },
};

const DocumentView = () => {
  const { docId } = useParams();
  const ContentComponent = contentComponents[docId];
  const meta = documentMeta[docId];

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

  if (!ContentComponent || !meta) {
    return (
      <div className="document-view-page p-4">
        <div className="text-center py-5">
          <p className="text-danger">Document not found</p>
          <Link to="/best-practices" className="btn btn-primary mt-3">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Best Practices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="document-view-page p-4">
      {/* Header */}
      <div className="document-header mb-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <Link
              to="/best-practices"
              className="back-link text-muted mb-2 d-inline-block"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Best Practices
            </Link>
            <h4 className="mb-1">
              <FontAwesomeIcon icon={faFileAlt} className="me-2 text-primary" />
              {meta.title}
            </h4>
            <div className="d-flex align-items-center gap-2 mt-2">
              <Badge bg="secondary">{meta.category}</Badge>
              <span className="text-muted">{meta.description}</span>
            </div>
          </div>
{/* <Link to="/ai-chat" className="btn btn-outline-primary btn-sm">
            <FontAwesomeIcon icon={faRobot} className="me-2" />
            Ask AI about this
          </Link> */}
        </div>
      </div>

      {/* Document Content */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="document-content p-4">
          <Suspense
            fallback={
              <div className="text-center py-4">
                <Spinner animation="border" size="sm" />
                <span className="ms-2">Loading content...</span>
              </div>
            }
          >
            <ContentComponent />
          </Suspense>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DocumentView;

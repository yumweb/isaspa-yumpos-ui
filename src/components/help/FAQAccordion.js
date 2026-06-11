import React, { useState } from "react";
import { Accordion, Badge, Spinner } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFileAlt,
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import clientAdapter from "../../lib/clientAdapter";

const FAQAccordion = ({ documents, categories }) => {
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [docContent, setDocContent] = useState({});
  const [loadingDoc, setLoadingDoc] = useState(null);

  const loadDocumentContent = async (docId) => {
    if (docContent[docId]) {
      // Already loaded
      setExpandedDoc(expandedDoc === docId ? null : docId);
      return;
    }

    setLoadingDoc(docId);
    try {
      const data = await clientAdapter.getHelpDocumentContent(docId);
      setDocContent((prev) => ({
        ...prev,
        [docId]: data,
      }));
      setExpandedDoc(docId);
    } catch (err) {
      console.error("Error loading document:", err);
    } finally {
      setLoadingDoc(null);
    }
  };

  const categoryColors = {
    "Customer Service": "primary",
    Operations: "info",
    Sales: "success",
    Communication: "warning",
    Hygiene: "danger",
    General: "secondary",
  };

  // Group documents by category
  const groupedDocs = {};
  Object.entries(categories).forEach(([category, docIds]) => {
    groupedDocs[category] = documents.filter((d) => docIds.includes(d.id));
  });

  if (documents.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <FontAwesomeIcon icon={faFolder} size="2x" className="mb-2" />
        <p>No FAQ documents available</p>
      </div>
    );
  }

  return (
    <div className="faq-accordion">
      {Object.entries(groupedDocs).map(([category, docs]) => (
        <div key={category} className="category-section mb-3">
          <h6 className="category-header d-flex align-items-center mb-2">
            <FontAwesomeIcon icon={faFolder} className="me-2 text-muted" />
            {category}
            <Badge
              bg={categoryColors[category] || "secondary"}
              className="ms-2"
            >
              {docs.length}
            </Badge>
          </h6>

          <Accordion className="faq-docs">
            {docs.map((doc) => (
              <Accordion.Item
                key={doc.id}
                eventKey={doc.id}
                className="border-0 mb-1"
              >
                <Accordion.Header
                  onClick={() => loadDocumentContent(doc.id)}
                  className="py-2"
                >
                  <div className="d-flex align-items-center w-100">
                    <FontAwesomeIcon
                      icon={expandedDoc === doc.id ? faChevronDown : faChevronRight}
                      className="me-2 text-muted"
                      size="sm"
                    />
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className="me-2 text-primary"
                    />
                    <div className="flex-grow-1">
                      <div className="doc-title">{doc.title}</div>
                      <small className="text-muted">{doc.description}</small>
                    </div>
                    {loadingDoc === doc.id && (
                      <Spinner animation="border" size="sm" />
                    )}
                  </div>
                </Accordion.Header>

                <Accordion.Body className="bg-light">
                  {docContent[doc.id] ? (
                    <div className="doc-content">
                      {docContent[doc.id].sections.map((section, idx) => (
                        <div key={section.id} className="section-item mb-3">
                          <h6 className="section-title border-bottom pb-1">
                            {section.title}
                          </h6>
                          <div
                            className="section-content"
                            style={{
                              whiteSpace: "pre-wrap",
                              fontSize: "0.9rem",
                            }}
                          >
                            {section.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading content...
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;

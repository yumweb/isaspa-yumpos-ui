import React, { useState, useEffect } from "react";
import { Tab, Tabs, Spinner, Alert } from "@themesberg/react-bootstrap";
import { Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faRobot, faSearch } from "@fortawesome/free-solid-svg-icons";
import FAQAccordion from "./FAQAccordion";
import ChatInterface from "./ChatInterface";
import clientAdapter from "../../lib/clientAdapter";

const HelpDrawer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("faq");
  const [faqData, setFaqData] = useState({ documents: [], categories: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiStatus, setAiStatus] = useState({ available: false, model: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadFAQs();
      checkAIStatus();
    }
  }, [isOpen]);

  const loadFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clientAdapter.getHelpFAQs();
      setFaqData(data);
    } catch (err) {
      console.error("Error loading FAQs:", err);
      setError("Failed to load FAQ content");
    } finally {
      setLoading(false);
    }
  };

  const checkAIStatus = async () => {
    try {
      const status = await clientAdapter.getHelpAIStatus();
      setAiStatus(status);
    } catch (err) {
      setAiStatus({ available: false, model: "" });
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await clientAdapter.searchHelpDocuments(query);
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      className="help-drawer"
      style={{ width: "400px" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <FontAwesomeIcon icon={faBook} className="me-2" />
          Help & FAQ
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="p-0">
        {/* Search Bar */}
        <div className="help-search-container p-3 border-bottom">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <FontAwesomeIcon icon={faSearch} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search SOPs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="search-results p-3 bg-light border-bottom">
            <h6 className="mb-2">Search Results</h6>
            {searchResults.slice(0, 5).map((result) => (
              <div
                key={result.id}
                className="search-result-item p-2 mb-1 bg-white rounded cursor-pointer"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                  setActiveTab("faq");
                }}
              >
                <small className="text-muted">{result.documentName}</small>
                <div className="fw-bold">{result.title}</div>
                <p className="small text-muted mb-0">
                  {result.content.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="help-tabs px-3 pt-2"
        >
          <Tab
            eventKey="faq"
            title={
              <>
                <FontAwesomeIcon icon={faBook} className="me-2" />
                FAQs
              </>
            }
          >
            <div className="tab-content-wrapper p-3">
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading FAQs...
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <FAQAccordion
                  documents={faqData.documents}
                  categories={faqData.categories}
                />
              )}
            </div>
          </Tab>

          <Tab
            eventKey="chat"
            title={
              <>
                <FontAwesomeIcon icon={faRobot} className="me-2" />
                Ask AI
                {!aiStatus.available && (
                  <span className="badge bg-secondary ms-1">Offline</span>
                )}
              </>
            }
          >
            <div className="tab-content-wrapper">
              <ChatInterface aiStatus={aiStatus} />
            </div>
          </Tab>
        </Tabs>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default HelpDrawer;

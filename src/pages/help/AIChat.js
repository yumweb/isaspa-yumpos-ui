import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Spinner, Container, Row, Col } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faRobot,
  faUser,
  faLightbulb,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import clientAdapter from "../../lib/clientAdapter";
import "./help.scss";

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState({ available: false, model: "" });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkAIStatus();
    inputRef.current?.focus();
  }, []);

  const checkAIStatus = async () => {
    try {
      const status = await clientAdapter.getHelpAIStatus();
      setAiStatus(status);
    } catch (err) {
      setAiStatus({ available: false, model: "" });
    }
  };

  const handleSend = async () => {
    const query = inputValue.trim();
    if (!query || isLoading) return;

    setMessages((prev) => [...prev, { type: "user", content: query }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await clientAdapter.chatWithHelpAI(query);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: response.answer,
          sources: response.sources,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What are the discounting guidelines?",
    "How do I handle customer complaints?",
    "What are the daily opening checklists?",
    "What are the sanitization protocols?",
    "How should I handle phone calls?",
    "What are the email etiquette rules?",
  ];

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  return (
    <Container fluid className="ai-chat-page py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-1">
                <FontAwesomeIcon icon={faRobot} className="me-2 text-primary" />
                SOP Assistant
              </h4>
              <p className="text-muted mb-0">
                Ask questions about Isa Spa Standard Operating Procedures
              </p>
            </div>
            <Link to="/best-practices" className="btn btn-outline-primary btn-sm">
              <FontAwesomeIcon icon={faBook} className="me-2" />
              View Best Practices
            </Link>
          </div>

          {/* Chat Container */}
          <Card className="chat-container border-0 shadow-sm">
            <Card.Body className="p-0 d-flex flex-column" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
              {/* Messages Area */}
              <div className="chat-messages flex-grow-1 overflow-auto p-4">
                {messages.length === 0 ? (
                  <div className="empty-state text-center py-5">
                    <div className="robot-icon mb-4">
                      <FontAwesomeIcon icon={faRobot} size="3x" className="text-primary opacity-50" />
                    </div>
                    <h5 className="text-muted mb-3">How can I help you today?</h5>
                    <p className="text-muted mb-4">
                      I can answer questions about Isa Spa SOPs, best practices, and operational guidelines.
                    </p>

                    {/* Suggested Questions */}
                    <div className="suggested-questions">
                      <p className="small text-muted mb-3">
                        <FontAwesomeIcon icon={faLightbulb} className="me-2" />
                        Try asking:
                      </p>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        {suggestedQuestions.map((q, i) => (
                          <Button
                            key={i}
                            variant="outline-secondary"
                            size="sm"
                            className="rounded-pill"
                            onClick={() => handleSuggestedQuestion(q)}
                          >
                            {q}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`message-wrapper mb-4 ${msg.type === "user" ? "user" : "assistant"}`}
                      >
                        <div className={`message ${msg.type}`}>
                          <div className="message-avatar">
                            <FontAwesomeIcon
                              icon={msg.type === "user" ? faUser : faRobot}
                            />
                          </div>
                          <div className="message-content">
                            <div className="message-text" style={{ whiteSpace: "pre-wrap" }}>
                              {msg.content}
                            </div>
                            {msg.sources && msg.sources.length > 0 && (
                              <div className="message-sources mt-2">
                                <small className="text-muted">
                                  Sources: {msg.sources.map(s => s.replace(/-/g, ' ')).join(', ')}
                                </small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="message-wrapper assistant">
                        <div className="message ai">
                          <div className="message-avatar">
                            <FontAwesomeIcon icon={faRobot} />
                          </div>
                          <div className="message-content">
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="chat-input-area border-top p-3">
                {!aiStatus.available && (
                  <div className="ai-status-warning text-center mb-2">
                    <small className="text-warning">
                      AI is currently offline. Responses will be based on keyword search.
                    </small>
                  </div>
                )}
                <div className="input-wrapper">
                  <textarea
                    ref={inputRef}
                    className="form-control"
                    placeholder="Ask a question about SOPs..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                    disabled={isLoading}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className="send-button"
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <FontAwesomeIcon icon={faPaperPlane} />
                    )}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AIChat;

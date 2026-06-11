import React, { useState, useRef, useEffect } from "react";
import { Button, Spinner, Alert, Badge } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faRobot,
  faUser,
  faInfoCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import clientAdapter from "../../lib/clientAdapter";

const ChatInterface = ({ aiStatus }) => {
  const [messages, setMessages] = useState([
    {
      type: "system",
      content:
        "Welcome! Ask me anything about Isa Spa SOPs and best practices. I'll search our documentation and provide relevant answers.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const query = inputValue.trim();
    if (!query) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: query }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await clientAdapter.chatWithHelpAI(query);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: response.answer,
          sources: response.sources,
          context: response.context,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
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
  ];

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <div className="chat-interface d-flex flex-column" style={{ height: "calc(100vh - 200px)" }}>
      {/* AI Status Banner */}
      {!aiStatus.available && (
        <Alert variant="warning" className="mb-0 rounded-0 py-2">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          <small>
            AI is offline. Responses will be based on keyword search only.
          </small>
        </Alert>
      )}

      {/* Messages Area */}
      <div className="chat-messages flex-grow-1 overflow-auto p-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-wrapper mb-3 ${
              msg.type === "user" ? "text-end" : ""
            }`}
          >
            {msg.type === "system" && (
              <div className="message system-message bg-light rounded p-3">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-info me-2"
                />
                {msg.content}
              </div>
            )}

            {msg.type === "user" && (
              <div className="message user-message d-inline-block bg-primary text-white rounded p-3">
                <FontAwesomeIcon icon={faUser} className="me-2" />
                {msg.content}
              </div>
            )}

            {msg.type === "ai" && (
              <div className="message ai-message bg-white border rounded p-3">
                <div className="d-flex align-items-center mb-2">
                  <FontAwesomeIcon
                    icon={faRobot}
                    className="text-success me-2"
                  />
                  <span className="fw-bold">AI Assistant</span>
                </div>
                <div
                  className="message-content"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="sources mt-2 pt-2 border-top">
                    <small className="text-muted">Sources: </small>
                    {msg.sources.map((source, i) => (
                      <Badge key={i} bg="secondary" className="me-1">
                        {source.replace(/-/g, " ")}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {msg.type === "error" && (
              <div className="message error-message bg-danger text-white rounded p-3">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="me-2"
                />
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message-wrapper mb-3">
            <div className="message ai-message bg-white border rounded p-3">
              <Spinner animation="border" size="sm" className="me-2" />
              <span className="text-muted">Searching SOPs and generating answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (show only if no messages yet) */}
      {messages.length === 1 && (
        <div className="suggested-questions px-3 pb-2">
          <small className="text-muted d-block mb-2">Try asking:</small>
          <div className="d-flex flex-wrap gap-1">
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
      )}

      {/* Input Area */}
      <div className="chat-input-area p-3 border-top bg-white">
        <div className="input-group">
          <textarea
            className="form-control"
            placeholder="Ask a question about SOPs..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            style={{ resize: "none" }}
            disabled={isLoading}
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

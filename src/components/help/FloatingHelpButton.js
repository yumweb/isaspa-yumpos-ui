import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import "./help.scss";

const FloatingHelpButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ai-chat");
  };

  return (
    <button
      className="floating-help-button"
      onClick={handleClick}
      title="Ask AI Assistant"
    >
      <FontAwesomeIcon icon={faRobot} size="lg" />
    </button>
  );
};

export default FloatingHelpButton;

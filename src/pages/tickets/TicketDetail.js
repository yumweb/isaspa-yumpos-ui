import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  ListGroup,
  Badge,
} from "react-bootstrap";
import clientAdapter from "../../lib/clientAdapter";
import { useLocation } from "react-router-dom";

const TicketDetails = () => {
  const location = useLocation();
  const [ticketDetails, setTicketDetails] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [replyComment, setReplyComment] = useState(""); // State for reply input
  const [replyingTo, setReplyingTo] = useState(null); // Tracks which comment is being replied to

  const menuItems = {
    35: "Male Unisex Stylist",
    36: "Male Hairstylist",
    37: "Female Beautician",
    38: "Female Beauty & Makeup",
    39: "Spa + Beauty (F)",
    40: "Spa + Beauty (M)",
    41: "Male Hair & Beauty",
    42: "Spa Therapist for Men",
    43: "Spa Therapist for Women",
    44: "Academy Fresher Beauty",
    46: "Academy Fresher Spa",
  };

  const fetchTicketDetails = async () => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const id = queryParams.get("id");
      const res = await clientAdapter.getTicketsbyId(id);
      setTicketDetails(res);
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, []);

  const handleRefresh = () => {
    fetchTicketDetails();
  };

  const handleNewComment = async () => {
    try {
      const res = await clientAdapter.addComment(ticketDetails.id, {
        comment: newComment,
      });
      setTicketDetails(null);
      setNewComment("");
      fetchTicketDetails();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    try {
      const res = await clientAdapter.addReply(ticketDetails.id, commentId, {
        reply: replyComment,
      });
      setReplyComment("");
      setReplyingTo(null);
      fetchTicketDetails(); // Refresh data after reply submission
    } catch (error) {
      console.error("Failed to submit reply:", error);
    }
  };

  // Organize feedback into comments and replies
  const organizeFeedbacks = (feedbacks) => {
    const comments = feedbacks.filter((fb) => fb.replyTo === null);
    const replies = feedbacks.filter((fb) => fb.replyTo !== null);
    return comments.map((comment) => ({
      ...comment,
      replies: replies.filter((reply) => reply.replyTo === comment.id),
    }));
  };

  // If no details are fetched yet, show a loading message
  if (!ticketDetails) {
    return <p>Loading ticket details...</p>;
  }

  const organizedFeedbacks = organizeFeedbacks(ticketDetails.ticketFeedbacks);

  return (
    <div className="container-fluid mt-4">
      <Row className="mb-3">
        <Col>
          <h3 className="fw-bold">Ticket Details</h3>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleRefresh}>
            Refresh Data
          </Button>
        </Col>
      </Row>

      <Card className="w-100 p-3 mb-4 shadow-lg rounded-3 border-0">
        <Card.Header className="bg-primary text-white fw-bold">
          {ticketDetails.subject}
        </Card.Header>

        <Card.Body>
          <h5 className="text-secondary border-bottom pb-2">
            General Information
          </h5>
          <Row className="mb-4">
            <Col md={6}>
              <p>
                <strong>Location Name</strong> {ticketDetails.location.name}
              </p>
              <p>
                <strong>ID:</strong> {ticketDetails.id}
              </p>
              <p>
                <strong>Ticket Type:</strong>{" "}
                {ticketDetails.ticketType === 1 ? "Staffing" : "Training"}
              </p>
              <p>
                <strong>Ticket Time:</strong>{" "}
                {new Date(ticketDetails.ticketTime).toLocaleString()}
              </p>
              <p>
                <strong>Location ID:</strong> {ticketDetails.locationId}
              </p>
              <p>
                <strong>Is Closed:</strong>{" "}
                <Badge bg={ticketDetails.isClosed ? "danger" : "success"}>
                  {ticketDetails.isClosed ? "Yes" : "No"}
                </Badge>
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Message:</strong> {ticketDetails.message}
              </p>
              <p>
                <strong>Subject:</strong> {ticketDetails.subject}
              </p>
              <p>
                <strong>Salary Range:</strong> {ticketDetails.salaryRange}
              </p>
              <p>
                <strong>Owner Name:</strong> {ticketDetails.location.ownerName}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {ticketDetails.location.ownerContact}
              </p>
              <p>
                <strong>Owner Email:</strong>{" "}
                {ticketDetails.location.ownerEmail}
              </p>
            </Col>
          </Row>

          <h5 className="text-secondary border-bottom pb-2">Staff Details</h5>
          <Row className="mb-4">
            <Col md={6}>
              <p>
                <strong>Staff Type:</strong>{" "}
                {menuItems[ticketDetails.staffType]}
              </p>
              <p>
                <strong>Staff Level:</strong> {ticketDetails.staffLevel}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Staff Gender:</strong> {ticketDetails.staffGender}
              </p>
              <p>
                <strong>Service Offered:</strong>{" "}
                {ticketDetails.staffOfferService}
              </p>
              <p>
                <strong>Accommodation:</strong>{" "}
                {ticketDetails.staffAccommodation}
              </p>
            </Col>
          </Row>

          <h5 className="text-secondary border-bottom pb-2">
            Ticket Scheduling
          </h5>
          <Row className="mb-4">
            <Col md={6}>
              <p>
                <strong>Target Date:</strong>{" "}
                {new Date(ticketDetails.ticketsTargetDate).toLocaleString()}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Grace Period:</strong>{" "}
                {ticketDetails.ticketsGracePeriod} days
              </p>
            </Col>
          </Row>

          <h5 className="text-secondary border-bottom pb-2">
            Comments and Feedbacks
          </h5>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="primary"
              className="mt-2"
              onClick={handleNewComment}
              disabled={!newComment.trim()}
            >
              Add Comment
            </Button>
          </Form.Group>

          <ListGroup>
            {organizedFeedbacks.map((comment) => (
              <ListGroup.Item
                key={comment.id}
                className="mb-2 p-3 rounded border-start border-4 border-primary"
              >
                <p className="mb-1 fw-bold text-dark">
                  <i className="bi bi-chat-left-text me-2"></i>
                  {comment.employee.person.firstName}{" "}
                  {comment.employee.person.lastName}:
                </p>
                <p className="ps-3">{comment.ticketFeedback}</p>
                <small className="text-muted ps-3">
                  {new Date(comment.feedbackTime).toLocaleString()}
                </small>

                {/* Reply button and form */}
                <Button
                  variant="link"
                  className="p-0 ms-3 text-dark"
                  onClick={() => setReplyingTo(comment.id)}
                >
                  Reply
                </Button>

                {/* Show reply input if replying to this comment */}
                {replyingTo === comment.id && (
                  <Form.Group className="mt-2">
                    <Form.Control
                      type="text"
                      placeholder="Write a reply..."
                      value={replyComment}
                      onChange={(e) => setReplyComment(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      className="mt-2"
                      onClick={() => handleReplySubmit(comment.id)}
                      disabled={!replyComment.trim()}
                    >
                      Submit Reply
                    </Button>
                  </Form.Group>
                )}

                {/* Display replies */}
                {comment.replies.map((reply) => (
                  <ListGroup.Item
                    key={reply.id}
                    className="mt-2 ms-4 p-2 rounded border-start border-info"
                  >
                    <p className="fw-bold text-secondary">
                      <i className="bi bi-reply me-2"></i>
                      {reply.employee.person.firstName}{" "}
                      {reply.employee.person.lastName}:
                    </p>
                    <p className="ps-3">{reply.ticketFeedback}</p>
                    <small className="text-muted ps-3">
                      {new Date(reply.feedbackTime).toLocaleString()}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TicketDetails;

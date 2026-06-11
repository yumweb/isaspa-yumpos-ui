import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DatatableWrapper,
  TableHeader,
  TableBody,
  Pagination,
  PaginationOptions,
} from "react-bs-datatable";
import {
  Row,
  Col,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Table,
} from "react-bootstrap";
import clientAdapter from "../../lib/clientAdapter";
import moment from "moment-timezone";
import ViewExitStaffTickets from "../ViewExitStaffTickets";
import { FormGroup } from "@mui/material";

const Tickets = () => {
  const locationInfo = JSON.parse(localStorage.getItem("yumpos_location"));
  const navigate = useNavigate();

  // State Variables
  const [sortState, setSortState] = useState({});
  const [otpShow, setOtpShow] = useState(false);
  const [otp, setOtp] = useState(true);
  const [ticketId, setTicketId] = useState(null);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const [displayClosed, setDisplayClosed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("displayClosed");
      return saved === "true"; // Convert string to boolean
    }
    return false; // Default value
  });

  const [ticketType, setTicketType] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ticketType");
      if (saved) {
        return saved;
      } else {
        return "staffing";
      }
    }
  });

  const [currentView, setCurrentView] = useState("tickets");

  // Table Header
  const header = [
    { title: "Location Name", prop: "locationName" },
    { title: "Ticket Number", prop: "id" },
    { title: "Ticket Date", prop: "ticketTime" },
    { title: "Ticket Type", prop: "ticketType" },
    { title: "Actions", prop: "actions" },
  ];

  useEffect(() => {
    localStorage.setItem("displayClosed", displayClosed);
  }, [displayClosed]);

  useEffect(() => {
    localStorage.setItem("ticketType", ticketType);
  }, [ticketType]);

  // Fetch Tickets
  const getTickets = async (page, limit) => {
    const type = ticketType === "staffing" ? 1 : 2;
    const res = await clientAdapter.getTicketsbyLocation(
      page,
      limit,
      displayClosed,
      locationInfo.locationId === 1,
      type
    );

    res.tickets.forEach((t) => {
      t.locationName = t.location.name;
      t.ticketTime = moment(t.ticketTime).format("D-MMM-YY hh:mm A");
      t.ticketType = t.ticketType === 1 ? "Staffing" : "Training";
      t.actions = renderActions(t);
    });

    setFilteredDataLength(rowsPerPage);
    setData(res.tickets);
    setCount(res.count);
    setMaxPage(Math.ceil(res.count / rowsPerPage));
  };

  // Render Actions for Each Ticket
  const renderActions = (ticket) => (
    <>
      <button
        onClick={() => navigate(`/ticketDetails?id=${ticket.id}`)}
        className="btn btn-primary"
      >
        View
      </button>
      <button
        className="btn btn-danger"
        onClick={() => initiateCloseTicket(ticket.id)}
      >
        Close
      </button>
      <span className="p-1 bg-gray text-white rounded">
        {ticket.ticketFeedbacks.length > 0
          ? ticket.ticketFeedbacks.length
          : "New"}
      </span>
    </>
  );

  // Initiate Ticket Closing
  const initiateCloseTicket = async (ticketId) => {
    setOtpShow(true);
    await clientAdapter.sendOtp();
    setTicketId(ticketId);
  };

  // Handle OTP Submission
  const handleOtp = async () => {
    const res = await clientAdapter.verifyOtp({ otp });

    if (res?.valid) {
      try {
        await clientAdapter.closeTicket(ticketId);
        setOtpShow(false);
        getTickets(currentPage, rowsPerPage);
      } catch {
        alert("Error while closing ticket");
      }
    } else {
      alert("Invalid Otp");
    }
  };

  // Pagination and Sorting Handlers
  const onSortChange = useCallback((nextProp) => setSortState(nextProp), []);
  const onPaginationChange = useCallback(
    (nextPage) => setCurrentPage(nextPage),
    []
  );
  const onRowsPerPageChange = useCallback((rowsPerPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(1);
  }, []);

  // Load Tickets on Initial Render and State Changes
  useEffect(() => {
    getTickets(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, displayClosed, ticketType]);

  // Close Modal
  const handleClose = () => setOtpShow(false);

  // Handle View Change
  const handleViewExitStaff = () => setCurrentView("exitStaffTickets");

  // New Ticket Handler
  const onClickCreateNewticket = () => {
    navigate("/ticket-generator");
  };

  const changeType = () => {
    if (ticketType === "staffing") {
      setTicketType("training");
    } else {
      setTicketType("staffing");
    }
  };

  return (
    <>
      {/* OTP Modal */}
      <Modal show={otpShow} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <InputGroup>
              <InputGroup.Text>OTP</InputGroup.Text>
              <FormControl
                type="text"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </InputGroup>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOtp}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tickets View */}
      {currentView === "tickets" && (
        <>
          <Row className="align-items-center mt-3 mb-3">
            <Col>
              <h6 className="mb-0">
                {ticketType === "staffing" ? "Staffing" : "Training"} Tickets
                {displayClosed ? " (Closed)" : ""}
              </h6>
            </Col>
            <Col xs="auto" className="d-flex gap-2 flex-wrap">
              <Button variant="primary" size="sm" onClick={onClickCreateNewticket}>
                + New Ticket
              </Button>
              <Button variant="dark" size="sm" onClick={changeType}>
                {ticketType === "staffing" ? "Show Training" : "Show Staffing"}
              </Button>
              <Button variant="dark" size="sm" onClick={handleViewExitStaff}>
                Exit Staff Tickets
              </Button>
              <Button variant="dark" size="sm" onClick={() => setDisplayClosed(!displayClosed)}>
                {displayClosed ? "Show Open" : "Show Closed"}
              </Button>
            </Col>
          </Row>

          <hr />

          {/* DataTable */}
          <DatatableWrapper body={data} headers={header} isControlled>
            <Table hover responsive striped>
              <TableHeader
                controlledProps={{
                  sortState,
                  onSortChange,
                  filteredDataLength,
                }}
              />
              <TableBody />
            </Table>

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-2">
              <PaginationOptions
                controlledProps={{
                  filteredDataLength,
                  onRowsPerPageChange,
                  rowsPerPageOptions: [5, 10, 15, 20],
                  rowsPerPage,
                }}
              />
              <Pagination
                controlledProps={{ currentPage, maxPage, onPaginationChange }}
              />
            </div>
          </DatatableWrapper>
        </>
      )}

      {/* Exit Staff Tickets View */}
      {currentView === "exitStaffTickets" && <ViewExitStaffTickets />}
    </>
  );
};

export default Tickets;

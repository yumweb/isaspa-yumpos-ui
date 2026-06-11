import { 
  Row, 
  Col, 
  Table, 
  Button 
} from "react-bootstrap";
import { 
  TableHeader, 
  TableBody, 
  Pagination,
  DatatableWrapper, 
  PaginationOptions,  
} from "react-bs-datatable";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import clientAdapter from "../lib/clientAdapter";
import { useState, useEffect, useCallback } from "react";
import Tickets from "./tickets/Tickets";

const ViewExitStaffTickets = () => {

  const header = [
    { title: "Location Name", prop: "locationName" },
    { title: "Ticket Number", prop: "id" },
    { title: "Ticket Date", prop: "ticketTime" },
    { title: "Ticket Type", prop: "ticketType" },
    { title: "Candidate Name", prop: "candidateName" },
  ];

  const navigate = useNavigate();
  const [sortState, setSortState] = useState({});
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const locationInfo = JSON.parse(localStorage.getItem("yumpos_location"));

  const getExitStaffTickets = async (page, limit) => {
    const res = await clientAdapter.getStaffExitTicket(page, limit);
    res.tickets.map((e) => {
      e.locationName = locationInfo.name
      e.ticketTime = moment(e.ticketTime).format("D-MMM-YY hh:mm A");
      e.ticketType = e.ticketType
      e.candidateName = e.candidateName
    })
    setData(res.tickets);
    setCount(res.count);
    setFilteredDataLength(rowsPerPage);
    setMaxPage(Math.ceil(res.count / rowsPerPage));
  };

  const onSortChange = useCallback((nextProp) => {
    setSortState(nextProp);
  }, []);

  const onPaginationChange = useCallback((nextPage) => {
    setCurrentPage(nextPage);
  }, []);

  const onRowsPerPageChange = useCallback((rowsPerPage) => {
    setRowsPerPage(rowsPerPage);
  }, []);

  useEffect(() => {
    getExitStaffTickets(currentPage, rowsPerPage)
  }, [currentPage, rowsPerPage]);

  const handleNewTicket = () => {
    navigate(`/ticket-generator`);
  };

  const handleViewTickets = () => {
    setCurrentIndex(1);
  };

  return (
    <>
      {currentIndex === 0 && (
        <>
          <hr />
          <Row className="d-flex flex-wrap flex-md-nowrap align-items-center"> 
            <div className="col-2">
              <Button 
                className="new-ticket"
                onClick={handleNewTicket}
              >
                New Ticket
              </Button>
            </div>
            <div className="col-2">
              <Button 
                className="staff-ticket"
                onClick={handleViewTickets}
              >
                View Tickets
              </Button>
            </div>
          </Row>
          <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
            <Col className="d-block mb-4 mb-md-0 col-6">
              <div className="">
                <h6 className="h6">List of Exit Staff Tickets </h6>
              </div>
            </Col>
          </Row>
          <hr />
          <DatatableWrapper body={data} headers={header} isControlled>
            <Table
              className="data-tables shadow-lg"
              hover="true"
              responsive="true"
              width="auto"
              striped="true"
              style={{
                cursor: "pointer",
                borderBottom: "1px solid lightGray",
                borderRadius: "10px",
                marginTop: "15px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            >
              <TableHeader
                controlledProps={{
                  sortState,
                  onSortChange,
                  filteredDataLength,
                }}
              />
              <TableBody />
            </Table>
            <Row>
              <Col
                xs={12}
                sm={6}
                lg={4}
                className="d-flex flex-col justify-content-lg-start align-items-center justify-content-sm-end mb-2 mb-sm-0"
              >
                <PaginationOptions
                  controlledProps={{
                    filteredDataLength,
                    onRowsPerPageChange,
                    rowsPerPageOptions: [5, 10, 15, 20],
                    rowsPerPage,
                  }}
                />
              </Col>
              <Col
                xs={12}
                sm={6}
                lg={4}
                className="d-flex flex-col justify-content-end align-items-end"
              >
                <Pagination
                  controlledProps={{ currentPage, maxPage, onPaginationChange }}
                />
              </Col>
            </Row>
          </DatatableWrapper>
        </>
      )}
      {currentIndex === 1 && (
        <>
          <Tickets />
        </>
      )}
    </>
  )
}

export default ViewExitStaffTickets;

import {
  TableHeader,
  TableBody,
  PaginationOptions,
  Pagination,
  DatatableWrapper,
  Filter,
} from "react-bs-datatable";
import { AppRoutes } from "../../routes";
import { useNavigate } from "react-router-dom";
import { Row, Col, Table } from "react-bootstrap";
import clientAdapter from "../../lib/clientAdapter";
import { useState, useCallback, useEffect } from "react";
import { Box, Button, Input, Tooltip } from "@mui/material";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Promotions = () => {
  const navigate = useNavigate();
  const [sortState, setSortState] = useState({});
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const header = [
    { title: "Promotion Id", prop: "status" },
    { title: "Message", prop: "content" },
    { title: "Sender Id", prop: "sender" },
    { title: "Recipients Count", prop: "total" },
    { title: "Send At", prop: "datetime" },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.

  const getSms = async (page, limit, startDate, endDate) => {
    const smsStartDate = new Date(startDate);
    const smsEndDate = new Date(endDate);
    const startSms = Math.floor(smsStartDate.getTime() / 1000);
    const endSms = Math.floor(smsEndDate.getTime() / 1000);
    try {
      const SmsRes = await clientAdapter.getSmsReport(
        page,
        limit,
        startSms,
        endSms
      );
      if (SmsRes.statusCode) {
        throw SmsRes;
      } else {
        setFilteredDataLength(SmsRes);
        setData(SmsRes.messages);
        setMaxPage(Math.round(SmsRes.count / rowsPerPage));
        setCurrentPage(currentPage);
      }
    } catch (error) {
      setFilteredDataLength(0);
      setData([]);
      setMaxPage(0);
      setCurrentPage(1);
    }
  };

  const onSortChange = useCallback((nextProp) => {
    setSortState(nextProp);
  }, []);

  const onPaginationChange = useCallback((nextPage) => {
    setCurrentPage(nextPage);
  }, []);

  const onRowsPerPageChange = useCallback((rowsPerPage) => {
    setRowsPerPage(rowsPerPage);
    setCurrentPage(1);
  }, []);

  const onClickCreatePromotion = () => {
    navigate(AppRoutes.PromotionsView.path);
  };

  const onFilter = () => {
    setFilter(filter);
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const searchPromotions = () => {
    getSms(currentPage, rowsPerPage, startDate, endDate, sortState);
  };

  useEffect(() => {
    getSms(currentPage, rowsPerPage, startDate, endDate, sortState);
  }, [currentPage, rowsPerPage, sortState]);

  return (
    <>
      <hr />
      <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
        <Col className="d-block mb-4 mb-md-0 col-6">
          <div className="">
            <h6 className="h6" style={{ fontFamily: "Russo One, sans-serif" }}>
              List of Promotions{" "}
            </h6>
          </div>
        </Col>
        <Col className="d-flex flex-column justify-content-end align-items-end leadpage-Btn">
          <Button
            style={{
              float: "right",
              backgroundColor: "black",
              color: "white",
              borderRadius: "5px",
              fontWeight: "400",
              marginBottom: "5px",
              textTransform: "capitalize",
            }}
            onClick={onClickCreatePromotion}
          >
            Create New Promotion
          </Button>
        </Col>
      </Row>
      {data?.length >= 0 && (
        <DatatableWrapper body={data} headers={header}>
          <section className="m-0 mt-2">
            <div className="d-flex justify-content-between w-75 m-0">
              <Filter
                controlledProps={{
                  filter: "searchbar",
                  onFilter,
                }}
              />
              <Box display="flex" alignItems="center" gap={10} ml={1}>
                <Tooltip title="Select Start Date" placement="top" arrow>
                  <Input
                    type="date"
                    pattern="one"
                    style={{
                      border: "1px solid lightGray",
                      borderRadius: "4px",
                    }}
                    value={startDate}
                    disableUnderline={true}
                    onChange={(e) => handleStartDate(e)}
                  />
                </Tooltip>
                <Tooltip title="Select End Date" placement="top" arrow>
                  <Input
                    type="date"
                    pattern="one"
                    style={{
                      border: "1px solid lightGray",
                      borderRadius: "4px",
                    }}
                    value={endDate}
                    disableUnderline={true}
                    onChange={(e) => handleEndDate(e)}
                  />
                </Tooltip>
                <Button
                  className="search-leads"
                  style={{ border: "1px solid lightGray" }}
                  onClick={searchPromotions}
                >
                  <FontAwesomeIcon icon={faSearch} style={{ color: "black" }} />
                </Button>
              </Box>
            </div>
          </section>
          <Tooltip
            arrow="true"
            title="Scroll left to see more"
            placement="top-start"
          >
            <Table
              className="data-tables shadow-lg"
              hover="true"
              responsive="true"
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
          </Tooltip>
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
                controlledProps={{
                  currentPage,
                  maxPage,
                  onPaginationChange,
                }}
              />
            </Col>
          </Row>
        </DatatableWrapper>
      )}
    </>
  );
};

export default Promotions;

import { useState } from "react";
import { DatatableWrapper } from "react-bs-datatable";
import { Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { TableHeader } from "react-bs-datatable";
import { TableBody } from "react-bs-datatable";
import { PaginationOptions } from "react-bs-datatable";
import { useCallback } from "react";
import { Pagination } from "react-bs-datatable";
import clientAdapter from "../../lib/clientAdapter";
import { useEffect } from "react";

const Reviews = () => {
  const [sortState, setSortState] = useState({});
  const [Count, setCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);

  const header = [
    { title: "Salon Location", prop: "locationId" },
    { title: "Review Date", prop: "createdDate" },
    { title: "Customer Feedback", prop: "review" },
    { title: "Customer Mobile Number", prop: "phone" },
    { title: "Customer Name", prop: "customerName" },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.

  const getReviews = async (page, limit) => {
    const ReviewRes = await clientAdapter.getLocationReviews(page, limit);
    ReviewRes.reviews.map((r) => {});
    setFilteredDataLength(rowsPerPage);
    setData(ReviewRes.reviews);
    setCount(ReviewRes.count);
    setMaxPage(Math.round(ReviewRes.count / rowsPerPage));
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

  useEffect(() => {
    getReviews(currentPage, rowsPerPage, sortState);
  }, [sortState, currentPage, rowsPerPage]);

  return (
    <>
      <hr />
      <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
        <Col className="d-block mb-4 mb-md-0 col-6">
          <div className="">
            <h6 className="h6">
              List of Reviews{" "}
              <span
                style={{
                  backgroundColor: "lightgray",
                  color: "black",
                  border: " 1px solid gray",
                  padding: "5px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  borderRadius: "50%",
                  marginLeft: "10px",
                }}
              >
                {Count}
              </span>
            </h6>
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
  );
};
export default Reviews;

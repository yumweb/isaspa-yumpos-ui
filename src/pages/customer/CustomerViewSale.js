import {
  TableHeader,
  TableBody,
  PaginationOptions,
  Pagination,
  DatatableWrapper,
  Filter,
} from "react-bs-datatable";
import { useNavigate } from "react-router-dom";
import clientAdapter from "../../lib/clientAdapter";
import { Row, Col, Table } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Input, Tooltip, Button } from "@mui/material";
import moment from "moment-timezone";

const CustomerViewSale = ({ personId }) => {
  const header = [
    { title: "Sale Date", prop: "saleDate" },
    { title: "Mode of Payment", prop: "paymentTypeString" },
    { title: "Amount Paid", prop: "paymentType" },
    { title: "Receipt", prop: "receipt" },
  ];

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState();
  const [maxPage, setMaxPage] = useState(1);
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [sortState, setSortState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredDataLength, setFilteredDataLength] = useState(0);

  const getCustomerViewSale = async (
    page,
    limit,
    startDate,
    endDate,
    custId
  ) => {
    const viewSale = await clientAdapter.getCustomerViewSalesById(
      page,
      limit,
      custId,
      startDate,
      endDate
    );
    if (viewSale) {
      viewSale.sales.map((s) => {
        s.saleDate = moment(s.saleTime).format("DD-MM-YYYY hh:mm A");
        s.paymentTypeString = s.paymentTypeString;
        s.paymentType = s.paymentType;
        s.receipt = (
          <a
            style={{
              padding: "5px",
              color: "white",
              borderRadius: "3px",
              backgroundColor: "black",
            }}
            onClick={() => viewSaleReceipt(s.id)}
          >
            View Receipt
          </a>
        );
      });
      setFilteredDataLength(rowsPerPage);
      setData(viewSale.sales);
      setMaxPage(Math.round(viewSale.count / rowsPerPage));
      setCurrentPage(currentPage);
    }
  };

  const viewSaleReceipt = async (saleId) => {
    navigate(`/sales/receipt?saleId=${saleId}`);
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDate = (e) => {
    setEndDate(e.target.value);
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

  const onFilter = () => {
    setFilter(filter);
  };

  const customerSalesView = () => {
    getCustomerViewSale(currentPage, rowsPerPage, startDate, endDate, personId);
  };

  useEffect(() => {
    getCustomerViewSale(currentPage, rowsPerPage, startDate, endDate, personId);
  }, [currentPage, rowsPerPage, sortState, personId]);

  return (
    <>
      <DatatableWrapper body={data} headers={header}>
        <section className="m-0 mt-2">
          <div className="d-flex justify-content-between w-75 m-0">
            <Filter
              controlledProps={{
                onFilter,
              }}
            />
            <Box marginY={2} display="flex" alignItems="center" gap={10} ml={1}>
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
                onClick={customerSalesView}
              >
                <FontAwesomeIcon icon={faSearch} style={{ color: "black" }} />
              </Button>
            </Box>
          </div>
        </section>
        <Tooltip
          arrow={true}
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
    </>
  );
};

export default CustomerViewSale;

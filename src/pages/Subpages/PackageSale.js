import { Row, Col, Table, Offcanvas } from "react-bootstrap";
import {
  TableHeader,
  TableBody,
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
} from "react-bs-datatable";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import clientAdapter from "../../lib/clientAdapter";
import { useEffect, useState, useCallback } from "react";
import { Box, Button } from "@mui/material";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";

const btnStyle = {
  background: "#111827",
  padding: "6px 10px",
  color: "#fff",
  fontSize: 12,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "black",
  },
  lineHeight: 1.2,
};
const deleteBtnStyle = {
  ...btnStyle,
  background: "#d32F2F",

  "&:hover": {
    backgroundColor: "#d32F2F",
  },
};
const updateBtnStyle = {
  ...btnStyle,
  background: "#2EB0D3",
  "&:hover": {
    backgroundColor: "#2EB0D3",
  },
};

const PackageSale = () => {
  const header = [
    { title: "Sale Id", prop: "id" },
    { title: "Date", prop: "saleTime" },
    { title: "Type", prop: "type" },
    { title: "Customer", prop: "customerName" },
    { title: "Items", prop: "items" },
    { title: "Comments", prop: "comment" },
    { title: "Unsuspend", prop: "suspended" },
    { title: "Invoice", prop: "saleInvoice" },
    { title: "E-mail Receipt", prop: "emailReceipt" },
    { title: "Delete", prop: "delete" },
  ];

  const navigate = useNavigate();
  const [filter, setFilter] = useState();
  const [maxPage, setMaxPage] = useState(1);
  const [sortState, setSortState] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterInput, setFilterInput] = useState("");
  const [suspendSaleData, setSuspendSaleData] = useState([]);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [saleCount, setSaleCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [emailShow, setEmailShow] = useState(false);
  const handleCloseEmail = () => setEmailShow(false);

  const suspendData = async (page, limit, name) => {
    setLoading(true);
    const suspendRes = await clientAdapter.getPackageSales(page, limit);
    if (suspendRes) {
      setSaleCount(suspendRes.count);
    }
    const sres = suspendRes;
    sres.sales?.map((s) => {
      const saleItemkit = s.saleItemkit.map((itemkit) => itemkit.itemkit.name);
      s.suspendSaleId = s.id;
      s.saleTime = moment(s.saleTime).format("DD-MM-YYYY @ hh:mm a");
      s.type = "Sale Package";
      s.customerName = `${s.customer.firstName} ${s.customer.lastName}`;
      s.items = [...saleItemkit].join(", ");
      s.comment = s.comment;
      s.suspended = (
        <Button
          variant="contained"
          sx={updateBtnStyle}
          onClick={() => handleUpdatePackage(s)}
        >
          {" "}
          Update Package
        </Button>
      );
      s.saleInvoice = (
        <Button
          variant="contained"
          sx={btnStyle}
          onClick={() => handleReceipt(s.id)}
        >
          {" "}
          Receipt
        </Button>
      );
      s.emailReceipt = (
        <></>
      );
      s.delete = (
        <Button
          variant="contained"
          sx={deleteBtnStyle}
          onClick={handleShow}
        >
          {" "}
          Delete
        </Button>
      );
    });
    setLoading(false);
    setFilteredDataLength(rowsPerPage);
    setSuspendSaleData(suspendRes.sales);
    setMaxPage(Math.ceil(suspendRes.count / rowsPerPage));
    setCurrentPage(currentPage);
  };

  useEffect(() => {
    suspendData(currentPage, rowsPerPage, filterInput);
  }, [currentPage, rowsPerPage]);

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

  const handleFilter = (page, limit, value) => {
    setFilterInput(value);
    suspendData(page, limit, value);
  };

  const handleUpdatePackage = async (s) => {
    navigate(`/sales?sale=unpackaged&saleId=${s.id}`);
  };

  const handleReceipt = async (saleId) => {
    navigate(`/sales/receipt?saleId=${saleId}?submit=Receipt`);
  };

  return (
    <>
      <hr />
      <>
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
          <Col className="d-block mb-4 mb-md-0 col-6">
            <div className="d-flex align-items-center">
              <h6 className="customer-title">List of Package Sales </h6>
              <div>
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
                  {saleCount}
                </span>
              </div>
            </div>
          </Col>
        </Row>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <DatatableWrapper body={suspendSaleData} headers={header}>
            <Row>
              <Filter
                controlledProps={{
                  filter: "searchbar",
                  onFilter,
                }}
              />
              <input
                className="input-search"
                type="text"
                placeholder="Search"
                name="searchbar"
                style={{
                  marginLeft: "20px",
                }}
                value={filterInput}
                onChange={(e) =>
                  handleFilter(currentPage, rowsPerPage, e.target.value)
                }
              />
            </Row>
            <hr />
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

      <Offcanvas
        show={show}
        placement="top"
        className="modal-2"
        onHide={handleClose}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Are you sure you want to delete this sale, this action cannot be
            undone
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="suspend_sale_list">
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button>
              Ok
            </Button>
          </Box>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas
        show={emailShow}
        placement="top"
        className="modal-5"
        onHide={handleCloseEmail}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Receipt Sent</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleCloseEmail}>Ok</Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default PackageSale;

import { Row, Col, Table, Offcanvas, Button } from "react-bootstrap";
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
import { Box, Snackbar, Alert } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const SuspendSales = () => {
  const header = [
    { title: "Suspended Sales", prop: "id" },
    { title: "Date", prop: "saleTime" },
    { title: "Type", prop: "type" },
    { title: "Customer", prop: "customer" },
    { title: "Items", prop: "items" },
    { title: "Comments", prop: "comment" },
    { title: "Unsuspend", prop: "suspended" },
    { title: "Sales Invoice", prop: "saleInvoice" },
    // { title: "E-mail Receipt", prop: "emailReceipt" },
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
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [suspendId, setSuspendId] = useState(null);
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const locationId = JSON.parse(window.localStorage.getItem("yumpos_location"));

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (sId) => {
    setShow(true);
    setSuspendId(sId);
  };
  const [emailShow, setEmailShow] = useState(false);
  const handleCloseEmail = () => setEmailShow(false);
  const handleShowEmail = () => {
    setTimeout(() => setEmailShow(true), 2000);
  };

  const suspendData = async (page, limit, name) => {
    setLoading(true);
    const suspendRes = await clientAdapter.getSuspendSales(page, limit, name);
    if (suspendRes) {
      setCount(suspendRes.count);
    }
    suspendRes.sales.map((s) => {
      console.log(s);
      const saleItems = s.saleItems.map((item) => item.item.name);
      const saleItemkit = s.saleItemkit.map((itemkit) => itemkit.itemkit.name);
      s.suspendSaleId = s.id;
      s.saleTime = moment.utc(s.saleTime).format("DD-MM-YYYY @ hh:mm a");
      s.type = "Service Slip";
      s.customer = `${s.customer.firstName} ${s.customer.lastName}`;
      s.items = [...saleItems, ...saleItemkit].join(", ");
      s.comment = s.comment;
      s.suspended = (
        <a
          style={{
            marginRight: "5px",
            padding: "5px",
            backgroundColor: "skyblue",
            color: "white",
            borderRadius: "3px",
          }}
          onClick={() => handleUnsuspendSale(s.id)}
        >
          Unsuspend
        </a>
      );
      s.saleInvoice = (
        <a
          style={{
            marginRight: "5px",
            padding: "5px",
            backgroundColor: "skyblue",
            color: "white",
            borderRadius: "3px",
          }}
          onClick={() => handleReceipt(s.id)}
        >
          Receipt
        </a>
      );
      s.emailReceipt = (
        <a
          style={{
            marginRight: "5px",
            padding: "5px",
            backgroundColor: "skyblue",
            color: "white",
            borderRadius: "3px",
          }}
          onClick={handleShowEmail}
        >
          Email
        </a>
      );
      s.delete = (
        <a
          style={{
            marginRight: "5px",
            padding: "5px",
            backgroundColor: "red",
            color: "white",
            borderRadius: "3px",
          }}
          onClick={() => handleShow(s.id)}
        >
          Delete
        </a>
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

  const handleUnsuspendSale = async (id) => {
    navigate(`/sales?sale=${"unsuspend"}&saleId=${id}`);
  };

  const handleReceipt = async (saleId) => {
    const response = await clientAdapter.getSaleReceipt(saleId);
    if (response) {
      window.open(
        `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${saleId}`,
        "_blank"
      );
    }
  };

  const handleDeleteSuspend = async () => {
    const response = await clientAdapter.deleteSuspendSale(suspendId);
    if (response === 200) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "success",
        message: "Deleted Suspend Sale Successful",
      });
      setShow(false);
      setTimeout(() => {
        suspendData(currentPage, rowsPerPage, filterInput);
      }, 1000);
    }
  };

  const handleSnackbarClose = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  };

  return (
    <>
      <hr />
      <>
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
          <Col className="d-block mb-4 mb-md-0 col-6">
            <div className="d-flex align-items-center">
              <h6 className="customer-title">List of Suspended Sales </h6>
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
                  {count}
                </span>
              </div>
            </div>
          </Col>
        </Row>
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
              // width="25%"
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
            {loading ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  <CircularProgress size={50} sx={{ color: "inherit" }} />
                </td>
              </tr>
            ) : (
              <TableBody />
            )}
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
            <Button onClick={handleDeleteSuspend}>Ok</Button>
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

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SuspendSales;

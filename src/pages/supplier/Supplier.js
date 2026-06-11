import React, { useState, useEffect, useCallback } from "react";
import clientAdapter from "../../lib/clientAdapter";
import { DatatableWrapper } from "react-bs-datatable";
import { Row, Col, Table, Button } from "react-bootstrap";
import {
  TableHeader,
  TableBody,
  PaginationOptions,
  Pagination,
  Filter,
} from "react-bs-datatable";
import NewLead from "../components/Dropdowns-Leadspage/Buttonleadtable";
import DropdownLeadsource from "../components/Dropdowns-Leadspage/Dropdown-leadsource";
import GenderCustomer from "../components/Dropdown-customers/GenderCustomer";
import { AddNewSupplier } from "./AddNewSupplier";
import { Snackbar, Alert } from "@mui/material";

const Supplier = () => {
  const [sortState, setSortState] = useState({});
  const [leadCount, setLeadCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [filter, onFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [snackBar, setSnackBar] = useState({ open: false, severity: "success", message: "" });

  // Define the table headers
  const header = [
    { title: "Supplier Id", prop: "id" },
    { title: "Company Name", prop: "companyName" },
    { title: "Last Name", prop: "lastName" },
    { title: "First Name", prop: "firstName" },
    { title: "E-mail", prop: "email" },
    { title: "Phone Number", prop: "phone" },
  ];

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const handleNewItem = () => {
    setShowModal(true);
  };

  // Fetch data from the API with pagination
  const fetchSuppliers = useCallback(async () => {
    const response = await clientAdapter.getSuppliers(currentPage, rowsPerPage);
    setData(
      response.data.map((supplier) => ({
        id: supplier.id,
        companyName: supplier.companyName,
        lastName: supplier.person?.lastName || "N/A",
        firstName: supplier.person?.firstName || "N/A",
        email: supplier.person?.email || "N/A",
        phone: supplier.person?.phoneNumber || "N/A",
      }))
    );
    setLeadCount(response.count); // Set the total number of suppliers
    setMaxPage(Math.ceil(response.count / rowsPerPage)); // Calculate max pages
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const onSortChange = useCallback((nextProp) => {
    setSortState(nextProp);
  }, []);

  const onPaginationChange = useCallback((nextPage) => {
    setCurrentPage(nextPage);
  }, []);

  const onRowsPerPageChange = useCallback((newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to the first page when rows per page change
  }, []);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        snackBar={snackBar}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>

      <AddNewSupplier
        showModal={showModal}
        handleCloseModal={() => setShowModal(false)}
        setSnackBar={setSnackBar}
        onSuccess={fetchSuppliers}
      />
      <hr />
      <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
        <Col className="d-block mb-4 mb-md-0 col-6">
          <div className="">
            <h6 className="h6">
              List of Suppliers <span className="badge">{leadCount}</span>
            </h6>
          </div>
        </Col>
      </Row>
      <DatatableWrapper body={data} headers={header} isControlled>
        <Row>
          <div className="col-2 flex-end">
            <Button className="search-items" onClick={handleNewItem}>
              New Supplier
            </Button>
          </div>
        </Row>
        <hr />

        <Table className="data-tables shadow-lg">
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

export default Supplier;

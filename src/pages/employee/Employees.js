import {
  Row,
  Col,
  Table,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasTitle,
  OffcanvasBody,
  Button,
} from "react-bootstrap";
import {
  TableHeader,
  TableBody,
  DatatableWrapper,
  Filter,
} from "react-bs-datatable";
import { Alert, Box, Typography, Snackbar } from "@mui/material";
import clientAdapter from "../../lib/clientAdapter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState, useCallback } from "react";
import EmployeesView from "./EmployeesView";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";

const Employees = () => {
  const [sortState, setSortState] = useState({});
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [employeeCount, setEmployeeCount] = useState(null);
  const [filterInput, setFilterInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const handleShow = (employeeId) => {
    setConfirmDelete(true);
    setCurrentEmployeeId(employeeId);
  };
  const handleClose = () => setConfirmDelete(false);

  const [employee, setEmployee] = useState({
    isEditing: false,
    editItem: null,
  });

  const locationInfo = JSON.parse(
    window.localStorage.getItem("yumpos_location")
  );

  const header = [
    { title: "Person Id", prop: "personId" },
    { title: "Name", prop: "name" },
    { title: "Username", prop: "username" },
    { title: "E-mail", prop: "email" },
    { title: "Phone Number", prop: "phoneNumber" },
    { title: "Action", prop: "action" },
  ];

  // Randomize data of the table columns.
  // Note that the fields are all using the `prop` field of the headers.

  const getData = async (id) => {
    setLoading(true);
    const employeeRes = await clientAdapter.getLocationData(id);
    setLoading(false);
    setEmployeeCount(employeeRes?.employeeConnection?.length);
    employeeRes.employeeConnection.map((e) => {
      e.personId = e.person.id;
      e.name = e.person.firstName;
      e.username = e.employee.username;
      e.email = e.person.email;
      e.phoneNumber = e.person.phoneNumber;
      e.action = (
        <Box>
          <a
            style={{
              marginRight: "5px",
              padding: "5px",
              backgroundColor: "skyblue",
              color: "white",
              borderRadius: "3px",
            }}
            onClick={() => handleUpdateEmployee(e)}
          >
            Edit
          </a>
          <a
            style={{
              padding: "5px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "3px",
            }}
            onClick={() => handleShow(e.person.id)}
          >
            Delete
          </a>
        </Box>
      );
    });
    setFilteredDataLength(rowsPerPage);
    setData(employeeRes.employeeConnection);
    setFilteredData(employeeRes.employeeConnection);
    setMaxPage(Math.round(employeeRes.count / rowsPerPage));
    setCurrentPage(currentPage);
  };

  const handleUpdateEmployee = async (item) => {
    const employeeDetails = await clientAdapter.getEmployeeDetails(
      item.person.id
    );
    if (employeeDetails) {
      setCurrentIndex(1);
      setEmployee({ isEditing: true, editItem: employeeDetails });
    }
  };

  const handleDelete = async () => {
    const EmployeeDel = await clientAdapter.deleteEmployee(currentEmployeeId);
    if (EmployeeDel === 200) {
      setConfirmDelete(false);
      setOpen(!open);
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 2000);
    }
  };

  const handleNewEmployee = () => {
    setCurrentIndex(1);
  };

  const onSortChange = useCallback((nextProp) => {
    setSortState(nextProp);
  }, []);

  useEffect(() => {
    const locationId = locationInfo.locationId;
    getData(locationId);
  }, [currentPage, rowsPerPage]);

  const onFilter = () => {
    setFilter(filter);
  };

  const handleClickBack = () => {
    setCurrentIndex(0);
    setEmployee({ isEditing: false, editItem: null });
  };

  const onSubmitEmployee = () => {
    const locationId = locationInfo.locationId;
    getData(locationId);
    setTimeout(() => {
      setCurrentIndex(0);
    }, 3000);
  };

  const onCancelEmployee = () => {};

  const handleInputChange = (e) => {
    const searchName = e.target.value;
    setFilterInput(searchName);

    const filterEmployee = data.filter(
      (employee) =>
        employee?.name?.toLowerCase().includes(searchName.toLowerCase()) ||
        employee?.username?.toLowerCase().includes(searchName.toLowerCase()) ||
        employee?.email?.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredData(filterEmployee);
    setEmployeeCount(filterEmployee.length);
  };

  return (
    <>
      {open && (
        <Snackbar open={open} autoHideDuration={6000}>
          <Alert severity="error">Employee Deleted Successfully</Alert>
        </Snackbar>
      )}

      <Offcanvas
        show={confirmDelete}
        onHide={handleClose}
        placement="top"
        className="modal-2"
      >
        <OffcanvasHeader closeButton>
          <OffcanvasTitle>
            Are you sure you want to delete this employee?
          </OffcanvasTitle>
        </OffcanvasHeader>
        <OffcanvasBody>
          <Box style={{ float: "right" }}>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={handleDelete} style={{ marginLeft: "5px" }}>
              Yes
            </Button>
          </Box>
        </OffcanvasBody>
      </Offcanvas>

      <hr />
      {currentIndex === 0 && (
        <>
          <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
            <Col className="d-block mb-4 mb-md-0 col-6">
              <div className="">
                <h6 className="h6">
                  List of Employees{" "}
                  {employeeCount ? (
                    <span
                      style={{
                        backgroundColor: "lightgray",
                        color: "black",
                        border: "1px solid gray",
                        padding: "5px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        borderRadius: "50%",
                        marginLeft: "10px",
                      }}
                    >
                      {employeeCount}
                    </span>
                  ) : null}
                </h6>
              </div>
            </Col>
            <Col className="d-flex flex-column justify-content-end align-items-end leadpage-Btn">
              <Button
                sx={{
                  background: "black",
                  color: "#fff",
                  fontSize: 14,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
                className="customer-title"
                onClick={handleNewEmployee}
              >
                New Employee
              </Button>
            </Col>
          </Row>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <DatatableWrapper body={filteredData} headers={header} isControlled>
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
                  placeholder="Search Employee"
                  name="searchbar"
                  style={{ marginLeft: "10px" }}
                  value={filterInput}
                  onChange={handleInputChange}
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
            </DatatableWrapper>
          )}
        </>
      )}
      {/* New Employee */}
      {currentIndex === 1 && (
        <>
          <Box display={"flex"} alignItems={"center"}>
            <ArrowBackIcon
              style={{ cursor: "pointer" }}
              onClick={handleClickBack}
            />
            <Typography ml={2} fontSize={22} fontWeight={"bold"}>
              {employee.isEditing ? "Edit Employee" : "Create Employee"}
            </Typography>
          </Box>
          <EmployeesView
            isEditing={employee.isEditing}
            editItem={employee.editItem}
            onSubmitEmployee={onSubmitEmployee}
            onCancelEmployee={onCancelEmployee}
          />
        </>
      )}
    </>
  );
};
export default Employees;

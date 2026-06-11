import { Row, Col, Table } from "react-bootstrap";
import {
  TableHeader,
  TableBody,
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
} from "react-bs-datatable";
import { orderBy } from "lodash";
import moment from "moment-timezone";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerViewSale from "./CustomerViewSale";
import clientAdapter from "../../lib/clientAdapter";
import { Box, Button, Typography } from "@mui/material";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";
import CustomerForm from "../components/customer/CustomerForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GenderCustomer from "../components/Dropdown-customers/GenderCustomer";
import DropdownLeadsource from "../components/Dropdowns-Leadspage/Dropdown-leadsource";

const Customer = () => {
  const navigate = useNavigate();
  const [sortState, setSortState] = useState({});
  const [leadCount, setLeadCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [filter, setFilter] = useState();
  const [source, setSource] = useState("");
  const [gender, setGender] = useState("");
  const [leadSources, setLeadSources] = useState([]);
  const [viewSalePersonId, setViewSalePersonId] = useState(null);
  const [customerlistLoading, setCustomerListloading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [redirectTo, setRedirectTo] = useState(null);
  const [customer, setCustomer] = useState({
    isEditing: false,
    editItem: null,
  });

  const header = [
    { title: "Date Created", prop: "createdDate" },
    { title: "Name", prop: "firstName" },
    { title: "Loyalty Card Number", prop: "loyaltyCardNumber" },
    { title: "Phone Number", prop: "phoneNumber" },
    { title: "Source", prop: "source" },
    { title: "Gender", prop: "gender" },
    { title: "Points", prop: "points" },
    { title: "Last Sale", prop: "lastSale" },
    { title: "Action", prop: "action" },
  ];
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/customers") {
      onClickBack();
    }
    let params = new URL(document.location.toString()).searchParams;
    let customerId = params.get("customerId");
    let redirect = params.get("redirect");
    if (customerId) {
      onViewSale(customerId);
      setRedirectTo(redirect);
    }
  }, [location]);

  const getLeadSourceName = (ls) => {
    if (leadSources.length) {
      const lname = leadSources?.filter((i) => i.id === ls);
      return lname[0]?.source;
    } else {
      return "";
    }
  };

  const getCustData = async (page, limit, name, source, gender) => {
    setCustomerListloading(true);
    try {
      const custRes = await clientAdapter.getCustomerData(
        page,
        limit,
        name,
        source,
        gender
      );
      if (custRes) {
        setFilteredDataLength(rowsPerPage);
        setData(custRes.customers);
        setLeadCount(custRes.count);
        setMaxPage(Math.ceil(custRes.count / rowsPerPage));
      }
      setCustomerListloading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getGender = (g) => {
    switch (g) {
      case "0":
      case "male":
      case "Male":
        return "Male";
      case "1":
      case "female":
      case "Female":
        return "Female";
      default:
        return "Prefer Not to Say";
    }
  };

  const customerLists = () => {
    let cres = [...data];
    if (sortState) {
      cres = orderBy(cres, sortState.prop, sortState.order);
    }
    cres?.map((a) => {
      a.personId = `${a.personId || ""}`;
      a.firstName = a.person.firstName;
      a.loyaltyCardNumber = a.loyaltyCardNumber || "NA";
      a.phoneNumber = a.person.phoneNumber;
      a.source = getLeadSourceName(a.sourceId);
      a.gender = getGender(a.gender);
      a.points = parseInt(a.points);
      a.createdDate = moment(a.createdDate).format("D-MMM-YY");
      a.lastSale = (
        <div
          data={a}
          style={{ color: "skyblue" }}
          onClick={() => onViewSale(a.personId)}
        >
          View Sales
        </div>
      );
      a.action = (
        <div
          data={a}
          style={{ color: "skyblue" }}
          onClick={() => onUpdateCustomer(a)}
        >
          Edit
        </div>
      );
    });

    return cres;
  };

  const onUpdateCustomer = (item) => {
    setCurrentIndex(1);
    setCustomer({ isEditing: true, editItem: item });
  };

  const onViewSale = (personId) => {
    setCurrentIndex(2);
    setCustomer({ isEditing: false, editItem: null });
    setViewSalePersonId(personId);
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
    getCustData(currentPage, rowsPerPage, filterInput, source, gender);
  }, [sortState, currentPage, rowsPerPage]);

  const handleSourceChange = (selectedSource) => {
    setSource(selectedSource);
  };

  const onFilter = () => {
    setFilter(filter);
  };

  const handleFilter = (e) => {
    setFilterInput(e.target.value);
  };

  const searchCustomer = () => {
    getCustData(currentPage, rowsPerPage, filterInput, source, gender);
  };

  const onClickNewCustomer = () => {
    setCurrentIndex(1);
  };

  const onSubmitCustomer = (res) => {
    getCustData(currentPage, rowsPerPage, filterInput, source, gender);
    setTimeout(() => {
      setCurrentIndex(0);
    }, 2000);
  };

  const onCancelCustomer = () => {};

  const onClickBack = () => {
    if (redirectTo) {
      navigate("/customer/report/retention");
    }
    setCurrentIndex(0);
    setCustomer({ isEditing: false, editItem: null });
  };

  return (
    <>
      <hr />
      {currentIndex === 0 && (
        <>
          <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
            <Col className="d-block mb-4 mb-md-0 col-6">
              <div className="">
                <h6 className="customer-title">
                  Customers{" "}
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
                    {leadCount}
                  </span>
                </h6>
              </div>
            </Col>
            <Col className="d-flex flex-column justify-content-end align-items-end leadpage-Btn">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: "black",
                  color: "#fff",
                  fontSize: 14,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "black", // Change to your desired color
                  },
                }}
                className="customer-title"
                onClick={onClickNewCustomer}
              >
                New Customer
              </Button>
            </Col>
          </Row>
          {customerlistLoading ? (
            <SkeletonLoader />
          ) : (
            <DatatableWrapper
              body={customerLists()}
              headers={header}
              isControlled
            >
              <section className="m-0">
                <div className="d-flex justify-content-between w-75 m-2">
                  <Filter
                    controlledProps={{
                      filter: "searchbar",
                      onFilter,
                    }}
                  />
                  <input
                    className="input-search"
                    type="text"
                    width="25%"
                    placeholder="Search"
                    name="searchbar"
                    value={filterInput}
                    onChange={(e) => handleFilter(e)}
                  />

                  <DropdownLeadsource
                    onChange={handleSourceChange}
                    setLeadSources={setLeadSources}
                  />

                  <GenderCustomer gender={gender} setGender={setGender} />

                  <Button
                    className=" search-leads"
                    style={{ border: "1px solid lightGray" }}
                    onClick={searchCustomer}
                  >
                    <FontAwesomeIcon
                      icon={faSearch}
                      style={{ color: "black" }}
                    />
                  </Button>
                </div>
              </section>

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
      )}
      {currentIndex === 1 && (
        <>
          <Box display={"flex"} alignItems={"center"}>
            <ArrowBackIcon
              style={{ cursor: "pointer" }}
              onClick={onClickBack}
            />
            <Typography ml={2} fontSize={22} fontWeight={"bold"}>
              {customer.isEditing ? "Edit Customer" : "Create Customer"}
            </Typography>
          </Box>
          <CustomerForm
            isEditing={customer.isEditing}
            editItem={customer.editItem}
            onSubmitCustomer={onSubmitCustomer}
            oCancelCustomer={onCancelCustomer}
          />
        </>
      )}
      {currentIndex === 2 && (
        <>
          <Box display={"flex"} alignItems={"center"}>
            <ArrowBackIcon
              style={{ cursor: "pointer" }}
              onClick={onClickBack}
            />
            <Typography ml={2} fontSize={22} fontWeight={"bold"}>
              View Sales
            </Typography>
          </Box>
          <CustomerViewSale personId={viewSalePersonId} />
        </>
      )}
    </>
  );
};

export default Customer;

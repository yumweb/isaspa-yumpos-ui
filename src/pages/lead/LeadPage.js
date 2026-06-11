import { useState, useEffect, useCallback } from "react";
import {
  DatatableWrapper,
  Pagination,
  PaginationOptions,
  TableBody,
  Filter,
} from "react-bs-datatable";
import { Button, Tooltip, Input, Box, Typography } from "@mui/material";
import { Col, Row, Table } from "@themesberg/react-bootstrap";
import "../../scss/dashboard.page.scss";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clientAdapter from "../../lib/clientAdapter";
import moment from "moment-timezone";
import { orderBy } from "lodash";
import Toggles from "../components/Leadpage-Modals/AppointmentModal";
import Sms from "../components/Leadpage-Modals/SmsModal";
import Whatsapp from "../components/Leadpage-Modals/WhatsappModal";
import View from "../components/Leadpage-Modals/ViewModal";
import NewLead from "../components/Dropdowns-Leadspage/Buttonleadtable";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";
import { leadStatus } from "../../data/leadStatus";
import { useLocation } from "react-router-dom";
import CustomTableHeader from "../../components/TableHeaderFilter/CustomTableHeader";

const header = [
  { title: "Created", prop: "dateCreated", isSortable: true },
  { title: "Customer Name", prop: "fullName", isSortable: true },
  { title: "Status", prop: "status" },
  { title: "Next Follow Up On", prop: "followupDate", isSortable: true },
  { title: "Lead Source", prop: "source" },
  { title: "First Bill Value", prop: "firstBillValue" },
  { title: "Actions", prop: "actions" },
];

// Then, use it in a component.
const Leadtable = () => {
  const location = useLocation();
  const [leadCount, setLeadCount] = useState(0);
  const [filteredDataLength, setFilteredDataLength] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [maxPage, setMaxPage] = useState(1);
  const [data, setData] = useState([]);
  const [sortState, setSortState] = useState({});
  const [filterInput, setFilterInput] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [followupStartDate, setFollowupStartDate] = useState("");
  const [followupEndDate, setFollowupEndDate] = useState("");
  const [filter, setFilter] = useState();
  const [filterStatus, setFilterStatus] = useState("");
  const [source, setSource] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);
  const [leadListLoading, setLeadListLoading] = useState(false);
  const [leadStatusOptions, setLeadStatusOptions] = useState([]);
  const [leadSourceOptions, setLeadSourceOptions] = useState([]);
  const [tableFilters, setTableFilters] = useState({
    status: [],
    source: [],
    dateCreated: null,
    followupDate: null,
  });
  const queryParameters = new URLSearchParams(location.search);
  const display = queryParameters.get("display");

  const getStatusClass = (statusId) => {
    let className = ``;
    switch (statusId) {
      case 1:
        className = "validated-box";
        break;
      case 2:
        className = "prospective-box";
        break;
      case 3:
        className = "hot-box";
        break;
      case 4:
        className = "converted-box";
        break;
      case 6:
        className = "cold-box";
        break;
      case 7:
        className = "connect-box";
        break;
      default:
        className = "";
    }
    return `source-wrapper ${className}`;
  };

  const getLeadData = async (
    page,
    limit,
    sortState,
    name,
    status,
    source,
    startDate,
    endDate,
    followupDateStart,
    followupDateEnd
  ) => {
    setLeadListLoading(true);
    try {
      const leRes = await clientAdapter.getLocationLeads(
        page,
        limit,
        sortState,
        name,
        status,
        source,
        startDate,
        endDate,
        followupDateStart,
        followupDateEnd
      );
      const leadRes = leRes;
      setLeadListLoading(false);
      if (sortState) {
        leadRes.leads = orderBy(leadRes.leads, sortState.prop, sortState.order);
      }
      leadRes?.leads?.map((l) => {
        l.fullName = `${l.firstName || ""} ${l.lastName || ""}`;
        l.status = (
          <span className={getStatusClass(l?.leadStatus?.id)}>
            {l.leadStatus?.status}
          </span>
        );
        l.source = l.leadSource ? l.leadSource.source : "NA";
        l.dateCreated = moment(l.dateCreated).format("D-MMM-YY hh:mm A");
        l.followupDate = l.followupDate
          ? moment(l.followupDate).format("Do MMM YYYY")
          : "NA";
        l.firstBillValue = `Rs. ${0}`;
        l.actions = [
          <Toggles data={l} />,
          <View data={l} />,
          <Whatsapp data={l} />,
          <Sms data={l} />,
        ];
      });
      setFilteredDataLength(rowsPerPage);
      setData(leadRes.leads);
      setLeadCount(leadRes.count);
      setMaxPage(Math.ceil(leadRes.count / rowsPerPage));
    } catch (err) {
      setLeadListLoading(false);
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

  useEffect(() => {
    getLeadData(
      currentPage,
      rowsPerPage,
      sortState,
      filterInput,
      filterStatus,
      source,
      startDate,
      endDate,
      display === "Today"
        ? moment(new Date()).subtract(1, "day").format("YYYY-MM-DD")
        : followupStartDate,
      display === "Today"
        ? moment(new Date()).subtract(1, "day").format("YYYY-MM-DD")
        : followupEndDate
    );
  }, [
    sortState,
    currentPage,
    rowsPerPage,
    display,
    followupStartDate,
    followupEndDate,
  ]);

  useEffect(() => {
    if (searchClicked) {
      getLeadData(
        currentPage,
        rowsPerPage,
        sortState,
        filterInput,
        filterStatus,
        source,
        startDate,
        endDate,
        display === "Today"
          ? moment(new Date()).subtract(1, "day").format("YYYY-MM-DD")
          : followupStartDate,
        display === "Today"
          ? moment(new Date()).subtract(1, "day").format("YYYY-MM-DD")
          : followupEndDate
      );
      setSearchClicked(false);
    }
  }, [searchClicked]);

  // Update table filters when filterStatus changes externally
  useEffect(() => {
    if (filterStatus) {
      const statusIds = filterStatus.split(",").map((id) => parseInt(id));
      setTableFilters((prev) => ({ ...prev, status: statusIds }));
    } else {
      setTableFilters((prev) => ({ ...prev, status: [] }));
    }
  }, [filterStatus]);

  // Update table filters when source changes externally
  useEffect(() => {
    if (source) {
      const sourceIds = source.split(",").map((id) => parseInt(id));
      setTableFilters((prev) => ({ ...prev, source: sourceIds }));
    } else {
      setTableFilters((prev) => ({ ...prev, source: [] }));
    }
  }, [source]);

  // Update table filters when date range changes externally
  useEffect(() => {
    if (startDate && endDate) {
      const dateRange = {
        from: moment(startDate).toDate(),
        to: moment(endDate).toDate(),
        label: `${moment(startDate).format("MMM DD")} - ${moment(
          endDate
        ).format("MMM DD, YYYY")}`,
      };
      setTableFilters((prev) => ({ ...prev, dateCreated: dateRange }));
    } else {
      setTableFilters((prev) => ({ ...prev, dateCreated: null }));
    }
  }, [startDate, endDate]);

  // Update table filters when followup date range changes externally
  useEffect(() => {
    if (followupStartDate && followupEndDate) {
      const dateRange = {
        from: moment(followupStartDate).toDate(),
        to: moment(followupEndDate).toDate(),
        label: `${moment(followupStartDate).format("MMM DD")} - ${moment(
          followupEndDate
        ).format("MMM DD, YYYY")}`,
      };
      setTableFilters((prev) => ({ ...prev, followupDate: dateRange }));
    } else {
      setTableFilters((prev) => ({ ...prev, followupDate: null }));
    }
  }, [followupStartDate, followupEndDate]);

  const onFilter = () => {
    setFilter(filter);
  };

  const handleFilter = (e) => {
    setFilterInput(e.target.value);
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleFilterChange = (selectedStatus) => {
    setFilterStatus(selectedStatus);
  };

  const handleSourceChange = (selectedSource) => {
    setSource(selectedSource);
  };

  const handleTableFilterChange = (filterType, values) => {
    const newFilters = { ...tableFilters, [filterType]: values };
    setTableFilters(newFilters);

    // Convert to format expected by API
    if (filterType === "status") {
      const statusValue = values.length > 0 ? values.join(",") : "";
      setFilterStatus(statusValue);
      // Trigger search automatically
      setSearchClicked(true);
    } else if (filterType === "source") {
      const sourceValue = values.length > 0 ? values.join(",") : "";
      setSource(sourceValue);
      // Trigger search automatically
      setSearchClicked(true);
    } else if (filterType === "dateCreated") {
      if (values) {
        setStartDate(moment(values.from).format("YYYY-MM-DD"));
        setEndDate(moment(values.to).format("YYYY-MM-DD"));
      } else {
        setStartDate("");
        setEndDate("");
      }
      // Trigger search automatically
      setSearchClicked(true);
    } else if (filterType === "followupDate") {
      if (values) {
        setFollowupStartDate(moment(values.from).format("YYYY-MM-DD"));
        setFollowupEndDate(moment(values.to).format("YYYY-MM-DD"));
      } else {
        setFollowupStartDate("");
        setFollowupEndDate("");
      }
      // Trigger search automatically
      setSearchClicked(true);
    }
  };

  const getLeadStatusOptions = async () => {
    try {
      const response = await clientAdapter.getLeadStatus();
      setLeadStatusOptions(response);
    } catch (error) {
      console.log("error from get lead status", error);
    }
  };

  const getLeadSourceOptions = async () => {
    try {
      const response = await clientAdapter.getLeadSource();
      setLeadSourceOptions(response);
    } catch (error) {
      console.log("error from get lead source", error);
    }
  };

  useEffect(() => {
    getLeadStatusOptions();
    getLeadSourceOptions();
  }, []);

  useEffect(() => {}, [source]);

  const handleFilters = (e) => {
    setSearchClicked(true);
  };

  return (
    <>
      <Row className="d-flex flex-wrap flex-md-nowrap align-items-center">
        <Col className="d-block mb-4 mb-md-0 col-2">
          <h3 className="p-3">Leads</h3>
        </Col>
        <Col className="d-flex flex-column justify-content-end align-items-end leadpage-Btn">
          <NewLead />
        </Col>
      </Row>
      {leadListLoading ? (
        <div style={{ width: "100%" }}>
          <SkeletonLoader />
        </div>
      ) : (
        <DatatableWrapper body={data} headers={header} isControlled>
          <div className="row-box  col-md-12 col-lg-12">
            <div className="lead-status clearfix">
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  flexWrap={"wrap"}
                  sx={{ width: "85%" }}
                >
                  {leadStatus.map((i, x) => {
                    return (
                      <Box key={i.id} display={"flex"} alignItems={"center"}>
                        <div className={i.className} />
                        <Typography fontSize={14}>{i.status}</Typography>
                      </Box>
                    );
                  })}
                </Box>
                <Box>
                  <span
                    style={{
                      backgroundColor: "lightgray",
                      color: "black",
                      border: " 1px solid gray",
                      padding: "5px",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      borderRadius: "50%",
                    }}
                  >
                    {leadCount}
                  </span>
                </Box>
              </Box>
            </div>
          </div>
          <Table
            className="data-tables col-sm-12 col-md-4 col-lg-10 "
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
            <CustomTableHeader
              headers={header}
              sortState={sortState}
              onSortChange={onSortChange}
              filters={tableFilters}
              onFilterChange={handleTableFilterChange}
              leadStatusOptions={leadStatusOptions}
              leadSourceOptions={leadSourceOptions}
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
      )}
    </>
  );
};

export default Leadtable;

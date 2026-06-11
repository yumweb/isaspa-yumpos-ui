import React from "react";
import clientAdapter from "../../../lib/clientAdapter";
import clientAdapterLegacy from "../../../lib/clientAdapterLegacy";
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import {
  Box,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextareaAutosize,
  Link,
  Pagination,
  PaginationItem,
} from "@mui/material";
import moment from "moment-timezone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MenuProps } from "../../../style/globalStyle";
import { Button } from "@themesberg/react-bootstrap";
import ReportSkeletonLoader from "../../../components/loader/reportSkeletonLoader";

export const CustomerRetentionReport = () => {
  const currentLocation = JSON.parse(
    window.localStorage.getItem("yumpos_location")
  );
  const [page, setPage] = useState(1); // Start from page 1 for UI
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatuses, setSelectedStatuses] = React.useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const resultPerPage = 20; // Define items per page

  // Function to handle dropdown changes
  const handleChange = (event, customerId) => {
    const selectedValue = JSON.parse(event.target.value);

    // Update only the relevant customer dropdown
    setSelectedStatuses((prevState) => ({
      ...prevState,
      [customerId]: JSON.stringify({
        status: selectedValue.status,
        customerId: selectedValue.customerId,
      }),
    }));

    // Call API to update the customer retention status
    clientAdapter.updateCustomerById(selectedValue.customerId, {
      retentionStatus: selectedValue.status,
    });
  };

  const handleFeedbackChange = (event, customerId) => {
    try {
      clientAdapter.updateCustomerById(customerId, {
        retentionFeedback: event.target.value || null,
      });
      alert("Feedback updated successfully");
    } catch (error) {
      alert("Error updating feedback");
    }
  };

  const handleWhatsAppClick = (phone) => {
    const url = `https://wa.me/91${phone}`;
    window.open(url, "_blank");
  };

  const handleFilterChange = async (event) => {
    let selectedValue = event.target.value;
    try {
      const res = await clientAdapterLegacy.getCustomerRetentionReport(
        currentLocation.locationId,
        60,
        { status: selectedValue }
      );
      if (res.success) {
        setData(res.retentionReport);
        setTotalCount(res.totalCount);
        setTotalPages(Math.ceil(res.totalCount / resultPerPage));
      }
      setFilterStatus(selectedValue);
      setPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleYearFilterChange = async (event) => {
    let selectedValue = event.target.value;
    console.log(selectedValue);
    try {
      const res = await clientAdapterLegacy.getCustomerRetentionReport(
        currentLocation.locationId,
        60,
        { year: selectedValue }
      );
      if (res.success) {
        setData(res.retentionReport);
        setTotalCount(res.totalCount);
        setTotalPages(Math.ceil(res.totalCount / resultPerPage));
      }
      setFilterYear(selectedValue);
      setPage(1);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async (pageNumber) => {
    setIsLoading(true);
    try {
      const res = await clientAdapterLegacy.getCustomerRetentionReport(
        currentLocation.locationId,
        60,
        { status: filterStatus, year: filterYear },
        (pageNumber - 1) * resultPerPage
      );
      if (res.success) {
        setData(res.retentionReport);
        setTotalCount(res.totalCount);
        setTotalPages(Math.ceil(res.totalCount / resultPerPage));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const header = [
    { title: "#", id: 1 },
    { title: "Customer Name", id: 2 },
    { title: "Phone", id: 3 },
    { title: "Last Sale Date", id: 4 },
    { title: "Status", id: 5 },
    { title: "Feedback", id: 6 },
  ];

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchData(value);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {isLoading ? (
        <ReportSkeletonLoader />
      ) : (
        <>
          <hr />
          <Box display={"flex"} alignItems={"center"}>
            <Typography ml={2} fontSize={20} fontWeight={"bold"}>
              Lost Customer Recovery Report &ndash; 60 Days{" "}
              <span style={{ color: "#0d6efd" }}>Total - {totalCount}</span>
            </Typography>
          </Box>
          <Box mt={2}>
            <FormControl sx={{ minWidth: 140, marginBottom: 3 }} size="small">
              <InputLabel id="filter-by-status">Filter By Status</InputLabel>
              <Select
                variant="outlined"
                labelId="filter-by-status"
                id="filter-by-status"
                value={filterStatus}
                label="Filter By Status"
                onChange={handleFilterChange}
                autoWidth={true}
                MenuProps={MenuProps}
              >
                <MenuItem key="1" value="all">
                  All
                </MenuItem>
                <MenuItem key="2" value="not-connected">
                  Not Connected
                </MenuItem>
                <MenuItem key="3" value="prospective">
                  Prospective
                </MenuItem>
                <MenuItem key="4" value="appointment-booked">
                  Appointment Booked
                </MenuItem>
                <MenuItem key="5" value="lost">
                  Lost
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              sx={{ minWidth: 240, marginBottom: 3, marginLeft: 2 }}
              size="small"
            >
              <InputLabel id="filter-by-status">
                Filter By Last Sale Year
              </InputLabel>
              <Select
                variant="outlined"
                labelId="filter-by-status"
                id="filter-by-status"
                value={filterYear}
                label="Filter By Status"
                onChange={handleYearFilterChange}
                autoWidth={true}
                MenuProps={MenuProps}
              >
                <MenuItem key="1" value="all">
                  All
                </MenuItem>
                <MenuItem key="2" value="2020">
                  2020
                </MenuItem>
                <MenuItem key="2" value="2021">
                  2021
                </MenuItem>
                <MenuItem key="2" value="2022">
                  2022
                </MenuItem>
                <MenuItem key="2" value="2023">
                  2023
                </MenuItem>
                <MenuItem key="2" value="2024">
                  2024
                </MenuItem>
              </Select>
            </FormControl>
            <Table aria-label="simple table" bordered>
              <TableHead>
                <TableRow>
                  {header.map((h) => (
                    <TableCell scope="col" key={h.id}>
                      {h.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.length ? (
                  <>
                    {data?.map((i, x) => (
                      <React.Fragment key={x}>
                        <TableRow key={x}>
                          <TableCell>{i?.serial_number}</TableCell>
                          <TableCell>
                            <Link
                              href={`/customers?customerId=${i?.person_id}&redirect=retention`}
                            >
                              {i?.first_name} {i?.last_name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {i?.phone_number}{" "}
                            <Link
                              onClick={() =>
                                handleWhatsAppClick(i?.phone_number)
                              }
                            >
                              <WhatsAppIcon />
                            </Link>
                          </TableCell>
                          <TableCell>
                            {moment(i?.last_sale_date).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>
                            <FormControl
                              sx={{ m: 1, minWidth: 120 }}
                              size="small"
                            >
                              <InputLabel id="demo-select-small">
                                Lead Status
                              </InputLabel>
                              <Select
                                variant="outlined"
                                labelId="demo-select-small"
                                id={`demo-select-${i.customer_id}`} // Unique ID for each select
                                value={
                                  selectedStatuses[i.customer_id] ||
                                  JSON.stringify({
                                    status:
                                      i?.retention_status || "not-connected",
                                    customerId: i?.customer_id,
                                  })
                                }
                                label="Lead Source"
                                onChange={(event) =>
                                  handleChange(event, i.customer_id)
                                } // Pass customerId
                                autoWidth={true}
                                MenuProps={MenuProps}
                              >
                                <MenuItem
                                  key="1"
                                  value={JSON.stringify({
                                    status: "not-connected",
                                    customerId: i?.customer_id,
                                  })}
                                >
                                  Not Connected
                                </MenuItem>
                                <MenuItem
                                  key="2"
                                  value={JSON.stringify({
                                    status: "prospective",
                                    customerId: i?.customer_id,
                                  })}
                                >
                                  Prospective
                                </MenuItem>
                                <MenuItem
                                  key="3"
                                  value={JSON.stringify({
                                    status: "appointment-booked",
                                    customerId: i?.customer_id,
                                  })}
                                >
                                  Appointment Booked
                                </MenuItem>
                                <MenuItem
                                  key="4"
                                  value={JSON.stringify({
                                    status: "lost",
                                    customerId: i?.customer_id,
                                  })}
                                >
                                  Lost
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextareaAutosize
                              style={{ width: "100%" }}
                              minRows={4}
                              placeholder="Enter Feedback"
                              defaultValue={i?.retention_feedback || undefined}
                              onBlur={(e) => {
                                handleFeedbackChange(e, i?.customer_id);
                              }}
                            />
                            <Button
                              className="btn btn-primary"
                              style={{ width: "100%" }}
                            >
                              Update Feedback
                            </Button>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>No Data Found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    sx={
                      item.selected
                        ? {
                            backgroundColor: "#262b40",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#262b40",
                              opacity: 0.9,
                            },
                          }
                        : {}
                    }
                    components={{
                      previous: () => (
                        <Button variant="primary">Previous</Button>
                      ),
                      next: () => <Button variant="primary">Next</Button>,
                    }}
                  />
                )}
              />
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

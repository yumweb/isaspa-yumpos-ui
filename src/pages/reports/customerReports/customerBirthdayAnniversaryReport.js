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
} from "@mui/material";
import moment from "moment-timezone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { MenuProps } from "../../../style/globalStyle";
import { Button } from "@themesberg/react-bootstrap";
import ReportSkeletonLoader from "../../../components/loader/reportSkeletonLoader";
import { useLocation } from "react-router-dom";

export const CustomerBirthdayAnniversaryReport = () => {
  const location = useLocation();
  const currentLocation = JSON.parse(
    window.localStorage.getItem("yumpos_location")
  );
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = React.useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [eventType, setEventType] = useState("");
  const [month, setMonth] = useState(moment().format("MM"));
  const [day, setDay] = useState(moment().format("DD"));

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
        90,
        { status: selectedValue }
      );
      if (res.success) {
        setData(res.retentionReport);
      }
      setFilterStatus(selectedValue);
      setPage(0);
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
        90,
        { year: selectedValue }
      );
      if (res.success) {
        setData(res.retentionReport);
      }
      setFilterYear(selectedValue);
      setPage(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async (page, eventType) => {
    setIsLoading(true);
    try {
      const res = await clientAdapterLegacy.getCustomerEventReport(
        currentLocation.locationId,
        day,
        month,
        parseInt(eventType),
        page * 20
      );
      console.log(res);
      // const res = await clientAdapterLegacy.getCustomerRetentionReport(
      //   currentLocation.locationId,
      //   90,
      //   { status: filterStatus, year: filterYear },
      //   page * 20
      // );
      if (res.success) {
        setData(res.webReport.summary);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");
    setEventType(type);
    fetchData(page, type);
  }, []);

  const header = [
    { title: "#", id: 1 },
    { title: "Customer Name", id: 2 },
    { title: "Phone", id: 3 },
    { title: "Birthday", id: 4 },
    { title: "Anniversary", id: 5 },
  ];

  const nextPage = () => {
    setPage(page + 1);
    fetchData(page + 1);
    window.scrollTo(0, 0);
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      fetchData(page - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {isLoading ? (
        <ReportSkeletonLoader />
      ) : (
        <>
          <hr />
          <Box display={"flex"} alignItems={"center"}>
            <ArrowBackIcon style={{ cursor: "pointer" }} />
            <Typography
              ml={2}
              fontSize={20}
              fontWeight={"bold"}
              style={{ textTransform: "capitalize" }}
            >
              Customer {eventType == 1 ? "Birthday's" : "Anniversary"} on{" "}
              {moment().format("DD-MM-YYYY")}
            </Typography>
          </Box>
          <Box mt={2}>
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
                          <TableCell>{x + 1}</TableCell>
                          <TableCell>{i?.customer_name}</TableCell>
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
                          <TableCell>{i?.birthday}</TableCell>
                          <TableCell>{i?.anniversary}</TableCell>
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
            <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
              <Button onClick={prevPage} style={{ marginRight: "20px" }}>
                Previous
              </Button>
              <Button onClick={nextPage}>Next</Button>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

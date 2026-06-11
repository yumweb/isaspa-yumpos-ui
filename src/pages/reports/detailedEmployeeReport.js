import React, { useEffect, useState } from "react";
import ReportSkeletonLoader from "../../components/loader/reportSkeletonLoader";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PrintIcon from "@mui/icons-material/Print";

import clientAdapter from "../../lib/clientAdapter";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Table } from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment-timezone";
import clientAdapterLegacy from "../../lib/clientAdapterLegacy";

const DetailedEmployeeReport = ({
  currentLocation,
  dateRange,
  onClickBack,
  employeeIds,
  employees,
}) => {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [reportRes, setReportRes] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [addIcon, setAddIcon] = useState(true);
  const [employeeTotals, setEmployeeTotals] = useState(null);
  const [amountTotal, setAmountTotal] = useState({
    netTotalServices: 0,
    netTotalProducts: 0,
    grossTotalServices: 0,
    grossTotalProducts: 0,
    totalRedemptions: 0,
  });

  const employeeMap = employees.map((employee) => ({
    id: employee.employeeId,
    name: employee.person?.firstName,
  }));

  const [errModal, setErrModal] = useState({
    open: false,
    message: "",
  });

  const inputFormat = "YYYY-MM-DDTHH:mm:ss.SSSZ";

  const header = [
    { title: "Sale Id", id: 1 },
    { title: "Date", id: 2 },
    { title: "Employee Name", id: 3 },
    { title: "Items Purchased", id: 4 },
    { title: "Total", id: 6 },
    { title: "Payment Type", id: 7 },
  ];

  const subHeader = [
    { title: "Name", id: 1 },
    { title: "Current Selling Price", id: 4 },
    { title: "Quantity Purchased", id: 5 },
    { title: "Discount", id: 9 },
  ];

  const nextPage = () => {
    setPage(page + 1);
    getReport(page + 1);
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
      getReport(page - 1);
    }
  };

  const getReport = async (page) => {
    setIsLoading(true);
    try {
      const res = await clientAdapterLegacy.getEmployeeSale(
        page * 20,
        moment(dateRange.startDate)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        moment(dateRange.endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        employeeIds
      );

      res.webReport.summary = res.webReport.summary.map((sale) => {
        return {
          ...sale,
          sale_time: moment(sale.sale_time).tz("Asia/Kolkata").format(),
        };
      });

      if (res) {
        setReportRes(res.webReport.summary);
        setEmployeeTotals(res.webReport.employeeTotal);
      } else {
        setReportRes(null);
      }

      // if (res) {
      //   setAmountTotal({
      //     netTotalServices: res.overallNetTotalServices,
      //     netTotalProducts: res.overallNetTotalProducts,
      //     grossTotalServices: res.overallGrossTotalServices,
      //     grossTotalProducts: res.overallGrossTotalProducts,
      //     totalRedemptions: res.overallTotalRedemptions,
      //   });
      // }

      if (res.statusCode >= 400) {
        setErrModal({
          ...errModal,
          open: true,
          message: res.message,
        });
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setReportRes(null);
    }
  };

  const handleErrModalClose = () => {
    setErrModal({ ...errModal, open: false });
  };

  useEffect(() => {
    getReport(0);
  }, [dateRange]);

  const handleExpand = (index) => {
    setAddIcon(!addIcon);
    setExpandedRows((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  };

  return (
    <div>
      {isLoading ? (
        <ReportSkeletonLoader />
      ) : (
        <>
          <hr />
          <Box>
            <Box display={"flex"} alignItems={"center"}>
              <ArrowBackIcon
                style={{ cursor: "pointer" }}
                onClick={onClickBack}
              />
              <Typography ml={2} fontSize={20} fontWeight={"bold"}>
                Detailed Employee Report{" "}
                <Typography variant="span" fontSize={14}>
                  {" "}
                  {`(${moment(dateRange.startDate).format("DD-MM-YYYY")} -
                ${moment(dateRange.endDate).format("DD-MM-YYYY")})`}
                </Typography>
              </Typography>
            </Box>
            <Grid mt={1} container spacing={2}>
              {employeeTotals &&
                employeeTotals.map((emp, index) => {
                  const nameSplit = emp.employee_name.split("<br>");
                  const employeeName = nameSplit[0];
                  const tax = nameSplit[1]?.replace("Tax: Rs.", "") || "N/A";
                  const grossTotal =
                    nameSplit[2]?.replace("Gross Total: Rs.", "") || "N/A";
                  const netServiceSale =
                    nameSplit[3]?.replace("Net Service Sale: Rs.", "") || "N/A";
                  const netRetailSale =
                    nameSplit[4]?.replace("Net Retail Sale: Rs.", "") || "N/A";

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Box
                        px={2}
                        py={2}
                        sx={{
                          width: "100%",
                          background: "lightBlue",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography fontSize={14} color={"#111"}>
                          Employee Name: {employeeName || "N/A"}
                        </Typography>
                        <Typography fontSize={14} color={"#111"}>
                          Net Employee Total: Rs. {emp.employee_total || "N/A"}
                        </Typography>
                        <Typography fontSize={14} color={"#111"}>
                          Net Service Sale: Rs. {netServiceSale}
                        </Typography>
                        <Typography fontSize={14} color={"#111"}>
                          Net Retail Sale: Rs. {netRetailSale}
                        </Typography>
                        <Typography fontSize={14} color={"#111"}>
                          Tax: Rs. {tax}
                        </Typography>
                        <Typography fontSize={14} color={"#111"}>
                          Gross Total: Rs. {grossTotal}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
            </Grid>
          </Box>
          <Box mt={2}>
            <Table aria-label="simple table" bordered>
              <TableHead>
                <TableRow>
                  {/* <TableCell>
                    <IconButton onClick={() => handleExpand("header")}>
                      {addIcon ? <AddIcon /> : <RemoveIcon />}
                    </IconButton>
                  </TableCell> */}
                  {header.map((h) => (
                    <TableCell scope="col" key={h.id}>
                      {h.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportRes?.length ? (
                  <>
                    {reportRes?.map((i, x) => (
                      <React.Fragment key={x}>
                        <TableRow key={x}>
                          {/* <TableCell>
                            <IconButton onClick={() => handleExpand(x)}>
                              {expandedRows[x] ? <RemoveIcon /> : <AddIcon />}
                            </IconButton>
                          </TableCell> */}
                          <TableCell>
                            {/* <PrintIcon
                              color="primary"
                              sx={{ cursor: "pointer" }}
                              onClick={() =>
                                window.open(
                                  `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${currentLocation.locationId}/${i?.sale_id}`,
                                  "_blank"
                                )
                              }
                            />&nbsp; */}
                            {i?.sale_location_id}
                          </TableCell>
                          <TableCell>
                            {moment(i?.sale_time).format("DD-MM-YYYY") || "N/A"}
                          </TableCell>
                          <TableCell>{i?.employee_name || "N/A"}</TableCell>

                          <TableCell>{i?.items_purchased || "N/A"}</TableCell>

                          <TableCell>
                            Rs. {Number(i?.employee_total).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {i?.payment_type?.split(":")[0] || "N/A"}
                          </TableCell>
                          {/* <TableCell>{i?.comment || "N/A"}</TableCell> */}
                        </TableRow>
                        {expandedRows[x] && (
                          <TableRow>
                            <TableCell colSpan={9}>
                              <Table bordered>
                                <TableHead>
                                  <TableRow>
                                    {subHeader.map((he) => (
                                      <TableCell scope="col" key={he.id}>
                                        {he.title}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {reportRes?.detail
                                    ?.filter((it) => it.sale_id === i.sale_id)
                                    ?.map((sd, y) => (
                                      <TableRow key={y}>
                                        <TableCell>
                                          {sd?.name || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {Number(sd?.item_unit_price)?.toFixed(
                                            2
                                          ) || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {Number(
                                            sd?.quantity_purchased
                                          ).toFixed() || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {Number(
                                            sd?.discount_percent
                                          )?.toFixed(2) || "N/A"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No Data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
              <Button onClick={prevPage}>previous</Button>
              <Button onClick={nextPage}>Next</Button>
            </Box>
          </Box>
        </>
      )}
      <Dialog
        open={errModal.open}
        onClose={handleErrModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{errModal.message}</DialogTitle>
        <DialogActions>
          <Button onClick={handleErrModalClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DetailedEmployeeReport;

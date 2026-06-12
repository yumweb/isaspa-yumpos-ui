import React, { useEffect, useState } from "react";
import ReportSkeletonLoader from "../../components/loader/reportSkeletonLoader";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
import {
  Table,
  Modal,
  FormControl,
  FormGroup,
  InputGroup,
} from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment-timezone";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import clientAdapterLegacy from "../../lib/clientAdapterLegacy";

const DetailedSaleReport = ({
  selectedLocations,
  currentLocation,
  dateRange,
  onClickBack,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [expandedData, setExpandedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [reportRes, setReportRes] = useState(null);
  const [boxData, setBoxData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const inputFormat = "YYYY-MM-DDTHH:mm:ss.SSSZ";
  const [errModal, setErrModal] = useState({
    open: false,
    message: "",
  });
  const [otpModal, setOtpModal] = useState({
    open: false,
    redactedEmail: "",
    otp: "",
    pendingAction: null,
    sending: false,
    verifying: false,
  });
  const header = [
    { title: "", id: 1 },
    { title: "Sale Id", id: 2 },
    { title: "Date", id: 3 },
    { title: "Items Purchased", id: 4 },
    { title: "Customer Name", id: 5 },
    { title: "Frequency", id: 6 },
    { title: "Total", id: 7 },
    { title: "Payment Type", id: 8 },
    { title: "Comments", id: 9 },
    { title: "Actions", id: 10 },
  ];
  const subHeader = [
    { title: "Name", id: 1 },
    { title: "Category", id: 2 },
    { title: "Service By", id: 3 },
    // { title: "Current Selling Price", id: 4 },
    { title: "Quantity Purchased	", id: 5 },
    // { title: "Subtotal", id: 6 },
    // { title: "Tax", id: 7 },
    // { title: "Total", id: 8 },
    // { title: "Discount (%)", id: 9 },
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
      const res = await clientAdapterLegacy.getSale(
        selectedLocations,
        page * 20,
        moment(dateRange.startDate)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        moment(dateRange.endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
      );

      res.webReport.summary = res.webReport.summary.map((sale) => {
        return {
          ...sale,
          sale_time: moment(sale.sale_time).tz("Asia/Kolkata").format(),
        };
      });
      res.webReport.detail = res.webReport.detail.map((sale) => {
        return {
          ...sale,
          sale_time: moment(sale.sale_time).tz("Asia/Kolkata").format(),
        };
      });

      if (res.webReport.summary) {
        setReportRes(res.webReport.summary);
        setBoxData(res.webReport.saleTotalBoxes);
      }

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
    }
  };

  // const updateBoxData = (boxData) => {
  //   const totalSalesService =
  //     Number(boxData.total_sales).toFixed(2) -
  //     Number(boxData.total_product_sales).toFixed(2);
  //   const NewBoxes = [
  //     {
  //       id: 1,
  //       title: "Gross Total",
  //       subtitle: "(With Redemption)",
  //       value: `Rs.${Number(boxData.total_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 2,
  //       title: "Gross Total",
  //       subtitle: "(Exc. Redemption)",
  //       value: `Rs.${Number(boxData.total_sales_excluding_redemptions).toFixed(
  //         2
  //       )}`,
  //     },
  //     {
  //       id: 3,
  //       title: "Gross Service Sale",
  //       subtitle: "(Exc. Redemption)",
  //       value: `Rs.${totalSalesService}`,
  //     },
  //     {
  //       id: 4,
  //       title: "Gross Retail Sale",
  //       subtitle: "(Exc. Redemption)",
  //       value: `Rs.${Number(boxData.total_product_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 5,
  //       title: "Cash",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_cash_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 6,
  //       title: "Debit Card",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_debit_card_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 7,
  //       title: "Paytm",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_paytm_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 8,
  //       title: "PhonePe",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_phonepe_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 9,
  //       title: "Google Pay",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_google_pay_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 10,
  //       title: "Deal Site Earnings",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_deal_site_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 11,
  //       title: "Family Card Redemption",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_family_card_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 12,
  //       title: "Gift Card Redemption",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_gift_card_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 13,
  //       title: "Debit Card",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_credit_card_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 14,
  //       title: "Coupon Redemption",
  //       subtitle: "",
  //       value: `Rs.${Number(boxData.total_coupon_sales).toFixed(2)}`,
  //     },
  //     {
  //       id: 15,
  //       title: "Male Walkins",
  //       subtitle: "",
  //       value: boxData.total_male_customers,
  //     },
  //     {
  //       id: 16,
  //       title: "Female Walkins",
  //       subtitle: "",
  //       value: boxData.total_female_customers,
  //     },
  //   ];

  //   setBoxData(NewBoxes);
  // };

  useEffect(() => {
    getReport(0);
  }, [dateRange]);

  useEffect(() => {
    const initialExpandedRows = {};
    reportRes?.summary?.forEach((_, index) => {
      initialExpandedRows[index] = false;
    });
    setExpandedRows(initialExpandedRows);
  }, [reportRes]);

  const handleExpandAll = () => {
    const allExpanded = Object.values(expandedRows).every((row) => row);
    const updatedExpandedRows = {};

    for (const key in expandedRows) {
      updatedExpandedRows[key] = !allExpanded;
    }

    setExpandedRows(updatedExpandedRows);
  };

  const handleExpand = async (index, saleId) => {
    // If the data is already fetched, toggle the row expansion
    if (expandedRows[index]) {
      setExpandedRows((prevExpanded) => ({
        ...prevExpanded,
        [index]: !prevExpanded[index],
      }));
      return;
    }

    // If data is not fetched, make API call
    try {
      const res = await clientAdapter.getSaleDetails(saleId); // Call your API with saleId
      // The /sales/:id/details endpoint returns the sale with a `saleItems`
      // array (not a pre-shaped `saleDetail`).
      setExpandedData((prevData) => ({
        ...prevData,
        [saleId]: res.saleItems || [],
      }));

      // Expand the row after data is fetched
      setExpandedRows((prevExpanded) => ({
        ...prevExpanded,
        [index]: true,
      }));
    } catch (error) {
      console.error("Failed to fetch sale details", error);
    }
  };

  const renderExpandIcon = (index) => {
    const allExpanded = Object.values(expandedRows).every((row) => row);
    return (
      <IconButton onClick={() => handleExpand(index)}>
        {allExpanded ? <RemoveIcon /> : <AddIcon />}
      </IconButton>
    );
  };

  const handleErrModalClose = () => {
    setErrModal({ ...errModal, open: false });
  };

  const deleteSale = async (saleId) => {
    const c = window.confirm("Are you sure you want to delete this sale?");
    if (!c) return;
    try {
      await clientAdapter.deleteSale(saleId);
      alert("Sale deleted successfully");
      getReport(page);
    } catch (e) {
      alert("Failed to delete sale");
    }
  };

  const initiateSaleAction = async (type, saleId) => {
    setOtpModal({
      open: true,
      redactedEmail: "",
      otp: "",
      pendingAction: { type, saleId },
      sending: true,
      verifying: false,
    });
    try {
      const res = await clientAdapter.sendSaleActionOtp();
      setOtpModal((prev) => ({
        ...prev,
        redactedEmail: res?.redactedEmail || "",
        sending: false,
      }));
    } catch (e) {
      setOtpModal((prev) => ({ ...prev, sending: false }));
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpVerify = async () => {
    if (!otpModal.otp) {
      alert("Please enter OTP");
      return;
    }
    setOtpModal((prev) => ({ ...prev, verifying: true }));
    try {
      const res = await clientAdapter.verifySaleActionOtp(otpModal.otp);
      if (!res?.valid) {
        alert("Invalid OTP");
        setOtpModal((prev) => ({ ...prev, verifying: false }));
        return;
      }
      const action = otpModal.pendingAction;
      setOtpModal({
        open: false,
        redactedEmail: "",
        otp: "",
        pendingAction: null,
        sending: false,
        verifying: false,
      });
      if (action?.type === "edit") {
        navigate(`/sales?sale=edit&saleId=${action.saleId}`);
      } else if (action?.type === "delete") {
        deleteSale(action.saleId);
      }
    } catch (e) {
      setOtpModal((prev) => ({ ...prev, verifying: false }));
      alert("Failed to verify OTP");
    }
  };

  const closeOtpModal = () => {
    setOtpModal({
      open: false,
      redactedEmail: "",
      otp: "",
      pendingAction: null,
      sending: false,
      verifying: false,
    });
  };

  return (
    <div>
      {isLoading ? (
        <ReportSkeletonLoader />
      ) : (
        <>
          <Box>
            <Box display={"flex"} alignItems={"center"}>
              <ArrowBackIcon
                style={{ cursor: "pointer" }}
                onClick={onClickBack}
              />
              <Typography ml={2} fontSize={20} fontWeight={"bold"}>
                Detailed Sales Report{" "}
                <Typography variant="span" fontSize={14}>
                  {" "}
                  {`(${moment(dateRange.startDate).format("DD-MM-YYYY")} -
                ${moment(dateRange.endDate).format("DD-MM-YYYY")})`}
                </Typography>
              </Typography>
            </Box>
            <Grid mt={1} container spacing={2}>
              {boxData.map((b, x) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={x}>
                  <Box
                    px={2}
                    py={2}
                    height={100}
                    sx={{
                      width: "100%",
                      background: "lightBlue",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography color={"#111"} fontWeight={"bold"}>
                      {b.currency
                        ? `${Number(b?.value).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                            style: "currency",
                            currency: "INR",
                          })}`
                        : b?.value}
                    </Typography>
                    <Typography fontSize={14} color={"#111"}>
                      {b.label.split("<br>")[0]}
                    </Typography>
                    <Typography fontSize={14} color={"#111"}>
                      {
                        b.label
                          .split("<br>")[1]
                          ?.split("<small>")[1]
                          ?.split("</small>")[0]
                      }
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box mt={2}>
            <Table aria-label="simple table" bordered>
              <TableHead>
                <TableRow>
                  {/* <TableCell>
                    {" "}
                    <IconButton onClick={handleExpandAll}>
                      {renderExpandIcon("header")}
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
                          <TableCell>
                            <IconButton
                              onClick={() => handleExpand(x, i.sale_id)}
                            >
                              {expandedRows[x] ? <RemoveIcon /> : <AddIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <PrintIcon
                              color="primary"
                              sx={{ cursor: "pointer" }}
                              onClick={() =>
                                window.open(
                                  `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${currentLocation.locationId}/${i?.sale_id}`,
                                  "_blank",
                                )
                              }
                            />
                            &nbsp;{i?.sale_location_id}
                          </TableCell>
                          <TableCell>
                            {moment(
                              moment.utc(i?.sale_time, inputFormat),
                            ).format("DD-MM-YYYY hh:mm A")}
                          </TableCell>
                          <TableCell>{i?.items_purchased}</TableCell>
                          <TableCell>{i?.customer_name}</TableCell>
                          <TableCell>{i?.freq}</TableCell>
                          <TableCell>
                            {Number(i?.total)?.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                              style: "currency",
                              currency: "INR",
                            })}
                          </TableCell>
                          <TableCell>
                            {i?.payment_type?.split("<br />").map((p) => {
                              return (
                                <span
                                  key={p}
                                  dangerouslySetInnerHTML={{
                                    __html: `${p?.split(":")[0]}${
                                      p?.split(":")[1]
                                        ? `: ${Number(
                                            p
                                              ?.split(":")[1]
                                              ?.replace("Rs. ", ""),
                                          ).toLocaleString("en-IN", {
                                            maximumFractionDigits: 2,
                                            style: "currency",
                                            currency: "INR",
                                          })}<br />`
                                        : ""
                                    }`,
                                  }}
                                ></span>
                              );
                            })}
                          </TableCell>
                          <TableCell>{i?.comment}</TableCell>
                          <TableCell>
                            <EditIcon
                              sx={{
                                cursor: "pointer",
                                color: "blue",
                                marginRight: 1,
                              }}
                              onClick={() =>
                                initiateSaleAction("edit", i.sale_id)
                              }
                            />
                            <DeleteIcon
                              sx={{ cursor: "pointer", color: "red" }}
                              onClick={() =>
                                initiateSaleAction("delete", i.sale_id)
                              }
                            />
                          </TableCell>
                        </TableRow>
                        {expandedRows[x] && (
                          <TableRow>
                            <TableCell colSpan={10}>
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
                                  {/* Check if expanded data exists for the sale_id */}
                                  {expandedData[i.sale_id]?.map((sd, y) => (
                                    <TableRow key={y}>
                                      <TableCell>
                                        {sd?.item?.name || sd?.item_name}
                                      </TableCell>
                                      <TableCell>
                                        {sd?.item?.category?.name ||
                                          sd?.category ||
                                          "—"}
                                      </TableCell>
                                      <TableCell>
                                        {sd?.serviceEmployee?.firstName ||
                                          sd?.technician_name?.firstName ||
                                          "N/A"}
                                      </TableCell>
                                      {/* <TableCell>
                                        {Number(sd?.item_unit_price)?.toFixed(
                                          2
                                        )}
                                      </TableCell> */}
                                      <TableCell>
                                        {Number(
                                          sd?.quantityPurchased ??
                                            sd?.quantity_purchased
                                        )}
                                      </TableCell>
                                      {/* <TableCell>
                                        {Number(sd?.subtotal)?.toFixed(2)}
                                      </TableCell> */}
                                      {/* <TableCell>
                                        {Number(sd?.tax)?.toFixed(2)}
                                      </TableCell> */}
                                      {/* <TableCell>
                                        {Number(sd?.total)?.toFixed(2)}
                                      </TableCell> */}
                                      {/* <TableCell>
                                        {Number(sd?.discount_percent)?.toFixed(
                                          2
                                        )}
                                      </TableCell> */}
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
                    <TableCell colSpan={10}>No Data Found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
              <Button onClick={prevPage}>previous</Button>
              <Button onClick={nextPage}>Next</Button>
            </Box>
          </Box>

          <Modal show={otpModal.open} onHide={closeOtpModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {otpModal.pendingAction?.type === "delete"
                  ? "OTP to Delete Sale"
                  : "OTP to Edit Sale"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {otpModal.sending ? (
                <Typography>Sending OTP…</Typography>
              ) : (
                <>
                  <Typography mb={2} fontSize={14}>
                    An OTP has been sent to{" "}
                    <strong>{otpModal.redactedEmail || "the admin email"}</strong>
                    . Contact the admin to get the OTP. It is valid for 3 hours
                    and can be reused within that window.
                  </Typography>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Text>OTP</InputGroup.Text>
                      <FormControl
                        type="text"
                        placeholder="Enter 4-digit OTP"
                        value={otpModal.otp}
                        onChange={(e) =>
                          setOtpModal((prev) => ({
                            ...prev,
                            otp: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={closeOtpModal} disabled={otpModal.verifying}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleOtpVerify}
                disabled={otpModal.sending || otpModal.verifying}
              >
                {otpModal.verifying ? "Verifying…" : "Verify"}
              </Button>
            </Modal.Footer>
          </Modal>

          <Dialog
            open={errModal.open}
            onClose={handleErrModalClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {errModal.message}
            </DialogTitle>
            <DialogActions
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "15px",
              }}
            >
              <Button
                style={{
                  color: "white",
                  borderRadius: "4px",
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "black",
                  },
                }}
                onClick={onClickBack}
              >
                Go Back
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default DetailedSaleReport;

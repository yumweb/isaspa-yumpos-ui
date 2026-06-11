import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  Backdrop,
  Typography,
  Alert,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fixedDateRange } from "../../data/reports";
import moment from "moment";
import clientAdapter from "../../lib/clientAdapter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BounceBackReport = ({ onClickBack }) => {
  const [loading, setLoading] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState(6); // Default to This Month
  const [reportView, setReportView] = useState("issuance"); // "issuance" or "redemption"
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD"),
  });

  const [summary, setSummary] = useState({
    totalIssued: 0,
    totalRedeemed: 0,
    totalExpired: 0,
    redemptionRate: 0,
    totalDiscountValue: 0,
    avgDaysToRedemption: null,
  });

  const [reportData, setReportData] = useState([]);
  const [dailyCounts, setDailyCounts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedDateOption(selectedOption);

    let newDateRange = { ...dateRange };

    switch (selectedOption) {
      case 1:
        newDateRange = {
          startDate: moment().format("YYYY-MM-DD"),
          endDate: moment().format("YYYY-MM-DD"),
        };
        break;
      case 2:
        newDateRange = {
          startDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
          endDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
        };
        break;
      case 3:
        newDateRange = {
          startDate: moment().subtract(7, "day").format("YYYY-MM-DD"),
          endDate: moment().subtract(1, "day").format("YYYY-MM-DD"),
        };
        break;
      case 4:
        newDateRange = {
          startDate: moment().startOf("week").format("YYYY-MM-DD"),
          endDate: moment().endOf("week").format("YYYY-MM-DD"),
        };
        break;
      case 5:
        newDateRange = {
          startDate: moment().subtract(1, "week").startOf("week").format("YYYY-MM-DD"),
          endDate: moment().subtract(1, "week").endOf("week").format("YYYY-MM-DD"),
        };
        break;
      case 6:
        newDateRange = {
          startDate: moment().startOf("month").format("YYYY-MM-DD"),
          endDate: moment().endOf("month").format("YYYY-MM-DD"),
        };
        break;
      case 7:
        newDateRange = {
          startDate: moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
          endDate: moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
        };
        break;
      case 8:
        newDateRange = {
          startDate: moment().startOf("year").format("YYYY-MM-DD"),
          endDate: moment().endOf("year").format("YYYY-MM-DD"),
        };
        break;
      default:
        break;
    }

    setDateRange(newDateRange);
  };

  const onChangeStartDate = (event) => {
    setDateRange({
      ...dateRange,
      startDate: event.target.value,
    });
  };

  const onChangeEndDate = (event) => {
    setDateRange({
      ...dateRange,
      endDate: event.target.value,
    });
  };

  const fetchSummary = async () => {
    try {
      const data = await clientAdapter.getBounceBackSummary();
      if (data && typeof data === "object") {
        setSummary(data);
      }
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let data;
      if (reportView === "issuance") {
        data = await clientAdapter.getBounceBackIssuance(
          dateRange.startDate,
          dateRange.endDate,
          page + 1,
          rowsPerPage
        );
      } else {
        data = await clientAdapter.getBounceBackRedemption(
          dateRange.startDate,
          dateRange.endDate
        );
      }

      // Handle paginated response for issuance
      if (data && data.data) {
        setReportData(data.data);
        setTotalRecords(data.total || 0);
      } else {
        setReportData(Array.isArray(data) ? data : []);
        setTotalRecords(Array.isArray(data) ? data.length : 0);
      }

      // Also fetch daily counts for chart
      const counts = await clientAdapter.getBounceBackDailyCounts(
        dateRange.startDate,
        dateRange.endDate
      );
      // Ensure counts is an array
      setDailyCounts(Array.isArray(counts) ? counts : []);
    } catch (err) {
      console.error("Failed to fetch report data:", err);
      setReportData([]);
      setDailyCounts([]);
      setTotalRecords(0);
      setSnackBar({
        open: true,
        severity: "error",
        message: "Failed to fetch report data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setReportView(newView);
    }
  };

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const getStatusChip = (status) => {
    const config = {
      pending: { color: "warning", label: "Pending" },
      redeemed: { color: "success", label: "Redeemed" },
      expired: { color: "error", label: "Expired" },
    };
    const { color, label } = config[status] || { color: "default", label: status };
    return <Chip label={label} color={color} size="small" />;
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportView, page, rowsPerPage]);

  // Reset page when date range or view changes
  useEffect(() => {
    setPage(0);
  }, [dateRange, reportView]);

  return (
    <>
      <Accordion expanded>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Box display={"flex"} alignItems={"center"}>
            <ArrowBackIcon
              style={{ cursor: "pointer" }}
              onClick={onClickBack}
            />
            <Typography ml={2} fontSize={20} fontWeight={"bold"}>
              New Customer Bounce Back Coupon Report
            </Typography>
          </Box>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Container
            style={{
              backgroundColor: "white",
              paddingTop: "25px",
              borderRadius: "3px",
            }}
          >
            {/* Summary Cards */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ bgcolor: "#e3f2fd" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Issued
                    </Typography>
                    <Typography variant="h4">{summary.totalIssued}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ bgcolor: "#e8f5e9" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Redeemed
                    </Typography>
                    <Typography variant="h4">{summary.totalRedeemed}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ bgcolor: "#ffebee" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Expired
                    </Typography>
                    <Typography variant="h4">{summary.totalExpired}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ bgcolor: "#fff3e0" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Redemption Rate
                    </Typography>
                    <Typography variant="h4">{summary.redemptionRate}%</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ bgcolor: "#f3e5f5" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Discount Given
                    </Typography>
                    <Typography variant="h5">Rs. {summary.totalDiscountValue}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Card sx={{ bgcolor: "#e0f7fa" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Avg Days to Redeem
                    </Typography>
                    <Typography variant="h4">
                      {summary.avgDaysToRedemption ?? "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Date Filter */}
            <Grid container spacing={2} alignItems="center" mb={3}>
              <Grid item xs={12} sm={2}>
                <Typography>Date Range:</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <Select
                    value={selectedDateOption}
                    size="small"
                    onChange={handleChange}
                  >
                    {fixedDateRange.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.duration}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {(selectedDateOption === 9 || selectedDateOption === 10) && (
                <>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      size="small"
                      type="date"
                      fullWidth
                      value={dateRange.startDate}
                      onChange={onChangeStartDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <Typography align="center">to</Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      size="small"
                      type="date"
                      fullWidth
                      value={dateRange.endDate}
                      onChange={onChangeEndDate}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={4}>
                <ToggleButtonGroup
                  value={reportView}
                  exclusive
                  onChange={handleViewChange}
                  size="small"
                >
                  <ToggleButton value="issuance">Issuance</ToggleButton>
                  <ToggleButton value="redemption">Redemption</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>

            {/* Chart */}
            {dailyCounts.length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" mb={2}>
                  Daily Issuance
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={dailyCounts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => moment(date).format("MMM D")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => moment(date).format("MMM D, YYYY")}
                    />
                    <Bar dataKey="count" fill="#ff9800" name="Coupons Issued" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Data Table */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Coupon Code</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Valid Until</TableCell>
                    {reportView === "redemption" && (
                      <>
                        <TableCell>Redeemed On</TableCell>
                        <TableCell>Days to Redeem</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={reportView === "redemption" ? 8 : 6} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : reportData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={reportView === "redemption" ? 8 : 6} align="center">
                        No data found for the selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          {moment(row.createdAt).format("DD MMM YYYY")}
                        </TableCell>
                        <TableCell>{row.customerName}</TableCell>
                        <TableCell>{row.customerPhone}</TableCell>
                        <TableCell>
                          <strong>{row.couponNumber}</strong>
                        </TableCell>
                        <TableCell>{getStatusChip(row.status)}</TableCell>
                        <TableCell>
                          {moment(row.validityDate).format("DD MMM YYYY")}
                        </TableCell>
                        {reportView === "redemption" && (
                          <>
                            <TableCell>
                              {row.redeemedAt
                                ? moment(row.redeemedAt).format("DD MMM YYYY")
                                : "-"}
                            </TableCell>
                            <TableCell>{row.daysToRedemption ?? "-"}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Container>
        </AccordionDetails>
      </Accordion>

      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackBar.severity}
          onClose={handleSnackbarClose}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default BounceBackReport;

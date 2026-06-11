import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Box,
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
  Legend,
} from "recharts";

const FirstVisitReport = ({ onClickBack }) => {
  const [loading, setLoading] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState(6); // Default to This Month
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
    totalFirstVisits: 0,
    bounceBackIssuedCount: 0,
    bounceBackNotIssuedCount: 0,
    issuanceRate: 0,
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

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [reportResult, summaryResult, countsResult] = await Promise.all([
        clientAdapter.getFirstVisitReport(dateRange.startDate, dateRange.endDate, page + 1, rowsPerPage),
        clientAdapter.getFirstVisitSummary(dateRange.startDate, dateRange.endDate),
        clientAdapter.getFirstVisitDailyCounts(dateRange.startDate, dateRange.endDate),
      ]);

      // Handle paginated response
      if (reportResult && reportResult.data) {
        setReportData(reportResult.data);
        setTotalRecords(reportResult.total || 0);
      } else {
        setReportData(Array.isArray(reportResult) ? reportResult : []);
        setTotalRecords(0);
      }

      if (summaryResult && typeof summaryResult === "object") {
        setSummary(summaryResult);
      }

      setDailyCounts(Array.isArray(countsResult) ? countsResult : []);
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

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const getBounceBackChip = (issued, status) => {
    if (!issued) {
      return <Chip label="Not Issued" color="default" size="small" variant="outlined" />;
    }

    const config = {
      pending: { color: "warning", label: "Issued - Pending" },
      redeemed: { color: "success", label: "Issued - Redeemed" },
      expired: { color: "error", label: "Issued - Expired" },
    };
    const { color, label } = config[status] || { color: "info", label: "Issued" };
    return <Chip label={label} color={color} size="small" />;
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange, page, rowsPerPage]);

  // Reset page when date range changes
  useEffect(() => {
    setPage(0);
  }, [dateRange]);

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
              First Visit Report
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
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "#e3f2fd" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total First Visits
                    </Typography>
                    <Typography variant="h4">{summary.totalFirstVisits}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "#e8f5e9" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Bounce Back Issued
                    </Typography>
                    <Typography variant="h4">{summary.bounceBackIssuedCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "#fff3e0" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Not Issued
                    </Typography>
                    <Typography variant="h4">{summary.bounceBackNotIssuedCount}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "#f3e5f5" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Issuance Rate
                    </Typography>
                    <Typography variant="h4">{summary.issuanceRate}%</Typography>
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
              <Grid item xs={12} sm={3}>
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
            </Grid>

            {/* Chart */}
            {dailyCounts.length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" mb={2}>
                  Daily First Visits
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
                    <Legend />
                    <Bar dataKey="total" fill="#2196f3" name="Total First Visits" />
                    <Bar dataKey="withBounceBack" fill="#4caf50" name="With Bounce Back" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Data Table */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell>First Visit Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Sale ID</TableCell>
                    <TableCell align="right">Sale Total</TableCell>
                    <TableCell>Served By</TableCell>
                    <TableCell>Bounce Back Status</TableCell>
                    <TableCell>Coupon Code</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : reportData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No first visits found for the selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportData.map((row) => (
                      <TableRow key={row.saleId}>
                        <TableCell>
                          {moment(row.firstVisitDate).format("DD MMM YYYY")}
                        </TableCell>
                        <TableCell>{row.customerName}</TableCell>
                        <TableCell>{row.customerPhone}</TableCell>
                        <TableCell>{row.saleId}</TableCell>
                        <TableCell align="right">
                          Rs. {row.saleTotal?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell>{row.employeeName}</TableCell>
                        <TableCell>
                          {getBounceBackChip(row.bounceBackIssued, row.bounceBackCouponStatus)}
                        </TableCell>
                        <TableCell>
                          {row.bounceBackCouponNumber || "-"}
                        </TableCell>
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

export default FirstVisitReport;

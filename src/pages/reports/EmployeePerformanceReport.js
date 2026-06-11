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
  Snackbar,
  Backdrop,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import clientAdapter from "../../lib/clientAdapter";

const EmployeePerformanceReport = ({ onClickBack }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [reportData, setReportData] = useState([]);
  const [editedTargets, setEditedTargets] = useState({});
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 6 }, (_, i) => moment().year() - i + 1);

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientAdapter.getEmployeePerformance(
        selectedMonth,
        selectedYear
      );
      setReportData(Array.isArray(data) ? data : []);
      setEditedTargets({});
    } catch (err) {
      console.error("Failed to fetch report data:", err);
      setReportData([]);
      setSnackBar({
        open: true,
        severity: "error",
        message: "Failed to fetch report data",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleTargetChange = (employeeId, field, value) => {
    const numValue = parseFloat(value) || 0;
    setEditedTargets((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: numValue,
      },
    }));
  };

  const getTargetValue = (row, field) => {
    if (editedTargets[row.employeeId]?.[field] !== undefined) {
      return editedTargets[row.employeeId][field];
    }
    return row[field];
  };

  const hasUnsavedChanges = () => {
    return Object.keys(editedTargets).length > 0;
  };

  const handleSaveTargets = async () => {
    if (!hasUnsavedChanges()) {
      setSnackBar({
        open: true,
        severity: "info",
        message: "No changes to save",
      });
      return;
    }

    setSaving(true);
    try {
      const savePromises = Object.entries(editedTargets).map(
        ([employeeId, targets]) => {
          const row = reportData.find((r) => r.employeeId === parseInt(employeeId));
          return clientAdapter.saveEmployeeTarget(
            parseInt(employeeId),
            selectedMonth,
            selectedYear,
            targets.serviceTarget ?? row.serviceTarget,
            targets.retailTarget ?? row.retailTarget
          );
        }
      );

      await Promise.all(savePromises);
      setSnackBar({
        open: true,
        severity: "success",
        message: "Targets saved successfully",
      });
      fetchReportData();
    } catch (err) {
      console.error("Failed to save targets:", err);
      setSnackBar({
        open: true,
        severity: "error",
        message: "Failed to save targets",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const AchievementIndicator = ({ achieved, mtdTarget }) => {
    if (mtdTarget === 0) return null;
    const isAhead = achieved >= mtdTarget;
    return (
      <span
        style={{
          color: isAhead ? "#4caf50" : "#f44336",
          marginLeft: 4,
          fontWeight: "bold",
        }}
      >
        {isAhead ? "▲" : "▼"}
      </span>
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

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
              Employee Performance Report
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
            {/* Month/Year Filter */}
            <Grid container spacing={2} alignItems="center" mb={3}>
              <Grid item xs={12} sm={1.5}>
                <Typography>Month:</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <Select
                    value={selectedMonth}
                    size="small"
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Typography>Year:</Typography>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <Select
                    value={selectedYear}
                    size="small"
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveTargets}
                  disabled={saving || !hasUnsavedChanges()}
                >
                  {saving ? "Saving..." : "Save Targets"}
                </Button>
              </Grid>
            </Grid>

            {/* Data Table */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell
                      rowSpan={2}
                      sx={{ borderRight: "1px solid #e0e0e0", fontWeight: "bold" }}
                    >
                      Employee Name
                    </TableCell>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{
                        borderRight: "1px solid #e0e0e0",
                        fontWeight: "bold",
                        bgcolor: "#e3f2fd",
                      }}
                    >
                      SERVICE
                    </TableCell>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ fontWeight: "bold", bgcolor: "#fff3e0" }}
                    >
                      RETAIL
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell
                      align="right"
                      sx={{ bgcolor: "#e3f2fd", minWidth: 100 }}
                    >
                      Month Target
                    </TableCell>
                    <TableCell align="right" sx={{ bgcolor: "#e3f2fd" }}>
                      MTD Target
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ borderRight: "1px solid #e0e0e0", bgcolor: "#e3f2fd" }}
                    >
                      MTD Achieved
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ bgcolor: "#fff3e0", minWidth: 100 }}
                    >
                      Month Target
                    </TableCell>
                    <TableCell align="right" sx={{ bgcolor: "#fff3e0" }}>
                      MTD Target
                    </TableCell>
                    <TableCell align="right" sx={{ bgcolor: "#fff3e0" }}>
                      MTD Achieved
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : reportData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportData.map((row) => (
                      <TableRow key={row.employeeId} hover>
                        <TableCell sx={{ borderRight: "1px solid #e0e0e0" }}>
                          {row.employeeName}
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            size="small"
                            type="number"
                            value={getTargetValue(row, "serviceTarget")}
                            onChange={(e) =>
                              handleTargetChange(
                                row.employeeId,
                                "serviceTarget",
                                e.target.value
                              )
                            }
                            inputProps={{
                              min: 0,
                              style: { textAlign: "right", width: 80 },
                            }}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(row.serviceMtdTarget)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ borderRight: "1px solid #e0e0e0" }}
                        >
                          {formatCurrency(row.serviceAchieved)}
                          <AchievementIndicator
                            achieved={row.serviceAchieved}
                            mtdTarget={row.serviceMtdTarget}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            size="small"
                            type="number"
                            value={getTargetValue(row, "retailTarget")}
                            onChange={(e) =>
                              handleTargetChange(
                                row.employeeId,
                                "retailTarget",
                                e.target.value
                              )
                            }
                            inputProps={{
                              min: 0,
                              style: { textAlign: "right", width: 80 },
                            }}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(row.retailMtdTarget)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(row.retailAchieved)}
                          <AchievementIndicator
                            achieved={row.retailAchieved}
                            mtdTarget={row.retailMtdTarget}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Legend */}
            <Box mt={2} p={2} sx={{ bgcolor: "#fafafa", borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Legend:</strong>{" "}
                <span style={{ color: "#4caf50" }}>▲</span> Achieved &gt;= MTD
                Target |{" "}
                <span style={{ color: "#f44336" }}>▼</span> Below MTD Target
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                <strong>Note:</strong> MTD Target = (Month Target ÷ Days in
                Month) × Current Day of Month
              </Typography>
            </Box>
          </Container>
        </AccordionDetails>
      </Accordion>

      <Backdrop open={loading || saving}>
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

export default EmployeePerformanceReport;

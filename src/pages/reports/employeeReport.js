import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Backdrop,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { filter } from "lodash";
import { fixedDateRange } from "../../data/reports";
import moment from "moment";
import clientAdapter from "../../lib/clientAdapter";
import DetailedEmployeeReport from "./detailedEmployeeReport";
import { MenuProps } from "../../style/globalStyle";
import clientAdapterLegacy from "../../lib/clientAdapterLegacy";

const EmployeeReport = ({ onClickBack }) => {
  const loggedInUserInfo = JSON.parse(
    window.localStorage.getItem("yumpos_user_info")
  );
  const _yumposClicks = localStorage.getItem("yumpos_emp_clicks");
  const yumposClicks =
    _yumposClicks !== "undefined" ? JSON.parse(_yumposClicks) : [];
  const [dateRange, setDateRange] = useState({
    startDate: moment(new Date()).startOf("day").toISOString(),
    endDate: moment(new Date()).endOf("day").toISOString(),
  });
  const [employee, setEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedDateOption, setselectedDateOption] = useState(1);
  const [checkedAllEmployees, setCheckedAllEmployees] = useState(false);
  const [exportToExcel, setExportToExcel] = useState("no");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [errModal, setErrModal] = useState({
    open: false,
    message: "",
  });

  const currentLocation = JSON.parse(
    window.localStorage.getItem("yumpos_location")
  );

  const onChangeExportToExcel = (event) => {
    setExportToExcel(event.target.value);
  };

  const onChangeStartDate = (event) => {
    setDateRange({
      startDate: event.target.value,
      endDate: event.target.value,
    });
  };

  const handleChange = (event) => {
    setselectedDateOption(event.target.value);
    switch (event.target.value) {
      case 1:
        setDateRange({
          ...dateRange,
          startDate: moment(new Date()),
          endDate: moment(new Date()),
        });

        break;
      case 2:
        setDateRange({
          ...dateRange,
          startDate: moment(new Date()).subtract(1, "day"),
          endDate: moment(new Date()).subtract(1, "day"),
        });
        break;
      case 3:
        setDateRange({
          ...dateRange,
          startDate: moment(new Date()).subtract(7, "day"),
          endDate: moment(new Date()).subtract(1, "day"),
        });
        break;
      case 4:
        setDateRange({
          ...dateRange,
          startDate: moment(new Date()).startOf("week"),
          endDate: moment(new Date()).endOf("week"),
        });
        break;
      case 5:
        setDateRange({
          ...dateRange,
          startDate: moment(new Date()).subtract(1, "week").startOf("week"),
          endDate: moment(new Date()).subtract(1, "week").endOf("week"),
        });
        break;
      case 6:
        setDateRange({
          ...dateRange,
          startDate: moment(new Date()).startOf("month"),
          endDate: moment(new Date()).endOf("month"),
        });
        break;
      case 7:
        setDateRange({
          ...dateRange,
          startDate: moment(new Date()).subtract(1, "month").startOf("month"),
          endDate: moment(new Date()).subtract(1, "month").endOf("month"),
        });
        break;
      case 8:
        setDateRange({
          ...dateRange,
          startDate: moment(new Date())
            .startOf("year")
            .startOf("day")
            .toISOString(),
          endDate: moment(new Date()).endOf("year").endOf("day").toISOString(),
        });
        break;

      default:
        break;
    }
  };

  const handleSelectedEmployee = (employeeId) => {
    // Check if the employeeId is already selected
    if (selectedEmployee.includes(employeeId)) {
      // If it is selected, remove it from the selectedEmployee array
      setSelectedEmployee((prevSelected) =>
        prevSelected.filter((id) => id !== employeeId)
      );
    } else {
      // If it is not selected, add it to the selectedEmployee array
      setSelectedEmployee((prevSelected) => [...prevSelected, employeeId]);
    }
  };

  const getTechnicians = async () => {
    setLoading(true);
    const locationId = JSON.parse(
      window.localStorage.getItem("yumpos_location")
    );
    const id = locationId.locationId;
    const res = await clientAdapter.getLocationData(id);
    const technicians = filter(res.employeeConnection, (e) => {
      return (
        e.employee &&
        e.employee.deleted === false &&
        e.employee.isCorporate === false &&
        e.employee.isOwner === false
      );
    });
    setEmployee(technicians);
    setLoading(false);
  };

  useEffect(() => {
    getTechnicians();
  }, []);

  // const shouldDisableReport = () => {
  //   let isDisable = false;
  //   const clickArray = yumposClicks || [];
  //   const clickData = clickArray.find(
  //     (i) => i.personId === loggedInUserInfo.personId
  //   );
  //   if (clickData && clickData?.clickCount >= 1) {
  //     const currentTime = moment(new Date(), "DD/MM/YYYY HH:mm:ss");
  //     const clickTime = clickData.clickTime;
  //     const duration = moment.duration(currentTime.diff(clickTime)).asMinutes();

  //     if (duration <= 90) {
  //       isDisable = true;
  //     }
  //   }
  //   return isDisable;
  // };

  const submitReport = () => {
    if (
      selectedDateOption === 6 ||
      selectedDateOption === 7 ||
      selectedDateOption === 10
    ) {
      const clickArray = yumposClicks || [];
      const clickDataIndex = clickArray.findIndex(
        (i) => i.personId === loggedInUserInfo.personId
      );
      const clickData = clickDataIndex !== -1 ? clickArray[clickDataIndex] : {};
      const clickInfo = {
        personId: clickData?.personId || loggedInUserInfo.personId,
        clickCount: (clickData?.clickCount || 0) + 1,
        clickTime: new Date(),
      };
      if (clickDataIndex !== -1) {
        clickArray[clickDataIndex] = { ...clickData, ...clickInfo };
      } else {
        clickArray.push({ ...clickInfo });
      }
      localStorage.setItem("yumpos_emp_clicks", JSON.stringify(clickArray));
    }
    setCurrentIndex(1);
  };

  const onBackFromReport = () => {
    setCurrentIndex(0);
  };

  const onChangeMonthStartDate = (event) => {
    const selectedStartDate = event.target.value;
    const newEndMonth = moment(selectedStartDate)
      .add(30, "days")
      .format("YYYY-MM-DD");

    setDateRange({
      startDate: selectedStartDate,
      endDate: newEndMonth,
    });
  };

  const onChangeMonthEndDate = (event) => {
    const selectedEndDate = event.target.value;
    // const minEndDate = moment(dateRange.startDate).add(1, "day");
    // const maxEndDate = moment(dateRange.startDate).add(31, "days");

    // if (
    //   moment(selectedEndDate).isBefore(minEndDate) ||
    //   moment(selectedEndDate).isAfter(maxEndDate)
    // ) {
    //   setSnackBar({
    //     open: true,
    //     severity: "error",
    //     message:
    //       "Please select an end date within the next 31 days from the start date.",
    //   });
    //   return;
    // }

    // const adjustedEndDate = moment
    //   .min(moment.max(moment(selectedEndDate), minEndDate), maxEndDate)
    //   .format("YYYY-MM-DD");

    setDateRange({
      ...dateRange,
      endDate: selectedEndDate,
    });
  };

  const handleDownload = (csvLink) => {
    // Parse CSV and convert to Excel format
    // Papa.parse(salesData, {
    //   complete: function (results) {
    //     const excelData = results.data;

    //     // Create a new workbook and add a worksheet
    //     const ws = XLSX.utils.json_to_sheet(excelData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    //     // Save the Excel file
    //     XLSX.writeFile(wb, `${currentLocation.name}-sales-report.xlsx`);
    //   },
    //   header: true, // If your CSV has headers
    // });

    // const blob = new Blob([salesData], {
    //   type: "application/vnd.ms-excel",
    // });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = `${currentLocation.name}-sales-report.xls`;
    // a.click();
    // URL.revokeObjectURL(url);
    // a.remove();

    const link = document.createElement("a");
    link.href = csvLink;
    link.download = "report.csv";
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleEmployeeData = async () => {
    setLoading(true);
    try {
      const startDate = moment(dateRange.startDate)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment(dateRange.endDate)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");

      if (selectedEmployee.length < 1) {
        setLoading(false);
        setSnackBar({
          open: true,
          severity: "error",
          message: "Please select employees",
        });
        return;
      }

      const employeeData = await clientAdapterLegacy.getEmployeeSaleCSV(
        startDate,
        endDate,
        selectedEmployee
      );

      if (!employeeData?.success) {
        setErrModal({
          ...errModal,
          open: true,
          message: "Failed to download",
        });
        setLoading(false);
      } else {
        handleDownload(employeeData.csv);
        setLoading(false);
      }
    } catch (err) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Failed to fetch the data",
      });
      setLoading(false);
    }
  };

  const onCheckedAllEmployees = (event) => {
    setCheckedAllEmployees(event.target.checked);
    if (event.target.checked) {
      setSelectedEmployee(employee.map((e) => e.employeeId));
    } else {
      setSelectedEmployee([]);
    }
  };

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const handleErrModalClose = () => {
    setErrModal({ ...errModal, open: false });
  };

  return (
    <>
      {currentIndex === 0 && (
        <Accordion expanded>
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
            <Box display={"flex"} alignItems={"center"}>
              <ArrowBackIcon
                style={{ cursor: "pointer" }}
                onClick={onClickBack}
              />
              <Typography ml={2} fontSize={20} fontWeight={"bold"}>
                Detailed Employees Report
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
              <Grid container>
                <Grid item xs={2.5} sm={2}>
                  <Typography>Date Range:</Typography>
                </Grid>
                <Grid item xs={3} sm={2}>
                  <FormControl fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedDateOption}
                      label=""
                      size="small"
                      onChange={handleChange}
                    >
                      {fixedDateRange.map((item, x) => (
                        <MenuItem key={x} value={item.id}>
                          {item.duration}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {selectedDateOption === 9 && (
                <Grid container mt={2}>
                  <Grid item xs={2.5} sm={2}>
                    <Typography>Custom Range</Typography>
                  </Grid>
                  <Grid item xs={9.5}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        variant="outlined"
                        style={{
                          width: "21%",
                        }}
                        required
                        size="small"
                        type="date"
                        value={dateRange.startDate}
                        onChange={onChangeStartDate}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}
              {selectedDateOption === 10 && (
                <Grid container mt={2}>
                  <Grid item xs={2.5} sm={2}>
                    <Typography>Custom Month</Typography>
                  </Grid>
                  <Grid item xs={9.5}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        variant="outlined"
                        style={{
                          width: "21%",
                        }}
                        required
                        size="small"
                        type="date"
                        value={dateRange.startDate}
                        onChange={onChangeMonthStartDate}
                      />
                      <Typography marginX="1rem" color="black">
                        {" "}
                        to{" "}
                      </Typography>
                      <TextField
                        variant="outlined"
                        style={{
                          width: "21%",
                        }}
                        required
                        size="small"
                        type="date"
                        // value={dateRange.endDate}
                        onChange={onChangeMonthEndDate}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}

              <Grid container mt={2} alignItems={"center"}>
                <Grid item xs={2.5} sm={2}>
                  <Typography>Employee :</Typography>
                </Grid>
                <Grid item xs={3} sm={2} marginRight={1.5}>
                  <FormControl fullWidth>
                    <Select
                      multiple
                      size="small"
                      MenuProps={MenuProps}
                      id="demo-simple-select"
                      value={selectedEmployee}
                      renderValue={(selected) => {
                        const selectedNames = employee
                          .filter((item) => selected.includes(item.employeeId))
                          .map(
                            (item) =>
                              `${item.person?.firstName}${item.person?.lastName}`
                          );
                        return selectedNames.join(", ");
                      }}
                      labelId="demo-simple-select-label"
                    >
                      {employee.map((item, x) => (
                        <MenuItem key={x} value={item.employeeId}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedEmployee.includes(
                                  item.employeeId
                                )}
                                onChange={() =>
                                  handleSelectedEmployee(item.employeeId)
                                }
                              />
                            }
                            label={`${item.person?.firstName} ${item.person?.lastName}`}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <FormControlLabel
                  label="All"
                  control={
                    <Checkbox
                      checked={checkedAllEmployees}
                      onChange={onCheckedAllEmployees}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                />
              </Grid>

              <Grid container mt={2} alignItems={"center"}>
                <Grid item xs={2.5} sm={2}>
                  <Typography>Export To Excel :</Typography>
                </Grid>
                <Grid item xs={9.5}>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={onChangeExportToExcel}
                    value={exportToExcel}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>

              <Divider />
              <Box display={"flex"} justifyContent={"flex-end"}>
                <Button
                  style={{
                    color: "white",
                    borderRadius: "4px",
                    backgroundColor: "black",
                    "&:hover": {
                      backgroundColor: "black",
                    },
                    marginTop: "20px",
                  }}
                  onClick={
                    exportToExcel === "yes" ? handleEmployeeData : submitReport
                  }
                >
                  {exportToExcel === "yes" ? "Export" : "Submit"}
                </Button>
                <Backdrop open={loading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Box>
            </Container>
          </AccordionDetails>
        </Accordion>
      )}
      {currentIndex === 1 && (
        <DetailedEmployeeReport
          currentLocation={currentLocation}
          dateRange={dateRange}
          onClickBack={onBackFromReport}
          employeeIds={selectedEmployee}
          employees={employee}
        />
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={errModal.open}
        onClose={handleErrModalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{errModal.message}</DialogTitle>
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
            onClick={handleErrModalClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeReport;

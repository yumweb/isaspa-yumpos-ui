import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Snackbar,
  Backdrop,
  Typography,
  Alert,
  Checkbox,
  ListSubheader,
} from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fixedDateRange } from "../../data/reports";
import moment from "moment";
import DetailedCustomerReport from "./detailedCustomerReport";
import clientAdapter from "../../lib/clientAdapter";
import clientAdapterLegacy from "../../lib/clientAdapterLegacy";
import { MenuProps } from "../../style/globalStyle";

const CustomerReport = ({ onClickBack }) => {
  const loggedInUserInfo = JSON.parse(
    window.localStorage.getItem("yumpos_user_info")
  );
  const currentLocation = JSON.parse(
    window.localStorage.getItem("yumpos_location")
  );
  const [employeeLocations, setEmployeeLocations] = useState([]);
  const [locationItems, setLocationItems] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedItems, setSelectedItems] = useState([0]);
  const [checkedAllLocations, setCheckedAllLocations] = useState(false);
  const [selectedDateOption, setselectedDateOption] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exportToExcel, setExportToExcel] = useState("no");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [errModal, setErrModal] = useState({
    open: false,
    message: "",
  });

  const onChangeExportToExcel = (event) => {
    setExportToExcel(event.target.value);
  };

  const [dateRange, setDateRange] = useState({
    startDate: moment(new Date()).startOf("day").toISOString(),
    endDate: moment(new Date()).endOf("day").toISOString(),
  });

  const onChangeStartDate = (event) => {
    setDateRange({
      startDate: event.target.value,
      endDate: event.target.value,
    });
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

  const handleChange = (event) => {
    const selectedOption = event.target.value;
    setselectedDateOption(selectedOption);

    switch (selectedOption) {
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

  const submitReport = () => {
    setCurrentIndex(1);
  };

  const onBackFromReport = () => {
    setCurrentIndex(0);
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

  const handleReportData = async () => {
    setLoading(true);
    try {
      const startDate = moment(dateRange.startDate)
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment(dateRange.endDate)
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss");
      const saleData = await clientAdapterLegacy.getCustomerSaleCSV(
        selectedLocations,
        startDate,
        endDate,
        selectedItems
      );

      if (!saleData?.success) {
        setErrModal({
          ...errModal,
          open: true,
          message: "Failed to download",
        });
        setLoading(false);
      } else {
        handleDownload(saleData.csvReport.csv);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Failed to fetch the data",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const handleErrModalClose = () => {
    setErrModal({ ...errModal, open: false });
  };

  const getUserLocations = async () => {
    setLoading(true);
    const res = await clientAdapter.getUserLocations(
      loggedInUserInfo.employeeId
    );
    setEmployeeLocations(res.locations);
    setLoading(false);
  };

  const getLocationItems = async () => {
    setLoading(true);
    const res = await clientAdapter.getAllLocationItems(1, 999);
    setLocationItems(res.items);
    setLoading(false);
  };

  const handleSelectedLocation = (locationId) => {
    // Check if the locationId is already selected
    if (selectedLocations.includes(locationId)) {
      // If it is selected, remove it from the selectedLocations array
      setSelectedLocations((prevSelected) =>
        prevSelected.filter((id) => id !== locationId)
      );
    } else {
      // If it is not selected, add it to the selectedLocations array
      setSelectedLocations((prevSelected) => [...prevSelected, locationId]);
    }
  };

  const handleSelectedItems = (itemId) => {
    // Check if the locationId is already selected
    if (selectedItems.includes(itemId)) {
      // If it is selected, remove it from the selectedLocations array
      const newSelected = selectedItems.filter((id) => id !== itemId);
      // If no items are selected, set back to [0] (all items)
      setSelectedItems(newSelected.length === 0 ? [0] : newSelected);
    } else {
      // If it is not selected, add it to the selectedLocations array
      // Remove [0] if it exists when adding a real item
      const filtered = selectedItems.filter((id) => id !== 0);
      setSelectedItems([...filtered, itemId]);
    }
  };

  const onCheckedAllLocations = (event) => {
    setCheckedAllLocations(event.target.checked);
    if (event.target.checked) {
      setSelectedLocations(employeeLocations.map((e) => e.locationId));
    } else {
      setSelectedLocations([]);
    }
  };

  const filteredItems = locationItems.filter((item) =>
    item.item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getUserLocations();
    getLocationItems();
    handleSelectedLocation(currentLocation.locationId);
  }, []);

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
                Detailed Customer Report
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
                  <Typography>Date :</Typography>
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
                    <Typography>Custom Date</Typography>
                  </Grid>
                  <Grid item xs={9.5}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        variant="outlined"
                        style={{
                          width: "50%",
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

              {employeeLocations && (
                <Grid container mt={2} alignItems={"center"}>
                  <Grid item xs={2.5} sm={2}>
                    <Typography>Select Location :</Typography>
                  </Grid>
                  <Grid item xs={3} sm={2} marginRight={1.5}>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        size="small"
                        MenuProps={MenuProps}
                        id="demo-simple-select"
                        value={[currentLocation]}
                        renderValue={(selected) => {
                          const selectedLocations = employeeLocations
                            .filter((item) =>
                              selected.includes(item.locationId)
                            )
                            .map((item) => `${item.locationId}`);
                          return selectedLocations.join(", ");
                        }}
                        labelId="demo-simple-select-label"
                      >
                        {employeeLocations.map((item, x) => (
                          <MenuItem key={x} value={item.locationId}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedLocations.includes(
                                    item.locationId
                                  )}
                                  onChange={() =>
                                    handleSelectedLocation(item.locationId)
                                  }
                                />
                              }
                              label={item.name}
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
                        checked={checkedAllLocations}
                        onChange={onCheckedAllLocations}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                  />
                </Grid>
              )}
              {locationItems && (
                <Grid container mt={2} alignItems={"center"}>
                  <Grid item xs={2.5} sm={2}>
                    <Typography>Select Items :</Typography>
                  </Grid>
                  <Grid item xs={3} sm={2} marginRight={1.5}>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        size="small"
                        MenuProps={MenuProps}
                        value={selectedItems}
                        renderValue={(selected) => {
                          const selectedLabels = locationItems
                            .filter((item) => selected.includes(item.itemId))
                            .map((item) => item.item.name);
                          return selectedLabels.join(", ");
                        }}
                      >
                        <ListSubheader>
                          <TextField
                            size="small"
                            placeholder="Search..."
                            fullWidth
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </ListSubheader>

                        {locationItems
                          .filter((item) =>
                            item.item.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((item, x) => (
                            <MenuItem key={x} value={item.itemId}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedItems.includes(
                                      item.itemId
                                    )}
                                    onChange={() =>
                                      handleSelectedItems(item.itemId)
                                    }
                                  />
                                }
                                label={item.item.name}
                              />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}

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

              <Divider sx={{ marginTop: 5 }} />
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
                    exportToExcel === "yes" ? handleReportData : submitReport
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
        <DetailedCustomerReport
          selectedLocations={selectedLocations}
          selectedItems={selectedItems}
          currentLocation={currentLocation}
          dateRange={dateRange}
          onClickBack={onBackFromReport}
        />
      )}

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

export default CustomerReport;

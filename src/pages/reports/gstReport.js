import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import clientAdapterLegacy from "../../lib/clientAdapterLegacy";

const GSTReport = ({ onClickBack }) => {
  const getCurrentMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    return currentMonth === 1 ? 12 : currentMonth - 1; // Previous month
  };

  const getCurrentYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    return currentMonth === 1
      ? currentDate.getFullYear() - 1
      : currentDate.getFullYear();
  };

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [isDownloading, setIsDownloading] = useState(false);

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

  const downloadCSV = async () => {
    try {
      setIsDownloading(true);

      const response = await clientAdapterLegacy.getGSTReport(
        selectedMonth,
        selectedYear
      );

      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.csvContent]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", response.filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("Failed to generate GST report");
      }
    } catch (error) {
      console.error("Error downloading GST report:", error);
      alert("Error downloading GST report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Accordion expanded>
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <Box display={"flex"} alignItems={"center"}>
          <ArrowBackIcon style={{ cursor: "pointer" }} onClick={onClickBack} />
          <Typography ml={2} fontSize={20} fontWeight={"bold"}>
            GST Report
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
          <Grid container alignItems={"center"}>
            <Grid item xs={2.5} sm={2}>
              <Typography>Select Month :</Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
              <FormControl fullWidth>
                <Select
                  size="small"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {months
                    .filter((month) => {
                      const currentDate = new Date();
                      const currentMonth = currentDate.getMonth() + 1;
                      const currentYear = currentDate.getFullYear();

                      // Only show previous months
                      if (selectedYear === currentYear) {
                        return month.value < currentMonth;
                      }
                      return selectedYear < currentYear;
                    })
                    .map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container mt={2} alignItems={"center"}>
            <Grid item xs={2.5} sm={2}>
              <Typography>Select Year :</Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
              <FormControl fullWidth>
                <Select
                  size="small"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
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
              onClick={downloadCSV}
              disabled={isDownloading}
              startIcon={<DownloadIcon />}
            >
              {isDownloading ? "Downloading..." : "Download CSV"}
            </Button>
            <Backdrop open={isDownloading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </Container>
      </AccordionDetails>
    </Accordion>
  );
};

export default GSTReport;

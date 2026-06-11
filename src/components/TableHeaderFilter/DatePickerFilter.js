import React, { useState, useRef, useEffect } from "react";
import { IconButton, Menu, Box, Typography, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faCaretDown, faCalendar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "./DatePickerFilter.scss";

const DatePickerFilter = ({ 
  title, 
  selectedDateRange = null, 
  onDateRangeChange, 
  isActive = false 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activePreset, setActivePreset] = useState(null);
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const open = Boolean(anchorEl);
  const buttonRef = useRef(null);

  const datePresets = [
    { 
      id: "today", 
      label: "Today", 
      getValue: () => ({
        from: moment().startOf('day').toDate(),
        to: moment().endOf('day').toDate(),
        label: "Today"
      })
    },
    { 
      id: "yesterday", 
      label: "Yesterday", 
      getValue: () => ({
        from: moment().subtract(1, 'day').startOf('day').toDate(),
        to: moment().subtract(1, 'day').endOf('day').toDate(),
        label: "Yesterday"
      })
    },
    { 
      id: "last7days", 
      label: "Last 7 Days", 
      getValue: () => ({
        from: moment().subtract(7, 'days').startOf('day').toDate(),
        to: moment().endOf('day').toDate(),
        label: "Last 7 Days"
      })
    },
    { 
      id: "last30days", 
      label: "Last 30 Days", 
      getValue: () => ({
        from: moment().subtract(30, 'days').startOf('day').toDate(),
        to: moment().endOf('day').toDate(),
        label: "Last 30 Days"
      })
    },
    { 
      id: "thismonth", 
      label: "This Month", 
      getValue: () => ({
        from: moment().startOf('month').toDate(),
        to: moment().endOf('month').toDate(),
        label: "This Month"
      })
    },
    { 
      id: "lastmonth", 
      label: "Last Month", 
      getValue: () => ({
        from: moment().subtract(1, 'month').startOf('month').toDate(),
        to: moment().subtract(1, 'month').endOf('month').toDate(),
        label: "Last Month"
      })
    },
    { 
      id: "custom", 
      label: "Custom Range", 
      getValue: () => null
    }
  ];

  useEffect(() => {
    if (selectedDateRange) {
      // Find which preset matches the current selection
      const matchingPreset = datePresets.find(preset => {
        if (preset.id === "custom") return false;
        const presetRange = preset.getValue();
        return (
          moment(selectedDateRange.from).isSame(presetRange.from, 'day') &&
          moment(selectedDateRange.to).isSame(presetRange.to, 'day')
        );
      });
      
      if (matchingPreset) {
        setActivePreset(matchingPreset.id);
        setShowCustomInputs(false);
      } else {
        setActivePreset("custom");
        setShowCustomInputs(true);
        setCustomFromDate(moment(selectedDateRange.from).format('YYYY-MM-DD'));
        setCustomToDate(moment(selectedDateRange.to).format('YYYY-MM-DD'));
      }
    } else {
      setActivePreset(null);
      setShowCustomInputs(false);
    }
  }, [selectedDateRange]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePresetClick = (preset) => {
    if (preset.id === "custom") {
      setActivePreset("custom");
      setShowCustomInputs(true);
      // Don't close menu for custom range
    } else {
      setActivePreset(preset.id);
      setShowCustomInputs(false);
      const dateRange = preset.getValue();
      onDateRangeChange(dateRange);
      handleClose();
    }
  };

  const handleCustomDateApply = () => {
    if (customFromDate && customToDate) {
      const dateRange = {
        from: moment(customFromDate).startOf('day').toDate(),
        to: moment(customToDate).endOf('day').toDate(),
        label: `${moment(customFromDate).format('MMM DD')} - ${moment(customToDate).format('MMM DD, YYYY')}`
      };
      onDateRangeChange(dateRange);
      handleClose();
    }
  };

  const handleClear = () => {
    setActivePreset(null);
    setShowCustomInputs(false);
    setCustomFromDate("");
    setCustomToDate("");
    onDateRangeChange(null);
    handleClose();
  };

  const getDisplayText = () => {
    if (selectedDateRange) {
      return selectedDateRange.label;
    }
    return null;
  };

  return (
    <div className="date-picker-filter">
      <div className="header-cell">
        <span className="header-title">{title}</span>
        <IconButton
          ref={buttonRef}
          size="small"
          onClick={handleClick}
          className={`filter-button ${isActive ? 'active' : ''}`}
        >
          <FontAwesomeIcon 
            icon={isActive ? faFilter : faCaretDown} 
            size="xs"
            style={{ color: isActive ? '#1976d2' : '#666' }}
          />
        </IconButton>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="date-picker-menu"
        PaperProps={{
          style: {
            maxHeight: 500,
            width: 300,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box className="date-picker-menu-content">
          <Typography variant="subtitle2" className="menu-title">
            {getDisplayText() || "Select Date Range"}
          </Typography>
          
          <Box className="preset-buttons">
            {datePresets.map((preset) => (
              <Button
                key={preset.id}
                variant={activePreset === preset.id ? "contained" : "outlined"}
                size="small"
                onClick={() => handlePresetClick(preset)}
                className={`preset-button ${activePreset === preset.id ? 'active' : ''}`}
              >
                {preset.label}
              </Button>
            ))}
          </Box>

          {showCustomInputs && (
            <Box className="custom-date-inputs">
              <Typography variant="caption" className="input-label">FROM</Typography>
              <input
                type="date"
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className="custom-date-input"
              />
              
              <Typography variant="caption" className="input-label">TO</Typography>
              <input
                type="date"
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                className="custom-date-input"
              />
              
              <Box className="custom-date-buttons">
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleCustomDateApply}
                  disabled={!customFromDate || !customToDate}
                  className="apply-button"
                >
                  Apply
                </Button>
              </Box>
            </Box>
          )}

          <Box className="filter-actions">
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleClear}
              className="clear-button"
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Menu>
    </div>
  );
};

export default DatePickerFilter;
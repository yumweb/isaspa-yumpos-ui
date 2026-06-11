import React, { useState, useRef, useEffect } from "react";
import { IconButton, Menu, MenuItem, Checkbox, FormControlLabel, Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import "./TableHeaderFilter.scss";

const TableHeaderFilter = ({ 
  title, 
  options = [], 
  selectedValues = [], 
  onFilterChange, 
  isActive = false,
  displayField = "status" // Default to "status", but can be "source" for lead sources
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tempSelectedValues, setTempSelectedValues] = useState(selectedValues);
  const open = Boolean(anchorEl);
  const buttonRef = useRef(null);

  useEffect(() => {
    setTempSelectedValues(selectedValues);
  }, [selectedValues]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckboxChange = (value) => {
    const newValues = tempSelectedValues.includes(value)
      ? tempSelectedValues.filter(v => v !== value)
      : [...tempSelectedValues, value];
    setTempSelectedValues(newValues);
  };

  const handleSelectAll = () => {
    if (tempSelectedValues.length === options.length) {
      setTempSelectedValues([]);
    } else {
      setTempSelectedValues(options.map(option => option.id));
    }
  };

  const handleApply = () => {
    onFilterChange(tempSelectedValues);
    handleClose();
  };

  const handleClear = () => {
    setTempSelectedValues([]);
    onFilterChange([]);
    handleClose();
  };

  const isAllSelected = tempSelectedValues.length === options.length;
  const isIndeterminate = tempSelectedValues.length > 0 && tempSelectedValues.length < options.length;

  return (
    <div className="table-header-filter">
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
        className="filter-menu"
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 250,
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
        <Box className="filter-menu-content">
          <Box className="filter-actions">
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                  size="small"
                />
              }
              label="Select All"
              className="select-all-checkbox"
            />
          </Box>
          
          <Box className="filter-options">
            {options.map((option) => (
              <MenuItem key={option.id} className="filter-option">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempSelectedValues.includes(option.id)}
                      onChange={() => handleCheckboxChange(option.id)}
                      size="small"
                    />
                  }
                  label={option[displayField]}
                  className="option-checkbox"
                />
              </MenuItem>
            ))}
          </Box>

          <Box className="filter-buttons">
            <button 
              className="filter-btn clear-btn" 
              onClick={handleClear}
            >
              Clear
            </button>
            <button 
              className="filter-btn apply-btn" 
              onClick={handleApply}
            >
              OK
            </button>
          </Box>
        </Box>
      </Menu>
    </div>
  );
};

export default TableHeaderFilter;
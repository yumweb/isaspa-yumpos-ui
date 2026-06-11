import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import TableHeaderFilter from "./TableHeaderFilter";
import DatePickerFilter from "./DatePickerFilter";
import "./CustomTableHeader.scss";

const CustomTableHeader = ({ 
  headers, 
  sortState, 
  onSortChange, 
  filters = {},
  onFilterChange,
  leadStatusOptions = [],
  leadSourceOptions = []
}) => {
  const handleSort = (prop) => {
    const order = sortState?.prop === prop && sortState?.order === "asc" ? "desc" : "asc";
    onSortChange({ prop, order });
  };

  const getSortIcon = (prop) => {
    if (sortState?.prop === prop) {
      return sortState.order === "asc" ? faSortUp : faSortDown;
    }
    return faSort;
  };

  const renderHeaderCell = (header, index) => {
    const isStatusColumn = header.prop === "status";
    const isSourceColumn = header.prop === "source";
    const isDateColumn = header.prop === "dateCreated";
    const isFollowupDateColumn = header.prop === "followupDate";
    const isSortable = header.isSortable;
    
    if (isStatusColumn) {
      return (
        <th key={index} className="filterable-header">
          <TableHeaderFilter
            title={header.title}
            options={leadStatusOptions}
            selectedValues={filters.status || []}
            onFilterChange={(values) => onFilterChange("status", values)}
            isActive={filters.status && filters.status.length > 0}
          />
        </th>
      );
    }

    if (isSourceColumn) {
      return (
        <th key={index} className="filterable-header">
          <TableHeaderFilter
            title={header.title}
            options={leadSourceOptions}
            selectedValues={filters.source || []}
            onFilterChange={(values) => onFilterChange("source", values)}
            isActive={filters.source && filters.source.length > 0}
            displayField="source"
          />
        </th>
      );
    }

    if (isDateColumn) {
      return (
        <th key={index} className="filterable-header">
          <DatePickerFilter
            title={header.title}
            selectedDateRange={filters.dateCreated || null}
            onDateRangeChange={(dateRange) => onFilterChange("dateCreated", dateRange)}
            isActive={filters.dateCreated !== null && filters.dateCreated !== undefined}
          />
        </th>
      );
    }

    if (isFollowupDateColumn) {
      return (
        <th key={index} className="filterable-header">
          <DatePickerFilter
            title={header.title}
            selectedDateRange={filters.followupDate || null}
            onDateRangeChange={(dateRange) => onFilterChange("followupDate", dateRange)}
            isActive={filters.followupDate !== null && filters.followupDate !== undefined}
          />
        </th>
      );
    }

    return (
      <th key={index} className={`header-cell ${isSortable ? 'sortable' : ''}`}>
        <div className="header-content">
          <span className="header-title">{header.title}</span>
          {isSortable && (
            <button
              className="sort-button"
              onClick={() => handleSort(header.prop)}
            >
              <FontAwesomeIcon 
                icon={getSortIcon(header.prop)} 
                size="xs"
                style={{ 
                  color: sortState?.prop === header.prop ? '#1976d2' : '#666' 
                }}
              />
            </button>
          )}
        </div>
      </th>
    );
  };

  return (
    <thead className="custom-table-header">
      <tr>
        {headers.map((header, index) => renderHeaderCell(header, index))}
      </tr>
    </thead>
  );
};

export default CustomTableHeader;
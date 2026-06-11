const LEGACY_API = "https://api.yumpos.co/api";
// const LEGACY_API = "http://localhost:8085/api";

const getEmployeeSaleCSV = async (fromDate, toDate, employeeId) => {
  const location = JSON.parse(window.localStorage.getItem("yumpos_location"));

  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      locationId: [location.locationId],
      employeeId: employeeId,
      dateFrom: fromDate,
      dateTo: toDate,
      csvExport: 1,
      offset: 0,
      saleType: "all",
      audit: 0,
    },
    Header: {
      Object: "reports",
      Action: "EmployeeReportDetail",
      Version: "v2",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

const getEmployeeSale = async (page, fromDate, toDate, employeeId) => {
  const location = JSON.parse(window.localStorage.getItem("yumpos_location"));

  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      locationId: [location.locationId],
      employeeId: employeeId,
      dateFrom: fromDate,
      dateTo: toDate,
      csvExport: 0,
      offset: page,
      saleType: "all",
      audit: 0,
    },
    Header: {
      Object: "reports",
      Action: "EmployeeReportDetail",
      Version: "v2",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

const getSale = async (location, page, fromDate, toDate) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      locationId: location,
      dateFrom: fromDate,
      dateTo: toDate,
      csvExport: 0,
      offset: page,
      saleType: "all",
      audit: 0,
    },
    Header: {
      Object: "reports",
      Action: "SalesReportDetail",
      Version: "v2",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

const getSaleCSV = async (locations, fromDate, toDate) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      locationId: locations,
      dateFrom: fromDate,
      dateTo: toDate,
      csvExport: 1,
      offset: 0,
      saleType: "all",
      audit: 0,
    },
    Header: {
      Object: "reports",
      Action: "SalesReportDetail",
      Version: "v2",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

const getCustomerSale = async (
  locations,
  selectedItems,
  page,
  fromDate,
  toDate
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      customerId: -1,
      locationId: locations,
      dateFrom: fromDate,
      dateTo: toDate,
      csvExport: 0,
      offset: page,
      itemId: selectedItems,
      sourceId: [0],
    },
    Header: {
      Object: "reports",
      Action: "CustomerReportDetail",
      Version: "v1",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

const getCustomerSaleCSV = async (
  locations,
  fromDate,
  toDate,
  selectedItems = [0]
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      customerId: -1,
      locationId: locations,
      dateFrom: fromDate,
      dateTo: toDate,
      csvExport: 1,
      offset: 0,
      itemId: selectedItems,
      sourceId: [0],
    },
    Header: {
      Object: "reports",
      Action: "CustomerReportDetail",
      Version: "v1",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

const getCustomerRetentionReport = async (
  locationId,
  interval,
  filter,
  page
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      locationId,
      interval,
      filter: filter || null,
      offset: page,
    },
    Header: {
      Object: "reports",
      Action: "CustomerRetentionReport",
      Version: "v2",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

const getCustomerEventReport = async (
  locationId,
  day,
  month,
  event /* 1 - Birthday; 2 Anniversary */,
  page
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      locationId: [locationId],
      event,
      day,
      month,
      offset: page || 0,
      csvExport: 0,
    },
    Header: {
      Object: "reports",
      Action: "CustomerEvents",
      Version: "v2",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

const getGSTReport = async (month, year) => {
  const location = JSON.parse(window.localStorage.getItem("yumpos_location"));

  const headers = {
    "Content-Type": "application/json",
  };

  const body = {
    Payload: {
      locationId: location.locationId,
      month: month,
      year: year,
    },
    Header: {
      Object: "reports",
      Action: "GSTReport",
      Version: "v2",
    },
  };

  const response = await fetch(LEGACY_API, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  return response.json();
};

export default {
  getEmployeeSaleCSV,
  getEmployeeSale,
  getSale,
  getSaleCSV,
  getCustomerSale,
  getCustomerSaleCSV,
  getCustomerRetentionReport,
  getCustomerEventReport,
  getGSTReport,
};

import apiClient from "./apiClient";

const loginEmployee = async (data) => {
  const response = await apiClient.post("/auth/login-employee", data);
  return response.json();
};

const resetEmail = async (data) => {
  const response = await apiClient.post(`/auth/reset-email`, data);
  return response.status;
};

const resetPassword = async (data) => {
  const response = await apiClient.post("/auth/reset-password", data);
  return response.status;
};

const getUserLocations = async () => {
  const response = await apiClient.get("/users/get-locations");
  return response.json();
};

const setUserLocation = async (data) => {
  const response = await apiClient.get(`/auth/set-location/${data}`);
  return response.json();
};

// EOD / Spa Closing report
const getEodPrefill = async (locationId, date) => {
  const response = await apiClient.get(
    `/eod-report/prefill?locationId=${locationId}&date=${date}`
  );
  return response.json();
};

const saveEodReport = async (data) => {
  const response = await apiClient.post(`/eod-report`, data);
  return response.json();
};

const getEodReports = async (locationId, startDate, endDate) => {
  const response = await apiClient.get(
    `/eod-report?locationId=${locationId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.json();
};

const dashboardSales = async (startDate, endDate) => {
  const response = await apiClient.get(
    `/sales/dashboard?startDate=${startDate}&endDate=${endDate}`
  );
  return response.json();
};

const getLocationLeads = async (
  page,
  limit,
  sortState,
  name,
  status,
  source,
  startDate,
  endDate,
  followupDateStart,
  followupDateEnd
) => {
  let filters = ``;
  if (name) {
    filters += `&name=${name}`;
  }
  if (source) {
    filters += `&source=${source}`;
  }
  if (status) {
    filters += `&status=${status}`;
  }
  if (startDate) {
    filters += `&startDate=${startDate}`;
  }
  if (endDate) {
    filters += `&endDate=${endDate}`;
  }
  if (followupDateStart) {
    filters += `&followupDateStart=${followupDateStart}`;
  }
  if (followupDateEnd) {
    filters += `&followupDateEnd=${followupDateEnd}`;
  }
  const response = await apiClient.get(
    `/leads/?page=${page}&limit=${limit}${filters}`
  );
  return response.json();
};

const getSummaryGraph = async (startDate, endDate) => {
  const response = await apiClient.get(
    `/sales/summary-graph?startDate=${startDate}&endDate=${endDate}`
  );
  return response.json();
};

const getLeadFeedback = async (leadId, page, limit) => {
  const response = await apiClient.get(
    `/leads/feedback/${leadId}?page=${page}&limit=${limit}`
  );
  if (response.status === 200) {
    return await response.json();
  } else {
    return null;
  }
};

const getCustomerData = async (page, limit, name, source, gender) => {
  let filters = ``;
  if (name) {
    filters += `&name=${name}`;
  }
  if (source) {
    filters += `&source=${source}`;
  }
  if (gender) {
    filters += `&gender=${gender}`;
  }
  const response = await apiClient.get(
    `/customers/?page=${page}&limit=${limit}${filters}`
  );
  return response.json();
};

const getCustomerDataByName = async (page, limit, name) => {
  const response = await apiClient.get(
    `/customers/?page=${page}&limit=${limit}&name=${name}`
  );
  return response.json();
};

const getLeadSource = async () => {
  const response = await apiClient.get(`/leads/sources`);
  return response.json();
};

const getLeadStatus = async () => {
  const response = await apiClient.get(`/leads/statuses`);
  return response.json();
};

const getCustomerPhone = async (mobile, data) => {
  const response = await apiClient.get(
    `/customers/search/?phone=${mobile}`,
    data
  );
  if (response.status === 200) {
    if (response) {
      return await response.json();
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const addItemToAppointmentSale = async (id, data) => {
  const response = await apiClient.post(`/sales/sale-items/${id}`, data);
  return response;
};

const addItemKitToAppointmentSale = async (id, data) => {
  const response = await apiClient.post(`/sales/sale-item-kits/${id}`, data);
  return response;
};

const deleteItemFromAppointmentSale = async (saleId, itemId) => {
  const response = await apiClient.delete(
    `/sales/appointment/${saleId}/sale-item/${itemId}`
  );
  return response;
};

const deleteItemKitFromAppointmentSale = async (saleId, itemId) => {
  const response = await apiClient.delete(
    `/sales/appointment/${saleId}/sale-item-kit/${itemId}`
  );
  return response;
};

const completeAppointmentSaleBySaleId = async (id, data) => {
  const response = await apiClient.patch(`/sales/${id}`, data);
  return response;
};

const addItemToSuspendSale = async (id, data) => {
  const response = await apiClient.post(`/sales/sale-items/${id}`, data);
  return response;
};

const addItemKitToSuspendSale = async (id, data) => {
  const response = await apiClient.post(`/sales/sale-item-kits/${id}`, data);
  return response;
};

const deleteItemFromSuspendSale = async (saleId, itemId) => {
  const response = await apiClient.delete(
    `/sales/${saleId}/sale-item/${itemId}`
  );
  return response;
};

const deleteItemKitFromSuspendSale = async (saleId, itemId) => {
  const response = await apiClient.delete(
    `/sales/${saleId}/sale-item-kit/${itemId}`
  );
  return response;
};

const completeSuspendSaleBySaleId = async (id, data) => {
  const response = await apiClient.patch(`/sales/${id}`, data);
  return response;
};

const changeDetachCustomer = async (id, data) => {
  const response = await apiClient.patch(`/sales/${id}/customer`, data);
  return response;
};

const getFamilyCardbyLocation = async (page, limit, number) => {
  let filters = ``;
  if (number) {
    filters += `&number=${number}`;
  }
  const response = await apiClient.get(
    `/familycards?page=${page}&limit=${limit}${filters}`
  );
  return response.json();
};

const getGiftCardbyLocation = async (page, limit, number) => {
  let filters = ``;
  if (number) {
    filters += `&number=${number}`;
  }
  const response = await apiClient.get(
    `/giftcards?page=${page}&limit=${limit}${filters}`
  );
  return response.json();
};

const getCouponById = async (id) => {
  const response = await apiClient.get(`/coupons/${id}`);
  return response.json();
};

const getFamilyCardDetailsbyId = async (id) => {
  const response = await apiClient.get(`/familycards/${id}`);
  return response.json();
};

const getGiftCardDetailsbyId = async (id) => {
  const response = await apiClient.get(`/giftcards/${id}`);
  return response.json();
};

const getCouponbyLocation = async (page, limit, number, includeDeleted = false) => {
  let filters = ``;
  if (number) {
    filters += `&number=${number}`;
  }
  if (includeDeleted) {
    filters += `&includeDeleted=true`;
  }
  const response = await apiClient.get(
    `/coupons?page=${page}&limit=${limit}${filters}`
  );
  return response.json();
};

const validateCoupon = async (couponNumber, customerId, billTotal) => {
  let url = `/coupons/validate/${encodeURIComponent(couponNumber)}`;
  const params = [];
  if (customerId) {
    params.push(`customerId=${customerId}`);
  }
  if (billTotal) {
    params.push(`billTotal=${billTotal}`);
  }
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  const response = await apiClient.get(url);
  return response.json();
};

const getServicesbyLocation = async (page, limit, name) => {
  let filters = ``;
  if (name) {
    filters += `&name=${name}`;
  }
  const response = await apiClient.get(
    `/items?page=${page}&limit=${limit}&isService=${true}${filters}`
  );
  return response.json();
};

const getRetailProductbyLocation = async (page, limit, name, category) => {
  let filters = ``;
  if (name) {
    filters += `&name=${name}`;
  }
  if (category) {
    filters += `&category=${category}`;
  }
  const response = await apiClient.get(
    `/items?page=${page}&limit=${limit}&isService=${false}${filters}`
  );
  return response.json();
};

const getItemsbyLocation = async (page, limit, name) => {
  let filters = ``;
  if (name) {
    filters += `&name=${name}`;
  }
  const response = await apiClient.get(
    `/itemkits?page=${page}&limit=${limit}${filters}`
  );
  return response.json();
};

const searchItems = async (keyword, signal) => {
  const response = await apiClient.get(
    `/items/search?keyword=${keyword}`,
    signal
  );
  return response.json();
};

const searchItemsWithoutSignal = async (keyword) => {
  const response = await apiClient.get(`/items/search?keyword=${keyword}`);
  return response.json();
};

const searchItemsAndItemKits = async (keyword, signal) => {
  const response = await apiClient.get(
    `/sales/item-search?keyword=${keyword}`,
    signal
  );
  return response.json();
};

// Service BOM endpoints
const getServiceBom = async (serviceItemId) => {
  const response = await apiClient.get(`/items/${serviceItemId}/bom`);
  return response.json();
};

const upsertServiceBom = async (serviceItemId, data) => {
  const response = await apiClient.put(`/items/${serviceItemId}/bom`, data);
  return response.json();
};

const deleteServiceBomItem = async (serviceItemId, componentItemId) => {
  const response = await apiClient.delete(
    `/items/${serviceItemId}/bom/${componentItemId}`
  );
  return response.json();
};

const getLocationData = async (id) => {
  const response = await apiClient.get(`/locations/${id}`);
  return response.json();
};

const createEmployee = async (data) => {
  const response = await apiClient.post(`/users/create-employee`, data);
  return response.status;
};

const createSupplier = async (date) => {
  const response = await apiClient.post(`/suppliers`, date);
  return response.json();
};

const updateEmployee = async (employeeId, data) => {
  const response = await apiClient.patch(
    `/users/employee/${Number(employeeId)}`,
    data
  );
  return response.status;
};

const getEmployeeDetails = async (id) => {
  const response = await apiClient.get(`/users/employee/${id}`);
  return response.json();
};

const employeeLocationDetails = async (employeeId, data) => {
  const response = await apiClient.patch(
    `/users/employee/${employeeId}/locations`,
    data
  );
  return response.status;
};

const employeeShiftsDetails = async (employeeId, data) => {
  const response = await apiClient.patch(
    `/users/employee/${employeeId}/shifts`,
    data
  );
  return response.status;
};

const getItemDetails = async (id) => {
  const response = await apiClient.get(`/itemkits/${id}`);
  return response.json();
};

const getItemsById = async (id) => {
  const response = await apiClient.get(`/items/${id}`);
  return response.json();
};

const closeTicket = async (id) => {
  const response = await apiClient.patch(`/tickets/${id}/close`);
  return response.status;
};

const getTicketsbyLocation = async (page, limit, closed, master, type) => {
  const response = await apiClient.get(
    `/tickets?page=${page}&limit=${limit}&closed=${closed}&master=${master}&type=${type}`
  );
  return response.json();
};

const getTicketsbyId = async (id) => {
  const response = await apiClient.get(`/tickets/${id}`);
  return response.json();
};

const getStaffExitTicket = async (page, limit) => {
  const response = await apiClient.get(
    `/tickets/exit?page=${page}&limit=${limit}`
  );
  return response.json();
};

const createStaffingTicket = async (data) => {
  const response = await apiClient.post(`/tickets/staff`, data);
  return response.json();
};

const createTrainingTicket = async (data) => {
  const response = await apiClient.post(`/tickets/training`, data);
  return response.json();
};

const getLocationReviews = async (page, limit) => {
  const response = await apiClient.get(`/reviews?page=${page}&limit=${limit}`);
  return response.json();
};

const getSmsReport = async (page, limit, min_time, max_time) => {
  let filters = ``;
  if (min_time) {
    filters += `&min_time=${min_time}`;
  }
  if (max_time) {
    filters += `&max_time=${max_time}`;
  }
  const response = await apiClient.get(
    `/promotions/report?type=${"promotion"}&start=${page}&limit=${limit}${filters}`
  );
  return response.json();
};

const getSmsTemplates = async () => {
  const response = await apiClient.get(`/promotions/templates`);
  return response.json();
};

const completeSale = async (data) => {
  const response = await apiClient.post(`/sales`, data);
  return response.json();
};

const getAppointmentInformation = async (startDate, endDate) => {
  const response = await apiClient.get(
    `/appointments?startDate=${startDate}&endDate=${endDate}`
  );
  return response.json();
};

const createAppointment = async (data) => {
  const response = await apiClient.post(`/appointments`, data);
  return response.status;
};

const salesAppointment = async (data) => {
  const response = await apiClient.post(`/sales/appointment`, data);
  return response.json();
};

const updateAppointment = async (id, data) => {
  const response = await apiClient.patch(`/appointments/${id}`, data);
  return response.status;
};

const deleteAppointment = async (id) => {
  const response = await apiClient.delete(`/appointments/${id}`);
  return response.status;
};

const getUpcomingAppointmentReminders = async (reminderMinutes = 60) => {
  const response = await apiClient.get(
    `/appointments/upcoming-reminders?reminderMinutes=${reminderMinutes}`
  );
  return response.json();
};

const suspendSale = async (id) => {
  const response = await apiClient.patch(`/sales/suspend/${id}`);
  return response.status;
};

const getSuspendSales = async (page, limit, keyword) => {
  const response = await apiClient.get(
    `/sales/suspend/?page=${page}&limit=${limit}&keyword=${keyword}`
  );
  return response.json();
};

const deleteSuspendSale = async (id) => {
  const response = await apiClient.delete(`/sales/suspend/${id}`);
  return response.status;
};

const getPackageSales = async (page, limit, keyword) => {
  const response = await apiClient.get(
    `/sales/packages/?page=${page}&limit=${limit}`
  );
  return response.json();
};

const updatePackageSale = async (data) => {
  const response = await apiClient.patch(`/sales/packages/redemption`, data);
  return response.json();
};

const getSaleReceipt = async (id) => {
  const response = await apiClient.get(`/sales/receipt/${id}`);
  return response.json();
};
const getPublicSaleReceipt = async (token) => {
  const response = await apiClient.get(`/sales/receipt/open/${token}`);
  return response.json();
};

const createCustomer = async (data) => {
  const response = await apiClient.post(`/customers`, data);
  return response.json();
};

const createRecievings = async (data) => {
  const response = await apiClient.post(`/receivings`, data);
  return response.json();
};

const getCustomerViewSalesById = async (
  page,
  limit,
  id,
  startDate,
  endDate
) => {
  let filters = "";
  if (startDate) {
    filters += `&startDate=${startDate}`;
  }
  if (endDate) {
    filters += `&endDate=${endDate}`;
  }
  const response = await apiClient.get(
    `/customers/get-sales/${id}?page=${page}&limit=${limit}${filters}`
  );
  return response.json();
};

const createItemInformation = async (data) => {
  const response = await apiClient.post(`/items`, data);
  return response.json();
};

const getAllLocationItems = async (data) => {
  const response = await apiClient.get(
    `/items?page=1&limit=9999&isService=true`
  );
  return response.json();
};

const getItemCategories = async (catId, filterByLocation = false) => {
  const params = [`parentId=${catId}`];
  if (filterByLocation) {
    params.push('filterByLocation=true');
  }
  const response = await apiClient.get(`/items/categories?${params.join('&')}`);
  return response.json();
};

const getCategoriesId = async (categoryId) => {
  const response = await apiClient.get(`/items/categories/${categoryId}`);
  return response.json();
};

const getAllCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.json();
};

const deleteEmployee = async (id) => {
  const response = await apiClient.delete(`/users/employee?employeeId=${id}`);
  return response.status;
};

const createCoupon = async (data) => {
  const response = await apiClient.post(`/coupons`, data);
  return response.json();
};

const createBounceBackCoupon = async (
  customerId,
  customerPersonId,
  customerPhone,
  customerName,
  couponNumber
) => {
  const response = await apiClient.post(`/coupons/bounce-back`, {
    customerId,
    customerPersonId,
    customerPhone,
    customerName,
    couponNumber,
  });
  return response.json();
};

// Bounce Back Report Functions
const getBounceBackSummary = async () => {
  const response = await apiClient.get(`/reports/bounce-back/summary`);
  return response.json();
};

const getBounceBackIssuance = async (fromDate, toDate, page = 1, limit = 20) => {
  const response = await apiClient.get(
    `/reports/bounce-back/issuance?from=${fromDate}&to=${toDate}&page=${page}&limit=${limit}`
  );
  return response.json();
};

const getBounceBackRedemption = async (fromDate, toDate) => {
  const response = await apiClient.get(
    `/reports/bounce-back/redemption?from=${fromDate}&to=${toDate}`
  );
  return response.json();
};

const getBounceBackDailyCounts = async (fromDate, toDate) => {
  const response = await apiClient.get(
    `/reports/bounce-back/daily-counts?from=${fromDate}&to=${toDate}`
  );
  return response.json();
};

// First Visit Report APIs
const getFirstVisitReport = async (fromDate, toDate, page = 1, limit = 20) => {
  const response = await apiClient.get(
    `/reports/first-visit?from=${fromDate}&to=${toDate}&page=${page}&limit=${limit}`
  );
  return response.json();
};

const getFirstVisitSummary = async (fromDate, toDate) => {
  const response = await apiClient.get(
    `/reports/first-visit/summary?from=${fromDate}&to=${toDate}`
  );
  return response.json();
};

const getFirstVisitDailyCounts = async (fromDate, toDate) => {
  const response = await apiClient.get(
    `/reports/first-visit/daily-counts?from=${fromDate}&to=${toDate}`
  );
  return response.json();
};

const getEmployeePerformance = async (month, year) => {
  const response = await apiClient.get(
    `/reports/employee-performance?month=${month}&year=${year}`
  );
  return response.json();
};

const saveEmployeeTarget = async (employeeId, month, year, serviceTarget, retailTarget) => {
  const response = await apiClient.post(`/reports/employee-targets`, {
    employeeId,
    month,
    year,
    serviceTarget,
    retailTarget,
  });
  return response.json();
};

const storeLocations = async () => {
  const response = await apiClient.get(`/locations/all`);
  return response.json();
};

const UpdateLeadStatus = async (id, body) => {
  const response = await apiClient.patch(`/leads/${id}`, body);
  return response.status;
};

const checkCustomerExist = async (phone, email) => {
  const response = await apiClient.get(
    `/customers/exists?phone=${phone}&email=${email}`
  );
  return response.json();
};

const createLead = async (data) => {
  const response = await apiClient.post(`/leads`, data);
  return response.json();
};

const createLocation = async (data) => {
  const response = await apiClient.post(`/locations`, data);
  return response.json();
};

const createStaffExitTicket = async (data) => {
  const response = await apiClient.post(`/tickets/exit`, data);
  return response.json();
};

const sendOtp = async () => {
  const response = await apiClient.post(`/tickets/send-otp`);
  return response.status;
};

const verifyOtp = async (data) => {
  const response = await apiClient.post(`/tickets/verify-otp`, data);
  const res = await response.json();
  return res;
};

const sendSaleActionOtp = async () => {
  const response = await apiClient.post(`/sales/action-otp/send`);
  return response.json();
};

const verifySaleActionOtp = async (otp) => {
  const response = await apiClient.post(`/sales/action-otp/verify`, { otp });
  return response.json();
};

const sendPromotion = async (data) => {
  const response = await apiClient.post(`/promotions/send`, data);
  return response.json();
};

const getCorporateEmployees = async (deleted, isCorporate) => {
  const response = await apiClient.get(
    `/users/employee?deleted=${deleted}&isCorporate=${isCorporate}`
  );
  return response.json();
};

const updateCustomerById = async (id, body) => {
  const response = await apiClient.patch(`/customers/${id}`, body);
  return response.status;
};

const getCustomerPointsHistory = async (customerId, page = 1, limit = 50) => {
  const response = await apiClient.get(
    `/customers/${customerId}/points-history?page=${page}&limit=${limit}`
  );
  return response.json();
};

const getAllStates = async (id) => {
  const response = await apiClient.get(`/locations/states?id=${id}`);
  return response.json();
};

const getCities = async (id) => {
  const response = await apiClient.get(`/locations/cities?id=${id}`);
  return response.json();
};

const getLocationById = async (id) => {
  const response = await apiClient.get(`/locations/${id}`);
  return response.json();
};

const updateLocationById = async (id, body) => {
  const response = await apiClient.patch(`/locations/${id}`, body);
  return response.json();
};

const getTsms = async () => {
  const response = await apiClient.get(`/locations/tsms`);
  return response.json();
};

const getLocationTsm = async (locationId) => {
  const response = await apiClient.get(`/locations/${locationId}/tsm`);
  return response.json();
};

const assignTsmToLocation = async (locationId, tsmId) => {
  const response = await apiClient.post(`/locations/${locationId}/tsm`, {
    tsmId,
  });
  return response.json();
};

const getlastLocationSale = async (locationId) => {
  const response = await apiClient.get(`/sales/get-last-sale/${locationId}`);
  return response.json();
};

const getCustomerLastSale = async (id, page, limit, startDate, endDate) => {
  const response = await apiClient.get(
    `/sales/${id}/get-sales?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.json();
};

const getCustomerSaleHistory = async (id) => {
  const response = await apiClient.get(`/customers/sales/${id}`);
  return response.json();
};

const createFamilyCards = async (data) => {
  const response = await apiClient.post(`/familycards`, data);
  return response.json();
};

const updateFamilyCards = async (id, data) => {
  const response = await apiClient.patch(`/familycards/${id}`, data);
  return response;
};

const redeemFamilyCards = async (id, data) => {
  const response = await apiClient.patch(`/familycards/${id}/redeem`, data);
  return response;
};

const redeemCoupons = async (id, data) => {
  const response = await apiClient.patch(`/coupons/${id}/redeem`, data);

  return response;
};

const createGiftCards = async (data) => {
  const response = await apiClient.post(`/giftcards`, data);

  return response;
};

const updateGiftCards = async (id, data) => {
  const response = await apiClient.patch(`/giftcards/${id}`, data);

  return response;
};

const redeemGiftCards = async (id, data) => {
  const response = await apiClient.patch(`/giftcards/${id}/redeem`, data);

  return response;
};

const getSaleReport = async (startDate, endDate) => {
  const response = await apiClient.get(
    `/reports/sales?from=${startDate}&to=${endDate}`
  );
  return response.json();
};

const getSaleDataReport = async (from, to) => {
  const response = await apiClient.get(
    `/reports/daily-count?startDate=${from}&endDate=${to}`
  );
  return response.json();
};

const getEmployeeReport = async (data) => {
  const response = await apiClient.post(`/reports/employees`, data);
  return response.json();
};

const getEmployeeDataReport = async (from, to, employees) => {
  let filters = ``;

  if (employees) {
    filters += `&employees=${employees}`;
  }
  const response = await apiClient.get(
    `/reports/employees/csv?from=${from}&to=${to}${filters}`
  );
  return response.text();
};

const getSalesDataReport = async (from, to) => {
  const response = await apiClient.get(
    `/reports/sales/csv?from=${from}&to=${to}`
  );
  const res = await response.text();
  return res;
};

const addComment = async (id, data) => {
  const response = await apiClient.post(`/tickets/${id}/comment`, data);
  return await response.text();
};

const addReply = async (id, commentId, data) => {
  const response = await apiClient.post(
    `/tickets/${id}/comment/${commentId}/reply`,
    data
  );
  return await response.text();
};

const getNotifications = async () => {
  const response = await apiClient.get(`/reports/leads/today/overview`);
  return await response.json();
};

const getSuppliers = async (page = 1, limit = 10) => {
  const response = await apiClient.get(
    `/suppliers?page=${page}&limit=${limit}`
  );
  return await response.json();
};

const getSupplierbyName = async (name) => {
  const response = await apiClient.get(`/suppliers/search?name=${name}`);
  return await response.json();
};

const checkAppointmentAvailability = async (data) => {
  const response = await apiClient.post(
    `/appointments/checkAvailability`,
    data
  );
  return await response.json();
};

const customerServicesReport = async (startDate, endDate, itemId) => {
  const response = await apiClient.get(
    `/reports/customer/services?from=${startDate}&to=${endDate}&itemId=${itemId}`
  );
  return await response.json();
};

const customerServicesReportCSV = async (startDate, endDate, itemId) => {
  const response = await apiClient.get(
    `/reports/customer/services/csv?from=${startDate}&to=${endDate}&itemId=${itemId}`
  );
  return await response.blob();
};

const getAllCategoriesNames = async () => {
  const response = await apiClient.get(`/categories/names`);
  return await response.json();
};

const getLowStockReport = async (category) => {
  const response = await apiClient.get(
    `/reports/inventory/low-stock?category=${category}`
  );
  return await response.json();
};

const getInventorySummaryReport = async (category) => {
  const response = await apiClient.get(
    `/reports/inventory/summary?category=${category}`
  );
  return await response.json();
};

const getDetailedInventoryReport = async (fromDate, toDate, itemId, showManualAdjustmentsOnly) => {
  let params = `?fromDate=${fromDate}&toDate=${toDate}`;
  if (itemId && itemId !== -1) {
    params += `&itemId=${itemId}`;
  }
  if (showManualAdjustmentsOnly) {
    params += `&showManualAdjustmentsOnly=true`;
  }
  const response = await apiClient.get(`/reports/inventory/detailed${params}`);
  return await response.json();
};

const getInventoryReceivingsReport = async (fromDate, toDate, category) => {
  const response = await apiClient.get(
    `/reports/inventory/receivings?fromDate=${fromDate}&toDate=${toDate}&category=${category}`
  );
  return await response.json();
};

const getInventoryReceivingsReportCSV = async (fromDate, toDate, category) => {
  const response = await apiClient.get(
    `/reports/inventory/receivings/csv?fromDate=${fromDate}&toDate=${toDate}&category=${category}`
  );
  return await response.blob();
};

const getReceivingsDetailsReport = async (from, to) => {
  let q = "";
  if (from && to) {
    q = `?from=${from}&to=${to}`;
  }
  const response = await apiClient.get(`/reports/receivings/details${q}`);
  return await response.json();
};

const getCustomerRetentionReports = async (timeInterval) => {
  const response = await apiClient.get(
    `/reports/customer/retention?timeInterval=${timeInterval}`
  );
  return await response.json();
};

const getSalesReportDetailed = async (fromDate, toDate) => {
  const response = await apiClient.get(
    `/reports/sales/detailed?from=${fromDate}&to=${toDate}`
  );
  return await response.json();
};

const getSaleDetails = async (saleId) => {
  const response = await apiClient.get(`/sales/${saleId}/details`);
  return await response.json();
};

const deleteSale = async (saleId) => {
  const response = await apiClient.delete(`/sales/${saleId}`);
  return await response.json();
};

const createItemKit = async (data) => {
  const response = await apiClient.post(`/itemkits`, data);
  return await response.json();
};

const updateItemKit = async (itemKitId, data) => {
  const response = await apiClient.patch(`/itemkits/${itemKitId}`, data);
  return await response.json();
};

const editSaleItem = async (saleId, itemId, data) => {
  const response = await apiClient.patch(`/sales/${saleId}/items/${itemId}`, data);
  return await response.json();
};

const editCompletedSale = async (saleId, data) => {
  const response = await apiClient.patch(`/sales/completed/${saleId}`, data);
  return await response.json();
};

const addItemToCompletedSale = async (id, data) => {
  const response = await apiClient.post(`/sales/completed/${id}/items`, data);
  return response;
};

const deleteItemFromCompletedSale = async (saleId, itemId) => {
  const response = await apiClient.delete(
    `/sales/completed/${saleId}/sale-item/${itemId}`
  );
  return response;
};

// Help & FAQ API methods
const getHelpFAQs = async () => {
  const response = await apiClient.get("/help/faqs");
  return await response.json();
};

const getHelpDocumentContent = async (docId) => {
  const response = await apiClient.get(`/help/faqs/${docId}`);
  return await response.json();
};

const searchHelpDocuments = async (query) => {
  const response = await apiClient.get(`/help/search?q=${encodeURIComponent(query)}`);
  return await response.json();
};

const chatWithHelpAI = async (query) => {
  const response = await apiClient.post("/help/chat", { query });
  return await response.json();
};

const getHelpAIStatus = async () => {
  const response = await apiClient.get("/help/status");
  return await response.json();
};

// WhatsApp ESU (Embedded Signup) methods
const startWhatsappEsu = async (locationId) => {
  const response = await apiClient.post(`/locations/${locationId}/whatsapp/esu/start`);
  return response.json();
};

const exchangeWhatsappEsu = async (locationId, payload) => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/esu/exchange`,
    payload
  );
  return response.json();
};

const registerWhatsappNumber = async (locationId, pin) => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/phone/register`,
    { pin }
  );
  return response.json();
};

const sendWhatsappMessage = async (locationId, to, type = "text", text, templateName, templateLanguage = "en") => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/messages/send`,
    { to, type, text, templateName, templateLanguage }
  );
  return response.json();
};

const getWhatsappPhoneStatus = async (locationId) => {
  const response = await apiClient.get(
    `/locations/${locationId}/whatsapp/phone/status`
  );
  return response.json();
};

const getWhatsappOnboardingHealth = async (locationId) => {
  const response = await apiClient.get(
    `/locations/${locationId}/whatsapp/onboarding/health`
  );
  return response.json();
};

const deregisterWhatsappPhone = async (locationId, password) => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/phone/deregister`,
    { password }
  );
  return response.json();
};

const syncWhatsappData = async (locationId, syncType) => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/phone/sync`,
    { sync_type: syncType }
  );
  return response.json();
};

const getWhatsappTemplates = async (locationId) => {
  const response = await apiClient.get(
    `/locations/${locationId}/whatsapp/templates`
  );
  return response.json();
};

const getWhatsappTemplateByName = async (locationId, templateName) => {
  const response = await apiClient.get(
    `/locations/${locationId}/whatsapp/templates/${templateName}`
  );
  return response.json();
};

const createWhatsappTemplate = async (locationId, templateData) => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/templates`,
    templateData
  );
  return response.json();
};

/**
 * Create a WhatsApp template with a media (IMAGE/VIDEO/DOCUMENT) header.
 * Uses multipart/form-data so the file rides alongside the metadata. The
 * browser sets the Content-Type with the multipart boundary itself when we
 * pass FormData — do not set Content-Type manually here.
 */
const createWhatsappTemplateWithMedia = async (locationId, fields, file) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("name", fields.name);
  fd.append("language", fields.language);
  fd.append("category", fields.category);
  fd.append("components", JSON.stringify(fields.components));

  const token = window.localStorage.getItem("yumpos_token");
  const baseUrl = process.env.REACT_APP_PUBLIC_BASE_URL;
  const apiKey = process.env.REACT_APP_PUBLIC_API_KEY;
  const response = await fetch(
    `${baseUrl}/locations/${locationId}/whatsapp/templates/with-media`,
    {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        accept: "application/json",
        authorization: `Bearer ${token}`,
      },
      body: fd,
    }
  );
  return response.json();
};

const updateWhatsappTemplate = async (locationId, templateId, templateData) => {
  const response = await apiClient.put(
    `/locations/${locationId}/whatsapp/templates/${templateId}`,
    templateData
  );
  return response.json();
};

const deleteWhatsappTemplate = async (locationId, templateName) => {
  const response = await apiClient.delete(
    `/locations/${locationId}/whatsapp/templates?name=${templateName}`
  );
  return response.json();
};

// WhatsApp Template Mappings (Notification Templates)
const getWhatsappTemplateMappings = async (locationId) => {
  const response = await apiClient.get(
    `/locations/${locationId}/whatsapp/template-mappings`
  );
  return response.json();
};

const submitWhatsappDefaultTemplates = async (locationId) => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/template-mappings/submit`
  );
  return response.json();
};

const syncWhatsappTemplateStatuses = async (locationId) => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/template-mappings/sync`
  );
  return response.json();
};

const assignWhatsappTemplateToPurpose = async (locationId, purpose, templateName, templateId) => {
  const response = await apiClient.put(
    `/locations/${locationId}/whatsapp/template-mappings/${purpose}`,
    { templateName, templateId }
  );
  return response.json();
};

// WhatsApp Template Version Management
const getWhatsappSubmittedTemplates = async (locationId) => {
  const response = await apiClient.get(
    `/locations/${locationId}/whatsapp/submitted-templates`
  );
  return response.json();
};

const getWhatsappAvailableDefinitions = async (locationId) => {
  const response = await apiClient.get(
    `/locations/${locationId}/whatsapp/available-definitions`
  );
  return response.json();
};

const submitWhatsappDefinition = async (locationId, definitionId) => {
  const response = await apiClient.post(
    `/locations/${locationId}/whatsapp/submit-definition/${definitionId}`
  );
  return response.json();
};

const setWhatsappActiveTemplate = async (locationId, mappingId) => {
  const response = await apiClient.put(
    `/locations/${locationId}/whatsapp/submitted-templates/${mappingId}/activate`
  );
  return response.json();
};

const getWhatsappTemplateDefinitions = async () => {
  const response = await apiClient.get(`/whatsapp/template-definitions`);
  return response.json();
};

// WhatsApp Campaigns
const getWhatsappCampaigns = async (locationId) => {
  const response = await apiClient.get(
    `/whatsapp/campaigns/${locationId}`
  );
  return response.json();
};

const getWhatsappCampaign = async (locationId, campaignId) => {
  const response = await apiClient.get(
    `/whatsapp/campaigns/${locationId}/${campaignId}`
  );
  return response.json();
};

const createWhatsappCampaign = async (locationId, data) => {
  const response = await apiClient.post(
    `/whatsapp/campaigns/${locationId}`,
    data
  );
  return response.json();
};

const updateWhatsappCampaign = async (locationId, campaignId, data) => {
  const response = await apiClient.put(
    `/whatsapp/campaigns/${locationId}/${campaignId}`,
    data
  );
  return response.json();
};

const deleteWhatsappCampaign = async (locationId, campaignId) => {
  const response = await apiClient.delete(
    `/whatsapp/campaigns/${locationId}/${campaignId}`
  );
  return response.json();
};

const previewWhatsappCampaignAudience = async (locationId, audienceType, audienceFilter) => {
  const response = await apiClient.post(
    `/whatsapp/campaigns/${locationId}/preview-audience`,
    { audienceType, audienceFilter }
  );
  return response.json();
};

const startWhatsappCampaign = async (locationId, campaignId) => {
  const response = await apiClient.post(
    `/whatsapp/campaigns/${locationId}/${campaignId}/start`
  );
  return response.json();
};

const pauseWhatsappCampaign = async (locationId, campaignId) => {
  const response = await apiClient.post(
    `/whatsapp/campaigns/${locationId}/${campaignId}/pause`
  );
  return response.json();
};

const cancelWhatsappCampaign = async (locationId, campaignId) => {
  const response = await apiClient.post(
    `/whatsapp/campaigns/${locationId}/${campaignId}/cancel`
  );
  return response.json();
};

const getWhatsappCampaignRecipients = async (locationId, campaignId, options = {}) => {
  const { page = 1, limit = 50, status, search } = options;
  let url = `/whatsapp/campaigns/${locationId}/${campaignId}/recipients?page=${page}&limit=${limit}`;
  if (status) url += `&status=${status}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const response = await apiClient.get(url);
  return response.json();
};

const addWhatsappCampaignRecipients = async (locationId, campaignId, phoneNumbers) => {
  const response = await apiClient.post(
    `/whatsapp/campaigns/${locationId}/${campaignId}/add-recipients`,
    { phoneNumbers }
  );
  return response.json();
};

const getWhatsappCampaignStats = async (locationId, campaignId) => {
  const response = await apiClient.get(
    `/whatsapp/campaigns/${locationId}/${campaignId}/stats`
  );
  return response.json();
};

// WhatsApp Chat API
const getWhatsappChatConversations = async (locationId, options = {}) => {
  const { status = 'active', search = '', page = 1, limit = 20 } = options;
  let url = `/whatsapp/chat/${locationId}/conversations?page=${page}&limit=${limit}&status=${status}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const response = await apiClient.get(url);
  return response.json();
};

const getWhatsappChatUnreadCount = async (locationId) => {
  const response = await apiClient.get(
    `/whatsapp/chat/${locationId}/unread-count`
  );
  return response.json();
};

const getWhatsappChatConversation = async (locationId, conversationId) => {
  const response = await apiClient.get(
    `/whatsapp/chat/${locationId}/conversations/${conversationId}`
  );
  return response.json();
};

const getWhatsappChatMessages = async (locationId, conversationId, page = 1, limit = 50) => {
  const response = await apiClient.get(
    `/whatsapp/chat/${locationId}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
  );
  return response.json();
};

const sendWhatsappChatMessage = async (locationId, conversationId, data) => {
  const response = await apiClient.post(
    `/whatsapp/chat/${locationId}/conversations/${conversationId}/send`,
    data
  );
  return response.json();
};

const startWhatsappChatConversation = async (locationId, data) => {
  const response = await apiClient.post(
    `/whatsapp/chat/${locationId}/start-conversation`,
    data
  );
  return response.json();
};

const markWhatsappChatAsRead = async (locationId, conversationId) => {
  const response = await apiClient.post(
    `/whatsapp/chat/${locationId}/conversations/${conversationId}/read`
  );
  return response.json();
};

const archiveWhatsappChatConversation = async (locationId, conversationId) => {
  const response = await apiClient.post(
    `/whatsapp/chat/${locationId}/conversations/${conversationId}/archive`
  );
  return response.json();
};

// ----- Google My Business (GMB) -----
const getGmbAuthUrl = async (locationId) => {
  const response = await apiClient.get(`/gmb/${locationId}/auth-url`);
  return response.json();
};

const connectGmb = async (locationId, code) => {
  const response = await apiClient.post(`/gmb/${locationId}/connect`, { code });
  return response.json();
};

const getGmbConnectionStatus = async (locationId) => {
  const response = await apiClient.get(`/gmb/${locationId}/status`);
  return response.json();
};

const getGmbAccounts = async (locationId) => {
  const response = await apiClient.get(`/gmb/${locationId}/accounts`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to load Google accounts");
  }
  return data;
};

const getGmbAccountLocations = async (locationId, accountId) => {
  const response = await apiClient.get(
    `/gmb/${locationId}/accounts/${accountId}/locations`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to load Google locations");
  }
  return data;
};

const mapGmbLocation = async (locationId, body) => {
  const response = await apiClient.post(`/gmb/${locationId}/map`, body);
  return response.json();
};

const getGmbMapping = async (locationId) => {
  const response = await apiClient.get(`/gmb/${locationId}`);
  return response.json();
};

const disconnectGmbLocation = async (locationId) => {
  const response = await apiClient.delete(`/gmb/${locationId}/map`);
  return response.json();
};

const logoutGmbAccount = async (locationId) => {
  const response = await apiClient.delete(`/gmb/${locationId}/account`);
  return response.json();
};

const getGmbReviews = async (locationId, page = 1, limit = 20) => {
  const response = await apiClient.get(
    `/gmb/${locationId}/reviews?page=${page}&limit=${limit}`
  );
  return response.json();
};

const syncGmbReviews = async (locationId) => {
  const response = await apiClient.post(`/gmb/${locationId}/reviews/sync`);
  return response.json();
};

const replyGmbReview = async (locationId, reviewId, comment) => {
  const response = await apiClient.put(
    `/gmb/${locationId}/reviews/${reviewId}/reply`,
    { comment }
  );
  return response.json();
};

const deleteGmbReply = async (locationId, reviewId) => {
  const response = await apiClient.delete(
    `/gmb/${locationId}/reviews/${reviewId}/reply`
  );
  return response.json();
};

const aiReplyGmbReview = async (locationId, reviewId) => {
  const response = await apiClient.post(
    `/gmb/${locationId}/reviews/${reviewId}/ai-reply`
  );
  // AI generation (OpenRouter) can fail intermittently -> backend returns 5xx.
  // Surface that as a thrown error so callers show an error toast.
  if (!response.ok) throw new Error("AI reply generation failed");
  return response.json();
};

const bulkAiReplyGmb = async (locationId) => {
  const response = await apiClient.post(
    `/gmb/${locationId}/reviews/bulk-ai-reply`
  );
  if (!response.ok) throw new Error("Bulk AI reply failed to start");
  return response.json();
};

const getGmbPerformance = async (locationId, metric, start, end) => {
  const response = await apiClient.get(
    `/gmb/${locationId}/performance?metric=${metric}&start=${start}&end=${end}`
  );
  return response.json();
};

const getGmbPosts = async (locationId) => {
  const response = await apiClient.get(`/gmb/${locationId}/posts`);
  return response.json();
};

const createGmbPost = async (locationId, body) => {
  const response = await apiClient.post(`/gmb/${locationId}/posts`, body);
  return response.json();
};

const deleteGmbPost = async (locationId, name) => {
  const response = await apiClient.delete(
    `/gmb/${locationId}/posts?name=${encodeURIComponent(name)}`
  );
  return response.json();
};

const getGmbMedia = async (locationId) => {
  const response = await apiClient.get(`/gmb/${locationId}/media`);
  return response.json();
};

const createGmbMedia = async (locationId, body) => {
  const response = await apiClient.post(`/gmb/${locationId}/media`, body);
  return response.json();
};

// Uploads an image to DO Spaces via the API and returns { url }. Uses
// multipart/form-data — let the browser set the Content-Type boundary.
const uploadGmbImage = async (locationId, file) => {
  const fd = new FormData();
  fd.append("file", file);
  const token = window.localStorage.getItem("yumpos_token");
  const baseUrl = process.env.REACT_APP_PUBLIC_BASE_URL;
  const apiKey = process.env.REACT_APP_PUBLIC_API_KEY;
  const response = await fetch(`${baseUrl}/gmb/${locationId}/upload-image`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
    body: fd,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message || "Image upload failed");
  return data;
};

// ----- WhatsApp merge-variable catalog -----
const getWhatsappVariables = async (activeOnly = false) => {
  const response = await apiClient.get(
    `/whatsapp/variables${activeOnly ? "?activeOnly=true" : ""}`
  );
  return response.json();
};

const createWhatsappVariable = async (data) => {
  const response = await apiClient.post(`/whatsapp/variables`, data);
  return response.json();
};

const updateWhatsappVariable = async (id, data) => {
  const response = await apiClient.put(`/whatsapp/variables/${id}`, data);
  return response.json();
};

const deleteWhatsappVariable = async (id) => {
  const response = await apiClient.delete(`/whatsapp/variables/${id}`);
  return response.json();
};

export default {
  getWhatsappVariables,
  createWhatsappVariable,
  updateWhatsappVariable,
  deleteWhatsappVariable,
  getGmbAuthUrl,
  connectGmb,
  getGmbConnectionStatus,
  getGmbAccounts,
  getGmbAccountLocations,
  mapGmbLocation,
  getGmbMapping,
  disconnectGmbLocation,
  logoutGmbAccount,
  getGmbReviews,
  syncGmbReviews,
  replyGmbReview,
  deleteGmbReply,
  aiReplyGmbReview,
  bulkAiReplyGmb,
  getGmbPerformance,
  getGmbPosts,
  createGmbPost,
  deleteGmbPost,
  getGmbMedia,
  createGmbMedia,
  uploadGmbImage,
  getSaleDetails,
  getSalesReportDetailed,
  getCustomerRetentionReports,
  getInventoryReceivingsReportCSV,
  getInventoryReceivingsReport,
  getReceivingsDetailsReport,
  getInventorySummaryReport,
  getDetailedInventoryReport,
  getLowStockReport,
  getAllCategoriesNames,
  customerServicesReportCSV,
  customerServicesReport,
  searchItemsWithoutSignal,
  createSupplier,
  checkAppointmentAvailability,
  getSupplierbyName,
  getSuppliers,
  getSaleDataReport,
  getNotifications,
  loginEmployee,
  resetEmail,
  resetPassword,
  dashboardSales,
  getUserLocations,
  getEodPrefill,
  saveEodReport,
  getEodReports,
  setUserLocation,
  getLocationLeads,
  getSummaryGraph,
  getLeadFeedback,
  getCustomerData,
  getLeadSource,
  getLeadStatus,
  getCustomerPhone,
  getFamilyCardbyLocation,
  getFamilyCardDetailsbyId,
  getGiftCardDetailsbyId,
  getGiftCardbyLocation,
  getCouponbyLocation,
  validateCoupon,
  getServicesbyLocation,
  getRetailProductbyLocation,
  getItemsbyLocation,
  getServiceBom,
  upsertServiceBom,
  deleteServiceBomItem,
  getLocationData,
  createEmployee,
  getItemDetails,
  getTicketsbyLocation,
  searchItems,
  createStaffingTicket,
  getLocationReviews,
  getSmsReport,
  completeSale,
  getAppointmentInformation,
  createAppointment,
  salesAppointment,
  updateAppointment,
  deleteAppointment,
  getUpcomingAppointmentReminders,
  addItemToAppointmentSale,
  addItemKitToAppointmentSale,
  completeAppointmentSaleBySaleId,
  suspendSale,
  getSuspendSales,
  deleteSuspendSale,
  getSaleReceipt,
  createCustomer,
  getCustomerViewSalesById,
  createItemInformation,
  getItemCategories,
  getCategoriesId,
  deleteEmployee,
  createCoupon,
  createBounceBackCoupon,
  getBounceBackSummary,
  getBounceBackIssuance,
  getBounceBackRedemption,
  getBounceBackDailyCounts,
  getFirstVisitReport,
  getFirstVisitSummary,
  getFirstVisitDailyCounts,
  getEmployeePerformance,
  saveEmployeeTarget,
  storeLocations,
  UpdateLeadStatus,
  checkCustomerExist,
  createLead,
  createLocation,
  createTrainingTicket,
  createStaffExitTicket,
  getStaffExitTicket,
  sendOtp,
  verifyOtp,
  sendSaleActionOtp,
  verifySaleActionOtp,
  getCorporateEmployees,
  getCouponById,
  updateCustomerById,
  getCustomerPointsHistory,
  getCities,
  getAllStates,
  getLocationById,
  updateLocationById,
  getTsms,
  getLocationTsm,
  assignTsmToLocation,
  getlastLocationSale,
  getCustomerLastSale,
  getCustomerSaleHistory,
  getItemsById,
  createFamilyCards,
  createGiftCards,
  updateGiftCards,
  updateFamilyCards,
  getCustomerDataByName,
  searchItemsAndItemKits,
  getSmsTemplates,
  sendPromotion,
  updateEmployee,
  getEmployeeDetails,
  employeeLocationDetails,
  employeeShiftsDetails,
  getPackageSales,
  updatePackageSale,
  updateGiftCards,
  getSaleReport,
  getEmployeeReport,
  redeemFamilyCards,
  redeemGiftCards,
  redeemCoupons,
  deleteItemFromAppointmentSale,
  deleteItemKitFromAppointmentSale,
  addItemToSuspendSale,
  addItemKitToSuspendSale,
  deleteItemFromSuspendSale,
  deleteItemKitFromSuspendSale,
  completeSuspendSaleBySaleId,
  changeDetachCustomer,
  getEmployeeDataReport,
  getSalesDataReport,
  getAllCategories,
  getPublicSaleReceipt,
  getTicketsbyId,
  closeTicket,
  addComment,
  addReply,
  createRecievings,
  deleteSale,
  getAllLocationItems,
  createItemKit,
  updateItemKit,
  editSaleItem,
  editCompletedSale,
  addItemToCompletedSale,
  deleteItemFromCompletedSale,
  // Help & FAQ
  getHelpFAQs,
  getHelpDocumentContent,
  searchHelpDocuments,
  chatWithHelpAI,
  getHelpAIStatus,
  // WhatsApp ESU
  startWhatsappEsu,
  exchangeWhatsappEsu,
  registerWhatsappNumber,
  sendWhatsappMessage,
  getWhatsappPhoneStatus,
  getWhatsappOnboardingHealth,
  deregisterWhatsappPhone,
  syncWhatsappData,
  getWhatsappTemplates,
  getWhatsappTemplateByName,
  createWhatsappTemplate,
  createWhatsappTemplateWithMedia,
  updateWhatsappTemplate,
  deleteWhatsappTemplate,
  // WhatsApp Template Mappings
  getWhatsappTemplateMappings,
  submitWhatsappDefaultTemplates,
  syncWhatsappTemplateStatuses,
  assignWhatsappTemplateToPurpose,
  // WhatsApp Template Version Management
  getWhatsappSubmittedTemplates,
  getWhatsappAvailableDefinitions,
  submitWhatsappDefinition,
  setWhatsappActiveTemplate,
  getWhatsappTemplateDefinitions,
  // WhatsApp Campaigns
  getWhatsappCampaigns,
  getWhatsappCampaign,
  createWhatsappCampaign,
  updateWhatsappCampaign,
  deleteWhatsappCampaign,
  previewWhatsappCampaignAudience,
  startWhatsappCampaign,
  pauseWhatsappCampaign,
  cancelWhatsappCampaign,
  getWhatsappCampaignRecipients,
  addWhatsappCampaignRecipients,
  getWhatsappCampaignStats,
  // WhatsApp Chat
  getWhatsappChatConversations,
  getWhatsappChatUnreadCount,
  getWhatsappChatConversation,
  getWhatsappChatMessages,
  sendWhatsappChatMessage,
  startWhatsappChatConversation,
  markWhatsappChatAsRead,
  archiveWhatsappChatConversation,
};

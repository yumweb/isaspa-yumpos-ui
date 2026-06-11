import {
  Input,
  InputLabel,
  FormGroup,
  Checkbox,
  Button,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  Typography,
  Divider,
  AccordionDetails,
  Container,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import clientAdapter from "../../lib/clientAdapter";
import { useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";

const CouponsView = ({ onClickBack, cupon }) => {
  const [couponNumber, setCouponNumber] = useState("");
  const [description, setDescription] = useState("");
  const [couponOption, setCouponOption] = useState("");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [validityDate, setValidityDate] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [check, setCheck] = useState(false);
  const [onetime, setOneTime] = useState(false);
  const [minBillValue, setMinBillValue] = useState("");
  const [data, setData] = useState("");
  const [couponData, setCouponData] = useState([]);
  const [couponLogs, setCouponLogs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(false);
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  const location = useLocation();

  const createCoupon = async () => {
    // Validate required fields
    if (!description) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Please select a coupon type (Description)",
      });
      return;
    }

    const data = {
      couponNumber,
      description,
      couponOption,
      value,
      startDate,
      validityDate,
      onetime,
    };
    if (customerId) {
      data.customerId = customerId;
    }
    if (minBillValue) {
      data.minBillValue = parseFloat(minBillValue);
    }
    try {
      const res = await clientAdapter.createCoupon(data);
      if (!res?.statusCode) {
        setData(res);
        setSnackBar({
          ...snackBar,
          open: true,
          severity: "success",
          message: "Coupon created successfully",
        });
        setTimeout(() => onClickBack(), 2000);
      } else {
        throw new Error(res?.message?.message[0] || "Error creating coupon");
      }
    } catch (error) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: error?.message || "Error creating coupon",
      });
    }
  };

  const getCouponDetails = async () => {
    const queryParameters = new URLSearchParams(location.search);
    const id = queryParameters.get("id");
    if (id) {
      const CouponRes = await clientAdapter.getCouponById(id);
      setCouponData(CouponRes);
    }
  };
  const getCustomersByPhone = async (phone) => {
    if (phone && phone.length >= 3) {
      try {
        const response = await clientAdapter.getCustomerDataByName(1, 10, phone);
        if (response && response.customers) {
          setCustomers(response.customers);
        } else {
          setCustomers([]);
        }
      } catch (error) {
        setCustomers([]);
      }
    } else {
      setCustomers([]);
    }
  };

  useEffect(() => {
    if (cupon.isEditing && cupon.editItem) {
      const item = cupon.editItem.originalData || cupon.editItem;
      setCouponNumber(item.couponNumber || "");
      setDescription(item.description || "");
      setCouponOption(item.couponOption || "");
      setValue(item.value || "");
      setStartDate(item.startDate ? item.startDate.split("T")[0] : "");
      setValidityDate(item.validityDate ? item.validityDate.split("T")[0] : "");
      setCheck(item.onetime || false);
      setOneTime(item.onetime || false);
      setCouponLogs(item.couponLogs || []);
      setMinBillValue(item.minBillValue || "");
      if (item.person) {
        setCustomerName(
          `${item.person.firstName || ""} ${item.person.lastName || ""}`.trim()
        );
        setCustomerPhone(item.person.phoneNumber || "");
        setCustomerId(item.customerId || "");
      }
    } else {
      getCouponDetails();
    }
  }, [cupon]);

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const handleChange = () => {
    setCheck(!check);
    setOneTime(!check);
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"}>
        <ArrowBackIcon style={{ cursor: "pointer" }} onClick={onClickBack} />
        <Typography ml={2} fontSize={22} fontWeight={"bold"}>
          {cupon.isEditing ? "View Coupon" : "Create Coupon"}
        </Typography>
      </Box>
      <Accordion expanded>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Coupon Information</Typography>
        </AccordionSummary>
        <Divider></Divider>
        <AccordionDetails>
          <Container
            style={{
              backgroundColor: "white",
              padding: "25px",
              paddingTop: "0px",
              borderRadius: "3px",
            }}
          >
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "red",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Coupon Number :
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                  value={couponNumber}
                  id="couponNumber"
                  disabled={cupon.isEditing}
                  onChange={(e) => setCouponNumber(e.target.value)}
                ></Input>
              </InputLabel>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "red",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Description :
                <Select
                  IconComponent={false}
                  variant="standard"
                  disableUnderline={true}
                  style={{
                    width: "80%",
                    border: "1px solid Gray",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                  id="description"
                  value={description}
                  disabled={cupon.isEditing}
                  onChange={(e) => setDescription(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Coupon Type
                  </MenuItem>
                  <MenuItem value="Bounce Back Coupon">
                    Bounce Back Coupon
                  </MenuItem>
                  <MenuItem value="Gift-certificate">Gift-certificate</MenuItem>
                  <MenuItem value="Voucher">Voucher</MenuItem>
                  <MenuItem value="Family saver-kit">Family saver-kit</MenuItem>
                </Select>
              </InputLabel>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "red",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Select Price Value Or
                <br /> Discount % :
                <Select
                  IconComponent={false}
                  variant="standard"
                  disableUnderline={true}
                  style={{
                    width: "80%",
                    border: "1px solid Gray",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                  type="enum"
                  id="discount"
                  value={couponOption}
                  disabled={cupon.isEditing}
                  onChange={(e) => setCouponOption(e.target.value)}
                >
                  <MenuItem value="percentage" selected>
                    Percentage Discount
                  </MenuItem>
                  <MenuItem value="pricevalue">Price Value</MenuItem>
                </Select>
              </InputLabel>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "red",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Value :
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                  id="value"
                  value={value}
                  disabled={cupon.isEditing}
                  onChange={(e) => setValue(e.target.value)}
                ></Input>
              </InputLabel>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Min Bill Value (Optional) :
                <Input
                  disableUnderline={true}
                  type="number"
                  placeholder="Leave empty for no minimum"
                  size="small"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                  id="minBillValue"
                  value={minBillValue}
                  disabled={cupon.isEditing}
                  onChange={(e) => setMinBillValue(e.target.value)}
                ></Input>
              </InputLabel>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "red",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Start Date :
                <Input
                  type="date"
                  disableUnderline={true}
                  required
                  size="small"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                  id="startDate"
                  value={startDate}
                  disabled={cupon.isEditing}
                  onChange={(e) => setStartDate(e.target.value)}
                ></Input>
              </InputLabel>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "red",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Valid Upto :
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                  id="validity"
                  value={validityDate}
                  disabled={cupon.isEditing}
                  onChange={(e) => setValidityDate(e.target.value)}
                  type="date"
                ></Input>
              </InputLabel>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Onetime Coupon :
                <Checkbox
                  checked={check}
                  value={check}
                  disabled={cupon.isEditing}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                  style={{ left: "-77%" }}
                />
              </InputLabel>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
                position: "relative",
              }}
            >
              <InputLabel
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Customer Phone :
                <Input
                  disableUnderline={true}
                  size="small"
                  placeholder="Enter phone number to search"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "white",
                  }}
                  id="customerPhone"
                  value={customerPhone}
                  disabled={cupon.isEditing}
                  onChange={(e) => {
                    if (!cupon.isEditing) {
                      const phone = e.target.value.replace(/[^0-9]/g, "");
                      setCustomerPhone(phone);
                      getCustomersByPhone(phone);
                      setCustomerSelected(true);
                    }
                  }}
                ></Input>
              </InputLabel>
              {customerName && (
                <Typography
                  variant="body2"
                  style={{
                    marginLeft: "20%",
                    color: "#4caf50",
                    fontWeight: "500",
                  }}
                >
                  Selected: {customerName}
                </Typography>
              )}
              {customers && customers.length > 0 && customerSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "20%",
                    width: "60%",
                    backgroundColor: "white",
                    padding: "5px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    border: "1px solid Gray",
                    borderRadius: "3px",
                    zIndex: 9999,
                    cursor: "pointer",
                  }}
                >
                  {customers.map((eachCustomer, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "white",
                        padding: "8px",
                        borderBottom:
                          index < customers.length - 1
                            ? "1px solid #eee"
                            : "none",
                      }}
                      onClick={() => {
                        setCustomerName(
                          `${eachCustomer?.person?.firstName || ""} ${
                            eachCustomer?.person?.lastName || ""
                          }`.trim()
                        );
                        setCustomerId(parseInt(eachCustomer?.personId));
                        setCustomerSelected(false);
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "500" }}>
                        {eachCustomer?.person?.firstName}{" "}
                        {eachCustomer?.person?.lastName}
                      </p>
                      <small style={{ color: "#666" }}>
                        {eachCustomer?.person?.phoneNumber}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </FormGroup>

            {/* Coupon Log Section - Only shown when viewing */}
            {cupon.isEditing && (
              <FormGroup
                style={{
                  display: "inline-block",
                  width: "100%",
                  fontFamily: "Russo One, sans-serif",
                  marginTop: "20px",
                }}
              >
                <InputLabel
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px",
                    color: "black",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Coupon Log :
                </InputLabel>
                {couponLogs?.length > 0 ? (
                  <div
                    style={{
                      border: "1px solid grey",
                      borderRadius: "4px",
                      padding: "12px 8px",
                      backgroundColor: "#F1F4F5",
                      color: "green",
                      width: "98%",
                      margin: "auto",
                      fontSize: "14px",
                    }}
                  >
                    {couponLogs.map((log, index) => (
                      <p
                        style={{
                          fontSize: "14px",
                          paddingBottom: 0,
                          marginBottom: index < couponLogs.length - 1 ? "8px" : 0,
                        }}
                        key={index}
                      >
                        {moment(log.logDate).format("DD/MM/YYYY, hh:mm a")} - {log.logMessage}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      border: "1px solid grey",
                      borderRadius: "4px",
                      padding: "12px 8px",
                      backgroundColor: "#F1F4F5",
                      color: "#666",
                      width: "98%",
                      margin: "auto",
                      fontSize: "14px",
                    }}
                  >
                    No logs available
                  </div>
                )}
              </FormGroup>
            )}

            {!cupon.isEditing && (
              <Button
                style={{
                  color: "white",
                  borderRadius: "4px",
                  backgroundColor: "black",
                  border: "0",
                  right: "-95%",
                  marginTop: "20px",
                }}
                onClick={() => createCoupon()}
              >
                Submit
              </Button>
            )}
          </Container>
        </AccordionDetails>
      </Accordion>
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
    </>
  );
};

export default CouponsView;

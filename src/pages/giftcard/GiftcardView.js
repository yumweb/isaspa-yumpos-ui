import React from "react";
import {
  InputLabel,
  Checkbox,
  FormGroup,
  Accordion,
  AccordionSummary,
  Divider,
  Input,
  AccordionDetails,
  Typography,
  Container,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useState } from "react";
import clientAdapter from "../../lib/clientAdapter";
import { useEffect } from "react";
import moment from "moment-timezone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const GiftcardView = ({ onClickBack, giftCard }) => {
  const [data, setData] = useState(null);
  const [giftCardNumber, setGiftCardNumber] = useState("");
  const [giftCardValue, setGiftCardValue] = useState("");
  const [description, setDescription] = useState("");
  const [inactive, setInactive] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    if (giftCard.isEditing) {
      setGiftCardNumber(giftCard?.editItem?.giftcardNumber);
      setGiftCardValue(giftCard?.editItem?.value);
      setDescription(giftCard?.editItem?.description);
      setInactive(giftCard?.editItem?.inactive === "Active" ? false : true);
      setCustomerName(
        `${giftCard?.editItem?.person?.firstName || ""} ${
          giftCard?.editItem?.person?.lastName || ""
        }`
      );
      setSelectedCustomer(giftCard?.editItem?.person);
    }
  }, []);
  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;

    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const onChangeGiftCardNumber = (e) => {
    setGiftCardNumber(e.target.value);
  };
  const onChangeGiftCardDescription = (e) => {
    setDescription(e.target.value);
  };
  const onChangeGiftCardvalue = (e) => {
    setGiftCardValue(e.target.value);
  };

  const onChangeInactive = (e) => {
    setInactive(e.target.checked);
  };

  const fetchSearchResults = async (name) => {
    try {
      if (name.length >= 1) {
        const cres = await clientAdapter.getCustomerDataByName(
          1,
          5,
          customerName
        );
        if (cres) {
          setCustomer(cres.customers);
        } 
      } else {
        setCustomer([]);
      }
    } catch (error) {
      console.error("Error fetching customer", error);
    }
  };

  const debouncedFetchSearchResults = debounce(fetchSearchResults, 300);

  const onChangeCustomerName = async (e) => {
    setCustomerName(e.target.value);
    const name = e.target.value;
    debouncedFetchSearchResults(name);
  };

  const handleSelectCustomer = (c) => {
    setSelectedCustomer(c);
    setCustomerName(`${c?.person?.firstName} ${c?.person?.lastName}`);
    setCustomer([]);
  };
  const onValidate = () => {
    if (giftCardNumber === "") {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Please enter giftcard number`,
      });
      return false;
    } else if (giftCardValue === "") {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Please enter giftcard value`,
      });
    } else {
      return true;
    }
  };

  const updateGiftcard = async () => {
    const customerId = selectedCustomer?.person?.id;
    if (!onValidate()) {
      return;
    }
    const options = {
      giftcardNumber: giftCardNumber,
      description: description,
      value: Number(giftCardValue),
    };
    if (customerId) {
      options.customerId = customerId;
    }
    try {
      const res = giftCard.isEditing
        ? await clientAdapter.updateGiftCards(giftCard?.editItem?.id, options)
        : await clientAdapter.createGiftCards(options);
      if (
        (!giftCard.isEditing && res?.id) ||
        (giftCard.isEditing && res.status === 200)
      ) {
        setSnackBar({
          open: true,
          severity: "success",
          message: `Successfully ${
            giftCard?.isEditing ? "updated" : "created"
          } giftcard`,
        });
        setTimeout(() => {
          onClickBack();
        }, 2000);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Something went wrong`,
      });
    }
  };

  const customerList = (customer) => {
    return (
      <div>
        {customer.map((i, x) => (
          <div
            className="data-result"
            onClick={() => handleSelectCustomer(i)}
            style={{
              cursor: "pointer",
              width: "80%",
              marginLeft: "auto",
              float: "right",
            }}
            key={x}
          >
            <p className="customer-number">
              {i.person.phoneNumber}
              <br></br>
              <span className="customer-name">{i?.person?.firstName}</span>
              <span className="customer-lname">{i?.person?.lastName}</span>
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"}>
        <ArrowBackIcon style={{ cursor: "pointer" }} onClick={onClickBack} />
        <Typography ml={2} fontSize={22} fontWeight={"bold"}>
          {giftCard?.isEditing ? "Edit Gift card" : "Create Gift card"}
        </Typography>
      </Box>
      <Accordion expanded>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Giftcard Information</Typography>
        </AccordionSummary>
        <Divider></Divider>
        <AccordionDetails>
          <Container
            style={{
              backgroundColor: "white",
              padding: "20px",
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
                Giftcard Number :
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
                    backgroundColor: "#F1F4F5",
                  }}
                  value={giftCardNumber}
                  onChange={onChangeGiftCardNumber}
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
                Description :
                <Input
                  disableUnderline={true}
                  required
                  multiline={true}
                  rows={4}
                  size="small"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "#F1F4F5",
                  }}
                  value={description}
                  onChange={onChangeGiftCardDescription}
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
                Value:
                <Input
                  disableUnderline={true}
                  readOnly={giftCard?.isEditing ? true : false}
                  required
                  size="small"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "#F1F4F5",
                  }}
                  value={
                    giftCard.isEditing
                      ? Number(giftCardValue).toFixed(2)
                      : giftCardValue
                  }
                  onChange={(e) => {
                    !giftCard.isEditing && onChangeGiftCardvalue(e);
                  }}
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
                Customer Name :
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  type="search"
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "#F1F4F5",
                  }}
                  value={customerName}
                  onChange={onChangeCustomerName}
                ></Input>
              </InputLabel>
              {customer?.length ? customerList(customer) : null}
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
                Inactive :
                <Checkbox
                  checked={inactive}
                  onChange={onChangeInactive}
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
                Giftcard Logs
              </InputLabel>
              {data?.giftcardLogs?.length ? (
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
                  {data?.giftcardLogs?.map((i, x) => (
                    <p
                      style={{
                        fontSize: "14px",
                        paddingBottom: 0,
                        marginBottom: 0,
                      }}
                      key={x}
                    >
                      {moment(i.logDate).format("DD/MM/YYYY, hh:mm a")}{" "}
                      {i.logMessage}
                    </p>
                  ))}
                </div>
              ) : null}
            </FormGroup>
            <Button
              style={{
                color: "white",
                borderRadius: "4px",
                backgroundColor: "black",
                border: "0",
                float: "right",
                marginBottom: "16px",
                marginTop: "16px",
              }}
              onClick={updateGiftcard}
            >
              Submit
            </Button>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={() => {
          setSnackBar({ ...snackBar, open: false });
        }}
      >
        <Alert
          onClose={() => {
            setSnackBar({ ...snackBar, open: false });
          }}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GiftcardView;

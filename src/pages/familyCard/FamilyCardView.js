import {
  Input,
  InputLabel,
  FormGroup,
  Checkbox,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Accordion,
  AccordionSummary,
  Typography,
  Divider,
  AccordionDetails,
  Container,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import clientAdapter from "../../lib/clientAdapter";
import moment from "moment-timezone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { familyCardTimePackage } from "../../data/sale";

const FamilyCardView = ({ onClickBack, familyCard }) => {
  const [data, setData] = useState([]);
  const [familyCardNumber, setFamilyCardNumber] = useState("");
  const [familyCardValue, setFamilyCardValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [inactive, setInactive] = useState(false);
  const [isTimeBased, setIsTimeBased] = useState(false);
  const [serviceTime, setServiceTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customer, setCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  useEffect(() => {
    if (familyCard.isEditing) {
      setFamilyCardNumber(familyCard.editItem.familycardNumber);
      setFamilyCardValue(familyCard.editItem.value);
      setDescription(familyCard.editItem.description);
      setInactive(familyCard.editItem.inactive === "Active" ? false : true);
      setIsTimeBased(Number(familyCard.editItem.isTimeBased) === 1);
      setServiceTime(familyCard.editItem.serviceTime || "");
      setExpiryDate(
        moment(familyCard.editItem.validityDate).format("YYYY-MM-DD")
      );
      setCustomerName(
        familyCard.editItem?.person
          ? `${familyCard.editItem?.person?.firstName} ${familyCard.editItem?.person?.lastName}`
          : ""
      );
      setSelectedCustomer(familyCard.editItem?.person);
    }
  }, []);

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

  const onChangeFamilyCardNumber = (e) => {
    setFamilyCardNumber(e.target.value);
  };
  const onChangeFamilyCardDescription = (e) => {
    setDescription(e.target.value);
  };
  const onChangeInactive = (e) => {
    setInactive(e.target.checked);
  };
  const onChangeExpirydate = (e) => {
    setExpiryDate(e.target.value);
  };
  const onChangeTimeBased = (e) => {
    setIsTimeBased(e.target.checked);
    if (!e.target.checked) {
      setServiceTime("");
    }
  };
  const onSelectTimePackage = (e) => {
    const pkg = familyCardTimePackage.find(
      (p) => String(p.id) === e.target.value
    );
    if (pkg) {
      setFamilyCardValue(pkg.value);
      setServiceTime(pkg.serviceTime);
      setExpiryDate(moment().add(pkg.expiry, "months").format("YYYY-MM-DD"));
    }
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
    if (!familyCardNumber) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Familycard number is required",
      });
    } else if (!familyCardValue) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Familycard value is required",
      });
    } else if (!expiryDate) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Expiry date is required",
      });
    } else if (isTimeBased && !Number(serviceTime)) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Service time (minutes) is required for a time-based card",
      });
    } else {
      return true;
    }
  };

  const updateFamilyCard = async () => {
    const customerId = selectedCustomer?.person?.id;
    if (!onValidate()) {
      return;
    }
    const options = {
      familycardNumber: familyCardNumber,
      description: description,
      value: Number(familyCardValue),
      validityDate: expiryDate,
      inactive: inactive,
      isTimeBased: isTimeBased ? 1 : 0,
      serviceTime: isTimeBased ? Number(serviceTime) : null,
    };
    if (customerId) {
      options.customerId = customerId;
    }
    try {
      const res = familyCard.isEditing
        ? await clientAdapter.updateFamilyCards(
            familyCard?.editItem?.id,
            options
          )
        : await clientAdapter.createFamilyCards(options);
      if (
        (!familyCard.isEditing && res?.id) ||
        (familyCard.isEditing && res.status === 200)
      ) {
        setSnackBar({
          open: true,
          severity: "success",
          message: `Successfully ${
            familyCard.isEditing ? "updated" : "created"
          } familycard`,
        });
        setTimeout(() => {
          onClickBack();
        }, 2000);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: error?.message || "Something went wrong",
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

  // const extractLogMessage = () => {
  //   return familyCard?.editItem?.familycardLogs?.map((message) => {
  //     const regex = /<.*S11\s(.*)<\/a>/;
  //     const match = message.logMessage.match(regex);

  //     let textMessage = message.logMessage;
  //     if (match && match.length > 1) {
  //       textMessage = message.logMessage.replace(match[0], `${match[1]}`);
  //     }

  //     const linkRegex = /<.*>/;
  //     textMessage = textMessage.replace(linkRegex, "");

  //     return textMessage;
  //   });
  // };

  // const extractedMessage = extractLogMessage();

  return (
    <>
      <Box display={"flex"} alignItems={"center"}>
        <ArrowBackIcon style={{ cursor: "pointer" }} onClick={onClickBack} />
        <Typography ml={2} fontSize={22} fontWeight={"bold"}>
          {familyCard.isEditing ? "Edit Familycard" : "Create Familycard"}
        </Typography>
      </Box>
      <Accordion expanded>
        <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
          <Typography>Familycard Information</Typography>
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
                Familycard Number :
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
                  onChange={onChangeFamilyCardNumber}
                  value={familyCardNumber}
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
                    backgroundColor: "white",
                  }}
                  onChange={onChangeFamilyCardDescription}
                  value={description}
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
                Familycard Value :
                <Input
                  disableUnderline={true}
                  readOnly={familyCard.isEditing ? true : false}
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
                  value={
                    familyCard.isEditing
                      ? familyCardValue
                        ? Number(familyCardValue).toFixed(2)
                        : ""
                      : familyCardValue
                  }
                  onChange={(e) => {
                    !familyCard.isEditing && setFamilyCardValue(e.target.value);
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
                Time-based (minutes) card :
                <Checkbox
                  checked={isTimeBased}
                  onChange={onChangeTimeBased}
                  disabled={familyCard.isEditing}
                  inputProps={{ "aria-label": "time-based" }}
                  style={{ left: "-77%" }}
                />
              </InputLabel>
            </FormGroup>
            {isTimeBased && !familyCard.isEditing && (
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
                  Package :
                  <select
                    onChange={onSelectTimePackage}
                    defaultValue=""
                    style={{
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="" disabled>
                      Select a package (auto-fills value, time, expiry)
                    </option>
                    {familyCardTimePackage.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </InputLabel>
              </FormGroup>
            )}
            {isTimeBased && (
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
                  Service Time (minutes) :
                  <Input
                    disableUnderline={true}
                    required
                    readOnly={familyCard.isEditing ? true : false}
                    size="small"
                    type="number"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "white",
                    }}
                    value={serviceTime}
                    onChange={(e) =>
                      !familyCard.isEditing && setServiceTime(e.target.value)
                    }
                  ></Input>
                </InputLabel>
              </FormGroup>
            )}
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
                  style={{
                    display: "flex",
                    border: "1px solid Gray",
                    width: "80%",
                    padding: "2px",
                    borderRadius: "3px",
                    backgroundColor: "white",
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
                  color: "red",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Expiry Date :
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
                  type="date"
                  onChange={onChangeExpirydate}
                  value={expiryDate}
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
                Inactive :
                <Checkbox
                  checked={inactive}
                  onChange={onChangeInactive}
                  inputProps={{ "aria-label": "controlled" }}
                  style={{ left: "-77%" }}
                  value={data.inactive ? "checked" : "unchecked"}
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
                Familycard Log :
              </InputLabel>
              {familyCard?.editItem?.familycardLogs?.length ? (
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
                  {familyCard?.editItem?.familycardLogs?.map((message, x) => (
                    <p
                      style={{
                        fontSize: "14px",
                        paddingBottom: 0,
                        marginBottom: 0,
                      }}
                      key={x}
                      dangerouslySetInnerHTML={{
                        __html: `${moment(message.logDate).format("DD/MM/YYYY, hh:mm a")} - ${message.logMessage.replace(/studio11\.yumpos\.co\/sales\/receipt\/(\d+)/g, `b.isaspa.co/print/${familyCard.editItem.locationId}/$1`)}`
                      }}
                    />
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
              onClick={updateFamilyCard}
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

export default FamilyCardView;

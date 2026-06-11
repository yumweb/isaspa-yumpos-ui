import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
  Checkbox,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { styles } from "./customer.styles";
import clientAdapter from "../../../lib/clientAdapter";
import moment from "moment-timezone";
import { MenuProps } from "../../../style/globalStyle";

const CustomerForm = ({
  onSubmitCustomer,
  oCancelCustomer,
  isEditing,
  editItem,
}) => {
  const [leadSourceItems, setLeadSourceItems] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [comments, setComments] = useState("");
  const [loyaltyCardNumber, setLoyaltyCardNumber] = useState("");
  const [loyaltyCardDiscount, setLoyalityCardDiscount] = useState("");
  const [amountSpendNextPoint, setAmountSpendNextPoint] = useState("");
  const [points, setPoints] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [leadCampaign, setLeadCampaign] = useState("");
  const [dndSms, setDndSms] = useState(false);
  const [dndEmails, setDndEmails] = useState(false);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [pointsSummary, setPointsSummary] = useState({ totalEarned: 0, totalUsed: 0, balance: 0 });

  const [errors, setErrors] = React.useState({
    firstName: "",
    phoneNumber: "",
    gender: "",
    leadCampaign: "",
  });
  const [expanded, setExpanded] = useState({
    panel1: true,
    panel2: false,
    panel3: false,
    panel4: false,
  });
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleExpanded = (panel) => (event, isExpanded) => {
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  const getLeadSourceItems = async () => {
    try {
      const res = await clientAdapter.getLeadSource();
      setLeadSourceItems(res);
    } catch (error) {
      setLeadSourceItems([]);
    }
  };

  useEffect(() => {
    getLeadSourceItems();
  }, []);

  const fetchPointsHistory = async (customerId) => {
    try {
      const res = await clientAdapter.getCustomerPointsHistory(customerId);
      if (res) {
        setPointsHistory(res.history || []);
        setPointsSummary(res.summary || { totalEarned: 0, totalUsed: 0, balance: 0 });
      }
    } catch (error) {
      console.error("Error fetching points history:", error);
    }
  };

  const onClickEdit = useCallback((item) => {
    setFirstName(item?.person?.firstName);
    setLastName(item?.person?.lastName);
    setEmail(item?.person?.email);
    setPhoneNumber(item?.person?.phoneNumber);
    setGender(
      item?.gender === "Female"
        ? "1"
        : item?.gender === "Male"
        ? "0"
        : item?.gender
    );
    setBirthday(
      item?.birthday ? moment(item?.birthday).format("YYYY-MM-DD") : ""
    );
    setAnniversary(item?.aniversery);
    setAddress1(item?.person?.address1);
    setAddress2(item?.person?.address2);
    setCity(item?.person?.city);
    setState(item?.person?.state);
    setZip(item?.person?.zip);
    setCountry(item?.person?.country);
    setComments(item?.person?.comments);
    setLoyaltyCardNumber(item?.loyaltyCardNumber);
    setLoyalityCardDiscount(item?.loyaltyCardDiscount);
    setAmountSpendNextPoint(item?.currentSpendForPoints);
    setPoints(item?.points);
    setCompanyAddress(item?.companyAddress);
    setLeadCampaign(item?.sourceId ? item?.sourceId?.toString() : "");
    setDndSms(item?.dndSms);
    setDndEmails(item?.dmdEmail === 0 ? false : true);
  }, []);

  useEffect(() => {
    if (isEditing) {
      onClickEdit(editItem);
      if (editItem?.id) {
        fetchPointsHistory(editItem.id);
      }
    }
  }, [isEditing, editItem, onClickEdit]);

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handlePhoneNumber = (e) => {
    const data = e.target.value;
    
    if (/^[0-9]*$/.test(data) && data.length <= 10) {
      setPhoneNumber(data);
    }
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleGender = (e) => {
    setGender(e.target.value);
  };
  const handleBirthday = (e) => {
    setBirthday(e.target.value);
  };
  const handleAniversery = (e) => {
    setAnniversary(e.target.value);
  };
  const handleAddress1 = (e) => {
    setAddress1(e.target.value);
  };
  const handleAddress2 = (e) => {
    setAddress2(e.target.value);
  };
  const handleCity = (e) => {
    setCity(e.target.value);
  };
  const handleZip = (e) => {
    setZip(e.target.value);
  };
  const handleState = (e) => {
    setState(e.target.value);
  };
  const handleCountry = (e) => {
    setCountry(e.target.value);
  };
  const handleComments = (e) => {
    setComments(e.target.value);
  };
  const handleLoyaltyCardNumber = (e) => {
    setLoyaltyCardNumber(e.target.value);
  };
  const handleLoyaltyCardDiscount = (e) => {
    setLoyalityCardDiscount(e.target.value);
  };
  const handleAmountSpendNextPoint = (e) => {
    setAmountSpendNextPoint(e.target.value);
  };
  const handlePoints = (e) => {
    setPoints(e.target.value);
  };
  const handleCompanyAddress = (e) => {
    setCompanyAddress(e.target.value);
  };
  const handleLeadCampaign = (e) => {
    setLeadCampaign(e.target.value);
  };
  const handleDndSms = (e) => {
    setDndSms(e.target.checked);
  };
  const handleDndEmails = (e) => {
    setDndEmails(e.target.checked);
  };

  const focusInputById = (id) => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.focus();
    }
  };

  const onValidation = () => {
    let isValid = true;
    if (!firstName) {
      handleError("First Name is Required", "firstName");
      isValid = false;
      !expanded.panel1 && setExpanded({ ...expanded, panel1: true });
      return;
    } else if (!firstName.trim().length) {
      handleError("First Name is Required", "firstName");
      isValid = false;
      !expanded.panel1 && setExpanded({ ...expanded, panel1: true });
      return;
    }

    if (!phoneNumber) {
      handleError("Phone Number is Required", "phoneNumber");
      isValid = false;
      !expanded.panel1 && setExpanded({ ...expanded, panel1: true });
      return;
    }

    if (!gender) {
      handleError("Gender is Required", "gender");
      isValid = false;
      !expanded.panel1 && setExpanded({ ...expanded, panel1: true });
      return;
    }

    if (!leadCampaign) {
      handleError("Lead From Campaign is Required", "leadCampaign");
      isValid = false;
      !expanded.panel4 && setExpanded({ ...expanded, panel4: true });
      return;
    }

    if (isValid) {
      return true;
    }
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
    focusInputById(input);
  };

  const createCustomer = async () => {
    if (onValidation()) {
      const personalData = {
        firstName,
        lastName,
        ...(email && { email }),
        phoneNumber,
        address1,
        address2,
        city,
        state,
        zip,
        country,
        comments,
      };
      let data;
      const commonData = {
        gender,
        birthday: birthday || null,
        anniversary: anniversary || null,
        ...(loyaltyCardNumber && { loyaltyCardNumber }),
        ...(loyaltyCardDiscount && { loyaltyCardDiscount }),
        currentSpendForPoints: amountSpendNextPoint
          ? Number(amountSpendNextPoint)
          : 0,
        points: points ? Number(points) : 0,
        companyAddress: companyAddress || "",
        sourceId: Number(leadCampaign),
        dndSms,
        dndEmail: dndEmails,
      };
      const createData = {
        ...personalData,
        ...commonData,
      };
      const updateData = {
        person: { ...personalData },
        ...commonData,
      };
      data = isEditing ? updateData : createData;
      try {
        let res;
        if (isEditing) {
          res = await clientAdapter.updateCustomerById(editItem.id, data);
        } else {
          res = await clientAdapter.createCustomer(data);
        }
        if (res?.personId || res?.person || res === 200) {
          setSnackBar({
            open: true,
            severity: "success",
            message: isEditing
              ? "Updated customer successfully"
              : "Created customer successfully",
          });
          onSubmitCustomer && onSubmitCustomer(res, data);
        } else {
          throw res;
        }
      } catch (error) {
        setSnackBar({
          open: true,
          severity: "error",
          message:
            error?.message?.message ||
            (error?.message?.message?.length && error?.message?.message[0]) ||
            "Some error occured. Please try again later",
        });
      }
    }
  };

  const cancelCustomer = () => {
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setEmail("");
    setGender("");
    setBirthday("");
    setAnniversary("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setZip("");
    setCountry("");
    setComments("");
    setLoyaltyCardNumber("");
    setLoyalityCardDiscount("");
    setAmountSpendNextPoint("");
    setPoints("");
    setCompanyAddress("");
    setLeadCampaign("");
    setDndSms(false);
    setDndEmails(false);
    setPointsHistory([]);
    setPointsSummary({ totalEarned: 0, totalUsed: 0, balance: 0 });
    oCancelCustomer && oCancelCustomer();
  };

  const handleSnackbarClose = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  };

  return (
    <>
      <Accordion
        style={{ marginTop: "20px" }}
        expanded={expanded.panel1}
        onChange={handleExpanded("panel1")}
      >
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Customer Information{" "}
            {expanded.panel1 && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "lighter",
                  color: "red",
                }}
              >
                (Fields in red are required)
              </span>
            )}
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Container style={styles.accordianDetails}>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabelRequired}>
                First Name :
              </InputLabel>
              <Box sx={styles.inputlabelRequiredWrapper}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputTextRequired}
                  id="firstName"
                  value={firstName}
                  onChange={handleFirstName}
                />
                <div style={styles.errorText}>{errors.firstName}</div>
              </Box>
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Last Name : </InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputText}
                id="lastName"
                value={lastName}
                onChange={handleLastName}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>
                E-mail :
              </InputLabel>
                <Input
                  disableUnderline={true}
                  size="small"
                  style={styles.inputText}
                  id="email"
                  value={email}
                  onChange={handleEmail}
                />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabelRequired}>
                Phone Number :{" "}
              </InputLabel>
              <Box sx={styles.inputlabelRequiredWrapper}>
                <Input
                  disableUnderline={true}
                  type="text"
                  required
                  size="small"
                  style={styles.inputTextRequired}
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  id="phoneNumber"
                  pattern="[0-9]*"
                />
                <div style={styles.errorText}>{errors.phoneNumber}</div>
              </Box>
            </FormGroup>

            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Address 1 :</InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputText}
                id="address1"
                value={address1}
                onChange={handleAddress1}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Address 2 :</InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputText}
                id="address2"
                value={address2}
                onChange={handleAddress2}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>City :</InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputText}
                id="city"
                value={city}
                onChange={handleCity}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>
                State/Province :
              </InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputText}
                id="state"
                value={state}
                onChange={handleState}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Zip : </InputLabel>
              <Input
                type="number"
                disableUnderline={true}
                required
                size="small"
                style={styles.inputText}
                id="zip"
                value={zip}
                onChange={handleZip}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Country :</InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                style={styles.inputText}
                id="country"
                value={country}
                onChange={handleCountry}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Comments :</InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                rows={4}
                multiline
                style={styles.inputText}
                id="comments"
                value={comments}
                onChange={handleComments}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabelRequired}>
                Gender :{" "}
              </InputLabel>
              <Box sx={styles.inputlabelRequiredWrapper}>
                <Select
                  IconComponent={false}
                  variant="standard"
                  disableUnderline={true}
                  id="gender"
                  style={styles.inputTextRequired}
                  value={gender}
                  onChange={handleGender}
                >
                  <MenuItem value="0">Male</MenuItem>
                  <MenuItem value="1">Female</MenuItem>
                </Select>
                <div style={styles.errorText}>{errors.gender}</div>
              </Box>
            </FormGroup>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded.panel2} onChange={handleExpanded("panel2")}>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Birthdays & Anniversary{" "}
            {expanded.panel2 && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "lighter",
                  color: "red",
                }}
              >
                (Fields in red are required)
              </span>
            )}
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Container style={styles.accordianDetails}>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Birthday :</InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                type="date"
                style={styles.inputText}
                id="birthday"
                value={birthday}
                onChange={handleBirthday}
              >
                <span>
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
              </Input>
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Anniversary :</InputLabel>
              <Input
                disableUnderline={true}
                required
                size="small"
                type="date"
                style={styles.inputText}
                id="anniversary"
                value={anniversary}
                onChange={handleAniversery}
              >
                <span>
                  <FontAwesomeIcon icon={faCalendar} />
                </span>
              </Input>
            </FormGroup>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded.panel3} onChange={handleExpanded("panel3")}>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Loyalty Management{" "}
            {expanded.panel3 && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "lighter",
                  color: "red",
                }}
              >
                (Fields in red are required)
              </span>
            )}
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Container style={styles.accordianDetails}>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>
                Loyalty Card Number :
              </InputLabel>
              <Input
                disableUnderline={true}
                required
                placeholder="LC 000 000"
                size="small"
                style={styles.inputText}
                id="loyalityCardNumber"
                value={loyaltyCardNumber}
                onChange={handleLoyaltyCardNumber}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>
                Loyalty Card Discount :{" "}
              </InputLabel>
              <Select
                IconComponent={false}
                variant="standard"
                disableUnderline={true}
                style={styles.selectInput}
                id="loyaltyCardDiscount"
                value={loyaltyCardDiscount}
                onChange={handleLoyaltyCardDiscount}
              >
                <MenuItem value="0">Loyalty Card Type</MenuItem>
                <MenuItem value="5">5% Loyalty Card</MenuItem>
                <MenuItem value="10">10% Loyalty Card</MenuItem>
                <MenuItem value="15">15% Loyalty Card</MenuItem>
                <MenuItem value="18">18% Loyalty Card</MenuItem>
                <MenuItem value="20">20% Loyalty Card</MenuItem>
                <MenuItem value="25">25% Loyalty Card</MenuItem>
                <MenuItem value="30">Privileged Card (30% Discount)</MenuItem>
                <MenuItem value="40">40% Loyalty Card</MenuItem>
                <MenuItem value="50">VIP Card (50% Discount)</MenuItem>
              </Select>
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>
                Amount To Spend For Next Point :
              </InputLabel>
              <Input
                disableUnderline={true}
                required
                placeholder="100.00"
                size="small"
                style={styles.inputText}
                id="amountspendnextpoint"
                value={amountSpendNextPoint}
                onChange={handleAmountSpendNextPoint}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Points :</InputLabel>
              <Input
                disableUnderline={true}
                type="number"
                required
                placeholder="0.00"
                size="small"
                style={styles.inputText}
                id="points"
                value={points}
                onChange={handlePoints}
              />
            </FormGroup>
            {isEditing && (
              <FormGroup style={{ ...styles.formgroup, marginTop: "20px" }}>
                <InputLabel style={{ ...styles.inputlabel, marginBottom: "10px" }}>
                  Points History :
                </InputLabel>
                {pointsHistory.length > 0 ? (
                  <>
                    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                      <Chip
                        label={`Total Earned: ${Math.round(pointsSummary.totalEarned)}`}
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        label={`Total Used: ${Math.round(pointsSummary.totalUsed)}`}
                        color="error"
                        variant="outlined"
                      />
                      <Chip
                        label={`Balance: ${Math.round(pointsSummary.balance)}`}
                        color="primary"
                        variant="filled"
                      />
                    </Box>
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }} align="right">Earned</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }} align="right">Used</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pointsHistory.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {row.date ? moment(row.date).format("DD/MM/YYYY, hh:mm a") : "-"}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={row.type === "sale" ? "Sale" : "Referral"}
                                  size="small"
                                  color={row.type === "sale" ? "default" : "secondary"}
                                />
                              </TableCell>
                              <TableCell align="right" sx={{ color: "green" }}>
                                {row.earned > 0 ? `+${Math.round(row.earned)}` : "-"}
                              </TableCell>
                              <TableCell align="right" sx={{ color: "red" }}>
                                {row.used > 0 ? `-${Math.round(row.used)}` : "-"}
                              </TableCell>
                              <TableCell>{row.description || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No points history available
                  </Typography>
                )}
              </FormGroup>
            )}
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded.panel4} onChange={handleExpanded("panel4")}>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Company and Tax Settings{" "}
            {expanded.panel4 && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "lighter",
                  color: "red",
                }}
              >
                (Fields in red are required)
              </span>
            )}
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Container style={styles.accordianDetails}>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>Address :</InputLabel>
              <Input
                disableUnderline={true}
                required
                multiline={true}
                rows={4}
                size="small"
                style={styles.inputText}
                value={companyAddress}
                onChange={handleCompanyAddress}
              />
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabelRequired}>
                Lead From Campaign :{" "}
              </InputLabel>
              <Box sx={styles.inputlabelRequiredWrapper}>
                <Select
                  required
                  IconComponent={false}
                  variant="standard"
                  disableUnderline={true}
                  style={styles.selectInputRequired}
                  id="leadCampaign"
                  value={leadCampaign}
                  onChange={handleLeadCampaign}
                  MenuProps={MenuProps}
                >
                  {leadSourceItems?.length
                    ? leadSourceItems?.map((lead) => (
                        <MenuItem key={lead?.id} value={lead?.id}>
                          {lead?.source}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                <div style={styles.errorText}>{errors.leadCampaign}</div>
              </Box>
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>
                Activate DND for SMS :
              </InputLabel>
              <Box sx={styles.inputlabelRequiredWrapper}>
                <Checkbox
                  checked={dndSms}
                  onChange={handleDndSms}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Box>
            </FormGroup>
            <FormGroup style={styles.formgroup}>
              <InputLabel style={styles.inputlabel}>
                Activate DND for E-mails :
              </InputLabel>
              <Box sx={styles.inputlabelRequiredWrapper}>
                <Checkbox
                  checked={dndEmails}
                  onChange={handleDndEmails}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </Box>
            </FormGroup>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Box sx={styles.footer}>
        <Button style={styles.button} onClick={cancelCustomer}>
          Cancel
        </Button>
        <Button
          style={{ ...styles.button, marginLeft: 8 }}
          onClick={createCustomer}
        >
          Submit
        </Button>
      </Box>
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
          {snackBar?.message?.toString()||''}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomerForm;

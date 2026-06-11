import {
  Alert,
  Autocomplete,
  Backdrop,
  ButtonGroup,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  ListItemText,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { MenuProps } from "../../style/globalStyle";
import clientAdapter from "../../lib/clientAdapter";
import ArticleIcon from "@mui/icons-material/Article";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { whatsappTemplates } from "../../data/promotion";
import moment from "moment-timezone";

const PromotionsView = () => {
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [sendTo, setSendTo] = useState(0);
  const [showCustomers, setShowCustomers] = useState(false);
  const [customerType, setCustomerType] = useState("");
  const [numbers, setNumbers] = useState("");
  const [display, setDisplay] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [active, setActive] = React.useState({ sms: true, whatsapp: false });
  const [whatsappTemplateId, setWhatsappTemplateId] = useState("");
  const [variable1, setVariable1] = useState("");
  const [variable2, setVariable2] = useState("");
  const [customList, setCustomList] = useState(false);
  const [customers, setCustomers] = useState(false);
  const [leads, setLeads] = useState(false);
  const [listType, setListType] = useState(0);
  const [gender, setGender] = useState("");
  const [servicesAvailable, setServicesAvailable] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [servicesAvailableBetween, setServicesAvailableBetween] = useState({
    startDate: "",
    endDate: "",
  });
  const [servicesNotAvailableBetween, setServicesNotAvailableBetween] =
    useState({
      startDate: "",
      endDate: "",
    });
  const [leadSource, setleadSource] = useState([]);
  const [leadStatus, setleadStatus] = useState([]);
  const [sourceItems, setSourceItems] = useState([]);
  const [statusItems, setStatusItems] = useState([]);
  const [leadsCreated, setLeadsCreated] = useState({
    startDate: "",
    endDate: "",
  });
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleGender = (e) => {
    setGender(e.target.value);
  };

  const handleServiceAvailedBetween = (field) => (event) => {
    setServicesAvailableBetween({
      ...servicesAvailableBetween,
      [field]: event.target.value,
    });
  };

  const handleServiceNotAvailedBetween = (field) => (event) => {
    setServicesNotAvailableBetween({
      ...servicesNotAvailableBetween,
      [field]: event.target.value,
    });
  };

  const handleLeadSource = (event) => {
    const {
      target: { value },
    } = event;
    setleadSource(typeof value === "string" ? value.split(",") : value);
  };

  const handleLeadStatus = (event) => {
    const {
      target: { value },
    } = event;
    setleadStatus(typeof value === "string" ? value.split(",") : value);
  };

  const handleLeadsCreated = (field) => (event) => {
    setLeadsCreated({
      ...leadsCreated,
      [field]: event.target.value,
    });
  };

  const handleSnackbarClose = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  };

  const onChangeVariable1 = (e) => {
    setVariable1(e.target.value);
  };
  const onChangeVariable2 = (e) => {
    setVariable2(e.target.value);
  };

  const getData = () => {
    switch (sendTo) {
      case 1:
        return { customerType: customerType };
      case 2:
        return;
      case 3:
        return { numbers: numbers };
      case 4:
        let listData;
        if (listType === 1) {
          listData = {
            ...(gender && { gender }),
            ...(servicesAvailable?.length && {
              serviceAvailed: servicesAvailable.map((i) => i.itemId),
            }),
            ...(servicesAvailableBetween.startDate && {
              serviceAvailedFrom: moment(
                servicesAvailableBetween.startDate
              ).format("YYYY-MM-DD HH:mm:ss"),
            }),
            ...(servicesAvailableBetween.endDate && {
              serviceAvailedTo: moment(servicesAvailableBetween.endDate).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            }),
            ...(servicesNotAvailableBetween.startDate && {
              serviceNotAvailedFrom: moment(
                servicesAvailableBetween.startDate
              ).format("YYYY-MM-DD HH:mm:ss"),
            }),
            ...(servicesNotAvailableBetween.endDate && {
              serviceNotAvailedTo: moment(
                servicesAvailableBetween.endDate
              ).format("YYYY-MM-DD HH:mm:ss"),
            }),
          };
        }
        if (listType === 2) {
          listData = {
            ...(leadSource?.length && {
              leadSourceId: leadSource,
            }),
            ...(leadStatus?.length && {
              leadStatusId: leadStatus,
            }),
            ...(leadsCreated.startDate && {
              leadCreatedFrom: moment(leadsCreated.startDate).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            }),
            ...(leadsCreated.endDate && {
              leadCreatedTo: moment(leadsCreated.endDate).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            }),
          };
        }
        return { ...listData, listType };
      default:
        break;
    }
  };

  const createPromotion = async () => {
    setLoading(true);
    let data;
    let commonData;
    if (active.whatsapp) {
      const wapMessage = {
        template: whatsappTemplateId || "",
        parameters: {
          variable1: variable1,
          variable2: variable2,
        },
      };
      commonData = {
        deliverychannel: "whatsapp",
        sendTo: sendTo,
        message: wapMessage,
      };
      data = {
        ...commonData,
        ...getData(),
      };
    } else {
      commonData = {
        deliverychannel: "sms",
        sendTo: sendTo,
        template: message,
      };
      data = {
        ...commonData,
        ...getData(),
      };
    }
    sendPromotion(data);
  };

  const sendPromotion = async (data) => {
    try {
      const res = await clientAdapter.sendPromotion(data);
      setLoading(false);
      if (res.statusCode) {
        throw res;
      } else {
        setSnackBar({
          open: true,
          severity: "success",
          message: `Message sent successfully`,
        });
        clearData();
      }
    } catch (error) {
      setLoading(false);
      setSnackBar({
        open: true,
        severity: "error",
        message:
          (active.whatsapp
            ? error?.message?.response?.description
            : error?.message?.errors[0]?.message) || `Something went wrong`,
      });
    }
  };

  const clearData = () => {
    setMessage("");
    setSendTo("");
    setNumbers("");
    setCustomerType("");
    setTemplate("");
    setListType("");
    setleadSource([]);
    setleadStatus([]);
    setServicesAvailableBetween({
      startDate: "",
      endDate: "",
    });
    setServicesNotAvailableBetween({
      startDate: "",
      endDate: "",
    });
    setVariable1("");
    setVariable2("");
  };

  const handleSend = async (e) => {
    setSendTo(e.target.value);
    if (e.target.value === 1) {
      setShowCustomers(true);
    } else {
      setShowCustomers(false);
    }

    if (e.target.value === 3) {
      setDisplay(true);
    } else {
      setDisplay(false);
    }

    if (e.target.value === 4) {
      setCustomList(true);
    } else {
      setCustomList(false);
    }
  };

  const handleSendListType = async (e) => {
    setListType(e.target.value);
    if (e.target.value === 1) {
      setCustomers(true);
    } else {
      setCustomers(false);
    }

    if (e.target.value === 2) {
      setLeads(true);
    } else {
      setLeads(false);
    }
  };

  const handleCustomerType = (e) => {
    setCustomerType(e.target.value);
  };

  const getTemplates = async () => {
    try {
      const tempRes = await clientAdapter.getSmsTemplates();
      if (tempRes.statusCode) {
        setTemplates([]);
      } else {
        setTemplates(tempRes.templates);
      }
    } catch (error) {
      console.log("error from get templates", error);
    }
  };

  const getLeadSourceItems = async () => {
    try {
      const res = await clientAdapter.getLeadSource();
      setSourceItems(res);
    } catch (error) {
      setSourceItems([]);
    }
  };

  const getLeadStatusItems = async () => {
    try {
      const res = await clientAdapter.getLeadStatus();
      setStatusItems(res);
    } catch (error) {
      setStatusItems([]);
    }
  };

  useEffect(() => {
    getTemplates();
    getLeadSourceItems();
    getLeadStatusItems();
  }, []);

  const handleReviewPhoneNumbers = () => {
    console.log("Review Phone Numbers List Printed");
  };

  return (
    <>
      <Typography
        variant="h5"
        my={3}
        style={{
          marginTop: 5,
          color: "black",
          padding: "5px",
        }}
      >
        Send Promotional Message
      </Typography>
      <Box mb={2}>
        <ButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <Button
            startIcon={<MessageOutlinedIcon />}
            sx={{
              backgroundColor: active.sms ? "#218aff" : "white",
              color: active.sms ? "white" : "#218aff",
              "&:hover": {
                backgroundColor: active.sms ? "#218aff" : "white",
                color: active.sms ? "white" : "#218aff",
              },
            }}
            onClick={() => {
              setActive({ sms: true, whatsapp: false });
              setTemplate("");
              setMessage("");
            }}
          >
            Sms
          </Button>
          <Button
            startIcon={<WhatsAppIcon />}
            onClick={() => {
              setActive({ sms: false, whatsapp: true });
              setTemplate("");
              setMessage("");
            }}
            sx={{
              backgroundColor: active.whatsapp ? "#25D366" : "white",
              color: active.whatsapp ? "white" : "#25D366",
              "&:hover": {
                backgroundColor: active.whatsapp ? "#25D366" : "white",
                color: active.whatsapp ? "white" : "#25D366",
              },
            }}
          >
            Whatsapp
          </Button>
        </ButtonGroup>
      </Box>
      <Container
        style={{
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
          padding: "10px",
          maxWidth: "100%",
        }}
      >
        {active.sms ? (
          <Box
            bgcolor="lightblue"
            color="black"
            borderRadius="3px"
            width="100%"
            px={2}
            py={2}
          >
            <Typography fontWeight={300}>
              As per TRAI regulations Promotional SMS can be sent only between
              10:00 AM to 08:45 PM
            </Typography>
          </Box>
        ) : null}
        <Grid container mt={2}>
          <Grid item xs={3}>
            <Typography
              style={{
                padding: "5px",
                color: "black",
              }}
            >
              Send To :
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth sx={{ fontFamily: "Kanit, sans-serif" }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sendTo}
                onChange={handleSend}
                fullWidth
                size="small"
                variant="outlined"
                displayEmpty
              >
                <MenuItem value={1}>My Customers</MenuItem>
                <MenuItem value={2}>Leads</MenuItem>
                <MenuItem value={3}>Enter Numbers</MenuItem>
                <MenuItem value={4}>Custom List</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Select Customer Type */}
        {showCustomers && (
          <Grid container mt={2}>
            <Grid item xs={3}>
              <Typography
                style={{
                  padding: "5px",
                  color: "black",
                  fontFamily: "Kanit, sans-serif",
                }}
              >
                Select Customer Type :
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Select
                fullWidth
                size="small"
                value={customerType}
                style={{}}
                onChange={handleCustomerType}
              >
                <MenuItem value={1}>All Customers</MenuItem>
                <MenuItem value={2}>One time Visitors</MenuItem>
                <MenuItem value={3}>Repeat Customers</MenuItem>
              </Select>
            </Grid>
          </Grid>
        )}

        {/* Enter Numbers */}
        {display && (
          <Grid container mt={2}>
            <Grid item xs={3}>
              <Typography
                style={{
                  padding: "5px",
                  color: "black",
                }}
              >
                Enter Numbers :
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                variant="outlined"
                fullWidth
                required
                size="small"
                onChange={(e) => setNumbers(e.target.value)}
              />
              <Typography fontSize={12}>
                Enter Comma(,) seperated numbers for multiple SMS
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* List Type */}
        {customList && (
          <Container
            style={{
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              padding: "10px",
              maxWidth: "100%",
              marginTop: "1rem",
              border: "1px solid grey",
              borderRadius: "4px",
            }}
          >
            <Grid container>
              <Grid item xs={3}>
                <Typography
                  style={{
                    padding: "5px",
                    color: "black",
                  }}
                >
                  List Type :
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <Select
                  fullWidth
                  size="small"
                  value={listType}
                  // style={{}}
                  onChange={handleSendListType}
                >
                  <MenuItem value={1}>Customers</MenuItem>
                  <MenuItem value={2}>Leads</MenuItem>
                </Select>
                <Typography fontSize={12}>
                  Select from customers / leads
                </Typography>
              </Grid>
            </Grid>

            {/* customers */}
            {customers && (
              <>
                <Grid container mt={2}>
                  <Grid item xs={3}>
                    <Typography
                      style={{
                        padding: "5px",
                        color: "black",
                      }}
                    >
                      Gender :
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <RadioGroup
                      style={{
                        float: "left",
                        display: "flex",
                        flexDirection: "row",
                      }}
                      value={gender}
                      onChange={handleGender}
                    >
                      <FormControlLabel
                        value="male"
                        label="Male"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="female"
                        label="Female"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="both"
                        label="Both"
                        control={<Radio />}
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>

                <Grid container mt={2}>
                  <Grid item xs={3}>
                    <Typography
                      style={{
                        padding: "5px",
                        color: "black",
                      }}
                    >
                      Services Availed :
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Autocomplete
                      multiple
                      size="small"
                      fullWidth
                      id="checkboxes-tags-demo"
                      options={serviceItems}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.item.name}
                      renderOption={(props, option, { selected }) => (
                        <>
                          <Box
                            {...props}
                            component="li"
                            key={option.itemId}
                            style={{
                              paddingBottom: "0px",
                              paddingTop: "0px",
                            }}
                          >
                            <Checkbox
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.item.name}
                          </Box>
                        </>
                      )}
                      renderInput={(params) => <TextField {...params} />}
                      value={servicesAvailable}
                      onChange={(event, newValue) => {
                        setServicesAvailable(newValue);
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container mt={2}>
                  <Grid item xs={3}>
                    <Typography
                      style={{
                        padding: "5px",
                        color: "black",
                      }}
                    >
                      Service(S) Availed Between :
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        variant="outlined"
                        style={{
                          width: "50%",
                        }}
                        required
                        size="small"
                        type="date"
                        value={servicesAvailableBetween.startDate}
                        onChange={handleServiceAvailedBetween("startDate")}
                      />
                      <Typography marginX="1rem" color="black">
                        {" "}
                        to{" "}
                      </Typography>
                      <TextField
                        variant="outlined"
                        style={{
                          width: "50%",
                        }}
                        required
                        size="small"
                        type="date"
                        value={servicesAvailableBetween.endDate}
                        onChange={handleServiceAvailedBetween("endDate")}
                      />
                    </Box>
                    <Typography fontSize={12}>
                      Select
                      <span
                        style={{
                          fontWeight: "bolder",
                          fontSize: "13px",
                        }}
                      >
                        {" "}
                        sale date range{" "}
                      </span>
                      for customers and
                      <span
                        style={{
                          fontWeight: "bolder",
                          fontSize: "13px",
                        }}
                      >
                        {" "}
                        created date range
                      </span>{" "}
                      for leads.
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container mt={2}>
                  <Grid item xs={3}>
                    <Typography
                      style={{
                        padding: "5px",
                        color: "black",
                      }}
                    >
                      Service(S) Not Availed Between :
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        variant="outlined"
                        style={{
                          width: "50%",
                        }}
                        required
                        size="small"
                        type="date"
                        value={servicesNotAvailableBetween.startDate}
                        onChange={handleServiceNotAvailedBetween("startDate")}
                      />
                      <Typography marginX="1rem" color="black">
                        {" "}
                        to{" "}
                      </Typography>
                      <TextField
                        variant="outlined"
                        style={{
                          width: "50%",
                        }}
                        required
                        size="small"
                        type="date"
                        value={servicesNotAvailableBetween.endDate}
                        onChange={handleServiceNotAvailedBetween("endDate")}
                      />
                    </Box>
                    <Typography fontSize={12}>
                      Select
                      <span
                        style={{
                          fontWeight: "bolder",
                          fontSize: "13px",
                        }}
                      >
                        {" "}
                        sale date range
                      </span>{" "}
                      where customer took service in previous range but not
                      current.
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}

            {/* leads */}
            {leads && (
              <>
                <Grid container mt={2}>
                  <Grid item xs={3}>
                    <Typography
                      style={{
                        padding: "5px",
                        color: "black",
                      }}
                    >
                      Lead Source :
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Select
                      multiple
                      fullWidth
                      size="small"
                      value={leadSource}
                      onChange={handleLeadSource}
                      labelId="demo-multiple-checkbox-label"
                      renderValue={(selected) =>
                        selected
                          .map((id) => {
                            const selectedSource = sourceItems?.find(
                              (source) => source.id === id
                            );
                            return selectedSource ? selectedSource.source : "";
                          })
                          .join(", ")
                      }
                      MenuProps={MenuProps}
                    >
                      {sourceItems.map((sourceItem) => (
                        <MenuItem key={sourceItem.id} value={sourceItem?.id}>
                          <Checkbox
                            checked={leadSource.indexOf(sourceItem?.id) > -1}
                          />
                          <ListItemText primary={sourceItem.source} />
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>

                <Grid container mt={2}>
                  <Grid item xs={3}>
                    <Typography
                      style={{
                        padding: "5px",
                        color: "black",
                      }}
                    >
                      Lead Status :
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Select
                      multiple
                      fullWidth
                      size="small"
                      value={leadStatus}
                      onChange={handleLeadStatus}
                      labelId="demo-multiple-checkbox-label"
                      renderValue={(selected) =>
                        selected
                          .map((id) => {
                            const selectedStatus = statusItems?.find(
                              (status) => status.id === id
                            );
                            return selectedStatus ? selectedStatus.status : "";
                          })
                          .join(", ")
                      }
                      MenuProps={MenuProps}
                    >
                      {statusItems.map((statusItem) => (
                        <MenuItem key={statusItem.id} value={statusItem.id}>
                          <Checkbox
                            checked={leadStatus.indexOf(statusItem.id) > -1}
                          />
                          <ListItemText primary={statusItem.status} />
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>

                <Grid container mt={2}>
                  <Grid item xs={3}>
                    <Typography
                      style={{
                        padding: "5px",
                        color: "black",
                      }}
                    >
                      Leads Created Between :
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Box display="flex" alignItems="center">
                      <TextField
                        variant="outlined"
                        style={{
                          width: "50%",
                        }}
                        required
                        size="small"
                        type="date"
                        value={leadsCreated.startDate}
                        onChange={handleLeadsCreated("startDate")}
                      />
                      <Typography marginX="1rem" color="black">
                        {" "}
                        to{" "}
                      </Typography>
                      <TextField
                        variant="outlined"
                        style={{
                          width: "50%",
                        }}
                        required
                        size="small"
                        type="date"
                        value={leadsCreated.endDate}
                        onChange={handleLeadsCreated("endDate")}
                      />
                    </Box>
                    <Typography fontSize={12}>
                      Select
                      <span
                        style={{
                          fontWeight: "bolder",
                          fontSize: "13px",
                        }}
                      >
                        {" "}
                        sale date range{" "}
                      </span>
                      for customers and
                      <span
                        style={{
                          fontWeight: "bolder",
                          fontSize: "13px",
                        }}
                      >
                        {" "}
                        created date range
                      </span>{" "}
                      for leads.
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}

            {/* Review Phone Numbers */}
            {(customers || leads) && (
              <Box display={"flex"} justifyContent={"flex-end"}>
                <Button
                  style={{
                    color: "white",
                    borderRadius: "4px",
                    backgroundColor: "black",
                    border: "0",
                    marginTop: "20px",
                    textTransform: "capitalize",
                  }}
                  onClick={handleReviewPhoneNumbers}
                >
                  Review Phone Numbers
                </Button>
              </Box>
            )}
          </Container>
        )}

        {/* SMS Templates */}
        <Grid container mt={2}>
          <Grid item xs={3}>
            <Typography
              style={{
                padding: "5px",
                color: "black",
              }}
            >
              {active.sms ? "SMS Templates " : "Whatsapp Templates"}:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Autocomplete
              id="country-select-demo"
              fullWidth
              options={active.sms ? templates : whatsappTemplates}
              size="small"
              value={template}
              getOptionLabel={(option) => option?.body || ""}
              renderOption={(props, option) => (
                <Box key={option?.id} {...props}>
                  <Box
                    display={"flex"}
                    alignItems={"flex-start"}
                    sx={{ cursor: "pointer" }}
                  >
                    <ArticleIcon
                      fontSize="large"
                      sx={{ mr: 2, color: "gray", pt: 0.5 }}
                    />
                    <Box>
                      <Typography fontWeight={600}>{option?.title}</Typography>
                      <Typography fontSize={14} fontWeight={300}>
                        {option?.body}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={{
                    ...params.inputProps,
                    fontFamily: "Kanit, sans-serif",
                  }}
                  value={template?.body}
                />
              )}
              onChange={(event, newValue) => {
                setTemplate(newValue);
                setMessage(newValue?.body);
                if (active.whatsapp) {
                  setWhatsappTemplateId(newValue?.id?.toString());
                }
              }}
            />
            {active.whatsapp && template && (
              <Typography fontSize={13}>
                Replace variable tags mentioned in <span>$(variable1)</span> and{" "}
                <span>$(variable1)</span>
                with your own text
              </Typography>
            )}
            <Box mt={2}>
              <Grid container spacing={2}>
                {template?.body?.includes("$(variable1)") && (
                  <Grid item xs={6}>
                    <Typography fontSize={14}>variable1</Typography>
                    <TextField
                      fullWidth
                      disableUnderline={true}
                      required
                      size="small"
                      value={variable1}
                      onChange={onChangeVariable1}
                      inputProps={{
                        style: { fontFamily: "Kanit, sans-serif" },
                      }}
                    />
                  </Grid>
                )}
                {template?.body?.includes("$(variable1)") && (
                  <Grid item xs={6}>
                    <Typography fontSize={14}>variable2</Typography>
                    <TextField
                      fullWidth
                      disableUnderline={true}
                      required
                      size="small"
                      value={variable2}
                      onChange={onChangeVariable2}
                      inputProps={{
                        style: { fontFamily: "Kanit, sans-serif" },
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {/* SMS Message */}
        <Grid container mt={2}>
          <Grid item xs={3}>
            <Typography
              style={{
                padding: "5px",
                color: "red",
              }}
            >
              {active.sms ? " SMS Message" : "Whatsapp Message"}:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              fullWidth
              disableUnderline={true}
              required
              size="small"
              rows={4}
              value={message}
              onChange={(e) => (active.sms ? setMessage(e.target.value) : null)}
              multiline
              inputProps={{ style: { fontFamily: "Kanit, sans-serif" } }}
            />
            {active.sms && message ? (
              <Typography fontSize={13}>
                Replace variable tags mentioned in [ ] with your own text
                <br />
                <br />
                <strong>[Price]</strong> - 300,400,1000,10,000 *max 6
                characters.
                <br />
                <strong>[Discount]</strong> - 30,40,50 *max 3 characters.
                <br />
                <strong>[Offer Text], [Service Name]</strong> - *max 90
                characters.
                <br />
              </Typography>
            ) : null}
          </Grid>
        </Grid>

        {/* Send SMS Button*/}
        <Box display={"flex"} justifyContent={"flex-end"}>
          <Button
            style={{
              color: "white",
              borderRadius: "4px",
              backgroundColor: "black",
              border: "0",
              marginTop: "20px",
            }}
            onClick={createPromotion}
          >
            Send Message
          </Button>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={5000}
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default PromotionsView;

import {
  Snackbar,
  Alert,
  FormGroup,
  InputLabel,
  Input,
  Select,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Container,
  Divider,
  MenuItem,
  Checkbox,
  InputAdornment,
  Button,
  Box,
} from "@mui/material";
import {
  faPercent,
  faPencilAlt,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import clientAdapter from "../../lib/clientAdapter";
import React, { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment-timezone";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  storeCode: yup.string().required("Store Code is required"),
  address: yup.string().required("Address is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  area: yup.string().required("Area is required"),
  phone: yup.string().required("Phone Number is required"),
  fdNumber: yup.string().required("Front Desk Contact is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  ownerName: yup.string().required("Owners Name is required"),
  ownerContact: yup.string().required("Owners Phone Number is required"),
  ownerEmail: yup.string(),
  accountValidity: yup.string().required("Account Validity Date is required"),
  timezone: yup.string().required("Time Zone is required"),
  dataStudioUrl: yup.string(),
});

const LocationEdit = (props) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [buttonText, setButtonText] = useState("Show More");
  const [city, setCity] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [tsms, setTsms] = useState([]);
  const [selectedTsm, setSelectedTsm] = useState(null);
  const [currentTsm, setCurrentTsm] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const tax = "Sales Tax";
  const tax2 = "Sales Tax 2";
  const country = 101;

  const handleShow = () => {
    setShow(!show);
    if (show) {
      setButtonText("Show More");
    } else {
      setButtonText("Hide");
    }
  };

  const onEdit = props.onEdit;

  const locationData = props.locationData || {};

  const date = new Date();

  useEffect(() => {
    const getStates = async () => {
      const States = await clientAdapter.getAllStates(country);
      setStateData(States);
    };
    getStates();
  }, []);

  useEffect(() => {
    const fetchTsms = async () => {
      try {
        const tsmsData = await clientAdapter.getTsms();
        setTsms(tsmsData);
      } catch (error) {
        console.error("Error fetching TSMs:", error);
      }
    };
    fetchTsms();
  }, []);

  useEffect(() => {
    const fetchLocationTsm = async () => {
      if (locationData?.locationId) {
        try {
          const tsmData = await clientAdapter.getLocationTsm(
            locationData.locationId
          );
          if (tsmData && tsmData.personId) {
            setCurrentTsm(tsmData.personId);
            setSelectedTsm(tsmData.personId);
          }
        } catch (error) {
          console.error("Error fetching location TSM:", error);
        }
      }
    };
    fetchLocationTsm();
  }, [locationData]);

  const handleStateChange = async (e) => {
    const cities = await clientAdapter.getCities(e.target.value);
    setCity(cities);
  };

  const handleTsmChange = (e) => {
    setSelectedTsm(e.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleClick = () => {
    navigate("/locations");
  };

  const handleFormSubmit = async (data) => {
    try {
      // First call the original onEdit function
      await onEdit(data);

      // Then update TSM assignment if changed
      // selectedTsm contains personId, which is what we need for tsmId in the assignment
      if (selectedTsm && selectedTsm !== currentTsm) {
        await clientAdapter.assignTsmToLocation(
          locationData.locationId,
          selectedTsm
        );
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const accValidity = moment(locationData.accountValidity).format("YYYY-MM-DD");

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
      <Box display={"flex"} alignItems={"center"} marginY="1rem">
        <ArrowBackIcon style={{ cursor: "pointer" }} onClick={handleClick} />
        <Typography ml={2} fontSize={22} fontWeight={"bold"}>
          Edit Location
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Accordion expanded>
          <AccordionSummary>
            <Typography>
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ marginRight: "10px" }}
              />
              Location Information
            </Typography>
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
                    color: "red   ",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Name :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("name")}
                    defaultValue={locationData.name}
                  ></Input>
                </InputLabel>
                {errors.name && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.name.message}
                  </span>
                )}
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
                    color: "red   ",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Store Code :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("storeCode")}
                    defaultValue={locationData.storeCode}
                  ></Input>
                </InputLabel>
                {errors.storeCode && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.storeCode.message}
                  </span>
                )}
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
                    color: "black  ",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Color :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("color", { required: false })}
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
                    color: "red   ",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Address :
                  <Input
                    disableUnderline={true}
                    rows={4}
                    multiline
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("address")}
                    defaultValue={locationData.address}
                  ></Input>
                </InputLabel>
                {errors.address && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.address.message}
                  </span>
                )}
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
                  Country :
                  <Select
                    IconComponent={false}
                    variant="standard"
                    disableUnderline={true}
                    style={{
                      width: "80%",
                      border: "1px solid Gray",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    defaultValue={country}
                    {...register("country")}
                  >
                    <MenuItem value={101}>India</MenuItem>
                  </Select>
                </InputLabel>
                {errors.country && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.country.message}
                  </span>
                )}
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
                  State :
                  <Select
                    IconComponent={false}
                    variant="standard"
                    disableUnderline={true}
                    style={{
                      width: "80%",
                      border: "1px solid Gray",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("state")}
                    onChange={handleStateChange}
                    defaultValue={locationData.state}
                  >
                    <MenuItem value={0} disabled selected>
                      Select State
                    </MenuItem>
                    {stateData.map((m) => (
                      <MenuItem value={m.id}>{m.name}</MenuItem>
                    ))}
                  </Select>
                </InputLabel>
                {errors.state && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.state.message}
                  </span>
                )}
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
                  City :
                  <Select
                    IconComponent={false}
                    variant="standard"
                    disableUnderline={true}
                    style={{
                      width: "80%",
                      border: "1px solid Gray",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("city")}
                    defaultValue={locationData.city}
                  >
                    <MenuItem value={0} disabled selected>
                      Select City
                    </MenuItem>
                    {city.map((c) => (
                      <MenuItem value={c.id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </InputLabel>
                {errors.city && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.city.message}
                  </span>
                )}
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
                    color: "red   ",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Area :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("area")}
                    defaultValue={locationData.area}
                  ></Input>
                </InputLabel>
                {errors.area && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.area.message}
                  </span>
                )}
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
                  Phone :
                  <Input
                    type="tel"
                    pattern="[0-9]*"
                    maxLength="10"
                    disableUnderline={true}
                    placeholder="Enter Toll Free Number Here"
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("phone")}
                    defaultValue={locationData.phone}
                  ></Input>
                </InputLabel>
                {errors.phone && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.phone.message}
                  </span>
                )}
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
                  Fax :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
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
                    color: "red",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Front Desk Contact :
                  <Input
                    type="tel"
                    pattern="[0-9]*"
                    maxLength="10"
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("fdNumber")}
                    defaultValue={locationData.fdNumber}
                  ></Input>
                </InputLabel>
                {errors.fdNumber && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.fdNumber.message}
                  </span>
                )}
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
                  Email :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("email")}
                    defaultValue={locationData.email}
                  ></Input>
                </InputLabel>
                {errors.email && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.email.message}
                  </span>
                )}
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
                  GSTIN :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("serviceTaxNumber")}
                    defaultValue={locationData.serviceTaxNumber}
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
                  Deleted :
                  <Checkbox
                    style={{ right: "77%" }}
                    {...register("deleted")}
                    defaultChecked={locationData.deleted}
                  ></Checkbox>
                </InputLabel>
              </FormGroup>
            </Container>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded>
          <AccordionSummary>
            <Typography>
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ marginRight: "10px" }}
              />
              SMS Credentials
            </Typography>
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
                    color: "black",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  SMS Gateway Client ID :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("tSmsUsername")}
                    defaultValue={locationData.tSmsUsername}
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
                  SMS Gateway Password :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("tSmsPassword")}
                    defaultValue={locationData.tSmsPassword}
                  ></Input>
                </InputLabel>
              </FormGroup>
            </Container>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded>
          <AccordionSummary>
            <Typography>
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ marginRight: "10px" }}
              />
              Owner Details
            </Typography>
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
                  Owners Name :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("ownerName")}
                    defaultValue={locationData.ownerName}
                  ></Input>
                </InputLabel>
                {errors.ownerName && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.ownerName.message}
                  </span>
                )}
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
                    color: "red   ",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Owners Phone Number :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("ownerContact")}
                    defaultValue={locationData.ownerContact}
                  ></Input>
                </InputLabel>
                <p
                  style={{
                    marginLeft: "218px",
                    fontSize: "13px",
                    fontWeight: "lighter",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  Leads and DSR SMS numbers to be added here!
                </p>
                {errors.ownerContact && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.ownerContact.message}
                  </span>
                )}
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
                  Owners Email :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("ownerEmail")}
                    defaultValue={locationData.ownerEmail}
                  ></Input>
                </InputLabel>
                <p
                  style={{
                    marginLeft: "218px",
                    fontSize: "13px",
                    fontWeight: "lighter",
                    fontFamily: "Kanit, sans-serif",
                  }}
                >
                  Leads and DSR E-mails to be added here!
                </p>
                {errors.ownerEmail && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.ownerEmail.message}
                  </span>
                )}
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
                  Territory Sales Manager (TSM) :
                  <Select
                    IconComponent={false}
                    variant="standard"
                    disableUnderline={true}
                    style={{
                      width: "80%",
                      border: "1px solid Gray",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    value={selectedTsm || 0}
                    onChange={handleTsmChange}
                  >
                    <MenuItem value={0}>None</MenuItem>
                    {tsms.map((tsm) => (
                      <MenuItem key={tsm.personId} value={tsm.personId}>
                        {tsm.person
                          ? `${tsm.person.firstName} ${tsm.person.lastName}`
                          : "Unknown"}
                      </MenuItem>
                    ))}
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
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                    color: "black",
                  }}
                >
                  Owners Contacts
                  <br />
                  for Tickets :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("ticketsContact")}
                    defaultValue={locationData.ticketsContact}
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
                  Owners Email <br />
                  for Tickets :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("ticketsEmail")}
                    defaultValue={locationData.ticketsEmail}
                  ></Input>
                </InputLabel>
              </FormGroup>
            </Container>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded>
          <AccordionSummary>
            <Typography>
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ marginRight: "10px" }}
              />
              Tax Details
            </Typography>
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
                    color: "black",
                    fontFamily: "Russo One, sans-serif",
                  }}
                >
                  Tax 1 Rate :
                  <Input
                    disableUnderline={true}
                    size="small"
                    value={tax}
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "35%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("taxName1")}
                  ></Input>
                  <Input
                    disableUnderline={true}
                    startAdornment={
                      <InputAdornment position="end">
                        <FontAwesomeIcon color="black" icon={faPercent} />
                      </InputAdornment>
                    }
                    placeholder="Tax Percent"
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "35%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("taxRate1")}
                    defaultValue={locationData.taxRate1}
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
                  }}
                >
                  Tax 2 Rate :
                  <Input
                    disableUnderline={true}
                    size="small"
                    value={tax2}
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "35%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("taxName2")}
                  ></Input>
                  <Input
                    disableUnderline={true}
                    startAdornment={
                      <InputAdornment position="end">
                        <FontAwesomeIcon color="black" icon={faPercent} />
                      </InputAdornment>
                    }
                    placeholder="Tax Percent"
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "35%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("taxRate2")}
                    defaultValue={locationData.taxRate2}
                  ></Input>
                </InputLabel>
              </FormGroup>
              <span style={{ marginLeft: "65%", display: "flex" }}>
                <Checkbox> </Checkbox>
                <InputLabel style={{ marginTop: "10px" }}>
                  Cummulative?
                </InputLabel>
              </span>
              <span>
                <Button
                  style={{
                    marginLeft: "20%",
                    borderRadius: "25px",
                    backgroundColor: "orange",
                    color: "white",
                  }}
                  onClick={() => handleShow()}
                >
                  {buttonText}
                  <FontAwesomeIcon
                    style={{ marginLeft: "2px" }}
                    icon={faAngleDoubleRight}
                  />
                </Button>
              </span>
              {show && (
                <Container setShow={show}>
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
                      }}
                    >
                      Tax 3 Rate :
                      <Input
                        disableUnderline={true}
                        size="small"
                        placeholder="Tax Name"
                        style={{
                          display: "flex",
                          border: "1px solid Gray",
                          width: "35%",
                          padding: "2px",
                          borderRadius: "3px",
                          backgroundColor: "#F1F4F5",
                        }}
                      ></Input>
                      <Input
                        disableUnderline={true}
                        startAdornment={
                          <InputAdornment position="end">
                            <FontAwesomeIcon color="black" icon={faPercent} />
                          </InputAdornment>
                        }
                        placeholder="Tax Percent"
                        size="small"
                        style={{
                          display: "flex",
                          border: "1px solid Gray",
                          width: "35%",
                          padding: "2px",
                          borderRadius: "3px",
                          backgroundColor: "#F1F4F5",
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
                      }}
                    >
                      Tax 4 Rate :
                      <Input
                        disableUnderline={true}
                        required
                        size="small"
                        placeholder="Tax Name"
                        style={{
                          display: "flex",
                          border: "1px solid Gray",
                          width: "35%",
                          padding: "2px",
                          borderRadius: "3px",
                          backgroundColor: "#F1F4F5",
                        }}
                      ></Input>
                      <Input
                        disableUnderline={true}
                        required
                        startAdornment={
                          <InputAdornment position="end">
                            <FontAwesomeIcon color="black" icon={faPercent} />
                          </InputAdornment>
                        }
                        placeholder="Tax Percent"
                        size="small"
                        style={{
                          display: "flex",
                          border: "1px solid Gray",
                          width: "35%",
                          padding: "2px",
                          borderRadius: "3px",
                          backgroundColor: "#F1F4F5",
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
                      }}
                    >
                      Tax 5 Rate :
                      <Input
                        disableUnderline={true}
                        required
                        size="small"
                        placeholder="Tax Name"
                        style={{
                          display: "flex",
                          border: "1px solid Gray",
                          width: "35%",
                          padding: "2px",
                          borderRadius: "3px",
                          backgroundColor: "#F1F4F5",
                        }}
                      ></Input>
                      <Input
                        disableUnderline={true}
                        required
                        startAdornment={
                          <InputAdornment position="end">
                            <FontAwesomeIcon color="black" icon={faPercent} />
                          </InputAdornment>
                        }
                        placeholder="Tax Percent"
                        size="small"
                        style={{
                          display: "flex",
                          border: "1px solid Gray",
                          width: "35%",
                          padding: "2px",
                          borderRadius: "3px",
                          backgroundColor: "#F1F4F5",
                        }}
                      ></Input>
                    </InputLabel>
                  </FormGroup>
                </Container>
              )}
            </Container>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded>
          <AccordionSummary>
            <Typography>
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ marginRight: "10px" }}
              />
              Social Media Management
            </Typography>
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
                    color: "black",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Facebook Username :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("facebookPageUsername")}
                    defaultValue={locationData.facebookPageUsername}
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
                  Google Place ID :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("googlePlaceId")}
                    defaultValue={locationData.googlePlaceId}
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
                  Show in Mobile App :
                  <Checkbox
                    style={{ right: "77%" }}
                    {...register("showInApp")}
                    defaultChecked={locationData.showInApp}
                  ></Checkbox>
                </InputLabel>
              </FormGroup>
            </Container>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded>
          <AccordionSummary>
            <Typography>
              <FontAwesomeIcon
                icon={faPencilAlt}
                style={{ marginRight: "10px" }}
              />
              Other Details
            </Typography>
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
                    color: "black",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Have Paid :
                  <Checkbox
                    style={{ right: "77%" }}
                    {...register("isPaid")}
                    defaultChecked={locationData.isPaid}
                  ></Checkbox>
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
                  Manage Service Kits :
                  <Checkbox
                    style={{ right: "77%" }}
                    {...register("managingInventory")}
                    defaultChecked={locationData.managingInventory}
                  ></Checkbox>
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
                  Account Validity Date :
                  <Input
                    disableUnderline={true}
                    type="date"
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("accountValidity")}
                    defaultValue={accValidity}
                  ></Input>
                </InputLabel>
                {errors.accountValidity && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.accountValidity.message}
                  </span>
                )}
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
                  Receive Stock Alerts :
                  <Checkbox
                    style={{ right: "77%" }}
                    {...register("receiveStockAlert")}
                    defaultChecked={locationData.receiveStockAlert}
                  ></Checkbox>
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
                  Return Policy :
                  <Input
                    disableUnderline={true}
                    multiline
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
                    {...register("returnPolicy")}
                    defaultValue={locationData.returnPolicy}
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
                  Time Zone :
                  <Input
                    disableUnderline={true}
                    defaultValue={date}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("timezone")}
                  ></Input>
                </InputLabel>
                {errors.timezone && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.timezone.message}
                  </span>
                )}
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
                  DataStudio Url :
                  <Input
                    disableUnderline={true}
                    size="small"
                    style={{
                      display: "flex",
                      border: "1px solid Gray",
                      width: "80%",
                      padding: "2px",
                      borderRadius: "3px",
                      backgroundColor: "#F1F4F5",
                    }}
                    {...register("dataStudioUrl")}
                    defaultValue={locationData.dataStudioUrl}
                  ></Input>
                </InputLabel>
                {errors.dataStudioUrl && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "5px",
                      marginLeft: "15rem",
                    }}
                  >
                    {errors.dataStudioUrl.message}
                  </span>
                )}
              </FormGroup>

              <Button
                style={{
                  color: "white",
                  borderRadius: "4px",
                  backgroundColor: "black",
                  border: "0",
                  right: "-95%",
                  marginTop: "20px",
                }}
                type="submit"
              >
                Update
              </Button>
            </Container>
          </AccordionDetails>
        </Accordion>
      </form>
    </div>
  );
};

export default LocationEdit;

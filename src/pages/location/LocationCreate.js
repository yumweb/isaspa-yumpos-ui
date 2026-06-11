import { useState, useEffect } from "react";
import clientAdapter from "../../lib/clientAdapter";
import {
  Accordion,
  AccordionSummary,
  Typography,
  Container,
  FormGroup,
  InputLabel,
  Input,
  AccordionDetails,
  Select,
  MenuItem,
  Button,
  Divider,
  Checkbox,
  InputAdornment,
  Box,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPercent,
  faPencilAlt,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  storeCode: yup.string().required("Store Code is required"),
  address: yup.string().required("Address is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  area: yup.string().required("Area is required"),
  phone: yup
    .string()
    .matches(
      /^\d{10}$/,
      "Mobile number must be exactly 10 digits and contain only numbers"
    )
    .required("Phone Number is required"),
  fdNumber: yup
    .string()
    .matches(/^\d{10}$/, "Invalid Front Desk Contact")
    .required("Front Desk Contact is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  ownerName: yup.string().required("Owners Name is required"),
  ownerContact: yup
    .string()
    .matches(
      /^\d{10}$/,
      "Mobile number must be exactly 10 digits and contain only numbers"
    )
    .required("Owners Phone Number is required"),
  ownerEmail: yup
    .string()
    .email("Invalid email")
    .required("Owners Email is required"),
  accountValidity: yup.string().required("Account Validity Date is required"),
  timezone: yup.string().required("Time Zone is required"),
  dataStudioUrl: yup.string().required("Studio URL is required"),
});

const LocationCreate = (props) => {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Show More");
  const [show, setShow] = useState(false);
  const [city, setCity] = useState([]);
  const [stateData, setStateData] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const country = 101;
  const tax2 = "Sales Tax 2";
  const tax = "Sales Tax";

  const date = new Date();

  const handleShow = () => {
    setShow(!show);
    if (show) {
      setButtonText("Show More");
    } else {
      setButtonText("Hide");
    }
  };

  useEffect(() => {
    const getStates = async () => {
      const States = await clientAdapter.getAllStates(country);
      setStateData(States);
    };
    getStates();
  }, []);

  const handleStateChange = async (e) => {
    const cities = await clientAdapter.getCities(e.target.value);
    setCity(cities);
  };

  const onSubmit = props.onSubmit;

  const handleClick = () => {
    navigate("/locations");
  };

  return (
    <>
      <Box display={"flex"} alignItems={"center"} marginY="1rem">
        <ArrowBackIcon style={{ cursor: "pointer" }} onClick={handleClick} />
        <Typography ml={2} fontSize={22} fontWeight={"bold"}>
          Create Location
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                    color: "red",
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
                    {...register("country")}
                    defaultValue={country}
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
                    {...register("ownerContact")}
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
                    color: "red   ",
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
                    color: "red",
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
                Submit
              </Button>
            </Container>
          </AccordionDetails>
        </Accordion>
      </form>
    </>
  );
};

export default LocationCreate;

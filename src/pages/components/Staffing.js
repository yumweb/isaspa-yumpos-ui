import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Checkbox, FormGroup, Snackbar } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Input } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import clientAdapter from "../../lib/clientAdapter";
import _ from "lodash";
import moment from "moment-timezone";
const salaryRange = {
  35: "28K to 30K + Food Allowances",
  36: "20K to 22K + Food Allowances",
  37: "20K to 22K + Food Allowances",
  38: "30K & Above + Food Allowances",
  39: "20K to 22K + Food Allowances",
  40: "20K to 22K + Food Allowances",
  41: "20K to 22K + Food Allowances",
  42: "20K to 22K + Food Allowances",
  43: "20K to 22K + Food Allowances",
  44: "8K to 12K + Food Allowances",
  45: "10K to 12K + Food Allowances",
  46: "12K to 15K + Food Allowances",
};
const Staffing = () => {
  const [staffType, setStaffType] = useState("");
  const [staffGender, setStaffGender] = useState("");
  const [staffLevel, setStaffLevel] = useState("junior");
  const [message, setMessage] = useState("");
  const [range, setRange] = useState("");
  const [ticketsTargetDate, setTicketsTargetDate] = useState("");
  const [ticketsGracePeriod, setTicketsGracePeriod] = useState("");
  const [subject, setSubject] = useState("");
  const [staffRequestType, setStaffRequestType] = useState("");
  const [details, setDetails] = useState("");
  const [iAccept, setIAccept] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpShow, setOtpShow] = useState(false);

  const navigate = useNavigate();

  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const createStaffingTicket = async () => {
    const data = {
      staffType,
      staffGender,
      ticketsTargetDate,
      ticketsGracePeriod,
      subject,
      message,
      staffRequestType,
      staffLevel,
      salaryRange: range,
    };
    try {
      const res = await clientAdapter.createStaffingTicket(data);
      if (res) {
        setSnackBar({
          ...snackBar,
          open: true,
          severity: "success",
          message: "Staffing Ticket Created Successful!",
        });

        navigate("/tickets");
      } else {
        throw new Error("Error in Creating Staffing Ticket");
      }
    } catch (error) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Error in Creating Staffing Ticket",
      });
    }
  };

  useEffect(() => {
    const locationData = async () => {
      const locationInfo = JSON.parse(
        window.localStorage.getItem("yumpos_location")
      );
      const location = await clientAdapter.getLocationData(
        locationInfo.locationId
      );
      setDetails(location);
    };
    locationData();
  }, []);

  const handleStaff = (e) => {
    setStaffType(e.target.value);
    setRange(salaryRange[e.target.value]);
  };

  const handleReplacement = (e) => {
    setStaffRequestType(e.target.value);
  };

  const handleLevel = (e) => {
    setStaffLevel(e.target.value);
  };

  const handleGender = (e) => {
    setStaffGender(e.target.value);
  };

  const handlePeriod = (e) => {
    setTicketsGracePeriod(e.target.value);
  };

  const handleIAccept = (e) => {
    setIAccept(e.target.checked);
  };

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const sendOtp = async () => {
    const data = {
      staffType,
      staffGender,
      ticketsTargetDate,
      ticketsGracePeriod,
      subject,
      message,
      staffRequestType,
    };
    const hasAnyEmptyValue = _.some(data, (value) => {
      return _.isEmpty(value) && !_.isNumber(value) && !_.isBoolean(value);
    });
    if (hasAnyEmptyValue || !iAccept) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Kindly fill all the required fields",
      });
      return false;
    }
    try {
      const res = await clientAdapter.sendOtp();
      if (res === 201) {
        setOtpShow(true);
        setSnackBar({
          ...snackBar,
          open: true,
          severity: "success",
          message: "OTP sent to your registered email",
        });
      } else {
        throw new Error("Error in sending otp");
      }
    } catch (err) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Error in sending otp",
      });
    }
  };

  const handleOtp = async () => {
    const data = {
      otp,
    };
    const res = await clientAdapter.verifyOtp(data);
    if (res?.valid === true && iAccept) {
      try {
        setSnackBar({
          ...snackBar,
          open: true,
          severity: "success",
          message: "Otp Verified Successfully",
        });
        createStaffingTicket();
      } catch (e) {
        setSnackBar({
          ...snackBar,
          open: true,
          severity: "error",
          message: "Error in Creating Staffing Ticket",
        });
      }
    } else {
      console.log(res?.valid, iAccept, "testingsjna");
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message:
          "Kindly fill all the required fields and accept Salary Range to verify the OTP and generate Staffing request",
      });
    }
  };

  return (
    <>
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
          Owners Name :
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
            value={details.ownerName}
            id="ownersName"
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
          E-Mail :
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
            value={details.ticketsEmail}
            id="ownersName"
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
          Phone Number :
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
            value={details.ticketsContact}
            id="omnersName"
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
          Type of Staff :
          <Select
            IconComponent={false}
            variant="standard"
            disableUnderline={true}
            style={{
              width: "80%",
              border: "1px solid Gray",
              borderRadius: "3px",
            }}
            value={staffType}
            onChange={handleStaff}
          >
            <MenuItem value={0} disabled>
              Select Skill Set
            </MenuItem>
            <MenuItem value={35}>Male Unisex Stylist</MenuItem>
            <MenuItem value={36}>Male Hairstylist</MenuItem>
            <MenuItem value={37}>Female Beautician</MenuItem>
            <MenuItem value={38}>Female Beauty & Makeup</MenuItem>
            <MenuItem value={39}>Spa + Beauty (F)</MenuItem>
            <MenuItem value={40}>Spa + Beauty (M)</MenuItem>
            <MenuItem value={41}>Male Hair & Beauty</MenuItem>
            <MenuItem value={42}>Spa Therapist for Men</MenuItem>
            <MenuItem value={43}>Spa Therapist for Women</MenuItem>
            <MenuItem value={44}>Academy Fresher Beauty</MenuItem>
            <MenuItem value={46}>Academy Fresher Spa</MenuItem>
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
            color: "red   ",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Staff Gender :
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
            onChange={handleGender}
            value={staffGender}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
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
            color: "red   ",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Staff Level :
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
            onChange={handleLevel}
            value={staffLevel}
          >
            <MenuItem value="junior">Junior</MenuItem>
            <MenuItem value="mid_level">Mid Level</MenuItem>
            <MenuItem value="senior">Senior</MenuItem>
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
            color: "red   ",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Target Date :
          <Input
            disableUnderline={true}
            required
            size="small"
            type="date"
            style={{
              display: "flex",
              border: "1px solid Gray",
              width: "80%",
              padding: "2px",
              borderRadius: "3px",
              backgroundColor: "#F1F4F5",
            }}
            onChange={(e) =>
              setTicketsTargetDate(moment(e.target.value).format())
            }
            id="ownersName"
          ></Input>
        </InputLabel>
      </FormGroup>
      <span>
        <h6 style={{ fontWeight: "lighter", marginLeft: "220px" }}>
          Should be minimum 30 days
        </h6>
      </span>
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
          Grace Period :
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
            value={ticketsGracePeriod}
            onChange={handlePeriod}
          >
            <MenuItem value={10}>10 days</MenuItem>
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
            color: "red   ",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Is Staff A Replacement? :
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
            value={staffRequestType}
            onChange={handleReplacement}
          >
            <MenuItem value={2}>Yes</MenuItem>
            <MenuItem value={1}>No</MenuItem>
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
            color: "red   ",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Subject :
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
            id="subject"
            onChange={(e) => setSubject(e.target.value)}
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
          Message :
          <Input
            disableUnderline={true}
            required
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
            onChange={(e) => setMessage(e.target.value)}
            id="ownersName"
          ></Input>
        </InputLabel>
      </FormGroup>
      {range && (
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
            Salary Range :
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
              value={range}
              id="salaryRange"
            ></Input>
          </InputLabel>
          <div>
            <Checkbox style={{ float: "left" }} onChange={handleIAccept}>
              {" "}
            </Checkbox>
            <InputLabel style={{ marginTop: "10px", float: "left" }}>
              I accept the Salary Range.
            </InputLabel>
          </div>
        </FormGroup>
      )}
      {otpShow && (
        <>
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
              Enter OTP :
              <Input
                disableUnderline={true}
                required
                type="text"
                size="small"
                style={{
                  display: "flex",
                  border: "1px solid Gray",
                  width: "80%",
                  padding: "2px",
                  borderRadius: "3px",
                  backgroundColor: "#F1F4F5",
                }}
                onChange={(e) => setOtp(e.target.value)}
                id="number"
              ></Input>
            </InputLabel>
          </FormGroup>
        </>
      )}
      {!otpShow && (
        <Button
          disabled={!iAccept}
          style={{
            backgroundColor: "#262B40",
            color: "white",
            marginLeft: "870px",
            marginTop: "1rem",
          }}
          onClick={sendOtp}
        >
          Generate Staffing Ticket OTP
        </Button>
      )}
      {otpShow && (
        <>
          <Button
            disabled={!iAccept}
            style={{
              backgroundColor: "#262B40",
              color: "white",
              marginLeft: "890px",
              marginTop: "1rem",
            }}
            onClick={handleOtp}
          >
            Verify OTP & Create Ticket
          </Button>
          <Button
            style={{
              backgroundColor: "#262B40",
              color: "white",
              marginLeft: "1007px",
              marginTop: "1rem",
            }}
            onClick={sendOtp}
          >
            Resend OTP
          </Button>
        </>
      )}
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

export default Staffing;

import React, { useEffect, useState } from "react";
import { FormGroup, InputLabel, Input } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Select } from "@mui/material";
import { Button } from "@mui/material";
import clientAdapter from "../lib/clientAdapter";
import { Snackbar, Alert } from "@mui/material";

const Training = () => {
  const [trainingFor, setTrainingFor] = useState("");
  const [ticketsTargetDate, setticketsTargetDate] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");
  const [otp, setOtp] = useState("");
  const [otpShow, setOtpShow] = useState(false);
  const [sendVerifyOtp, setSendVerifyOtp] = useState(true);
  const [response, setResponse] = useState("");
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  
  const trainingTicket = async () => {
    if (response?.valid === true) {
      const data = {
        trainingFor,
        ticketsTargetDate,
        subject,
        message,
      };
      const res = await clientAdapter.createTrainingTicket(data);
      if (res) {
        setSnackBar({
          ...snackBar,
          open: true,
          severity: "success",
          message: "Training Ticket Created Successful!",
        });
      }
    } else {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message:
          "Kindly fill all the required fields and also verify the OTP to generate Training request",
      });
    }
  };

  const sendOtp = async () => {
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
        setSendVerifyOtp(false);
      } else {
        throw new Error("Error in sending otp");
      }
    } catch (error) {
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
    setResponse(res);
    if (res?.valid === true) {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "success",
        message: "Otp Verified Successfully",
      });
    } else {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message: "Invalid Otp",
      });
    }
  };

  const handleTraining = (e) => {
    setTrainingFor(e.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
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
            color: "red",
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
            color: "red",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Phone Number :
          <Input
            disableUnderline={true}
            required
            type="number"
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
            id="number"
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
          Training For :
          <Select
            required
            IconComponent={false}
            variant="standard"
            disableUnderline={true}
            style={{
              width: "80%",
              border: "1px solid Gray",
              borderRadius: "3px",
            }}
            onChange={handleTraining}
            value={trainingFor}
          >
            <MenuItem value="0" disabled>
              Select Training Request
            </MenuItem>
            <MenuItem value="skin">Skin</MenuItem>
            <MenuItem value="spa">Spa</MenuItem>
            <MenuItem value="hair">Hair</MenuItem>
            <MenuItem value="make_up">Make-up</MenuItem>
            <MenuItem value="front_office">Front Office</MenuItem>
            <MenuItem value="experience_sop">Experience SOP</MenuItem>
            <MenuItem value="soft_skills">Soft Skills</MenuItem>
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
          Target Date :
          <Input
            disableUnderline={true}
            required
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
            onChange={(e) => setticketsTargetDate(e.target.value)}
            id="number"
          ></Input>
        </InputLabel>
      </FormGroup>
      <span>
        <h6
          style={{
            fontWeight: "lighter",
            marginLeft: "220px",
            fontSize: "14px",
          }}
        >
          Minimum 15 Days for Experience SOP , Soft Skills , Skin , Spa , Hair ,
          Make-Up and One Week Notice for Front Office Training
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
            color: "red",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Subject :
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
            onChange={(e) => setSubject(e.target.value)}
            id="text"
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
          Message :
          <Input
            disableUnderline={true}
            required
            multiline
            rows={4}
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
            onChange={(e) => setMessage(e.target.value)}
            id="number"
          ></Input>
        </InputLabel>
      </FormGroup>
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
          <FormGroup
            style={{
              display: "inline-block",
              width: "100%",
              fontFamily: "Russo One, sans-serif",
              marginTop: "10px",
            }}
          >
            <Button
              style={{
                marginRight: "780px",
                backgroundColor: "#262B40",
                color: "white",
              }}
              onClick={handleOtp}
            >
              Verify OTP
            </Button>
          </FormGroup>
        </>
      )}
      {sendVerifyOtp && (
        <FormGroup
          style={{
            display: "inline-block",
            width: "100%",
            fontFamily: "Russo One, sans-serif",
            marginTop: "10px",
          }}
        >
          <Button
            style={{
              marginRight: "780px",
              backgroundColor: "#262B40",
              color: "white",
            }}
            onClick={sendOtp}
          >
            Send OTP
          </Button>
        </FormGroup>
      )}
      <Button
        style={{
          backgroundColor: "#262B40",
          color: "white",
          marginLeft: "900px",
        }}
        onClick={trainingTicket}
      >
        Generate Exit Ticket
      </Button>
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

export default Training;

import { Button, FormGroup } from "@mui/material";
import React, { useState } from "react";
import { InputLabel, Input } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import clientAdapter from "../lib/clientAdapter";
import { useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

const StaffExit = () => {
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState("");
  const [candidateDesignation, setCandidateDesignation] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [relievingDate, setRelievingDate] = useState("");
  const [leavingReason, setLeavingReason] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [candidateSalary, setCandidateSalary] = useState("");
  const [companyReviewCandidate, setCompanyReviewCandidate] = useState("");
  const [otherCommentsCandidate, setOtherCommentsCandidate] = useState("");
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

  const handleDesignation = (e) => {
    setCandidateDesignation(e.target.value);
  };

  const handleCandidatePhoneNumber = (e) => {
    const data = e.target.value;

    if (/^[0-9]*$/.test(data) && data.length <= 10) {
      setCandidatePhoneNumber(data);
    } 
  };

  const handleNoticePeriod = (e) => {
    const data = e.target.value;

    if (/^[0-9]*$/.test(data)) {
      setNoticePeriod(data);
    } 
  };

  const handleSalary = (e) => {
    const data = e.target.value;

    if (/^[0-9]*$/.test(data)) {
      setCandidateSalary(data);
    } 
  };

  const createExitTicket = async () => {
    if (response?.valid === true) {
      const data = {
        candidateName,
        candidateEmail,
        candidatePhoneNumber,
        candidateDesignation,
        joiningDate,
        relievingDate,
        leavingReason,
        noticePeriod,
        candidateSalary,
        companyReviewCandidate,
        otherCommentsCandidate,
      };
      try {
        const res = await clientAdapter.createStaffExitTicket(data);
        if (res) {
          setSnackBar({
            ...snackBar,
            open: true,
            severity: "success",
            message: "StaffExit Ticket Created Successful!",
          });
        } else {
          throw new Error("Error in Creating StaffExit Ticket");
        }
      } catch (error) {
        setSnackBar({
          ...snackBar,
          open: true,
          severity: "error",
          message: "Error in Creating StaffExit Ticket",
        });
      }
    } else {
      setSnackBar({
        ...snackBar,
        open: true,
        severity: "error",
        message:
          "Kindly fill all the required fields and also verify the OTP to generate StaffExit request",
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
            color: "red   ",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          E-mail :
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
            id="email"
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
            id="phoneNumber"
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
            fontFamily: "Russo One, sans-serif",
            width: "100%",
            color: "red",
          }}
        >
          Candidate Name :
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
            onChange={(e) => setCandidateName(e.target.value)}
            id="firstName"
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
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Candidate Email :
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
            onChange={(e) => setCandidateEmail(e.target.value)}
            id="email"
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
          Candidate Phone No. :
          <Input
            disableUnderline={true}
            type="text"
            required
            size="small"
            value={candidatePhoneNumber}
            style={{
              display: "flex",
              border: "1px solid Gray",
              width: "80%",
              padding: "2px",
              borderRadius: "3px",
              backgroundColor: "#F1F4F5",
            }}
            pattern="[0-9]*"
            onChange={handleCandidatePhoneNumber}
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
          Designation :
          <Select
            IconComponent={false}
            variant="standard"
            disableUnderline={true}
            style={{
              width: "80%",
              border: "1px solid Gray",
              borderRadius: "3px",
            }}
            value={candidateDesignation}
            onChange={handleDesignation}
          >
            <MenuItem value={0} disabled>
              Current Designation
            </MenuItem>
            <MenuItem value={1}>Hair Stylist</MenuItem>
            <MenuItem value={2}>Spa Therapist</MenuItem>
            <MenuItem value={3}>Basic Makeup Artist</MenuItem>
            <MenuItem value={4}>Advanced Makeup Artist</MenuItem>
            <MenuItem value={5}>Nail Artist</MenuItem>
            <MenuItem value={7}>Front Desk Executive</MenuItem>
            <MenuItem value={9}>Beautician</MenuItem>
            <MenuItem value={10}>Pedicurist</MenuItem>
            <MenuItem value={11}>All Rounder</MenuItem>
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
          Joining Date :
          <Input
            disableUnderline={true}
            type="date"
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
            onChange={(e) => setJoiningDate(e.target.value)}
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
          Relieving Date :
          <Input
            disableUnderline={true}
            type="date"
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
            onChange={(e) => setRelievingDate(e.target.value)}
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
          Reason for Leaving :
          <Input
            disableUnderline={true}
            multiline
            rows={4}
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
            onChange={(e) => setLeavingReason(e.target.value)}
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
          Notice Period :
          <Input
            disableUnderline={true}
            type="text"
            required
            size="small"
            value={noticePeriod}
            style={{
              display: "flex",
              border: "1px solid Gray",
              width: "80%",
              padding: "2px",
              color: "red",
              borderRadius: "3px",
              backgroundColor: "#F1F4F5",
            }}
            pattern="[0-9]*"
            onChange={handleNoticePeriod}
            id="number"
          ></Input>
        </InputLabel>
      </FormGroup>
      <span>
        <h6 style={{ fontWeight: "lighter", marginLeft: "220px" }}>In Days</h6>
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
            color: "black",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Salary :
          <Input
            disableUnderline={true}
            type="text"
            required
            size="small"
            value={candidateSalary}
            style={{
              display: "flex",
              border: "1px solid Gray",
              width: "80%",
              padding: "2px",
              color: "red",
              borderRadius: "3px",
              backgroundColor: "#F1F4F5",
            }}
            pattern="[0-9]*"
            onChange={handleSalary}
            id="number"
          ></Input>
        </InputLabel>
      </FormGroup>
      <span>
        <h6 style={{ fontWeight: "lighter", marginLeft: "220px" }}>
          Current Monthly Salary
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
            color: "black",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Company's Perfomance <br></br> Review :
          <Input
            disableUnderline={true}
            required
            size="small"
            multiline
            rows={4}
            style={{
              display: "flex",
              border: "1px solid Gray",
              width: "80%",
              padding: "2px",
              color: "red",
              borderRadius: "3px",
              backgroundColor: "#F1F4F5",
            }}
            onChange={(e) => setCompanyReviewCandidate(e.target.value)}
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
            color: "black",
            fontFamily: "Russo One, sans-serif",
            width: "100%",
          }}
        >
          Other Comments (If Any) :
          <Input
            disableUnderline={true}
            required
            size="small"
            multiline
            rows={4}
            style={{
              display: "flex",
              border: "1px solid Gray",
              width: "80%",
              padding: "2px",
              color: "red",
              borderRadius: "3px",
              backgroundColor: "#F1F4F5",
            }}
            onChange={(e) => setOtherCommentsCandidate(e.target.value)}
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
        onClick={createExitTicket}
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

export default StaffExit;

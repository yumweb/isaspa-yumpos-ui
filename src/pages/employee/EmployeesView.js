import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Input,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import clientAdapter from "../../lib/clientAdapter";
import { styles } from "./employee.styles";
import React, { useState, useCallback, useEffect } from "react";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  defaultEndTime,
  defaultStartTime,
  weekDays,
} from "../../data/employee";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const empSkillSets = [
  { id: "1", skill: "Male Hair Stylist" },
  { id: "2", skill: "Spa Therapist" },
  { id: "3", skill: "Makeup Artist" },
  { id: "4", skill: "Advance Makeup Artist" },
  { id: "5", skill: "Nail Artist" },
  { id: "6", skill: "Manager" },
  { id: "7", skill: "Front Desk Executive" },
  { id: "8", skill: "TSM" },
  { id: "9", skill: "Beautician" },
  { id: "10", skill: "Pedicurist" },
  { id: "11", skill: "Unisex Hairstylist" },
  { id: "12", skill: "Fresher Beautician" },
];

const EmployeesView = ({
  isEditing,
  editItem,
  onSubmitEmployee,
  onCancelEmployee,
}) => {
  const loggedInUserInfo = JSON.parse(
    window.localStorage.getItem("yumpos_user_info")
  );

  const [branchLocations, setBranchLocations] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [comments, setComments] = useState("");
  const [employeeGender, setEmployeeGender] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [employeeSchedule, setEmployeeSchedule] = useState([...weekDays]);
  const [previousEmployeeSchedule, setPreviousEmployeeSchedule] = useState([
    ...weekDays,
  ]);

  const [employeeSkillSets, setEmployeeSkillSets] = useState([]);
  const [employeeServiceGender, setEmployeeServiceGender] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [birthday, setBirthday] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [language, setLanguage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [selectedLocations, setSelectedLocations] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState("");
  const [addedSkillsets, setAddedSkillsets] = useState([]);
  const [removedSkillsets, setRemovedSkillsets] = useState([]);
  const [addedLocations, setAddedLocations] = useState([]);
  const [removedLocations, setRemovedLocations] = useState([]);

  const [errors, setErrors] = React.useState({
    firstName: "",
    email: "",
    phoneNumber: "",
    employeeGender: "",
    employeeSkillSets: "",
    serviceGender: "",
    username: "",
    password: "",
    passwordAgain: "",
    locations: "",
    employeeType: "",
  });
  const [expanded, setExpanded] = useState({
    panel1: true,
    panel2: false,
    panel3: false,
    panel4: false,
    panel5: false,
  });
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleSnackbarClose = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  };

  const handleExpanded = (panel) => (event, isExpanded) => {
    setExpanded({ ...expanded, [panel]: isExpanded });
  };

  const getAllLocations = async () => {
    try {
      const res = await clientAdapter.getUserLocations();
      setBranchLocations(res.locations);
    } catch (error) {
      setBranchLocations([]);
    }
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  const updateEmpSchedule = (employeeShifts) => {
    const empSchedule = weekDays.map((weekday) => {
      const matchedDay = employeeShifts.find(
        (empDay) => empDay.day === weekday.day
      );

      return (
        matchedDay || {
          ...weekday,
          weeklyOff: true,
          shiftStart: dayjs(defaultStartTime),
          shiftEnd: dayjs(defaultEndTime),
        }
      );
    });

    setPreviousEmployeeSchedule(empSchedule);
    setEmployeeSchedule(empSchedule);
  };

  const onClickEdit = useCallback((item) => {
    setFirstName(item.person.firstName);
    setLastName(item.person.lastName);
    setEmail(item.person.email);
    setPhoneNumber(item.person.phoneNumber);
    setAddress1(item.person.address1);
    setAddress2(item.person.address2);
    setCity(item.person.city);
    setState(item.person.state);
    setZip(item.person.zip);
    setCountry(item.person.country);
    setComments(item.person.comments);
    setEmployeeGender(item.employeeGender);
    setEmployeeType(item.role);
    const empSchedule = item.employeeShifts.map((item) => {
      const { day, shiftStart, shiftEnd } = item;

      return {
        day,
        weeklyOff: !shiftStart || !shiftEnd,
        shiftStart: shiftStart
          ? dayjs(`${dayjs().format("YYYY-MM-DD")}T${shiftStart}`)
          : dayjs(defaultStartTime),
        shiftEnd: shiftEnd
          ? dayjs(`${dayjs().format("YYYY-MM-DD")}${shiftEnd}`)
          : dayjs(defaultEndTime),
      };
    });
    updateEmpSchedule(empSchedule);
    setEmployeeSkillSets(
      item.skillsets.map((skillId) => skillId.id.toString())
    );
    setEmployeeServiceGender(item.serviceGender);
    setHireDate(item.hireDate);
    setBirthday(item.birthDate);
    setEmployeeNumber(item.employeeNumber);
    setLanguage(item.language);
    setUsername(item.username);
    setPassword();
    setPasswordAgain();
    setSelectedLocations(item.locations.map((location) => location.locationId));
  }, []);

  useEffect(() => {
    if (isEditing) {
      onClickEdit(editItem);
    }
  }, [isEditing, editItem]);

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
    if (!lastName) {
      handleError("Last Name is Required", "lastName");
      isValid = false;
      !expanded.panel1 && setExpanded({ ...expanded, panel1: true });
      return;
    } else if (!lastName.trim().length) {
      handleError("Last Name is Required", "lastName");
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

    // if (!email) {
    //   handleError("Email is Required", "email");
    //   isValid = false;
    //   !expanded.panel1 && setExpanded({ ...expanded, panel1: true });
    //   return;
    // }

    if (!employeeGender) {
      handleError("Gender is Required", "gender");
      isValid = false;
      !expanded.panel1 && setExpanded({ ...expanded, panel1: true });
      return;
    }

    if (loggedInUserInfo.employeeId === 1 && !employeeType) {
      handleError("Employee Type is Required", "employeeType");
      isValid = false;
      !expanded.panel1 && setExpanded({ ...expanded, panel1: true });
      return;
    }

    // if (!employeeSkillSets) {
    //   handleError("Employee Skillsets is Required", "employeeSkillSets");
    //   isValid = false;
    //   !expanded.panel2 && setExpanded({ ...expanded, panel2: true });
    //   return;
    // }

    // if (!employeeServiceGender) {
    //   handleError("Employee Service Gender is Required", "serviceGender");
    //   isValid = false;
    //   !expanded.panel2 && setExpanded({ ...expanded, panel2: true });
    //   return;
    // }

    if (!isEditing) {
      if (!username) {
        handleError("Username is a Required Field", "username");
        isValid = false;
        !expanded.panel4 && setExpanded({ ...expanded, panel4: true });
        return;
      }
    }

    if (!isEditing) {
      if (!password) {
        handleError("Password is Required", "password");
        isValid = false;
        !expanded.panel4 && setExpanded({ ...expanded, panel4: true });
        return;
      }
    }

    if (!isEditing) {
      if (!passwordAgain) {
        handleError("Confirm Password is Required", "passwordAgain");
        isValid = false;
        !expanded.panel4 && setExpanded({ ...expanded, panel4: true });
        return;
      }
    }

    if (!isEditing) {
      if (password !== passwordAgain) {
        handleError(
          "Confirm Password does not match the entered password.",
          "passwordAgain"
        );
        isValid = false;
        !expanded.panel4 && setExpanded({ ...expanded, panel4: true });
        return;
      }
    }

    if (!selectedLocations?.length) {
      handleError(
        "At least one location is required for an employee",
        "locations"
      );
      isValid = false;
      !expanded.panel5 && setExpanded({ ...expanded, panel5: true });
      return;
    }

    if (isValid) {
      return true;
    }
  };

  const focusInputById = (id) => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
    focusInputById(input);
  };

  const areObjectsEqual = (obj1, obj2) => {
    for (const key in obj1) {
      if (obj1[key] instanceof Date && obj2[key] instanceof Date) {
        // Compare dates using getTime()
        if (obj1[key].getTime() !== obj2[key].getTime()) {
          return false;
        }
      } else if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  };

  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (!areObjectsEqual(arr1[i], arr2[i])) {
        return false;
      }
    }
    return true;
  };

  const checkIfLocationOrShiftHasUpdated = async (shiftsData) => {
    let hasUpdated = false;
    let res = false;
    //check if shift has been updated or not
    const isShiftEqual = areArraysEqual(
      previousEmployeeSchedule,
      employeeSchedule
    );

    if (!isShiftEqual) {
      const sData = {
        shifts: shiftsData,
      };
      const updateShiftsRes = await clientAdapter.employeeShiftsDetails(
        editItem.person.id,
        sData
      );
      if (updateShiftsRes === 200) {
        hasUpdated = true;
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: "Shifts update failed. Please try again later.",
        });
        hasUpdated = false;
      }
    }
    //check if location has been updated or not
    let isLocationUpdated =
      addedLocations.length > 0 || removedLocations.length > 0;
    if (isLocationUpdated) {
      const locationUpdateData = {
        locations: {
          added: addedLocations,
          removed: removedLocations,
        },
      };

      const locationUpdateRes = await clientAdapter.employeeLocationDetails(
        editItem.person.id,
        locationUpdateData
      );
      if (locationUpdateRes === 200) {
        hasUpdated = true;
      } else {
        hasUpdated = false;
        setSnackBar({
          open: true,
          severity: "error",
          message: "Location update failed. Please try again later.",
        });
      }
    }

    if (isShiftEqual && !isLocationUpdated) {
      res = true;
    } else if (hasUpdated) {
      res = true;
    } else {
      res = false;
    }

    return res;
  };

  const createEmployee = async () => {
    if (onValidation()) {
      const shiftsData = employeeSchedule
        .filter((shift) => !shift.weeklyOff)
        .map(({ shiftStart, shiftEnd, day }) => ({
          shiftStart: shiftStart?.format("HH:mm"),
          shiftEnd: shiftEnd?.format("HH:mm"),
          day: day,
        }));

      try {
        let res;
        const editData = {};
        if (isEditing) {
          if (addedSkillsets.length > 0 || removedSkillsets.length > 0) {
            editData.skillsets = {
              added: addedSkillsets,
              removed: removedSkillsets,
            };
          }

          if (editItem.person.firstName !== firstName) {
            editData.firstName = firstName;
          }

          if (editItem.person.lastName !== lastName) {
            editData.lastName = lastName;
          }

          if (editItem.person.email !== email) {
            editData.email = email;
          }

          if (editItem.person.phoneNumber !== phoneNumber) {
            editData.phoneNumber = phoneNumber;
          }

          if (editItem.employeeGender !== employeeGender) {
            editData.employeeGender = Number(employeeGender);
          }

          if (loggedInUserInfo.employeeId === 1) {
            if (editItem.employeeType !== employeeType) {
              editData.employeeType = employeeType;
            }
          }

          if (editItem.serviceGender !== employeeServiceGender) {
            editData.serviceGender = Number(employeeServiceGender);
          }

          const _isupdate = await checkIfLocationOrShiftHasUpdated(shiftsData);
          if (_isupdate || Object.keys(editData).length !== 0) {
            res = await clientAdapter.updateEmployee(
              editItem.person.id,
              editData
            );
          } else {
            setSnackBar({
              open: true,
              severity: "error",
              message: "No update has been done",
            });
          }
        } else {
          //create new employee
          const data = {
            firstName,
            lastName,
            email: email || null,
            phoneNumber,
            address1,
            address2,
            city,
            state,
            zip,
            country,
            comments,
            employeeGender: Number(employeeGender),
            shifts: shiftsData,
            serviceGender: Number(employeeServiceGender) || null,
            hireDate: hireDate || null,
            birthDay: birthday || null,
            ...(employeeNumber && { employeeNumber }),
            language,
            userName: username,
            password: password,
          };

          data.skillsets = employeeSkillSets;
          data.employeeLocation = selectedLocations;
          if (loggedInUserInfo.employeeId === 1) {
            data.employeeType = employeeType;
          }
          console.log(data);
          res = await clientAdapter.createEmployee(data);
        }

        if (res) {
          if (res && res === 409) {
            setSnackBar({
              open: true,
              severity: "error",
              message:
                "Employee already exists. Please provide unique information.",
            });
          } else if (res === 200 || res === 201) {
            setSnackBar({
              open: true,
              severity: "success",
              message: isEditing
                ? "Updated Employee Successfully"
                : "Created Employee Successfully",
            });
            setPreviousEmployeeSchedule(weekDays);
            onSubmitEmployee && onSubmitEmployee();
          }
        } else {
          alert("Some error occurred. Please try again later");
        }
      } catch (error) {
        setSnackBar({
          open: true,
          severity: "error",
          message: "An error occurred. Please try again later.",
        });
      }
    }
  };

  const cancelEmployee = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setState("");
    setZip("");
    setCountry("");
    setComments("");
    setEmployeeGender("");
    setEmployeeType("");
    setEmployeeSchedule([]);
    setEmployeeSkillSets([]);
    setEmployeeGender("");
    setHireDate("");
    setBirthday("");
    setEmployeeNumber("");
    setLanguage("");
    setUsername("");
    setPassword("");
    setPasswordAgain("");
    setSelectedLocations([]);
    onCancelEmployee && onCancelEmployee();
  };

  const handleFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePhoneNumber = (e) => {
    const data = e.target.value;
    if (/^[0-9]*$/.test(data) && data.length <= 10) {
      setPhoneNumber(data);
    }
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
  const handleState = (e) => {
    setState(e.target.value);
  };
  const handleZip = (e) => {
    setZip(e.target.value);
  };
  const handleCountry = (e) => {
    setCountry(e.target.value);
  };
  const handleComments = (e) => {
    setComments(e.target.value);
  };
  const handleGender = (e) => {
    setEmployeeGender(e.target.value);
  };
  const handleEmployeeType = (e) => {
    setEmployeeType(e.target.value);
  };
  const handleEmployeeSchedule = (index, isChecked) => {
    setEmployeeSchedule((prevSchedule) => {
      const updatedSchedule = prevSchedule.map((day, i) => {
        if (i === index) {
          return { ...day, weeklyOff: isChecked };
        }
        return day;
      });

      return updatedSchedule;
    });
  };
  const handleShiftStartChange = (index, time) => {
    setEmployeeSchedule((prevShifts) => {
      const updatedShifts = prevShifts.map((shift, i) => {
        if (i === index) {
          // Create a new object for the updated shift
          return { ...shift, shiftStart: time };
        }
        return shift;
      });

      return updatedShifts;
    });
  };
  const handleShiftEndChange = (index, time) => {
    setEmployeeSchedule((prevShifts) => {
      const updatedShifts = prevShifts.map((shift, i) => {
        if (i === index) {
          // Create a new object for the updated shift
          return { ...shift, shiftEnd: time };
        }
        return shift;
      });

      return updatedShifts;
    });
  };
  const handleEmployeeSkillSets = (e) => {
    const selectedSkill = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setEmployeeSkillSets((prevSkills) => [...prevSkills, selectedSkill]);

      if (isEditing) {
        setAddedSkillsets((prevSkills) => [...prevSkills, selectedSkill]);
        setRemovedSkillsets((prevSkills) =>
          prevSkills.filter((skill) => skill !== selectedSkill)
        );
      }
    } else {
      setEmployeeSkillSets((prevSkills) =>
        prevSkills.filter((skill) => skill !== selectedSkill)
      );

      if (isEditing) {
        setRemovedSkillsets((prevSkills) => [...prevSkills, selectedSkill]);
        setAddedSkillsets((prevSkills) =>
          prevSkills.filter((skill) => skill !== selectedSkill)
        );
      }
    }
  };
  const handleServiceGender = (e) => {
    setEmployeeServiceGender(e.target.value);
  };
  const handleHireDate = (e) => {
    setHireDate(e.target.value);
  };
  const handleBirthday = (e) => {
    setBirthday(e.target.value);
  };
  const handleEmployeeNumber = (e) => {
    setEmployeeNumber(e.target.value);
  };
  const handleLanguage = (e) => {
    setLanguage(e.target.value);
  };
  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handlePasswordAgain = (e) => {
    setPasswordAgain(e.target.value);
  };

  const handleSearch = (e) => {
    setLocation(e.target.value);
    setLocationList(
      branchLocations.filter((i) =>
        i?.name?.toLowerCase().includes(e.target.value?.toLowerCase())
      )
    );
  };

  const handleLocations = (selectedLocation, isLocation) => {
    if (isLocation) {
      setSelectedLocations((prevLocation) => [
        ...prevLocation,
        selectedLocation,
      ]);

      if (isEditing) {
        setAddedLocations((prevLocation) => [
          ...prevLocation,
          selectedLocation,
        ]);
        setRemovedLocations((prevLocation) =>
          prevLocation.filter((location) => location !== selectedLocation)
        );
      }
    } else {
      setSelectedLocations((prevLocation) =>
        prevLocation.filter((location) => location !== selectedLocation)
      );

      if (isEditing) {
        setRemovedLocations((prevLocation) => [
          ...prevLocation,
          selectedLocation,
        ]);
        setAddedLocations((prevLocation) =>
          prevLocation.filter((location) => location !== selectedLocation)
        );
      }
    }
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
            Employee Basic Information{" "}
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
            <Grid container>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  {" "}
                  First Name :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
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
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  Last Name :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="lastName"
                  value={lastName}
                  onChange={handleLastName}
                />
                <div style={styles.errorText}>{errors.lastName}</div>
              </Grid>
            </Grid>

            {/* <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  E-mail :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputTextRequired}
                  id="email"
                  value={email}
                  onChange={handleEmail}
                />
                <div style={styles.errorText}>{errors.email}</div>
              </Grid>
            </Grid> */}

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  {" "}
                  Phone Number :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  type="text"
                  size="small"
                  style={styles.inputTextRequired}
                  value={phoneNumber}
                  id="phoneNumber"
                  onChange={handlePhoneNumber}
                  pattern="[0-9]*"
                />
                <div style={styles.errorText}>{errors.phoneNumber}</div>
              </Grid>
            </Grid>

            {/* <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>Address 1 :</Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="address1"
                  value={address1}
                  onChange={handleAddress1}
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>Address 2 :</Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="address2"
                  value={address2}
                  onChange={handleAddress2}
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>City :</Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="city"
                  value={city}
                  onChange={handleCity}
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>
                  State/Province :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="state"
                  value={state}
                  onChange={handleState}
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>Zip :</Typography>
              </Grid>
              <Grid item xs={9.5}>
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
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>Country :</Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="country"
                  value={country}
                  onChange={handleCountry}
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>Comments :</Typography>
              </Grid>
              <Grid item xs={9.5}>
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
              </Grid>
            </Grid> */}

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  {" "}
                  Employee Gender :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <RadioGroup
                  name="use-radio-group"
                  defaultValue="first"
                  style={{
                    float: "left",
                    display: "flex",
                    flexDirection: "row",
                  }}
                  id="employeeGender"
                  value={employeeGender}
                  onChange={handleGender}
                >
                  <FormControlLabel
                    value={1}
                    label="Male"
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value={2}
                    label="Female"
                    control={<Radio />}
                  />
                </RadioGroup>
                <div style={styles.errorText}>{errors.gender}</div>
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <>
                <Grid item xs={2.5}>
                  <Typography style={styles.inputlabelRequired}>
                    Employee Type :{" "}
                  </Typography>
                </Grid>
                <Grid item xs={9.5}>
                  <RadioGroup
                    id="employeeType"
                    name="use-radio-group"
                    defaultValue="first"
                    style={{
                      float: "left",
                      display: "flex",
                      flexDirection: "row",
                    }}
                    value={employeeType}
                    onChange={handleEmployeeType}
                  >
                    <FormControlLabel
                      value="admin"
                      label="Admin"
                      control={<Radio />}
                    />
                    <FormControlLabel
                      value="user"
                      label="User"
                      control={<Radio />}
                    />
                  </RadioGroup>
                  <div style={styles.errorText}>{errors.employeeType}</div>
                </Grid>
              </>
            </Grid>
          </Container>
        </AccordionDetails>
      </Accordion>
      {/* <Accordion expanded={expanded.panel2} onChange={handleExpanded("panel2")}>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Employee Skillset and Schedules{" "}
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
            <Grid container>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>
                  Employee Schedule :{" "}
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                {employeeSchedule.map((week, index) => (
                  <Box marginBottom="0.5rem" key={index}>
                    <Typography fontSize={14}>
                      {dayjs().day(parseInt(week.day, 10)).format("dddd")}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          onChange={(time) => {
                            handleShiftStartChange(index, time);
                          }}
                          value={week.shiftStart}
                          disabled={week.weeklyOff}
                        />
                      </LocalizationProvider>
                      <Typography marginX="0.5rem"> to </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          onChange={(time) => handleShiftEndChange(index, time)}
                          value={week.shiftEnd}
                          disabled={week.weeklyOff}
                        />
                      </LocalizationProvider>

                      <Checkbox
                        checked={week.weeklyOff}
                        onChange={(e) =>
                          handleEmployeeSchedule(index, e.target.checked)
                        }
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                          "&.Mui-checked": {},
                        }}
                      />
                      <Typography component={"span"} fontSize={14}>
                        Weekly Off
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  Employee Skillsets :{" "}
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                {empSkillSets.map((sets, index) => (
                  <FormControlLabel
                    id="employeeSkillSets"
                    key={index}
                    value={sets.id}
                    label={<Typography fontSize={14}>{sets.skill}</Typography>}
                    control={
                      <Checkbox
                        sx={{
                          "& .MuiSvgIcon-root": { fontSize: 16 },
                          "&.Mui-checked": {},
                        }}
                        checked={employeeSkillSets.includes(sets.id)}
                        onChange={handleEmployeeSkillSets}
                      />
                    }
                  />
                ))}
                <div style={styles.errorText}>{errors.employeeSkillSets}</div>
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  Employee Service Gender :{" "}
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <RadioGroup
                  id="serviceGender"
                  name="use-radio-group"
                  defaultValue="first"
                  style={{
                    float: "left",
                    display: "flex",
                    flexDirection: "row",
                  }}
                  value={employeeServiceGender}
                  onChange={handleServiceGender}
                >
                  <FormControlLabel
                    value={1}
                    label="Unisex"
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value={2}
                    label="Straight"
                    control={<Radio />}
                  />
                </RadioGroup>
                <div style={styles.errorText}>{errors.serviceGender}</div>
              </Grid>
            </Grid>
          </Container>
        </AccordionDetails>
      </Accordion> */}
      {/* <Accordion expanded={expanded.panel3} onChange={handleExpanded("panel3")}>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Optional Information{" "}
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
            <Grid container>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>Hire Date :</Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  type="date"
                  style={styles.inputText}
                  id="hiredate"
                  value={hireDate}
                  onChange={handleHireDate}
                >
                  <span>
                    <FontAwesomeIcon icon={faCalendar} />
                  </span>
                </Input>
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>Birthday :</Typography>
              </Grid>
              <Grid item xs={9.5}>
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
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>
                  Employee Number :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputText}
                  id="employeeNumber"
                  value={employeeNumber}
                  onChange={handleEmployeeNumber}
                />
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabel}>Language :</Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Select
                  variant="standard"
                  disableUnderline={true}
                  style={styles.inputText}
                  id="language"
                  value={language}
                  onChange={handleLanguage}
                >
                  <MenuItem value="0" selected>
                    English
                  </MenuItem>
                  <MenuItem value="1">Indonesia</MenuItem>
                  <MenuItem value="2">Español</MenuItem>
                  <MenuItem value="3">Français</MenuItem>
                  <MenuItem value="4">Italiano</MenuItem>
                  <MenuItem value="5">Deutsch</MenuItem>
                  <MenuItem value="6">Nederlands</MenuItem>
                  <MenuItem value="7">Portugues</MenuItem>
                  <MenuItem value="8">العَرَبِيةُ</MenuItem>
                  <MenuItem value="9">Khmer</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Container>
        </AccordionDetails>
      </Accordion> */}
      <Accordion expanded={expanded.panel4} onChange={handleExpanded("panel4")}>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Login Details{" "}
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
            <h5>Employee Login Info</h5>
            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  {" "}
                  Username :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  id="userName"
                  style={styles.inputTextRequired}
                  value={username}
                  onChange={handleUsername}
                  disabled={isEditing}
                />
                <div style={styles.errorText}>{errors.username}</div>
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  {" "}
                  Password :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  type="password"
                  disableUnderline={true}
                  required
                  size="small"
                  id="password"
                  style={styles.inputTextRequired}
                  value={password}
                  onChange={handlePassword}
                />
                <div style={styles.errorText}>{errors.password}</div>
              </Grid>
            </Grid>

            <Grid container mt={2}>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  {" "}
                  Confirm Password :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  type="password"
                  disableUnderline={true}
                  required
                  size="small"
                  style={styles.inputTextRequired}
                  id="passwordAgain"
                  value={passwordAgain}
                  onChange={handlePasswordAgain}
                />
                <div style={styles.errorText}>{errors.passwordAgain}</div>
              </Grid>
            </Grid>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded.panel5} onChange={handleExpanded("panel5")}>
        <AccordionSummary
          expandIcon={<FontAwesomeIcon icon={faArrowDown} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            Locations{" "}
            {expanded.panel5 && (
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
            <Grid container>
              <Grid item xs={2.5}>
                <Typography style={styles.inputlabelRequired}>
                  Locations :
                </Typography>
              </Grid>
              <Grid item xs={9.5}>
                <Input
                  disableUnderline={true}
                  required
                  size="small"
                  id="search"
                  style={{ ...styles.inputText, width: "100%" }}
                  value={location}
                  onChange={handleSearch}
                  fullWidth
                />
                <div style={styles.errorText}>{errors.locations}</div>
                <Box
                  mt={2}
                  p={2}
                  sx={{
                    height: "300px",
                    overflowY: "auto",
                    border: "1px solid #fcfcfc",
                  }}
                >
                  <Grid container>
                    {(!location ? branchLocations : locationList).map(
                      (location, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <FormControlLabel
                            id="location"
                            value={location.locationId?.toString()}
                            label={
                              <Typography fontSize={14}>
                                {location.name}
                              </Typography>
                            }
                            control={
                              <Checkbox
                                checked={selectedLocations.includes(
                                  location.locationId
                                )}
                                onChange={(e) =>
                                  handleLocations(
                                    location.locationId,
                                    Number(e.target.checked)
                                  )
                                }
                                sx={{
                                  "& .MuiSvgIcon-root": { fontSize: 16 },
                                }}
                              />
                            }
                          />
                        </Grid>
                      )
                    )}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Box sx={styles.footer}>
        <Button style={styles.button} onClick={cancelEmployee}>
          Cancel
        </Button>
        <Button
          style={{ ...styles.button, marginLeft: 8 }}
          onClick={createEmployee}
        >
          Submit
        </Button>
      </Box>
      <Snackbar
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackBar.severity}
          onClose={handleSnackbarClose}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmployeesView;

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faPercent } from "@fortawesome/free-solid-svg-icons";
import { faAngleDoubleRight } from "@fortawesome/free-solid-svg-icons";
import { Paper, TableBody } from "@mui/material";
import {
  Accordion,
  Divider,
  Container,
  AccordionDetails,
  AccordionSummary,
  Input,
  InputLabel,
  FormGroup,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  InputAdornment,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material";

export default () => {
  const [checked, setChecked] = useState(true);
  const [check, setCheck] = useState(false);
  const [save, setSave] = useState(false);
  const [show, setShow] = useState(false);
  const [buttonText, setButtonText] = useState("Show More");

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleCheck = () => {
    setCheck(!check);
  };

  const handleShow = () => {
    setShow(!show);
    if (show) {
      setButtonText("Show More");
    } else {
      setButtonText("Hide");
    }
  };

  const handleSave = () => {
    setSave(!save);
  };
  return (
    <>
      <Accordion
        style={{ marginTop: "20px", backgroundColor: "white" }}
        expanded
      >
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Company Information</Typography>
        </AccordionSummary>
        <Divider></Divider>
        <AccordionDetails style={{ backgroundColor: "white" }}>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Company Name :
                <Input
                  disableUnderline={true}
                  required
                  value="Isa Spa"
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Website :
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
                ></Input>
              </InputLabel>
            </FormGroup>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion style={{ marginTop: "20px" }} expanded>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Taxes & Currency</Typography>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Prices Include Tax :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Charge Tax <br></br>on Recievings :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Tax 1 Rate :
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
                position: "relative",
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
                onClick={handleShow}
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
                Include Tax on Barcode :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={save}
                  onChange={handleSave}
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
                }}
              >
                Currency Symbol :
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
                Number of Decimals :
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
                >
                  <MenuItem value="0" selected>
                    Let system decide (Recommended)
                  </MenuItem>
                  <MenuItem value="1">0</MenuItem>
                  <MenuItem value="2">1</MenuItem>
                  <MenuItem value="3">2</MenuItem>
                  <MenuItem value="4">3</MenuItem>
                  <MenuItem value="5">4</MenuItem>
                  <MenuItem value="6">5</MenuItem>
                  <MenuItem value="7">6</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Thousands Seperator :
                <Input
                  disableUnderline={true}
                  required
                  placeholder=","
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Decimal Point :
                <Input
                  disableUnderline={true}
                  placeholder="."
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
                Currency Denominations :
                <TableContainer
                  component={Paper}
                  style={{ width: "50%", marginRight: "30%" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Denomination</TableCell>
                        <TableCell>Currency Value</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="100's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="100.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="50's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="50.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="20's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="20.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="10's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="10.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="5's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="5.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="2's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="2.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="1's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="1.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="500's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="500.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="2000's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="2000.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="200's"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <Input
                            disableUnderline
                            value="200.00"
                            style={{
                              display: "flex",
                              border: "1px solid Gray",
                              width: "80%",
                              padding: "2px",
                              borderRadius: "3px",
                            }}
                          ></Input>
                        </TableCell>
                        <TableCell>
                          <a>Delete</a>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </InputLabel>
              <a
                style={{
                  marginLeft: "20%",
                  top: "20%",
                }}
              >
                Add Currency Denomonation
              </a>
            </FormGroup>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary>
          <Typography>Sales & Receipt</Typography>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Sale ID Prefix :
                <Input
                  disableUnderline={true}
                  required
                  placeholder="S11"
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Override Receipt Title :
                <Input
                  disableUnderline={true}
                  required
                  placeholder="Tax Invoice"
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Item ID To Show On <br></br> Sales Interface :
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
                >
                  <MenuItem value="0" selected>
                    UPC/EAN/ISBN
                  </MenuItem>
                  <MenuItem value="1">Product ID</MenuItem>
                  <MenuItem value="2">Item ID</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Show Item Id On Receipt :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Item ID To Show On <br></br> Sales Interface :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Print Receipt After <br></br> Receiving :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Auto Focus On <br></br> Item Field When Using <br></br>{" "}
                Sales/Receivings <br></br> Interfaces :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Hide Signature :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Number Of Recent Sales By<br></br> Customer To Show :
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
                >
                  <MenuItem value="0" selected>
                    10
                  </MenuItem>
                  <MenuItem value="2">20</MenuItem>
                  <MenuItem value="3">50</MenuItem>
                  <MenuItem value="4">100</MenuItem>
                  <MenuItem value="5">200</MenuItem>
                  <MenuItem value="6">500</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Remove Customer Contact <br></br> Info From Receipt :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Hide Recent Sales For <br></br> Customer :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Disable Confirmation For <br></br> Complete Sale :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Disable Sale Quick <br></br> Complete :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Round To Nearest .05 On <br></br> Receipt :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Automatically Email <br></br>Receipt :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Automatically Print <br></br> Duplicate Receipt <br></br> For
                Credit
                <br></br> Card Transactions :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Automatically Show <br></br> Comments On Receipt :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Calculate Average Cost <br></br> Price From Receivings :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Always Use Global Average <br></br> Cost Price For <br></br> A
                Sale Item's <br></br> Cost Price :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Hide Suspended <br></br> Receivings <br></br> In Reports :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Track Cash In Register :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Disable Giftcard Detection :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Disable Familycard <br></br> Detection :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Calculate Gift Card <br></br> Profit When :
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
                >
                  <MenuItem value="0" selected>
                    Do Nothing
                  </MenuItem>
                  <MenuItem value="2">Redeeming Giftcard</MenuItem>
                  <MenuItem value="3">Selling Giftcard</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Calculate Family Card <br></br>Profit When :
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
                >
                  <MenuItem value="0" selected>
                    Do Nothing
                  </MenuItem>
                  <MenuItem value="2">Redeeming Giftcard</MenuItem>
                  <MenuItem value="3">Selling Giftcard</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Calculate Coupon <br></br>Profit When :
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
                >
                  <MenuItem value="0" selected>
                    Do Nothing
                  </MenuItem>
                  <MenuItem value="2">Redeeming Giftcard</MenuItem>
                  <MenuItem value="3">Selling Giftcard</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Always Show Item Grid :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Hide Out Of Stock Items <br></br> In Grid :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Calculate Family Card <br></br>Profit When :
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
                >
                  <MenuItem value="0" selected>
                    Categories
                  </MenuItem>
                  <MenuItem value="1">Tags</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Hide Barcode On Receipts :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Round Tier Prices to <br></br> 2 Decimals :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Group All Taxes <br></br> On Receipt :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Require Customer <br></br> For Sale :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Require Customer For <br></br> Suspended Sale :
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                Redirect To Sale Or <br></br> Receiving Screen After <br></br>{" "}
                Printing Receipt:
                <Checkbox
                  style={{ marginRight: "77%" }}
                  checked={false}
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
                  padding: "2px",
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Payment Types :
                <Container
                  style={{ marginLeft: "6%", justifyContent: "space-between" }}
                >
                  <Button
                    style={{
                      backgroundColor: "#262B40",
                      color: "white",
                      marginRight: "3px",
                    }}
                  >
                    {" "}
                    Cash{" "}
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#262B40",
                      color: "white",
                      marginRight: "3px",
                    }}
                  >
                    Check
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#262B40",
                      color: "white",
                      marginRight: "3px",
                    }}
                  >
                    Gift Card
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#262B40",
                      color: "white",
                      marginRight: "3px",
                    }}
                  >
                    Family Card
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#262B40",
                      color: "white",
                      marginRight: "3px",
                    }}
                  >
                    Coupon
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#262B40",
                      color: "white",
                      marginRight: "3px",
                    }}
                  >
                    Debit Card
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#262B40",
                      color: "white",
                      marginRight: "3px",
                    }}
                  >
                    Credit Card
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "#262B40",
                      color: "white",
                      marginRight: "3px",
                    }}
                  >
                    Paytm Dynamic QR
                  </Button>
                </Container>
                <br></br>
              </InputLabel>
              <Select
                IconComponent={false}
                variant="standard"
                disableUnderline={true}
                style={{
                  width: "80%",
                  border: "1px solid Gray",
                  borderRadius: "3px",
                  backgroundColor: "#F1F4F5",
                  marginLeft: "20%",
                  marginTop: "2%",
                }}
              >
                <MenuItem value="0" selected>
                  Let system decide (Recommended)
                </MenuItem>
                <MenuItem value="1">0</MenuItem>
                <MenuItem value="2">1</MenuItem>
                <MenuItem value="3">2</MenuItem>
                <MenuItem value="4">3</MenuItem>
                <MenuItem value="5">4</MenuItem>
                <MenuItem value="6">5</MenuItem>
                <MenuItem value="7">6</MenuItem>
              </Select>
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
                Default Payment Type :
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
                >
                  <MenuItem value="0" selected>
                    Cash
                  </MenuItem>
                  <MenuItem value="1">Cheque</MenuItem>
                  <MenuItem value="1">Gift Card</MenuItem>
                  <MenuItem value="1">Family Card</MenuItem>
                  <MenuItem value="1">Coupon</MenuItem>
                  <MenuItem value="1">Debit Card</MenuItem>
                  <MenuItem value="1">Credit Card</MenuItem>
                  <MenuItem value="1">Store Account</MenuItem>
                  <MenuItem value="1">Airtel Payments</MenuItem>
                  <MenuItem value="1">MyRewardss</MenuItem>
                  <MenuItem value="1">Paytm</MenuItem>
                  <MenuItem value="1">Deal Sites</MenuItem>
                  <MenuItem value="1">PhonePay</MenuItem>
                  <MenuItem value="1">GooglePay</MenuItem>
                  <MenuItem value="1">BharatPay</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Receipt Text Size :
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
                >
                  <MenuItem value="0" selected>
                    Small
                  </MenuItem>
                  <MenuItem value="1">Medium</MenuItem>
                  <MenuItem value="2">Large</MenuItem>
                  <MenuItem value="3">Extra Large</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Select Sales Person <br></br> During Sale :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                Default Sales Person :
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
                >
                  <MenuItem value="0" selected>
                    Logged In Employee
                  </MenuItem>
                  <MenuItem value="1">Not Set</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Commission Default Rate <br></br> (Percent Commission Is{" "}
                <br></br>Based On The Selling <br></br> Price Or Profit{" "}
                <br></br> Of An Item) :
                <Input
                  disableUnderline={true}
                  required
                  placeholder="0"
                  size="small"
                  style={{
                    display: "flex",
                    height: "8vh",
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Commission Percent <br></br> Calculation Method :
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
                >
                  <MenuItem value="0" selected>
                    Selling Price
                  </MenuItem>
                  <MenuItem value="1">Profit</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Disable Sale Notification :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Change Sale Date <br></br> For New Sale :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Do NOT Group Items <br></br> That Are The Same :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Hide Store Account <br></br> Balance On Receipt :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Disable Store Account <br></br> Balance On Receipt :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Disable Store Account <br></br> When Over Credit Limit :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Store Account Statement <br></br> Message :
                <Input
                  disableUnderline={true}
                  required
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
                Prompt For CCV When <br></br> Swiping Credit Card :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Do NOT Allow <br></br> Items To Be Sold <br></br> Below Cost
                Price :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
                ></Checkbox>
              </InputLabel>
            </FormGroup>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary>
          <Typography>Suspended Sales/Layaways</Typography>
        </AccordionSummary>
        <Divider></Divider>
        <AccordionDetails>
          <Container
            style={{
              backgroundColor: "white",
              padding: "20px",
              paddingTop: "0px",
              //   boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
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
                Hide Layaways In Reports :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Hide Store Account <br></br> Payments In Reports :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Change Sale Date When <br></br> Suspending Sale :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Hide Store Account <br></br> Payments From <br></br> Report
                Totals :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Change Sale Date When <br></br> Suspending Sale :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Change Sale Date When <br></br>Completing <br></br> Suspended
                Sale :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Show Receipt After <br></br> Suspending Sale :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
                ></Checkbox>
              </InputLabel>
            </FormGroup>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded>
        <AccordionSummary>
          <Typography>Application Settings</Typography>
        </AccordionSummary>
        <Divider></Divider>
        <AccordionDetails>
          <Container
            style={{
              backgroundColor: "white",
              padding: "20px",
              paddingTop: "0px",
              //   boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
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
              <a style={{ textDecoration: "underline", color: "#337ab7" }}>
                Manage Categories
              </a>
            </FormGroup>
            <FormGroup
              style={{
                display: "inline-block",
                width: "100%",
                fontFamily: "Russo One, sans-serif",
                marginTop: "10px",
              }}
            >
              <a style={{ textDecoration: "underline", color: "#337ab7" }}>
                Manage Tags
              </a>
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
                Test Mode <br></br>(Sales NOT Saved) :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Enable Fast User Switching <br></br> (Password Not Required) :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Require Employee Login <br></br> Before Each Sale :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                }}
              >
                Keep Same Location After <br></br> Switching Employee :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={check}
                  onChange={handleCheck}
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
                Language :
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
                Date Format :
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
                >
                  <MenuItem value="0" selected>
                    12/30/2000
                  </MenuItem>
                  <MenuItem value="1">30-12-2000</MenuItem>
                  <MenuItem value="2">2000-12-30</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Time Format :
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
                >
                  <MenuItem value="0" selected>
                    1:00 PM
                  </MenuItem>
                  <MenuItem value="1">13:00</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                ID To Show On Barcode :
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
                >
                  <MenuItem value="0" selected>
                    Item ID
                  </MenuItem>
                  <MenuItem value="1">UPC/EAN/ISBN</MenuItem>
                  <MenuItem value="2">Product ID</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Hide Price On Barcodes :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Customers Store <br></br> Accounts :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Enable Customer <br></br> Loyalty System :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Loyalty Program Option :
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
                >
                  <MenuItem value="0" selected>
                    Simple
                  </MenuItem>
                  <MenuItem value="1">Advanced</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Spend Amount <br></br>To Point Ratio :
                <Input
                  disableUnderline={true}
                  required
                  placeholder="100"
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
                <Input
                  disableUnderline={true}
                  required
                  placeholder="1"
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Point Value :
                <Input
                  disableUnderline={true}
                  required
                  placeholder="1.00"
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Hide Points on Receipt :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Do Not Allow Out <br></br> Of Stock Items <br></br> To Be Sold :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Highlight Low Inventory <br></br>Items In Items Module :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Enable Time Clock :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Enable Sounds For <br></br> Status Messages :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Edit Item Price If 0 <br></br> After Adding To Sale :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                Number of Items Per Page :
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
                >
                  <MenuItem value="0" selected>
                    20
                  </MenuItem>
                  <MenuItem value="1">50</MenuItem>
                  <MenuItem value="2">100</MenuItem>
                  <MenuItem value="3">200</MenuItem>
                  <MenuItem value="6">500</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Number of Items Per Page <br></br>In Grid :
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
                >
                  <MenuItem value="0" selected>
                    1
                  </MenuItem>
                  <MenuItem value="1">2</MenuItem>
                  <MenuItem value="2">3</MenuItem>
                  <MenuItem value="3">4</MenuItem>
                  <MenuItem value="4">5</MenuItem>
                  <MenuItem value="5">6</MenuItem>
                  <MenuItem value="6">7</MenuItem>
                  <MenuItem value="7">8</MenuItem>
                  <MenuItem value="8">9</MenuItem>
                  <MenuItem value="9">10</MenuItem>
                  <MenuItem value="10">11</MenuItem>
                  <MenuItem value="7">12</MenuItem>
                  <MenuItem value="7">13</MenuItem>
                  <MenuItem value="7">14</MenuItem>
                  <MenuItem value="7">15</MenuItem>
                  <MenuItem value="7">16</MenuItem>
                  <MenuItem value="7">17</MenuItem>
                  <MenuItem value="7">18</MenuItem>
                  <MenuItem value="7">19</MenuItem>
                  <MenuItem value="7">20</MenuItem>
                  <MenuItem value="7">21</MenuItem>
                  <MenuItem value="7">22</MenuItem>
                  <MenuItem value="7">23</MenuItem>
                  <MenuItem value="7">24</MenuItem>
                  <MenuItem value="7">25</MenuItem>
                  <MenuItem value="7">26</MenuItem>
                  <MenuItem value="7">27</MenuItem>
                  <MenuItem value="7">28</MenuItem>
                  <MenuItem value="7">29</MenuItem>
                  <MenuItem value="7">30</MenuItem>
                  <MenuItem value="7">31</MenuItem>
                  <MenuItem value="7">32</MenuItem>
                  <MenuItem value="7">33</MenuItem>
                  <MenuItem value="7">34</MenuItem>
                  <MenuItem value="7">35</MenuItem>
                  <MenuItem value="7">36</MenuItem>
                  <MenuItem value="7">37</MenuItem>
                  <MenuItem value="7">38</MenuItem>
                  <MenuItem value="7">39</MenuItem>
                  <MenuItem value="7">40</MenuItem>
                  <MenuItem value="7">41</MenuItem>
                  <MenuItem value="7">42</MenuItem>
                  <MenuItem value="7">43</MenuItem>
                  <MenuItem value="7">44</MenuItem>
                  <MenuItem value="7">45</MenuItem>
                  <MenuItem value="7">46</MenuItem>
                  <MenuItem value="7">47</MenuItem>
                  <MenuItem value="7">48</MenuItem>
                  <MenuItem value="7">49</MenuItem>
                  <MenuItem value="7">50</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Default New Items <br></br> As Service Items :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Hide Dashboard Statistics :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Show Language Switcher :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Show Clock In Header :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
                ></Checkbox>
              </InputLabel>
              <span style={{ marginLeft: "20%", fontSize: "12px" }}>
                This is Visible only on Wide Screens
              </span>
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
                Legacy Detailed Report <br></br> Excel Report :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                Number of Items Per Page :
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
                >
                  <MenuItem value="0" selected>
                    Oldest First
                  </MenuItem>
                  <MenuItem value="1">Newest First</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                }}
              >
                Speed Up Search Queries? <br></br>(Only Recommend If <br></br>{" "}
                You Have More Than<br></br> 10,000 Items Or Customers) :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Disable Price <br></br> Margin Calculator :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Disable Quick Edit <br></br> On Manage Pages :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Legacy Search Method :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Include Child Categories <br></br> When Searching <br></br> Or
                Reporting :
                <Checkbox
                  style={{ right: "77%" }}
                  checked={checked}
                  onChange={handleChange}
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
                }}
              >
                Return Policy :
                <Input
                  disableUnderline={true}
                  required
                  placeholder="For Franchisee Enquiry Call - +18001023373"
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
                Announcements/Specials :
                <Input
                  disableUnderline={true}
                  required
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
                Return Policy :
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
                Spreadsheet Format :
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
                >
                  <MenuItem value="0" selected>
                    CSV
                  </MenuItem>
                  <MenuItem value="1">XLSX</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Mailing Labels Format :
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
                >
                  <MenuItem value="0" selected>
                    PDF
                  </MenuItem>
                  <MenuItem value="1">Excel</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Session Expiration :
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
                >
                  <MenuItem value="1" selected>
                    On Browser Close
                  </MenuItem>
                  <MenuItem value="2">1 Hours</MenuItem>
                  <MenuItem value="2">2 Hours</MenuItem>
                  <MenuItem value="2">3 Hours</MenuItem>
                  <MenuItem value="2">4 Hours</MenuItem>
                  <MenuItem value="2">5 Hours</MenuItem>
                  <MenuItem value="2">6 Hours</MenuItem>
                  <MenuItem value="2">7 Hours</MenuItem>
                  <MenuItem value="2">8 Hours</MenuItem>
                  <MenuItem value="2">9 Hours</MenuItem>
                  <MenuItem value="2">10 Hours</MenuItem>
                  <MenuItem value="2">11 Hours</MenuItem>
                  <MenuItem value="2">12 Hours</MenuItem>
                  <MenuItem value="2">13 Hours</MenuItem>
                  <MenuItem value="2">14 Hours</MenuItem>
                  <MenuItem value="2">15 Hours</MenuItem>
                  <MenuItem value="2">16 Hours</MenuItem>
                  <MenuItem value="2">17 Hours</MenuItem>
                  <MenuItem value="2">18 Hours</MenuItem>
                  <MenuItem value="2">19 Hours</MenuItem>
                  <MenuItem value="2">20 Hours</MenuItem>
                  <MenuItem value="2">21 Hours</MenuItem>
                  <MenuItem value="2">22 Hours</MenuItem>
                  <MenuItem value="2">23 Hours</MenuItem>
                  <MenuItem value="2">24 Hours</MenuItem>
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
                  color: "black",
                  fontFamily: "Russo One, sans-serif",
                  width: "100%",
                }}
              >
                Currency Denominations :
                <TableContainer style={{ width: "50%", marginRight: "30%" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sort</TableCell>
                        <TableCell>Tier Name</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </TableContainer>
              </InputLabel>
            </FormGroup>
          </Container>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

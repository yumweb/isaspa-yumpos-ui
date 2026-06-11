import React, { useState } from "react";
import {
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Divider,
  Container,
  FormGroup,
  InputLabel,
  Input,
  MenuItem,
  Select,
  Button,
} from "@mui/material";

const FamilycardInfo = () => {
  const [select, setSelect] = useState();
  const handleSelect = (e) => {
    setSelect(e.target.value);
  };

  return (
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
                color: "black",
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
              Package Type :
              <Select
                value={select}
                IconComponent={false}
                variant="standard"
                disableUnderline={true}
                onChange={handleSelect}
                style={{
                  width: "80%",
                  border: "1px solid Gray",
                  borderRadius: "3px",
                }}
              >
                <MenuItem selected value="package">
                  Select Package Type
                </MenuItem>
                <MenuItem value="default">Default Package</MenuItem>
                <MenuItem value="custom">Custom Package</MenuItem>
              </Select>
            </InputLabel>
          </FormGroup>
          {select === "default" && (
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
                placeholder="Select Package"
              >
                Family Card Value :
                <Select
                  IconComponent={false}
                  variant="standard"
                  disableUnderline={true}
                  style={{
                    width: "80%",
                    border: "1px solid Gray",
                    borderRadius: "3px",
                  }}
                >
                  {/* <MenuItem value="pearl">Pearl (Rs. 5000/-)</MenuItem> */}
                  <MenuItem value="silver">Silver (Rs. 10000/-)</MenuItem>
                  <MenuItem value="gold">Gold (Rs. 15000/-)</MenuItem>
                  <MenuItem value="diamond">Diamond (Rs. 20000/-)</MenuItem>
                  <MenuItem value="platinum">Platinum (Rs. 30000/-)</MenuItem>
                </Select>
              </InputLabel>
            </FormGroup>
          )}
          {select === "custom" && (
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
                    color: "black",
                    fontFamily: "Russo One, sans-serif",
                    width: "100%",
                  }}
                >
                  Familycard Balance :
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
                    placeholder="Amount in numbers only"
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
                  Familycard Balance :
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
                  Expiry Date :
                  <Input
                    type="date"
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
                  ></Input>
                </InputLabel>
              </FormGroup>
            </>
          )}
          <Button
            style={{
              color: "white",
              borderRadius: "4px",
              backgroundColor: "black",
              border: "0",
              right: "2%",
              marginTop: "20px",
              marginLeft: "1020px",
            }}
          >
            Submit
          </Button>
        </Container>
      </AccordionDetails>
    </Accordion>
  );
};

export default FamilycardInfo;

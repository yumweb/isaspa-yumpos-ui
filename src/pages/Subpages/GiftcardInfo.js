import React from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  Divider,
  AccordionDetails,
  Container,
  FormGroup,
  InputLabel,
  Input,
  Button,
} from "@mui/material";

const GiftcardInfo = () => {
  return (
    <>
      <Accordion expanded>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Giftcard Information</Typography>
        </AccordionSummary>
        <Divider></Divider>
        <AccordionDetails>
          <Container
            style={{
              backgroundColor: "white",
              padding: "50px",
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
                Giftcard Number :
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
                Value :
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
            <Button
              style={{
                color: "white",
                borderRadius: "4px",
                backgroundColor: "black",
                border: "0",
                right: "2%",
                position: "absolute",
                top: "80%",
              }}
            >
              Submit
            </Button>
          </Container>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default GiftcardInfo;

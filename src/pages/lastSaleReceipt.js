import React, { useEffect, useState } from "react";
import clientAdapter from "../lib/clientAdapter";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
} from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Col, Row } from "@themesberg/react-bootstrap";
import ReactToPrint from "react-to-print";
import { useRef } from "react";

const LastSaleReceipt = (props) => {
  const [sale, setSale] = useState(null);
  const lastSaleId = new URLSearchParams(props.location.search).get(
    "lastSaleId"
  );

  const componentRef = useRef();

  const getReceipt = async () => {
    const saleRes = await clientAdapter.getSaleReceipt(lastSaleId);
    setSale(saleRes);
  };

  useEffect(() => {
    getReceipt();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return sale ? (
    <>
      <Box
        bgcolor="white"
        style={{
          padding: "15px",
          borderRadius: "5px",
          display: "flex",
          width: "100%",
          borderBottom: "1px black solid",
        }}
      >
        <Container
          className="col-md-6"
          style={{
            width: "50%",
            display: "flex",
          }}
        ></Container>
        <Container
          className="col-md-6"
          style={{ backgroundColor: "", width: "50%", display: "flex" }}
        >
          <FormControlLabel
            control={<Checkbox />}
            label="Duplicate Receipt"
            style={{ marginLeft: "150px" }}
          />
          <ReactToPrint
            trigger={() => (
              <Button
                onClick={handlePrint}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  marginRight: "5px",
                }}
              >
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
          <Button
            style={{
              backgroundColor: "black",
              color: "white",
              marginRight: "5px",
            }}
            href="/sales"
          >
            New Sale
          </Button>
        </Container>
      </Box>
      <Container
        className="cont"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          marginTop: "20px",
        }}
      >
        <Row
          style={{ justifyContent: "space-between", padding: "25px" }}
          ref={componentRef}
        >
          <Col style={{ textAlign: "left" }}>
            <ul
              style={{
                fontFamily: "arial",
                color: "#9398a0",
                fontSize: "14px",
                textAlign: "left",
              }}
            >
              <li>
                <img
                  style={{
                    width: "35%",
                    left: "0",
                    marginTop: "5px",
                    alignItems: "left",
                  }}
                  src="http://isaspa.yumpos.co/assets/img/header_logo_dark.png"
                  alt="Isa Spa"
                />
              </li>
              <li
                style={{
                  fontFamily: "arial",
                  marginTop: "15px",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                {sale.location.name}
              </li>
              <li
                style={{
                  fontFamily: "arial",
                  marginTop: "15px",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                {sale.location.address}
              </li>
              <li
                style={{
                  fontFamily: "arial",
                  marginTop: "15px",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                {sale.location.phone}
              </li>
              <li></li>
              <li
                style={{
                  fontFamily: "arial",
                  marginTop: "15px",
                  textAlign: "left",
                  fontSize: "14px",
                }}
              >
                GSTIN: {sale.location.serviceTaxNumber}
              </li>
            </ul>
          </Col>
          <Col style={{ textAlign: "center", marginTop: "35px" }}>
            <ul
              style={{
                fontFamily: "arial",
                color: "#9398a0",
                fontSize: "14px",
                paddingTop: "10px",
              }}
            >
              <li
                style={{
                  fontFamily: "arial",
                  marginTop: "5px",
                  paddingBottom: "10px",
                }}
              >
                <span
                  style={{
                    color: "#555555",
                    fontFamily: "arial",
                    paddingRight: "10px",
                  }}
                >
                  Sale_id:
                </span>
                S11-{sale.id}
              </li>
              <li
                style={{
                  fontFamily: "arial",
                  marginTop: "15px",
                  paddingBottom: "5px",
                }}
              >
                <span
                  style={{
                    color: "#555555",
                    fontFamily: "arial",
                    paddingRight: "10px",
                  }}
                >
                  Employee:
                </span>
                {sale.employee.firstName} {sale.employee.lastName}
              </li>
            </ul>
          </Col>
          <Col style={{ textAlign: "right", marginTop: "35px" }}>
            <ul>
              <li
                style={{
                  fontFamily: "arial",
                  marginTop: "15px",
                  paddingBottom: "10px",
                }}
              >
                <span
                  style={{
                    color: "#555555",
                    fontFamily: "arial",
                    paddingRight: "10px",
                    textAlign: "right",
                    paddingTop: "10px",
                  }}
                >
                  Invoice to:
                </span>
              </li>
              <li
                style={{
                  textAlign: "right",
                  fontFamily: "arial",
                  color: "#9398a0",
                  fontSize: "14px",
                  paddingTop: "5px",
                }}
              >
                Customer: {sale.customer.firstName} {sale.customer.lastName}
              </li>
              <li
                style={{
                  textAlign: "right",
                  fontFamily: "arial",
                  color: "#9398a0",
                  fontSize: "14px",
                  paddingTop: "10px",
                }}
              >
                Phone Number: {sale.customer.phoneNumber}
              </li>
            </ul>
          </Col>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Service Technician</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sale.saleItems.map((item) => (
                  <>
                    <TableRow key={item.line}>
                      <TableCell>{item.item.name}</TableCell>
                      <TableCell>
                        {item.serviceEmployee.firstName}{" "}
                        {item.serviceEmployee.lastName}
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Row>
      </Container>
    </>
  ) : (
    <></>
  );
};

export default LastSaleReceipt;

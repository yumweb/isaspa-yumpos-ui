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
  Typography,
  Grid,
  List,
  ListItem,
  useMediaQuery,
} from "@mui/material";
import ReactToPrint from "react-to-print";
import { FormControlLabel } from "@mui/material";
import clientAdapter from "../../../lib/clientAdapter";
import { Image } from "@themesberg/react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { groupBy, map, sumBy } from "lodash";
import ReceiptSkeletonLoader from "../../../components/loader/receiptSkeletonLoader";
import moment from "moment-timezone";
import Logo from "../../../assets/img/brand/header_logo_dark.png";

const Receipt = ({ isPublic }) => {
  const location = useLocation();
  const componentRef = useRef();
  const [show, setShow] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [cartTotal, setCartTotal] = useState(0.0);
  const [cartSubTotal, setCartSubTotal] = useState(0.0);
  const [cartTaxes, setCartTaxes] = useState([]);
  const [discount, setDiscount] = useState(null);

  const saleId = new URLSearchParams(location.search).get("saleId");
  const token = new URLSearchParams(location.search).get("t");

  const locationTaxRate = JSON.parse(
    localStorage.getItem("yumpos_locationTaxRate")
  );

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    setShow(!show);
  };

  const getReceiptData = async () => {
    try {
      const res = isPublic
        ? await clientAdapter.getPublicSaleReceipt(token)
        : await clientAdapter.getSaleReceipt(saleId);
      setReceiptData(res);
      const ltax = locationTaxRate || res?.location?.taxRates;
      getSubtotal(res, ltax);
    } catch (error) {
      setReceiptData({ value: null });
    }
  };

  useEffect(() => {
    getReceiptData();
  }, []);

  const calculateBasePrice = (unitPrice, itemTaxes) => {
    const totalTax = itemTaxes
      ? itemTaxes[0]?.percent + itemTaxes[1]?.percent
      : 18;
    const basePrice = unitPrice / (1 + totalTax / 100);
    return basePrice?.toFixed(2);
  };

  const getSubtotal = (res, taxRate) => {
    let _discount;
    if (res.saleItems && res.saleItems.length) {
      res.saleItems.filter((item) => {
        if (item?.item?.name?.toLowerCase() === "discount") {
          setDiscount(item?.itemUnitPrice);
          _discount = item?.itemUnitPrice;
        }
      });
    }
    const cartItem = [...res.saleItems, ...res.saleItemkit];
    let itemDetails;
    const cartItems = cartItem.map((item) => {
      if (item?.itemkit?.itemKitId) {
        itemDetails = {
          name: item.itemkit.name,
          id: item.itemkit.itemKitId,
          _taxIncluded: item.itemkit.taxIncluded,
          itemkitItems: item.itemkit.itemkitItems,
          itemTaxes: res.saleItemkitTax?.map((i) => ({
            name: i.name,
            percent: Number(i.percent),
          })),
          description: item.itemkit.description,
          productId: item.itemkit.productId,
          itemkitNumber: item.itemkit.itemkitNumber,
          itemCostPrice: item.itemKitCostPrice,
          itemUnitPrice: item.itemKitUnitPrice,
          itemLinePrice: item.itemKitUnitPrice,
          itemBasePrice: item.itemKitCostPrice,
        };
      }
      if (item?.item?.itemId) {
        itemDetails = {
          name: item.item.name,
          id: item.item.itemId,
          _taxIncluded:
            item.item.name === "Gift Card" || item.item.name === "Family Card"
              ? true
              : item.item.taxIncluded,
          itemkitItems: null,
          _isService: item.item.isService,
          itemTaxes: res.saleItemTaxes?.map((i) => ({
            name: i.name,
            percent: Number(i.percent),
          })),
          description: item.item.description,
          itemCostPrice: item.itemCostPrice,
          itemUnitPrice: item.itemUnitPrice,
          itemLinePrice: item.itemUnitPrice,
          itemBasePrice: item.itemCostPrice,
        };
      }
      return {
        ...itemDetails,
        line: cartItem.length + 1,
        quantityPurchased: item.quantityPurchased,
        discountPercent: item.discountPercent,
        commission: 0,
        serviceEmployeeId: 0,
      };
    });

    const taxes = [];
    const _taxRates = taxRate || null;
    let subtotal;
    // Calculate the total based on subtotal and taxes
    subtotal = cartItems
      .filter((i) => i?.name?.toLowerCase() !== "discount")
      .reduce((acc, item) => {
        const itemPrice =
          (_taxRates && _taxRates[0]?.rate
            ? item._taxIncluded
              ? calculateBasePrice(item.itemUnitPrice, item.itemTaxes)
              : item.itemUnitPrice
            : item.itemUnitPrice) * item.quantityPurchased;
        let discountedPrice =
          itemPrice - itemPrice * (item.discountPercent / 100);
        return acc + discountedPrice;
      }, 0);
    const fTotal = subtotal.toFixed(2);
    if (_discount) {
      subtotal = fTotal - _discount;
    }

    setCartSubTotal(subtotal.toFixed(2));
    cartItems.map((c) => {
      c.itemTaxes?.map((t) => {
        t.amount = parseFloat(subtotal * (Number(t.percent) / 100)).toFixed(2);
        taxes.push({
          name: t.name,
          percent: t.percent,
          amount: +t.amount,
        });
      });
    });

    let cartTaxAmount = 0;
    if (_taxRates && _taxRates[0]?.rate) {
      const ct = map(groupBy(taxes.slice(0, 2), "name"), (o, idx) => {
        cartTaxAmount = sumBy(o, "amount");
        return { percent: Number(o[0].percent), id: idx, total: cartTaxAmount };
      });
      setCartTaxes(ct);
    }
    const cartTotal = subtotal + cartTaxAmount * 2;
    setCartTotal(cartTotal.toFixed(2));
  };

  const displayComment = () => {
    // Only display comment if showCommentOnReceipt flag is true
    if (!receiptData.showCommentOnReceipt) {
      return null;
    }

    const comment = receiptData.comment;

    if (comment.startsWith("V2 -")) {
      return comment.substring(4).trim();
    } else {
      return null;
    }
  };

  const getActiveFamilyCards = () => {
    return receiptData?.customer?.familycards
      ? receiptData.customer.familycards.filter(
          (card) =>
            card?.locationId === receiptData?.location?.locationId &&
            !card?.inactive
        )
      : [];
  };
  const activeFamilyCard = getActiveFamilyCards();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const PrintButton = () => {
    return (
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
    );
  };

  return receiptData ? (
    <>
      {receiptData.value === null ? (
        <Typography>Receipt not found</Typography>
      ) : (
        <>
          <Box
            bgcolor="white"
            sx={{
              padding: { sm: "15px", xs: "10px" },
              borderRadius: "5px",
              display: "flex",
              width: "100%",
              borderBottom: "1px black solid",
              justifyContent: isPublic ? "flex-end" : "",
            }}
          >
            {isPublic ? (
              <PrintButton />
            ) : (
              <>
                <Container
                  className="col-md-6"
                  style={{
                    width: "50%",
                    display: "flex",
                  }}
                >
                  <Button
                    onClick={() => handleEdit()}
                    style={{
                      backgroundColor: "black",
                      marginRight: "5px",
                      color: "white",
                    }}
                  >
                    Edit
                  </Button>
                </Container>
                <Container
                  className="col-md-6"
                  style={{
                    backgroundColor: "",
                    width: "50%",
                    display: "flex",
                    justifyContent: isPublic ? "flex-end" : "",
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Duplicate Receipt"
                    style={{ marginLeft: "150px" }}
                  />

                  {<PrintButton />}

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
              </>
            )}
          </Box>
          <Container
            className="cont"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              marginTop: "20px",
              maxWidth: "100%",
              paddingLeft: "0px",
              paddingRight: "0px",
            }}
          >
            <Grid
              container
              sx={{
                justifyContent: "space-between",
                padding: { sm: "18px", xs: "10px" },
              }}
              ref={componentRef}
            >
              <Grid item xs={12} sm={4} sx={{ textAlign: "left" }}>
                <List
                  sx={{
                    fontFamily: "arial",
                    color: "#9398a0",
                    fontSize: { sm: "16px", xs: "14px" },
                    textAlign: "left",
                    paddingLeft: { sm: "16px", xs: "12px" },
                  }}
                >
                  {/* logo */}
                  <ListItem sx={{ padding: 0 }}>
                    <Image
                      style={{
                        width: "35%",
                        left: "0",
                        marginTop: "5px",
                        alignItems: "left",
                      }}
                      src={Logo}
                      alt="Isa Spa"
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      marginTop: "15px",
                      textAlign: "left",
                      fontSize: { md: "16px", sm: "16px", xs: "14px" },
                      color: "black",
                      fontWeight: "600",
                      padding: 0,
                    }}
                  >
                    {receiptData?.location?.name}
                  </ListItem>
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      marginTop: { md: "15px", sm: "15px", xs: "6px" },
                      textAlign: "left",
                      fontSize: { sm: "16px", xs: "14px" },
                      color: "black",
                      fontWeight: "600",
                      padding: 0,
                    }}
                  >
                    {receiptData?.location?.address}
                  </ListItem>
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      marginTop: { md: "15px", sm: "15px", xs: "6px" },
                      textAlign: "left",
                      fontSize: { sm: "16px", xs: "14px" },
                      color: "black",
                      fontWeight: "600",
                      padding: 0,
                    }}
                  >
                    {receiptData?.location?.phone}
                  </ListItem>
                  <ListItem sx={{ padding: 0 }} />
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      marginTop: { md: "15px", sm: "15px", xs: "6px" },
                      textAlign: "left",
                      fontSize: { sm: "16px", xs: "14px" },
                      color: "black",
                      fontWeight: "600",
                      padding: 0,
                    }}
                  >
                    GSTIN: {receiptData?.location?.serviceTaxNumber}
                  </ListItem>
                </List>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  textAlign: { md: "center", sm: "center", xs: "left" },
                  marginTop: { sm: "35px", xs: "16px" },
                }}
              >
                <List
                  sx={{
                    fontFamily: "arial",
                    color: "#9398a0",
                    fontSize: { sm: "16px", xs: "14px" },
                    paddingTop: { sm: "8px", xs: "0px" },
                  }}
                >
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      marginTop: { sm: "0px", xs: "0px" },
                      //paddingBottom: "10px",
                      padding: { sm: "10px 0 10px 0px", xs: "0px 0 0px 16px" },
                      textAlign: { md: "center", sm: "center", xs: "left" },
                      display: "flex",
                      justifyContent: { sm: "center", xs: "flex-start" },
                    }}
                  >
                    <span
                      style={{
                        color: "#555555",
                        fontFamily: "arial",
                        paddingRight: "10px",
                        fontWeight: "600",
                      }}
                    >
                      Sale ID:
                    </span>
                    <span
                      style={{
                        color: "black",
                        fontWeight: "600",
                      }}
                    >
                      S11-{receiptData.locationId}-{receiptData.saleLocationId}
                    </span>
                  </ListItem>
                  {receiptData.suspended === 1 && (
                    <ListItem
                      sx={{
                        fontFamily: "arial",
                        marginTop: { sm: "15px", xs: "5px" },
                        padding: { sm: "0px 0 5px 0px", xs: "0px 0 0px 16px" },
                        textAlign: { md: "center", sm: "center", xs: "left" },
                        display: "flex",
                        justifyContent: { sm: "center", xs: "flex-start" },
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "arial",
                          paddingRight: "10px",
                          fontWeight: "600",
                        }}
                      >
                        Service Slip
                      </span>
                    </ListItem>
                  )}
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      marginTop: { sm: "15px", xs: "5px" },
                      //paddingBottom: "5px",
                      padding: { sm: "0px 0 5px 0px", xs: "0px 0 0px 16px" },
                      textAlign: { md: "center", sm: "center", xs: "left" },
                      display: "flex",
                      justifyContent: { sm: "center", xs: "flex-start" },
                    }}
                  >
                    <span
                      style={{
                        color: "#555555",
                        fontFamily: "arial",
                        paddingRight: "10px",
                        fontWeight: "600",
                      }}
                    >
                      Employee:
                    </span>
                    <span
                      style={{
                        color: "black",
                        fontWeight: "600",
                      }}
                    >
                      {receiptData?.employee?.firstName}{" "}
                      {receiptData?.employee?.lastName}
                    </span>
                  </ListItem>
                </List>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  // display: "flex",
                  // justifyContent: { sm: "flex-end", xs: "flex-start" },
                  textAlign: { sm: "right", xs: "left" },
                  marginTop: { sm: "35px", xs: "0" },
                }}
              >
                <List
                  sx={{
                    paddingTop: { sm: "0px", xs: "0px" },
                  }}
                >
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      marginTop: { sm: "15px", xs: "5px" },
                      padding: { sm: "0px 0 10px 0px", xs: "0px 0 0px 16px" },
                      textAlign: { md: "right", sm: "right", xs: "left" },
                      display: "flex",
                      justifyContent: { sm: "flex-end", xs: "flex-start" },
                    }}
                  >
                    <span
                      style={{
                        color: "#555555",
                        fontFamily: "arial",
                        paddingRight: "10px",
                        textAlign: "right",
                        //paddingTop: "10px",
                        fontWeight: "600",
                      }}
                    >
                      Invoice to:
                    </span>
                  </ListItem>
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      color: "black",
                      //fontSize: "16px",
                      //paddingTop: "5px",
                      padding: { sm: "5px 0 0px 0px", xs: "0px 0 0px 16px" },
                      fontWeight: "600",
                      textAlign: { md: "right", sm: "right", xs: "left" },
                      display: "flex",
                      justifyContent: { sm: "flex-end", xs: "flex-start" },
                    }}
                  >
                    Customer: {receiptData?.customer?.firstName}{" "}
                    {receiptData.customer.lastName}
                  </ListItem>
                  <ListItem
                    sx={{
                      fontFamily: "arial",
                      color: "black",
                      fontSize: "16px",
                      //paddingTop: "10px",
                      fontWeight: "600",
                      padding: { sm: "10px 0 0px 0px", xs: "0px 0 0px 16px" },
                      display: "flex",
                      textAlign: { md: "right", sm: "right", xs: "left" },
                      justifyContent: { sm: "flex-end", xs: "flex-start" },
                    }}
                  >
                    Phone Number: {receiptData?.customer?.phoneNumber}
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table size={isSmallScreen ? "small" : "medium"}>
                    {/* <Table size={'small'}> */}
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "900",
                            fontSize: { sm: "16px", xs: "14px" },
                            fontFamily: "Arial",
                          }}
                        >
                          Item Name
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "900",
                            fontSize: { sm: "16px", xs: "14px" },
                            fontFamily: "Arial",
                          }}
                        >
                          Service Technician
                        </TableCell>
                        {receiptData.suspended !== 1 ? (
                          <>
                            <TableCell
                              sx={{
                                fontWeight: "900",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                              }}
                            >
                              Price
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "900",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                              }}
                            >
                              Qty
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "900",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                              }}
                            >
                              Disc %
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "900",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                              }}
                            >
                              Total
                            </TableCell>
                          </>
                        ) : null}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {receiptData.saleItems
                        // ?.filter((i) => i?.item?.name?.toLowerCase() !== "discount")
                        .map((item) => (
                          <>
                            <TableRow key={item.line}>
                              <TableCell
                                sx={{
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  fontFamily: "Arial",
                                }}
                              >
                                {item.item?.name}
                                <br />
                                <div style={{ color: "#9398A0" }}>
                                  {" "}
                                  {item.item?.name === "Gift Card" ||
                                  item.item?.name === "Family Card"
                                    ? item.description
                                    : null}
                                </div>
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  fontFamily: "Arial",
                                }}
                              >
                                {item.serviceEmployee?.firstName}{" "}
                                {item.serviceEmployee?.lastName}
                              </TableCell>
                              {receiptData.suspended !== 1 ? (
                                <>
                                  <TableCell
                                    sx={{
                                      fontWeight: "600",
                                      fontSize: { sm: "16px", xs: "14px" },
                                      fontFamily: "Arial",
                                    }}
                                  >
                                    Rs. {item.itemUnitPrice}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "600",
                                      fontSize: { sm: "16px", xs: "14px" },
                                      fontFamily: "Arial",
                                    }}
                                  >
                                    {item.quantityPurchased}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "600",
                                      fontSize: { sm: "16px", xs: "14px" },
                                      fontFamily: "Arial",
                                    }}
                                  >
                                    {item.discountPercent}%
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "600",
                                      fontSize: { sm: "16px", xs: "14px" },
                                      fontFamily: "Arial",
                                    }}
                                  >
                                    Rs. {item.itemTotal}
                                  </TableCell>
                                </>
                              ) : null}
                            </TableRow>
                          </>
                        ))}

                      {receiptData.saleItemkit?.map((item, x) => (
                        <>
                          <TableRow key={x}>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                              }}
                            >
                              {item.itemkit?.name}
                            </TableCell>
                            {receiptData.suspended !== 1 ? (
                              <>
                                <TableCell></TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "600",
                                    fontSize: { sm: "16px", xs: "14px" },
                                    fontFamily: "Arial",
                                  }}
                                >
                                  Rs. {item.itemKitUnitPrice.toFixed(2)}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "600",
                                    fontSize: { sm: "16px", xs: "14px" },
                                    fontFamily: "Arial",
                                  }}
                                >
                                  {item.quantityPurchased}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "600",
                                    fontSize: { sm: "16px", xs: "14px" },
                                    fontFamily: "Arial",
                                  }}
                                >
                                  {item.discountPercent}%
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "600",
                                    fontSize: { sm: "16px", xs: "14px" },
                                    fontFamily: "Arial",
                                  }}
                                >
                                  Rs.{" "}
                                  {(
                                    item.itemKitUnitPrice *
                                    item.quantityPurchased *
                                    (1 - item.discountPercent / 100)
                                  ).toFixed(2)}
                                </TableCell>
                              </>
                            ) : null}
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Table>
                                {item?.saleItemkitItems?.map((i, ix) => (
                                  <TableRow key={ix}>
                                    <TableCell>{i.item?.name}</TableCell>
                                    <TableCell>
                                      {i.kitsServiceEmployeePerson?.firstName}{" "}
                                      {i.kitsServiceEmployeePerson?.lastName}
                                    </TableCell>

                                    {receiptData.suspended !== 1 ? (
                                      <TableCell>
                                        {i?.purchasedQuantity}
                                      </TableCell>
                                    ) : null}
                                  </TableRow>
                                ))}
                              </Table>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}

                      {receiptData.suspended !== 1 ? (
                        <>
                          {discount ? (
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell style={{ fontWeight: "bold" }}>
                                Discount
                              </TableCell>
                              <TableCell>Rs. {discount}</TableCell>
                            </TableRow>
                          ) : null}

                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                              }}
                            >
                              Sub Total
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                              }}
                            >
                              Rs.{" "}
                              {receiptData.location.displayTax
                                ? cartSubTotal
                                : cartTotal}
                            </TableCell>
                          </TableRow>

                          {receiptData.location.displayTax &&
                            cartTaxes.map((c, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  style={{ border: "none" }}
                                ></TableCell>
                                <TableCell
                                  style={{ border: "none" }}
                                ></TableCell>
                                <TableCell
                                  style={{ border: "none" }}
                                ></TableCell>
                                <TableCell
                                  style={{ border: "none" }}
                                ></TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "600",
                                    fontSize: { sm: "16px", xs: "14px" },
                                    fontFamily: "Arial",
                                    border: "none",
                                  }}
                                >
                                  {c.percent}% {c.id}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontWeight: "600",
                                    fontSize: { sm: "16px", xs: "14px" },
                                    fontFamily: "Arial",
                                    border: "none",
                                  }}
                                >
                                  Rs. {c.total}
                                </TableCell>
                              </TableRow>
                            ))}

                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                                borderTop: "0.8px solid rgb(147, 152, 160)",
                              }}
                            >
                              Total
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                                borderTop: "0.8px solid rgb(147, 152, 160)",
                              }}
                            >
                              Rs. {cartTotal}
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                                borderTop: "0.8px solid rgb(147, 152, 160)",
                              }}
                            >
                              Number of items sold
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                                borderTop: "0.8px solid rgb(147, 152, 160)",
                              }}
                            >
                              {receiptData.saleItems?.length +
                                receiptData.saleItemkit?.length}
                            </TableCell>
                          </TableRow>

                          {receiptData.salePayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell style={{ border: "none" }}></TableCell>
                              <TableCell style={{ border: "none" }}></TableCell>
                              <TableCell style={{ border: "none" }}></TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  fontFamily: "Arial",
                                  border: "none",
                                  textAlign: "center",
                                  paddingBottom: "0px",
                                }}
                              >
                                {moment(receiptData.saleTime)
                                  .tz("Asia/Kolkata")
                                  .format("DD-MM-YYYY hh:mm A")}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  fontFamily: "Arial",
                                  border: "none",
                                  paddingBottom: "0px",
                                }}
                              >
                                {payment.paymentType === "Family Card"
                                  ? `${payment.paymentType}: ${activeFamilyCard[0]?.familycardNumber}`
                                  : payment.paymentType}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  fontFamily: "Arial",
                                  border: "none",
                                  paddingBottom: "0px",
                                }}
                              >
                                Rs. {payment.paymentAmount}
                              </TableCell>
                            </TableRow>
                          ))}

                          {receiptData.salePayments.some(
                            (payment) => payment?.paymentType === "Family Card"
                          ) ? (
                            <TableRow>
                              <TableCell style={{ border: "none" }}></TableCell>
                              <TableCell style={{ border: "none" }}></TableCell>
                              <TableCell style={{ border: "none" }}></TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  fontFamily: "Arial",
                                  border: "none",
                                  paddingBottom: "0px",
                                  textAlign: "center",
                                }}
                              >
                                Family card Balance
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  fontFamily: "Arial",
                                  border: "none",
                                  paddingBottom: "0px",
                                }}
                              >
                                {`Family Card: ${activeFamilyCard[0].familycardNumber}`}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  fontFamily: "Arial",
                                  border: "none",
                                  paddingBottom: "0px",
                                }}
                              >
                                Rs.{" "}
                                {Number(activeFamilyCard[0].value).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ) : null}

                          <TableRow>
                            <TableCell style={{ border: "none" }}></TableCell>
                            <TableCell style={{ border: "none" }}></TableCell>
                            <TableCell style={{ border: "none" }}></TableCell>
                            <TableCell style={{ border: "none" }}></TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                                border: "none",
                              }}
                            >
                              Points
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                fontFamily: "Arial",
                                border: "none",
                              }}
                            >
                              {receiptData.customer.customer.points}
                            </TableCell>
                          </TableRow>

                          {displayComment() && (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                align="center"
                                sx={{
                                  borderBottom: "none",
                                  fontWeight: "600",
                                  fontSize: { sm: "16px", xs: "14px" },
                                  padding: "17px 10px 10px",
                                }}
                              >
                                {displayComment()}
                              </TableCell>
                            </TableRow>
                          )}

                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{
                                borderBottom: "none",
                                fontWeight: "600",
                                fontSize: { sm: "16px", xs: "14px" },
                                padding: "17px 10px 10px",
                              }}
                            >
                              For Franchise Enquiry Call - +919959995370
                            </TableCell>
                          </TableRow>
                        </>
                      ) : null}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  ) : (
    <>
      <ReceiptSkeletonLoader />
    </>
  );
};

export default Receipt;

import { faEdit, faTimes, faGift } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import moment from "moment-timezone";
import { useState } from "react";
import { Table } from "react-bootstrap";
import clientAdapter from "../../../lib/clientAdapter";

const CustomerInfo = ({
  getCustomerLastSale,
  selectedCustomer,
  handleEditCustomer,
  handleDetachCustomer,
  updatePackage,
}) => {
  const userLocation = JSON.parse(localStorage.getItem("yumpos_location"));

  const [emailReceipt, setEmailReceipt] = useState(false);
  const [bounceBackCouponCode, setBounceBackCouponCode] = useState("");
  const [bounceBackLoading, setBounceBackLoading] = useState(false);
  const [bounceBackMessage, setBounceBackMessage] = useState(null);

  const handleEmailReceipt = (e) => {
    setEmailReceipt(e.target.checked);
  };

  const handleCreateBounceBackCoupon = async () => {
    if (!bounceBackCouponCode.trim()) return;

    setBounceBackLoading(true);
    setBounceBackMessage(null);

    try {
      const customerName = `${selectedCustomer.person?.firstName || ""} ${
        selectedCustomer.person?.lastName || ""
      }`.trim();
      const customerPhone = selectedCustomer.person?.phoneNumber || "";

      const result = await clientAdapter.createBounceBackCoupon(
        selectedCustomer.id,
        selectedCustomer.person?.id || selectedCustomer.personId,
        customerPhone,
        customerName,
        bounceBackCouponCode.toUpperCase()
      );

      if (result.success) {
        setBounceBackMessage({
          type: "success",
          text: `Bounce Back coupon ${result.couponNumber} created! SMS sent.`,
        });
        setBounceBackCouponCode("");
      } else {
        setBounceBackMessage({
          type: "error",
          text: result.error || "Failed to create coupon",
        });
      }
    } catch (error) {
      setBounceBackMessage({
        type: "error",
        text: "Failed to create bounce back coupon",
      });
    } finally {
      setBounceBackLoading(false);
    }
  };

  const familyCards = selectedCustomer?.person?.familycards.filter(
    (card) => card.locationId === userLocation.locationId && !card.inactive
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <Table striped responsive>
            <tbody>
              <tr>
                <td
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    width: "50%",
                  }}
                >
                  <div onClick={getCustomerLastSale}>
                    {" "}
                    {selectedCustomer.person?.firstName ||
                      selectedCustomer.firstName}{" "}
                    {selectedCustomer.person?.lastName ||
                      selectedCustomer?.lastName}
                  </div>
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{
                      marginLeft: "5px",
                      cursor: "pointer",
                      fontWeight: "lighter",
                    }}
                    onClick={handleEditCustomer}
                  />
                </td>
                <td
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    width: "50%",
                    cursor: "pointer",
                  }}
                >
                  <div onClick={getCustomerLastSale}>
                    {selectedCustomer.person?.phoneNumber ||
                      selectedCustomer.customer?.phoneNumber}
                  </div>
                </td>
              </tr>
              <tr style={{ lineHeight: "3px" }}>
                <td style={{ color: "red", width: "50%" }}>Points:</td>
                <td style={{ width: "50%" }}>
                  {parseInt(selectedCustomer.points).toFixed()}
                </td>
              </tr>
              <tr style={{ lineHeight: "3px" }}>
                <td>LC Number:</td>
                <td>
                  {selectedCustomer.loyaltyCardNumber} {"("}
                  {selectedCustomer.loyaltyCardDiscount}
                  {"%)"}
                </td>
              </tr>
              {familyCards && familyCards.length > 0 && (
                <tr>
                  <td>Membership ID:</td>
                  <td>
                    {familyCards.map((card, index) => (
                      <span key={card.id}>
                        {Number(card.isTimeBased) === 1
                          ? `${card.familycardNumber} (${
                              Number(card.serviceTime) || 0
                            } min)`
                          : `${card.familycardNumber} (Rs.${(
                              Math.round(card.value * 100) / 100
                            ).toFixed(2)})`}
                        {index !== familyCards.length - 1 && <span>, </span>}
                      </span>
                    ))}
                  </td>
                </tr>
              )}
              <tr style={{ lineHeight: "3px" }}>
                <td>Total Visits:</td>
                <td>{selectedCustomer.saleCount}</td>
              </tr>
              <tr style={{ lineHeight: "3px" }}>
                <td>Lifetime Purchase Value:</td>
                <td>Rs. {selectedCustomer.lifetimeValue}</td>
              </tr>
              <tr style={{ lineHeight: "3px" }}>
                <td>Birthdate:</td>
                <td>
                  {selectedCustomer.birthday
                    ? moment(selectedCustomer.birthday).format("D-MMM-YYYY")
                    : "NA"}
                </td>
              </tr>
              <tr style={{ lineHeight: "3px" }}>
                <td>Anniversary:</td>
                <td>
                  {selectedCustomer.birthday
                    ? moment(selectedCustomer.anniversary).format("D-MMM-YYYY")
                    : "NA"}
                </td>
              </tr>
              {updatePackage ? null : (
                <tr style={{ lineHeight: "5px" }}>
                  {!selectedCustomer?.person?.email ||
                  selectedCustomer?.person?.email === "" ? (
                    <td>
                      <Button
                        variant="text"
                        startIcon={<FontAwesomeIcon icon={faEdit} />}
                        onClick={handleEditCustomer}
                        sx={{ fontSize: "12px" }}
                      >
                        Update Customer
                      </Button>
                    </td>
                  ) : (
                    <td>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={emailReceipt}
                              onChange={handleEmailReceipt}
                              size="small"
                            />
                          }
                          label="E-Mail Receipt?"
                        />
                      </FormGroup>
                    </td>
                  )}

                  <td>
                    <Button
                      variant="text"
                      startIcon={<FontAwesomeIcon icon={faTimes} />}
                      color="error"
                      onClick={handleDetachCustomer}
                      sx={{ fontSize: "12px" }}
                    >
                      Detach
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Bounce Back Coupon - Show only for first-time customers */}
          {selectedCustomer.saleCount === 0 && !updatePackage && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "#fff3e0",
                borderRadius: 1,
                border: "1px solid #ffb74d",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#e65100",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <FontAwesomeIcon icon={faGift} />
                First Visit - Issue Bounce Back Coupon?
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#666", display: "block", mb: 1 }}
              >
                40% discount, valid for 3 months
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  size="small"
                  placeholder="Enter coupon code"
                  value={bounceBackCouponCode}
                  onChange={(e) =>
                    setBounceBackCouponCode(e.target.value.toUpperCase())
                  }
                  disabled={bounceBackLoading}
                  sx={{ flex: 1 }}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  onClick={handleCreateBounceBackCoupon}
                  disabled={!bounceBackCouponCode.trim() || bounceBackLoading}
                  sx={{ minWidth: 100 }}
                >
                  {bounceBackLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </Box>
              {bounceBackMessage && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 1,
                    color:
                      bounceBackMessage.type === "success" ? "green" : "red",
                  }}
                >
                  {bounceBackMessage.text}
                </Typography>
              )}
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;

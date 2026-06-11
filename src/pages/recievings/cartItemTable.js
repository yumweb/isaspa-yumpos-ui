import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useRef } from "react";
import Popup from "reactjs-popup";
import DeleteIcon from "@mui/icons-material/Delete";

const CartItemTable = ({
  item,
  removeItemFromCart,
  onOpenCartIteminfoModal,
  updateTechnician,
  technicians,
  updateItemKitTechnician,
  updateItemKitReedem,
  updateAmountInput,
  updateItemQuantity,
  updateItemDiscount,
  updatePackage,
  loyaltyDiscount,
  selectedCustomer,
  generateUniqueId,
}) => {
  const amountInput = useRef(null);
  const qtyInput = useRef(null);
  const discountInput = useRef(null);

  if (!item.uniqueIdd) {
    item.uniqueIdd = generateUniqueId();
  }

  const handlePrice = (event, close) => {
    if (event.key === "Enter") {
      updateAmountInput(item.id, Number(amountInput.current.value));
      close();
    }
  };

  const handleQty = (event, close) => {
    if (event.key === "Enter") {
      updateItemQuantity(
        item.id,
        item.uniqueIdd,
        Number(qtyInput.current.value)
      );
      close();
    }
  };

  const handleDiscount = (event, close) => {
    if (event.key === "Enter") {
      updateItemDiscount(item.id, discountInput.current.value);
      close();
    }
  };

  useEffect(() => {
    if (selectedCustomer && loyaltyDiscount > 0 && item._isService === true) {
      updateItemDiscount(item.id, loyaltyDiscount);
    }
  }, [selectedCustomer, item]);

  return (
    <>
      <tr>
        {/* delete Icon */}
        <td>
          {updatePackage ? null : (
            <IconButton onClick={() => removeItemFromCart(item)}>
              <DeleteIcon className="remove text-danger" />
            </IconButton>
          )}
        </td>
        {/* itemName */}
        <td style={{ textAlign: "left" }}>
          <div
            className="cart-item-name"
            style={{ cursor: "pointer", color: "#33BEFF" }}
            onClick={() => onOpenCartIteminfoModal(item)}
          >
            {item.name}
          </div>
          {item.type === "discount"
            ? null
            : !item._isService && (
                <div className="stock-qty">Stock: {item.quantity || 0}</div>
              )}
        </td>
        {/* price */}
        <td>
          <Popup
            trigger={
              <div
                style={{
                  textDecoration: "underline dashed #33BEFF",
                  cursor: "pointer",
                }}
              >
                Rs. {Number(item?.itemUnitPrice)?.toFixed(2)}
              </div>
            }
            position="top center"
            contentStyle={{
              backgroundColor: "#f5f5f5",
              padding: "5px",
              border: "1px solid lightGray",
              borderRadius: "5px",
            }}
            arrowStyle={{ color: "black" }}
          >
            {(close) => (
              <div>
                <p
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "0px",
                  }}
                >
                  Price
                </p>
                <input
                  ref={amountInput}
                  placeholder={Number(item?.itemCostPrice)?.toFixed(2)}
                  type="text"
                  style={{
                    width: "100%",
                    fontSize: "12px",
                    padding: "10px",
                  }}
                  onKeyDown={(event) => handlePrice(event, close)}
                />
                <FontAwesomeIcon
                  type="button"
                  icon={faCheck}
                  className="check-button"
                  onClick={() => {
                    updateAmountInput(
                      item.id,
                      item.uniqueIdd,
                      Number(amountInput.current.value)
                    );
                    close();
                  }}
                />
                <FontAwesomeIcon
                  type="button"
                  icon={faTimes}
                  className="times-button"
                  onClick={close}
                />
              </div>
            )}
          </Popup>
          {item._taxIncluded ? (
            <div>
              <span
                style={{
                  backgroundColor: "#eaedf2",
                  borderRadius: "50px",
                  fontSize: "10px",
                  padding: "2px 6px",
                }}
              >
                GST Included
              </span>
            </div>
          ) : null}
        </td>
        {/* quantity */}
        <td>
          <Popup
            disabled={item._isGiftCard}
            trigger={
              <div
                style={{
                  textDecoration: `${
                    item._isGiftCard ? "none" : "underline dashed #33BEFF"
                  }`,
                  cursor: `${item._isGiftCard ? "default" : "pointer"}`,
                }}
              >
                {item.quantityPurchased}
              </div>
            }
            position="top center"
            contentStyle={{
              backgroundColor: "#f5f5f5",
              padding: "5px",
              border: "1px solid lightGray",
              borderRadius: "5px",
            }}
            arrowStyle={{ color: "black" }}
          >
            {(close) => (
              <div>
                <p
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "0px",
                  }}
                >
                  Qty.
                </p>
                <input
                  ref={qtyInput}
                  placeholder={item.quantityPurchased}
                  type="text"
                  style={{
                    width: "100%",
                    fontSize: "12px",
                    padding: "10px",
                  }}
                  onKeyDown={(event) => handleQty(event, close)}
                />
                <FontAwesomeIcon
                  type="button"
                  icon={faCheck}
                  className="check-button"
                  onClick={() => {
                    updateItemQuantity(
                      item.id,
                      item.uniqueIdd,
                      Number(qtyInput.current.value)
                    );
                    close();
                  }}
                />
                <FontAwesomeIcon
                  type="button"
                  icon={faTimes}
                  className="times-button"
                  onClick={close}
                />
              </div>
            )}
          </Popup>
        </td>

        <td>Rs. {Number(item?.itemLinePrice)?.toFixed(2)}</td>
      </tr>
      {item.type === "itemkit" ? (
        <tr>
          <td> </td>
          <td colSpan={5} style={{ textAlign: "left" }}>
            <table
              style={{ width: "100%", position: "relative", borderTop: "none" }}
            >
              <tr>
                <td style={{ fontWeight: "bold" }}>Services</td>
                <td style={{ fontWeight: "bold" }}>Quantity</td>
                <td style={{ fontWeight: "bold" }}>Technician</td>
                <td style={{ fontWeight: "bold" }}>Service Reedemed</td>
              </tr>

              {item?.itemkitItems?.map((i, x) => (
                <tr key={x}>
                  <td>{i.item?.name}</td>
                  <td>{i?.quantity}</td>
                  <td>
                    <FormControl>
                      <Select
                        variant="outlined"
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={i?.serviceEmployeeId || 0}
                        size="small"
                        onChange={(e) =>
                          updateItemKitTechnician(
                            item.id,
                            i.itemId,
                            item.uniqueIdd,
                            e.target?.value
                          )
                        }
                        sx={{
                          fontSize: "14px",
                          minWidth: "160px",
                          "& .MuiSelect-select.MuiSelect-select": {
                            padding: "4px 16px 4px 12px",
                            fontFamily: "Russo One, sans-serif",
                          },
                        }}
                      >
                        <MenuItem value={0}>Select technician</MenuItem>
                        {technicians.length
                          ? technicians?.map((technician) => (
                              <MenuItem value={technician?.person?.id}>
                                {technician?.person?.firstName}{" "}
                                {technician?.person?.lastName}
                              </MenuItem>
                            ))
                          : null}
                      </Select>
                    </FormControl>
                  </td>
                  <td>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) => {
                            updateItemKitReedem(
                              item.id,
                              i.itemId,
                              e.target.checked
                            );
                          }}
                          checked={i?.redeemed ? true : false}
                        />
                      }
                      label="Redemed"
                    />
                  </td>
                </tr>
              ))}
            </table>
          </td>
        </tr>
      ) : null}
    </>
  );
};

export default CartItemTable;

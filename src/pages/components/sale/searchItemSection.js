/* eslint-disable jsx-a11y/anchor-is-valid */
import { faCircle, faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import clientAdapter from "../../../lib/clientAdapter";
import { SkeletonLoader } from "../../../components/loader/SkeletonLoader";
import { Button } from "react-bootstrap";
import { TextField } from "@mui/material";

// Helper function to identify redemption items that should not receive auto loyalty discounts
const isRedemptionItem = (item) => {
  if (!item) return false;

  // Check for specific redemption item IDs (family cards, gift cards, etc.)
  const redemptionItemIds = [2909, 2944]; // 2909: Family Card, 2944: Gift Card
  if (redemptionItemIds.includes(item.itemId || item.id)) {
    return true;
  }

  // Check for redemption-related naming patterns
  const itemName = (item.name || '').toLowerCase();
  const redemptionKeywords = ['family card', 'gift card', 'voucher', 'coupon', 'redemption'];
  return redemptionKeywords.some(keyword => itemName.includes(keyword));
};

const SearchItemSection = ({
  toggleOffcanvas,
  searchValue,
  items,
  setSearchValue,
  searchItems,
  handleShowGrid,
  buttonText,
  addItemToCart,
  setSnackBar,
  itemListLoading,
  setItems,
  selectedCustomer,
}) => {
  let abortController;
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setItems([]);
        setSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Item = ({ item }) => {
    const onSelectItem = async (itemData) => {
      if (itemData.item) {
        const ires = await clientAdapter.getItemsById(itemData?.itemId);

        // Allow out of stock items to be added and sold
        // Show a warning but still allow the item to be added
        if (ires && ires?.quantity <= 0 && !ires?.item?.isService) {
          setSnackBar({
            open: true,
            severity: "warning",
            message: `Warning: Item is out of stock (${ires?.quantity || 0} remaining)`,
          });
        }

        // Always add the item regardless of stock status
        if (ires) {
          addItemToCart({
            ...ires,
            category: item?.item?.category,
            costPrice: ires.costPrice || ires?.item?.costPrice,
            unitPrice: ires.unitPrice || ires?.item?.unitPrice,
            type: "item",
            // Only apply loyalty card discount to service items, excluding redemption items
            discountPercent: (ires?.item?.isService && !isRedemptionItem(ires?.item) && selectedCustomer?.loyaltyCardDiscount) || 0,
          });
        }
      }
      if (itemData.itemkit) {
        const ikres = await clientAdapter.getItemDetails(itemData?.itemKitId);
        if (ikres) {
          if (ikres?.itemkit?.itemkitItems?.length === 0) {
            setSnackBar({
              open: true,
              severity: "error",
              message: `Error in adding itemkit to cart`,
            });
          } else {
            addItemToCart({
              ...ikres,
              category: item?.itemkit?.category?.name,
              costPrice: ikres.costPrice || ikres?.itemkit?.costPrice,
              unitPrice: ikres.unitPrice || ikres?.itemkit?.unitPrice,
              // Item kits are typically services, but check to be safe and exclude redemption items
              discountPercent: (ikres?.itemkit?.isService !== false && !isRedemptionItem(ikres?.itemkit) && selectedCustomer?.loyaltyCardDiscount) || 0,
              type: "itemkit",
            });
          }
        }
      }
      setSearchValue("");
    };

    return (
      <div className="item" onClick={() => onSelectItem(item)}>
        {item.item ? (
          <>
            <div className="item-name">{item?.item?.name}</div>
            <div className="item-meta">
              {item?.item?.isService ? "Service" : "Retail Product"} | Category:{" "}
              {item?.item?.category ? item?.item?.category.name : "NA"}{" "}
              {item?.item?.category?.parent?.name
                ? ` > ${item?.item?.category?.parent?.name}`
                : ""}
            </div>
          </>
        ) : item.itemkit ? (
          <>
            <div className="item-name">{item?.itemkit?.name}</div>
            <div className="item-meta">
              Item Kits | Category:{" "}
              {item?.itemkit?.category ? item?.itemkit?.category?.name : "NA"}
            </div>
          </>
        ) : null}
      </div>
    );
  };

  const handleSearch = () => {
    abortController && abortController.abort("cleanup");
    abortController = new AbortController();
    searchItems(searchValue, abortController.signal);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    if (searchValue.length === 4) {
      handleSearch();
    }
  }, [searchValue]);

  return (
    <div className="register-box register-items-form">
      <a tabIndex="-1" className="dismissfullscreen hidden">
        <FontAwesomeIcon icon={faCircle} />
      </a>
      <div className="item-form">
        <form
          id="add_item_form"
          className="form-inline"
          autoComplete="off"
          method="post"
          acceptCharset="utf-8"
        >
          <div
            className="input-group contacts register-input-group"
            ref={inputRef}
          >
            <span className="input-group-addon">
              <a
                className="none add-new-item"
                title="New Item"
                id="new-item"
                tabIndex="-1"
                onClick={toggleOffcanvas}
              >
                <FontAwesomeIcon icon={faEdit} />
              </a>
            </span>
            <span
              role="status"
              aria-live="polite"
              className="ui-helper-hidden-accessible"
            />
            {/* search bar */}
            <TextField
              label="Enter Item Name and press enter to search..."
              variant="outlined"
              name="item"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                e.target.value === "" && setItems([]);
              }}
              ref={inputRef}
              onKeyPress={handleKeyPress}
              sx={{
                width: "67%",
                height: "50px",
                "& label.Mui-focused": {
                  color: "black",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "black",
                    borderRadius: "0px",
                  },
                  "& fieldset": {
                    height: "65px",
                    borderRadius: "0px",
                  },
                },
              }}
            />
            {/* search button */}
            <Button
              className="search-leads"
              style={{
                borderRight: "1px solid lightGray",
                height: "60px",
                width: "60px",
                backgroundColor: "black",
              }}
              onClick={handleSearch}
            >
              <FontAwesomeIcon icon={faSearch} fontSize="20px" />
            </Button>
            {/* show grid */}
            <span className="input-group-addon show-grid">
              <a
                href="sales#"
                className="show-grid"
                tabIndex="-1"
                onClick={() => handleShowGrid()}
              >
                {buttonText}
              </a>
            </span>
          </div>
        </form>
        {itemListLoading ? (
          <div id="item-search-result">
            <SkeletonLoader />
          </div>
        ) : (
          <>
            {items.length > 0 && (
              <div id="item-search-result" ref={suggestionRef}>
                {items.map((item, x) => (
                  <Item item={item} key={`${item.itemId}-${x}`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchItemSection;

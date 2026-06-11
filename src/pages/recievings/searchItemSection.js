/* eslint-disable jsx-a11y/anchor-is-valid */
import { faCircle, faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import clientAdapter from "../../lib/clientAdapter";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";
import { Button } from "react-bootstrap";
import { TextField } from "@mui/material";

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
  const abortRef = useRef(null);
  const debounceRef = useRef(null);
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
      // Cleanup timers and in-flight requests on unmount
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort("unmount");
    };
  }, []);

  const Item = ({ item }) => {
    const onSelectItem = async (itemData) => {
      if (itemData.item) {
        const ires = await clientAdapter.getItemsById(itemData?.itemId);
        console.log(ires.item);
        if (ires.item.isService) {
          setSnackBar({
            open: true,
            severity: "error",
            message: `Error in adding itemkit to cart, please select a Product not a service`,
          });
          setItems([]);
        } else {
          addItemToCart({
            ...ires,
            category: item?.item?.category?.name,
            costPrice: ires.costPrice || ires?.item?.costPrice,
            unitPrice: ires.unitPrice || ires?.item?.unitPrice,
            type: "item",
            discountPercent: selectedCustomer?.loyaltyCardDiscount || 0,
          });
        }
      }
      if (itemData.itemkit) {
        setSnackBar({
          open: true,
          severity: "error",
          message: `Error in adding itemkit to cart, please select a Product not a service`,
        });
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

  const handleSearch = (value = searchValue) => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort("cleanup");
    abortRef.current = new AbortController();
    searchItems(value, abortRef.current.signal);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleKeyUp = (e) => {
    const value = e.target.value;
    // Debounce to avoid excessive requests while typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Start searching as user types (keyup) with small delay
    debounceRef.current = setTimeout(() => {
      if (value && value.trim().length >= 2) {
        handleSearch(value.trim());
      } else {
        // Clear results for short/empty queries
        if (abortRef.current) abortRef.current.abort("cleanup");
        setItems([]);
      }
    }, 250);
  };

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
              label="Type to search items..."
              variant="outlined"
              name="item"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                e.target.value === "" && setItems([]);
              }}
              ref={inputRef}
              onKeyPress={handleKeyPress}
              onKeyUp={handleKeyUp}
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
                href="recievings#"
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

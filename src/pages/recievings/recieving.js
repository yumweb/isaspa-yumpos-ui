import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import LabTabs from "../components/Tab";
import clientAdapter from "../../lib/clientAdapter";
import ReactDatePicker from "react-datepicker";
import { Table, Offcanvas } from "react-bootstrap";
import Popup from "reactjs-popup";
import { filter, find, groupBy, map, remove, sumBy } from "lodash";
import CartItemInfoPopup from "../components/sale/SalesModal/cartItemInfoPopup";
import {
  Snackbar,
  Alert,
  Button,
  Tooltip,
  FormGroup,
  InputLabel,
  Input,
  Container,
  Skeleton,
  CircularProgress,
  Backdrop,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  faSearch,
  faTrash,
  faUserPlus,
  faCheck,
  faTimes,
  faCalendar,
  faPause,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerForm from "../components/customer/CustomerForm";
import ItemsViewPage from "../ItemsViewpage";
import CartItemTable from "./cartItemTable";
import DropdownSales from "../components/sale/Dropdown-sales/DropdownSales";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";
import CustomerInfo from "../components/sale/customerInfo";
import SupplierListDropdown from "./supplierListDropdown";
import AddPaymentSection from "./addPaymentSection";
import SearchItemSection from "./searchItemSection";
import { familyCardDefaultPackage } from "../../data/sale";
import FamilyCardModal from "../components/sale/familyCardModal";
import SupplierInfo from "./supplierInfo";

const Recievings = () => {
  const masterPaymentMethods = [
    {
      name: "Cash",
      selected: false,
    },
    {
      name: "Debit Card",
      selected: false,
    },
    {
      name: "Credit Card",
      selected: false,
    },
    {
      name: "Airtel Payments",
      selected: false,
    },
    {
      name: "Paytm",
      selected: false,
    },
    {
      name: "PhonePe",
      selected: false,
    },
    {
      name: "Google Pay",
      selected: false,
    },
    {
      name: "Bharat QR",
      selected: false,
    },
  ];

  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [backdrop, setBackdrop] = useState(false);
  const [buttonText, setButtonText] = useState("Show Grid");
  const [showGrid, setShowGrid] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [error, setError] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [cartItems, setCartItems] = useState([]);
  const [prevCartItems, setPrevCartItems] = useState([]);
  const [deletedCartItems, setDeletedCartItems] = useState([]);
  const [prevCustomer, setPrevCustomer] = useState(null);
  const [deleteItemPopup, setDeleteItemPopup] = useState({
    open: false,
    item: null,
  });

  const [cartItemInfoModal, setCartItemInfoModal] = useState({
    open: false,
    item: null,
  });
  const [commentText, setCommentText] = useState("");
  const [commentCheckbox, setCommentCheckbox] = useState(false);
  const [cartTotal, setCartTotal] = useState(0.0);
  const [cartAmountDue, setCartAmountDue] = useState(0.0);
  const [amountTendered, setAmountTendered] = useState(0.0);

  const [cartSubTotal, setCartSubTotal] = useState(0.0);
  const [cartTaxes, setCartTaxes] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [open, setOpen] = useState(false);
  const [allItemsDiscount, setAllItemsDiscount] = useState(0);
  const [entireSaleDiscount, setEntireSaleDiscount] = useState();
  // Supplier search helpers
  const supplierAbortRef = useRef(null);
  const supplierDebounceRef = useRef(null);
  const [entireSaleDiscountAmount, setEntireSaleDiscountAmount] = useState();
  const [suspendsale, setSuspendSale] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [hide, setHide] = useState(false);
  const [field, setField] = useState(false);
  const [view, setView] = useState(false);
  const [advanceView, setAdvanceView] = useState(false);
  const [giftcard, setGiftCard] = useState(false);
  const [editCustomer, setEditCustomer] = useState(false);
  const [custInfo, setCustInfo] = useState("");
  const [custSaleId, setCustSaleId] = useState("");
  const finalTotal = (0.0).toFixed(2);
  const amountTenderedRef = useRef();
  const discountAllItems = useRef(null);
  const discountEntireSale = useRef(null);
  const [completeSaleBtnText, setCompleteSaleBtnText] = useState({
    text: "Add Payment",
    complete: false,
  });
  const [paymentMethods, setPaymentMethods] = useState(masterPaymentMethods);
  const loggedInUserInfo = JSON.parse(
    window.localStorage.getItem("yumpos_user_info")
  );
  const locationId = JSON.parse(window.localStorage.getItem("yumpos_location"));
  const [display, setDisplay] = useState(false);
  const [famCard, setFamCard] = useState(false);
  const [lastSale, setLastSale] = useState("");
  const [customerPrevSale, setCustomerPrevSale] = useState([]);
  const [showCustPrevSale, setShowCustPrevSale] = useState(false);
  const [familycardNumber, setFamilyCardNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");
  const [validityDate, setValdityDate] = useState("");
  const [openItems, setOpenItems] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [giftCardNumber, setGiftCardNumber] = useState("");
  const [giftCardvalue, setGiftCardvalue] = useState(0);
  const [appointmentDateAndTime, setAppointmentDateAndTime] = useState("");
  const [locationTaxDetails, setLocationTaxDetails] = useState(null);
  const [cardNumber, setCardNumber] = useState({
    giftCard: { id: null, number: "", redeemValue: 0, cNumber: "" },
    familyCard: { id: null, number: "", redeemValue: 0, cNumber: "" },
    cupon: { id: null, number: "", redeemValue: 0, cNumber: "" },
    points: { id: null, number: "", redeemValue: 0, cNumber: "" },
  });
  const [saleIdSuspend, setSaleIdSuspend] = useState("");

  const [loading, setLoading] = useState(false);
  const [itemListLoading, setItemListLoading] = useState(false);
  const [customerListLoading, setCustomerListLoading] = useState(false);
  const [saleIsSuspended, setSaleIsSuspended] = useState({});

  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const mobile = queryParameters.get("phone");
  const Appointment = queryParameters.get("bookAppointment");
  const salesId = queryParameters.get("saleId");
  const changeAppointmentId = queryParameters.get("appointmentId");
  const saleName = queryParameters.get("sale");

  const navigate = useNavigate();
  const handleCustSaleClose = () => setShowCustPrevSale(false);
  const handleClose = () => setDisplay(display);
  const handleOpen = () => setDisplay(!display);
  const handlefamilyCard = () => setFamCard(!famCard);
  const handleGiftCard = () => setGiftCard(!giftcard);
  const handleAdvanceSlipClose = () => {
    setAdvanceView(false);
    setSuspendSale(false);
  };

  const calculateTotalValue = () => {
    return cartItems.reduce((total, item) => {
      // Assuming each item has a price attribute and a quantityPurchased attribute
      return total + item.itemUnitPrice * item.quantityPurchased;
    }, 0); // Starting the accumulation from 0
  };

  const handleAdvanceSlipShow = async (id) => {
    const res = await clientAdapter.suspendSale(id);
    if (res === 200) {
      navigate(`/sales/receipt?saleId=${id}`);
    }
  };

  const handleAddPayment = async () => {
    let data = {
      supplier: selectedSupplier.id,
      comment: commentText,
      paymentType: selectedPaymentMethod,
      paymentAdvance: 0,
    };

    const receivableitems = cartItems.map((cartItem, index) => ({
      itemId: cartItem.id,
      line: index + 1,
      quantityPurchased: cartItem.quantityPurchased,
      itemCostPrice: cartItem.itemCostPrice,
      itemUnitPrice: cartItem.itemUnitPrice,
    }));

    data.receivingItems = receivableitems;

    console.log(data);
    const res = await clientAdapter.createRecievings(data);
    if (res) {
      setSnackBar({
        open: true,
        severity: "success",
        message: `Successfully created receivings!`,
      });
      // Reset local state/storage and refresh after a short delay
      cancelSale();
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  };

  const toggleOffcanvas = () => {
    setOpenItems(!openItems);
  };

  const handleCloseButton = () => {
    setDisplay(false);
  };

  useEffect(() => {
    const _customer = localStorage.getItem("yuppos_selected_supplier");
    const customerData = _customer && JSON.parse(_customer);
    if (customerData) {
      console.log(customerData);
      setSelectSupplier(customerData);
    }
  }, []);

  useEffect(() => {
    setCartAmountDue(calculateTotalValue());
  }, [cartItems]);

  const _setCart = (taxRate) => {
    const cart = localStorage.getItem("yumpos_cart_items");
    const cartList = cart && JSON.parse(cart);
    if (cartList) {
      setCartItems(cartList?.cartItem);
    }
  };

  var test = new Date();
  test.setDate(test.getDate() - 30);

  // --- Create Customer ---//
  // const createCustomer = async (res) => {
  //   setTimeout(() => {
  //     setDisplay(!display);
  //   }, 3000);
  //   if (res.personId || res?.person) {
  //     try {
  //       const customer = await clientAdapter.getCustomerPhone(res?.phoneNumber);
  //       if (customer.statusCode) {
  //       } else {
  //         handleSelectCustomer(customer);
  //       }
  //     } catch (error) {}
  //   }
  // };

  // // --- Update Customer ---//
  // const updateCustomer = async (res, data) => {
  //   setTimeout(() => {
  //     handleCloseCustomer();
  //   }, 3000);
  //   if (res === 200) {
  //     try {
  //       const customer = await clientAdapter.getCustomerPhone(
  //         res === 200 ? data.person?.phoneNumber : res?.phoneNumber
  //       );
  //       if (customer.statusCode) {
  //       } else {
  //         handleSelectCustomer(customer);
  //       }
  //     } catch (error) {}
  //   }
  // };

  const cancelSale = () => {
    localStorage.removeItem("yumpos_cart_items");
    localStorage.removeItem("yuppos_selected_customer");
    localStorage.removeItem("yumpos_card_number");
    localStorage.removeItem("yuppos_selected_supplier");
    setAllItemsDiscount(0);
    setEntireSaleDiscount();
    setDeletedCartItems([]);
    setCartItems([]);
    setItems([]);
    setSelectSupplier(null);
    setSupplierName("");
    setAppointment(false);
    setOpen(false);
  };

  // const AppointmentDetails = async (salesId) => {
  //   if (salesId) {
  //     setLoading(true);
  //     const location = locationId.locationId;
  //     const reslt = await clientAdapter.getLocationData(location);
  //     if (reslt.taxRates) {
  //       setLocationTaxDetails(reslt.taxRates);
  //     }
  //     const res = await clientAdapter.getSaleReceipt(salesId);
  //     const result = await clientAdapter.getCustomerPhone(
  //       res.customer.phoneNumber
  //     );
  //     setSelectCustomer(result);
  //     localStorage.setItem("yuppos_selected_customer", JSON.stringify(result));
  //     getTechnicians(location);
  //     addAppointmentItemToCart(res, reslt.taxRates);
  //     setSaleIsSuspended(res);
  //     setPrevCustomer(res);
  //   }
  // };

  const handleShowGrid = () => {
    setShowGrid(!showGrid);
    if (showGrid) {
      setButtonText("Show Grid");
    } else {
      setButtonText("Hide Grid");
    }
  };

  const handleDetachSupplier = async () => {
    setSelectSupplier(null);
    setSupplierName("");
    setOpen(false);
    localStorage.removeItem("yuppos_selected_supplier");
  };

  const handleSnackbarClose = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  };

  const handleShow = () => {
    setHide(!hide);
  };

  const handleAppointment = () => {
    setField(!field);
  };

  const handleSaleDate = () => {
    setAppointment(!appointment);
    setField(!field);
    setShow(show);
  };

  const handleSuspend = async () => {
    if ((saleName === "complete" || saleName === "unsuspend") && salesId) {
      setSaleIdSuspend(salesId);
      setSuspendSale(true);
    } else {
      // create a sale
      const createSale = await completeSale("suspend");
      if (createSale && createSale.id) {
        setSaleIdSuspend(createSale.id);
        setSuspendSale(true);
      }
    }
  };

  const handleSuspendSale = async () => {
    // if sale is already suspended
    if (
      salesId &&
      (saleName === "unsuspend" ||
        (saleIsSuspended.wasAppointment === true &&
          saleIsSuspended.suspended === 1 &&
          saleName === "complete"))
    ) {
      const isCustomerChanged = await checkIfCustomerChanged();
      const isItemsAddedOrRemoved = await checkIfNewItemsAddedOrRemoved();

      if (!isCustomerChanged) {
        setSnackBar({
          open: true,
          severity: "error",
          message: `Failed to change customer`,
        });
        return;
      }

      if (!isItemsAddedOrRemoved) {
        setSnackBar({
          open: true,
          severity: "error",
          message: `Error in suspend Sale, Please contact YumPOS Support!`,
        });
        return;
      }

      navigate(`/sales/receipt?saleId=${saleIdSuspend}`);
      cancelSale();
    } else {
      // first time suspend a sale
      const res = await clientAdapter.suspendSale(saleIdSuspend);
      if (res === 200) {
        handleClose();
        navigate(`/sales/receipt?saleId=${saleIdSuspend}`);
        cancelSale();
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: "Failed to suspend sale, please try again.",
        });
      }
    }
  };

  const checkIfCustomerChanged = async () => {
    // Check if the customer data has changed
    const hasCustomerChanged =
      prevCustomer.customer.id !== selectedSupplier?.person.id;

    if (hasCustomerChanged) {
      const detachCustomerPayload = {
        customerId: selectedSupplier?.person.id,
      };

      const detachCustomer = await clientAdapter.changeDetachCustomer(
        salesId,
        detachCustomerPayload
      );
      const res = await detachCustomer.json();
      if (res.success) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  };

  const handleCloseAppointment = () => {
    setView(false);
    setSuspendSale(false);
  };

  const handleAppointmnetClose = () => {
    setField(false);
  };

  const handleSlip = () => {
    setView(!view);
  };

  const handleAdvanceSlip = () => {
    setAdvanceView(!advanceView);
  };

  // --- Search Customer By Phone ---//
  const searchSupplierByName = (name) => {
    try {
      setSupplierName(name);
      // Debounce keyup supplier search
      if (supplierDebounceRef.current) clearTimeout(supplierDebounceRef.current);
      supplierDebounceRef.current = setTimeout(async () => {
        const query = (name || "").trim();
        if (query.length < 2) {
          // Too short: clear results and abort inflight
          if (supplierAbortRef.current) supplierAbortRef.current.abort("cleanup");
          setSuppliers([]);
          setCustomerListLoading(false);
          return;
        }
        // Cancel any in-flight request and issue a new one
        if (supplierAbortRef.current) supplierAbortRef.current.abort("cleanup");
        supplierAbortRef.current = new AbortController();
        setCustomerListLoading(true);
        try {
          const results = await clientAdapter.getSupplierbyName(query);
          setSuppliers(Array.isArray(results) ? results : []);
        } catch (error) {
          // Ignore aborted requests; otherwise surface minimal failure
        } finally {
          setCustomerListLoading(false);
        }
      }, 250);
    } catch (error) {
      setCustomerListLoading(false);
    }
  };

  const handleSearchSupplierByName = async () => {
    setCustomerListLoading(true);
    const customer = await clientAdapter.getSupplierbyName(supplierName);
    setCustomerListLoading(false);
    if (customer) {
      if (customer.length == 0) {
        setSnackBar({
          open: true,
          severity: "error",
          message: "Name doesnt exist",
        });
        return;
      }

      setSuppliers(customer);
    } else {
      setError("Name does not exist");
    }
  };

  // Cleanup supplier search timers/requests on unmount
  useEffect(() => {
    return () => {
      if (supplierDebounceRef.current)
        clearTimeout(supplierDebounceRef.current);
      if (supplierAbortRef.current) supplierAbortRef.current.abort("unmount");
    };
  }, []);

  const searchItems = async (keyword, signal) => {
    try {
      if (keyword.length > 0) {
        setItemListLoading(true);
        const itemsres = await clientAdapter.searchItems(keyword, signal);
        // itemsres is an array of LocationItem records scoped to the current location
        setItems(Array.isArray(itemsres) ? itemsres : []);
        setItemListLoading(false);
      } else {
        setItems([]);
      }
    } catch (error) {
      setItemListLoading(false);
    }
  };

  const onOpenCartIteminfoModal = async (item) => {
    if (item._isGiftCard || item._isFamilyCard) {
      setCartItemInfoModal({
        open: true,
        item: item,
      });
    } else {
      try {
        const itemDetails = await clientAdapter.getItemsById(item.id);
        setCartItemInfoModal({
          open: true,
          item: itemDetails
            ? { ...itemDetails, quantityPurchased: item.quantityPurchased }
            : null,
        });
      } catch (error) {}
    }
  };

  const onCloseCartItemInfoModal = () => {
    setCartItemInfoModal({ open: false, item: null });
  };

  const addItemToCart = (item) => {
    let itemDetails;

    console.log(item);

    if (item.item.isService) {
      setSnackBar({
        open: true,
        severity: "falied",
        message: "Please add a product.",
      });
      return;
    }

    if (item.type === "item") {
      itemDetails = {
        name: item.item.name,
        id: item.itemId,
        _taxIncluded: item.item.taxIncluded,
        itemkitItems: null,
        _isService: item.item.isService,
        itemTaxes: item.item.itemTaxes,
        description: item.item.description,
      };
    }
    if (item.type === "discount") {
      itemDetails = {
        name: "Discount",
        id: 291,
        _taxIncluded: false,
        itemkitItems: null,
        _isService: false,
        itemTaxes: [
          {
            name: "SGST",
            percent: 9,
          },
          {
            name: "CGST",
            percent: 9,
          },
        ],
        description: "",
      };
    }
    const cartItem = {
      ...itemDetails,
      type: item.type,
      line: cartItems.length + 1,
      quantityPurchased: 1,
      itemCostPrice: Number(item.costPrice),
      itemUnitPrice: Number(item.unitPrice),
      discountPercent: Number(item.discountPercent) || 0,
      commission: 0,
      serviceEmployeeId: 0,
      itemLinePrice: Number(item.unitPrice),
      itemBasePrice: Number(item.costPrice),
      quantity: item?.quantity || 0,
    };

    if (item.type === "discount") {
      const existingIndex = cartItems.findIndex((item) => item?.id === 291);
      if (existingIndex !== -1) {
        cartItems[existingIndex] = cartItem;
      } else {
        cartItems.push(cartItem);
      }
      // additemsToLocalStorage([...cartItems]);
    } else {
      // additemsToLocalStorage([...cartItems, cartItem]);
      setCartItems([...cartItems, cartItem]);
    }
  };

  const additemsToLocalStorage = (cartItem) => {
    const cartitemDetails = {
      cartItem,
    };
    localStorage.setItem("yumpos_cart_items", JSON.stringify(cartitemDetails));
  };

  const onCloseDeleteItemPopup = () => {
    setDeleteItemPopup({ open: false, item: null });
  };

  const onConfirmDeleteAppointmentItem = async (deletedItem) => {
    let res;
    if (deletedItem.type === "item") {
      res =
        saleName === "unsuspend"
          ? await clientAdapter.deleteItemFromSuspendSale(
              salesId,
              deletedItem.id
            )
          : await clientAdapter.deleteItemFromSuspendSale(
              salesId,
              deletedItem.id
            );
    }
    if (deletedItem.type === "itemkit") {
      res =
        saleName === "unsuspend"
          ? await clientAdapter.deleteItemKitFromSuspendSale(
              salesId,
              deletedItem.id
            )
          : await clientAdapter.deleteItemKitFromSuspendSale(
              salesId,
              deletedItem.id
            );
    }

    const dres = await res.json();
    if (dres?.success) {
      setSnackBar({
        open: true,
        severity: "success",
        message: "Item deleted successfully",
      });

      const newItems = remove(cartItems, (i) => {
        return i.id !== deletedItem.id;
      });
      setDeleteItemPopup({ open: false, item: null });
      additemsToLocalStorage(newItems);

      if (!newItems?.length) {
        cancelSale();
      }
    } else {
      setSnackBar({
        open: true,
        severity: "error",
        message: "Something went wrong",
      });
    }
  };

  const removeItemFromCart = (item) => {
    setCartItems((prevCartItems) => {
      if (item.type === "discount") {
        // Remove all items with type 'discount'
        return prevCartItems.filter((cartItem) => cartItem.type !== "discount");
      } else {
        // Remove the item with matching id
        return prevCartItems.filter((cartItem) => cartItem.id !== item.id);
      }
    });
  };

  const generateUniqueId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  const updateItemQuantity = (itemId, uniqueIdd, qty) => {
    console.log("updateItemQuantity", itemId, uniqueIdd, qty);
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantityPurchased: qty };
        }

        return item;
      });

      console.log(updatedItems);

      return updatedItems;
    });
  };

  const updateAmountInput = (itemId, uniqueIdd, price) => {
    cartItems?.map((c) => {
      if (c.id === itemId && c.uniqueIdd === uniqueIdd) {
        c.itemCostPrice = price;
        c.itemUnitPrice = price;
        c.itemLinePrice = c.itemUnitPrice * c.quantityPurchased;
      }
    });
  };

  const updateItemDiscount = (itemId, uniqueIdd, discount) => {
    const updatedCartItems = cartItems?.map((c) => {
      if (
        c.id === itemId &&
        c.uniqueIdd === uniqueIdd &&
        c.type !== "discount"
      ) {
        c.discountPercent = +discount;
        c.itemLinePrice =
          c.itemUnitPrice * c.quantityPurchased -
          (c.itemUnitPrice * c.quantityPurchased * +discount) / 100;
      }
      return c;
    });

    additemsToLocalStorage(updatedCartItems);
  };

  const updateTechnician = (itemId, uniqueIdd, technicianId) => {
    cartItems.map((c) => {
      if (c.id === itemId && c.uniqueIdd === uniqueIdd) {
        c.serviceEmployeeId = technicianId;
      }
    });
    additemsToLocalStorage([...cartItems]);
  };

  const updateItemKitTechnician = (
    itemId,
    subItemId,
    uniqueIdd,
    technicianId
  ) => {
    cartItems?.map((c) => {
      if (c.id === itemId && c.uniqueIdd === uniqueIdd) {
        c.itemkitItems.map((i) => {
          if (i.itemId === subItemId) {
            i.serviceEmployeeId = technicianId;
          }
        });
      }
    });
    additemsToLocalStorage([...cartItems]);
  };

  const updateItemKitReedem = (itemId, subItemId, checked) => {
    cartItems?.map((c) => {
      if (c.id === itemId) {
        c.itemkitItems.map((i) => {
          if (i.itemId === subItemId) {
            i.redeemed = checked;
          }
        });
      }
    });
    additemsToLocalStorage([...cartItems]);
  };

  const handleSelectSupplier = (customer) => {
    setSelectSupplier(customer);
    // setCustSaleId(customer.person.id);
    setOpen(!open);
    setSuppliers([]);

    localStorage.setItem("yuppos_selected_supplier", JSON.stringify(customer));
  };

  const handlePaymentMethod = (name) => {
    masterPaymentMethods.map((m) => {
      if (m.name === name) {
        m.selected = true;
      } else {
        m.selected = false;
      }
    });
    setSelectedPaymentMethod(name);
    setPaymentMethods(masterPaymentMethods);
  };

  const checkGiftCardExists = async (giftCardNumber) => {
    const res = await clientAdapter.getGiftCardbyLocation(1, 1, giftCardNumber);
    return res;
  };

  const deductAmountFromCard = async (amountDue, cardValue) => {
    if (Number(amountDue) <= Number(cardValue)) {
      cardValue -= amountDue;
      masterPaymentMethods.map((m) => {
        if (
          m.name === "Gift Card" ||
          m.name === "Family Card" ||
          m.name === "Coupon" ||
          m.name === "Points"
        ) {
          m.amountLeft = cardValue;
        }
      });
      setPaymentMethods(masterPaymentMethods);
      return amountDue;
    }
    return cardValue;
  };

  const checkFamilyCardExists = async (familyCardNumber) => {
    const res = await clientAdapter.getFamilyCardbyLocation(
      1,
      1,
      familyCardNumber
    );
    return res;
  };

  const checkCouponsExists = async (couponNumber) => {
    const res = await clientAdapter.getCouponbyLocation(1, 1, couponNumber);
    return res;
  };

  const checkIfCard = (selectedPaymentMethod) => {
    if (
      selectedPaymentMethod.name === "Gift Card" ||
      selectedPaymentMethod.name === "Family Card" ||
      selectedPaymentMethod.name === "Coupon" ||
      selectedPaymentMethod.name === "Points"
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleIfCardExists = async (selectedPaymentMethod, amountTendered) => {
    const personId = selectedSupplier?.person?.id;

    if (selectedPaymentMethod.name === "Gift Card") {
      const giftcardExist = await checkGiftCardExists(
        cardNumber.giftCard.number
      );
      if (
        giftcardExist?.giftcards.length &&
        giftcardExist?.giftcards[0]?.person?.id === personId
      ) {
        const updatedAmount = await deductAmountFromCard(
          amountTendered,
          giftcardExist.giftcards[0]?.value
        );
        const gData = {
          id: giftcardExist.giftcards[0]?.id,
          number: giftcardExist.giftcards[0]?.giftcardNumber,
          redeemValue: updatedAmount,
          cNumber: giftcardExist.giftcards[0]?.giftcardNumber,
        };
        const d = { ...cardNumber, giftCard: { ...gData } };
        window.localStorage.setItem("yumpos_card_number", JSON.stringify(d));
        setCardNumber(d);
        return updatedAmount;
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: "Gift card does not exist. Please enter a valid gift card.",
        });
        return null;
      }
    }
    if (selectedPaymentMethod.name === "Family Card") {
      const familycardExist = await checkFamilyCardExists(
        cardNumber.familyCard.number
      );
      if (
        familycardExist?.familycards.length &&
        familycardExist?.familycards[0]?.person?.id === personId
      ) {
        const updatedAmount = await deductAmountFromCard(
          amountTendered,
          familycardExist.familycards[0]?.value
        );
        const d = {
          ...cardNumber,
          familyCard: {
            id: familycardExist?.familycards[0]?.id,
            number: familycardExist?.familycards[0].familycardNumber,
            redeemValue: updatedAmount,
            cNumber: familycardExist?.familycards[0]?.familycardNumber,
          },
        };
        window.localStorage.setItem("yumpos_card_number", JSON.stringify(d));

        setCardNumber(d);
        return updatedAmount;
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message:
            "Family card does not exist. Please enter a valid family card.",
        });
        return null;
      }
    }
    if (selectedPaymentMethod.name === "Coupon") {
      const couponExist = await checkCouponsExists(cardNumber.cupon.number);
      if (couponExist.coupons.length) {
        const coupon_person = couponExist.coupons[0]?.person;
        if (!coupon_person || coupon_person?.id === personId) {
          if (couponExist.coupons[0]?.couponOption === "percentage") {
            updateAllItemsDiscount(couponExist.coupons[0]?.value);
            const couponDiscountAmount = 0;
            const d = {
              ...cardNumber,
              cupon: {
                id: couponExist.coupons[0]?.id,
                number: couponExist.coupons[0]?.couponNumber,
                redeemValue: couponDiscountAmount,
                cNumber: couponExist.coupons[0]?.couponNumber,
              },
            };
            window.localStorage.setItem(
              "yumpos_card_number",
              JSON.stringify(d)
            );

            setCardNumber(d);
            return couponDiscountAmount;
          } else {
            const updatedAmount = await deductAmountFromCard(
              amountTendered,
              couponExist.coupons[0]?.value
            );
            const d = {
              ...cardNumber,
              cupon: {
                id: couponExist.coupons[0]?.id,
                number: couponExist.coupons[0]?.couponNumber,
                redeemValue: updatedAmount,
                cNumber: couponExist.coupons[0]?.couponNumber,
              },
            };
            window.localStorage.setItem(
              "yumpos_card_number",
              JSON.stringify(d)
            );

            setCardNumber(d);
            return updatedAmount;
          }
        } else {
          setSnackBar({
            open: true,
            severity: "error",
            message:
              "Coupon does not exist or is invalid. Please enter a valid coupon.",
          });
          return null;
        }
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: "Coupon does not exist. Please enter a valid coupon.",
        });
        return null;
      }
    }
    if (selectedPaymentMethod.name === "Points") {
      const point = selectedSupplier?.points;

      const updatedAmount = Number(cardNumber.points.number);
      const d = {
        ...cardNumber,
        familyCard: {
          id: null,
          number: point,
          redeemValue: updatedAmount,
          cNumber: point,
        },
      };
      window.localStorage.setItem("yumpos_card_number", JSON.stringify(d));
      setCardNumber(d);
      return updatedAmount;
    }
  };

  const handleSelect = (e) => {
    setDescription(e.target.value);
  };

  const checkIfNewItemsAddedOrRemoved = async () => {
    // Find newly added items (items that are present in cartItems but not in prevCartItems)
    const newlyAddedItems = cartItems.filter((currentItem) => {
      return !prevCartItems.some((prevItem) => prevItem.id === currentItem.id);
    });

    const updatedItems = cartItems.filter((currentItem) => {
      return prevCartItems.some((prevItem) => {
        return (
          prevItem.id === currentItem.id &&
          (prevItem.type !== currentItem.type ||
            prevItem.description !== currentItem.description ||
            prevItem.line !== currentItem.line ||
            prevItem.quantityPurchased !== currentItem.quantityPurchased ||
            prevItem.discountPercent !== currentItem.discountPercent ||
            prevItem.commission !== currentItem.commission ||
            prevItem.serviceEmployeeId !== currentItem.serviceEmployeeId ||
            prevItem.itemCostPrice !== currentItem.itemCostPrice ||
            prevItem.itemUnitPrice !== currentItem.itemUnitPrice ||
            (prevItem.type === "itemkit" &&
              JSON.stringify(prevItem.itemkitItems) !==
                JSON.stringify(currentItem.itemkitItems)))
        );
      });
    });

    for (const deletedItem of updatedItems) {
      if (deletedItem.type === "item") {
        const res = await clientAdapter.deleteItemFromSuspendSale(
          salesId,
          deletedItem.id
        );
        if (res?.status === 200) {
          newlyAddedItems.push(deletedItem);
        } else {
          console.error("Failed to deleteItem:", deletedItem.id);
        }
      }
      if (deletedItem.type === "itemkit") {
        const res = await clientAdapter.deleteItemKitFromSuspendSale(
          salesId,
          deletedItem.id
        );
        if (res?.status === 200) {
          newlyAddedItems.push(deletedItem);
        } else {
          console.error("Failed to deleteItemKit:", deletedItem.id);
        }
      }
    }

    //Group new items by type (item or itemkit)
    const groupedNewItems = [];
    const groupedNewItemkits = [];
    let itemsSuccess = false;
    let itemKitsSuccess = false;

    newlyAddedItems.forEach((newItem) => {
      if (newItem.type === "item" || newItem.type === "discount") {
        groupedNewItems.push(newItem);
      }
      if (newItem.type === "itemkit") {
        groupedNewItemkits.push(newItem);
      }
    });

    if (groupedNewItems.length > 0) {
      const sitems = groupedNewItems.map((i) => {
        const taxData = {
          itemTaxes: i.itemTaxes
            ? i.itemTaxes?.map(({ name, percent }) => ({
                name,
                percent,
              }))
            : null,
        };

        return {
          description: i.description || "",
          line: 0,
          quantityPurchased: i.quantityPurchased,
          discountPercent: i.discountPercent,
          commission: 0,
          serviceEmployeeId: i.serviceEmployeeId,
          ...taxData,
          id: i.id,
          serialNumber: 0,
          itemCostPrice: Number(i.itemCostPrice),
          itemUnitPrice: Number(i.itemUnitPrice),
        };
      });
      const payload = {
        items: sitems,
      };

      const res =
        saleName === "unsuspend"
          ? await clientAdapter.addItemToSuspendSale(salesId, payload)
          : await clientAdapter.addItemToAppointmentSale(salesId, payload);
      if (res?.status === 201) {
        itemsSuccess = true;
      }
    } else {
      itemsSuccess = true;
    }

    if (groupedNewItemkits.length > 0) {
      const sitems = groupedNewItemkits.map((i) => {
        return {
          description: i.description,
          line: i?.line || 0,
          quantityPurchased: i.quantityPurchased,
          discountPercent: i.discountPercent,
          commission: 0,
          serviceEmployeeId: 0,
          itemTaxes: i.itemTaxes,
          id: i.id,
          itemKitCostPrice: i.itemCostPrice,
          itemKitUnitPrice: i.itemUnitPrice,
          itemkitItems: i.itemkitItems?.map((ik) => ({
            itemId: ik.itemId,
            redeemed: ik.redeemed ? true : false,
            itemServiceEmployeeId: ik.serviceEmployeeId,
            itemLine: 0,
            quantityPurchased: 1,
          })),
        };
      });
      const payload = {
        items: sitems,
      };

      const res =
        saleName === "unsuspend"
          ? await clientAdapter.addItemKitToSuspendSale(salesId, payload)
          : await clientAdapter.addItemKitToAppointmentSale(salesId, payload);
      if (res?.status === 201) {
        itemKitsSuccess = true;
      }
    } else {
      itemKitsSuccess = true;
    }
    return itemsSuccess && itemKitsSuccess;
  };

  const completeSale = async (_sale) => {
    const endPoint =
      _sale === "new_appointment" ? "salesAppointment" : "completeSale";

    if (!selectedSupplier) {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Please select a customer`,
      });
      return;
    }

    if (cartItems) {
      for await (const eachItem of cartItems) {
        if (
          eachItem?.type !== "discount" &&
          parseInt(eachItem?.itemCostPrice) === 0
        ) {
          setSnackBar({
            open: true,
            severity: "error",
            message: `${eachItem?.name} price should not be zero`,
          });
          return;
        }
      }
    }

    const lineCounts = {};
    const customerId = selectedSupplier?.person?.id || selectedSupplier?.id;
    const employeeId = loggedInUserInfo.personId;
    const soldBy = loggedInUserInfo.personId;
    const sitems = cartItems.map((i) => {
      let line = 0;

      if (i.type === "item" || i.type === "discount") {
        line = lineCounts[i.id]
          ? ++lineCounts[i.id]
          : (lineCounts[i.id] = 1) - 1;
      } else if (i.type === "itemkit") {
        line = i.line || 0;
      }

      if (i.type === "item" || i.type === "discount") {
        const taxData = {
          itemTaxes: i.itemTaxes
            ? i.itemTaxes?.map(({ name, percent }) => ({
                name,
                percent,
              }))
            : null,
        };

        return {
          itemType: "item",
          item: {
            description: i.description || "",
            line: line,
            quantityPurchased: i.quantityPurchased,
            discountPercent: i.discountPercent,
            commission: 0,
            serviceEmployeeId: i.serviceEmployeeId,
            ...taxData,
            id: i.id,
            serialNumber: 0,
            itemCostPrice: Number(i.itemCostPrice),
            itemUnitPrice: Number(i.itemUnitPrice),
          },
        };
      }
      if (i.type === "itemkit") {
        return {
          itemType: "itemKit",
          itemKit: {
            description: i.description,
            line: line,
            quantityPurchased: i.quantityPurchased,
            discountPercent: i.discountPercent,
            commission: 0,
            serviceEmployeeId: 0,
            itemTaxes: i.itemTaxes,
            id: i.id,
            itemKitCostPrice: i.itemCostPrice,
            itemKitUnitPrice: i.itemUnitPrice,
            itemkitItems: i.itemkitItems?.map((ik) => ({
              itemId: ik.itemId,
              redeemed: ik.redeemed ? true : false,
              itemServiceEmployeeId: ik.serviceEmployeeId,
              itemLine: 0,
              quantityPurchased: 1,
            })),
          },
        };
      }
      if (i.type === "giftCard" || i.type === "familyCard") {
        const totalTaxPercent =
          i.itemTaxes.reduce((total, { percent }) => total + percent, 0) || 0;
        const cardAsItem = {
          description: i.description || "",
          line: 0,
          quantityPurchased: i.quantityPurchased,
          discountPercent: i.discountPercent,
          commission: 0,
          serviceEmployeeId: i.serviceEmployeeId,
          id: i.id,
          serialNumber: 0,
          itemCostPrice: Number(i.itemCostPrice),
          itemUnitPrice: Number(i.itemUnitPrice),
        };
        const taxData = {
          itemTaxes: i.itemTaxes
            ? i.itemTaxes?.map(({ name, percent }) => {
                const basePrice =
                  Number(i.itemUnitPrice) / (1 + totalTaxPercent / 100);
                const taxAmount = basePrice * (percent / 100);
                return {
                  id: null,
                  itemId: 5497,
                  name,
                  percent,
                  cumulative: 0,
                  item: null,
                  amount: taxAmount.toFixed(2),
                };
              })
            : null,
        };
        if (i.type === "giftCard") {
          const gdata = {
            itemType: "giftCard",
            giftCard: {
              giftCardNumber: i.description,
              value: i?.giftCardValue || 0,
            },
          };
          const iData = {
            ...taxData,
            name: "Gift Card",
            _isGiftCard: true,
            _taxIncluded: true,
          };
          const giftCardAsItem = {
            itemType: "item",
            item: {
              ...cardAsItem,
              ...iData,
            },
          };
          return [gdata, giftCardAsItem];
        }
        if (i.type === "familyCard") {
          const fmdata = {
            itemType: "familyCard",
            familyCard: {
              familyCardNumber: i.familyCardNumber,
              description: i.description,
              validityDate:
                moment(i.validityDate).toISOString() ||
                "2023-12-31T13:39:18.451Z",
              value: Number(i.familyCardValue) || 0,
            },
          };
          const iData = {
            ...taxData,
            name: "Family Card",
            _isGiftCard: true,
            _taxIncluded: true,
          };
          const familyCardAsItem = {
            itemType: "item",
            item: {
              ...cardAsItem,
              ...iData,
            },
          };
          return [fmdata, familyCardAsItem];
        }
      }
    });

    let isAllreedemed = true;

    if (sitems.length > 0) {
      sitems
        .filter((i) => i.itemType === "itemKit")
        .map((item) => {
          const redeemed = item.itemKit.itemkitItems.every(
            (item) => item.redeemed === true
          );
          isAllreedemed = redeemed;
        });
    }

    const saleBody = {
      customerId: customerId,
      employeeId: employeeId,
      soldBy: soldBy,
      registerId: 1,
      wasAppointment:
        saleName === "complete" || saleName === "changeAppointment"
          ? true
          : _sale === "new_appointment"
          ? true
          : false,
      comment: commentText ? `V2 - ${commentText}` : "V2",
      items: sitems.flat(),
      suspended:
        _sale === "suspend"
          ? 1
          : _sale === "new_appointment"
          ? 3
          : isAllreedemed
          ? 0
          : 4,
    };

    setBackdrop(true);
    const res = await clientAdapter[endPoint](saleBody);
    setBackdrop(false);
    if (res?.stockWarnings && Array.isArray(res.stockWarnings) && res.stockWarnings.length > 0) {
      setSnackBar({
        open: true,
        severity: "warning",
        message: `Stock went negative for ${res.stockWarnings.length} item(s).`,
      });
    }
    if (res.id) {
      return res;
    } else {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Something went wrong. Please contact YumPOS Support!`,
      });
      return;
    }
  };

  const _updatePackageSale = async () => {
    const redeemedItemIds = cartItems.reduce((acc, currentItem) => {
      if (currentItem.itemkitItems) {
        currentItem.itemkitItems.forEach((item) => {
          if (item.redeemed === true) {
            acc.push(item.itemId);
          }
        });
      }
      return acc;
    }, []);
    const allItemsRedeemed = cartItems.every((item) => {
      if (item.itemkitItems) {
        return item.itemkitItems.every((subItem) => subItem.redeemed === true);
      }
      return false; // Return false if itemkitItems array doesn't exist
    });

    const data = {
      saleId: Number(salesId),
      items: redeemedItemIds,
    };
    if (allItemsRedeemed) {
      data.allRedeemed = true;
    }
    setBackdrop(true);
    const res = await clientAdapter.updatePackageSale(data);
    setBackdrop(false);
    if (res?.success) {
      cancelSale();
      navigate(`/sales/receipt?saleId=${Number(salesId)}`);
    } else {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Something went wrong. Please contact YumPOS Support!`,
      });
    }
  };

  const showRes = (createSale) => {
    setSnackBar({
      ...snackBar,
      open: true,
      severity: "success",
      message: `Appointment created successfully`,
    });
    setTimeout(() => {
      navigate(`/sales/receipt?saleId=${createSale.id}`);
      setCompleteSaleBtnText({
        text: "Complete Sale",
        complete: false,
      });
      cancelSale();
    }, 1000);
  };

  const updateAllItemsDiscount = (discount) => {
    cartItems.map((c) => {
      updateItemDiscount(c.id, c.uniqueIdd, discount);
    });
    setAllItemsDiscount(discount);
  };

  const calculateTotalAmount = (amount, ftotal) => {
    const total = Number(amount);

    return +total.toFixed(2);
  };

  const calculateBasePrice = (unitPrice, itemTaxes) => {
    const totalTax = itemTaxes
      ? parseInt(itemTaxes[0]?.percent) + parseInt(itemTaxes[1]?.percent)
      : 18;
    const basePrice = unitPrice / (1 + totalTax / 100);
    return basePrice?.toFixed(2);
  };

  useEffect(() => {
    if (selectedSupplier?.loyaltyCardNumber && allItemsDiscount === 0) {
      updateAllItemsDiscount(selectedSupplier?.loyaltyCardDiscount);
    }
  }, [
    selectedSupplier?.loyaltyCardNumber,
    selectedSupplier?.loyaltyCardDiscount,
    cartItems,
  ]);

  useEffect(() => {
    if (entireSaleDiscount === undefined) {
      setEntireSaleDiscount(null);
      return;
    }
  }, [entireSaleDiscount]);

  useEffect(() => {
    if (mobile && Appointment) {
      const getAppointmentInfo = async () => {
        const res = await clientAdapter.getCustomerPhone(mobile);
        if (res) {
          setSelectSupplier(res);
          setOpen(!open);
          setAppointment(!appointment);
        }
      };
      getAppointmentInfo();
    }
  }, []);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        ContentProps={{ sx: { p: 0 } }}
      >
        <Alert
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackBar.severity || "info"}
          sx={{ width: "100%", alignItems: "center" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
      <hr />

      <div className="main-content">
        <div className="page-title">
          <h4>Create Recieving</h4>
        </div>
        <div id="sales_page_holder">
          <div id="sale-grid-big-wrapper" className="clearfix register">
            <div className="row">
              <div className="clearfix" id="category_item_selection_wrapper" />
            </div>
          </div>

          <LabTabs showGrid={showGrid} addItemToCart={addItemToCart} />

          <div id="register_container" className="sales clearfix">
            <div className="row register" style={{ marginTop: 0 }}>
              {/* ---left */}
              <div className="col-12 col-lg-8 col-md-12">
                {/* search items */}
                {saleName === "unpackaged" ? null : (
                  <SearchItemSection
                    toggleOffcanvas={toggleOffcanvas}
                    searchValue={searchValue}
                    items={items}
                    setSearchValue={setSearchValue}
                    searchItems={searchItems}
                    handleShowGrid={handleShowGrid}
                    buttonText={buttonText}
                    addItemToCart={addItemToCart}
                    setSnackBar={setSnackBar}
                    itemListLoading={itemListLoading}
                    setItems={setItems}
                    selectedSupplier={selectedSupplier}
                  />
                )}
                {/* --cart items table--- */}
                <div className="register-box register-items paper-cut">
                  <div className="register-items-holder">
                    {loading ? (
                      <SkeletonLoader />
                    ) : (
                      <table id="register" className="table table-hover">
                        <thead>
                          <tr className="register-items-header">
                            <td></td>
                            <td
                              className="item_name_heading"
                              style={{ textAlign: "left" }}
                            >
                              Item Name
                            </td>
                            <td className="sales_price">Price</td>
                            <td className="sales_quantity">Qty.</td>
                            <td>Total</td>
                          </tr>
                        </thead>
                        <tbody className="register-item-content">
                          {cartItems.length ? (
                            <>
                              {cartItems.map((item, x) => (
                                <React.Fragment key={x}>
                                  <CartItemTable
                                    item={item}
                                    key={`${item.id}`}
                                    removeItemFromCart={removeItemFromCart}
                                    onOpenCartIteminfoModal={
                                      onOpenCartIteminfoModal
                                    }
                                    updateTechnician={updateTechnician}
                                    technicians={technicians}
                                    updateItemKitTechnician={
                                      updateItemKitTechnician
                                    }
                                    updateItemKitReedem={updateItemKitReedem}
                                    updateAmountInput={updateAmountInput}
                                    updateItemQuantity={updateItemQuantity}
                                    updateItemDiscount={updateItemDiscount}
                                    updatePackage={
                                      saleName === "unpackaged" ? true : false
                                    }
                                    selectedSupplier={selectedSupplier}
                                    loyaltyDiscount={
                                      selectedSupplier?.loyaltyCardDiscount
                                    }
                                    generateUniqueId={generateUniqueId}
                                  />
                                </React.Fragment>
                              ))}
                            </>
                          ) : (
                            <tr className="cart_content_area">
                              <td colSpan="6">
                                <div className="text-center text-warning">
                                  <h3>
                                    There are no items in the cart
                                    <span className="flatGreenc">
                                      {" "}
                                      [Recieving]{" "}
                                    </span>
                                  </h3>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
              {/* ---right---- */}
              <div className="col-12 col-lg-4 col-md-12 no-padding-right">
                <div className="register-box register-right">
                  <div className="sale-buttons">
                    <div className="btn-group"></div>

                    {selectedSupplier && cartItems.length > 0 ? (
                      <Tooltip title="Suspend Sale" placement="top">
                        <Button
                          style={{
                            backgroundColor: "#FFC55C",
                            color: "white",
                            border: "1px solid orange",
                            marginLeft: "20px",
                            margin: "5px",
                          }}
                          onClick={() => handleSuspend()}
                        >
                          <FontAwesomeIcon icon={faPause} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <></>
                    )}

                    {cartItems.length > 0 && (
                      <Tooltip title="Cancel Sale" placement="top">
                        <Button
                          style={{
                            marginLeft: "100px",
                            backgroundColor: "#FF5C5C",
                            border: "1px solid red",
                            color: "white",
                            margin: "5px",
                          }}
                          onClick={cancelSale}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                  <div className="customer-form">
                    <form
                      action=""
                      id="select_customer_form"
                      autoComplete="off"
                      className="form-inline"
                      method="post"
                      acceptCharset="utf-8"
                    >
                      <div className="input-group contacts">
                        {!open && (
                          <>
                            <span className="input-group-addon ">
                              <div
                                onClick={handleSearchSupplierByName}
                                className="none"
                                title="Search"
                                id="new-customer"
                                tabIndex="-1"
                              >
                                <FontAwesomeIcon
                                  icon={faSearch}
                                  className="address-book"
                                />
                              </div>
                            </span>
                            <span
                              role="status"
                              aria-live="polite"
                              className="ui-helper-hidden-accessible"
                            ></span>

                            <input
                              type="text"
                              id="customer"
                              name="customer"
                              className="add-customer-input ui-autocomplete-input"
                              placeholder="Type Supplier Name"
                              autoComplete="off"
                              onChange={(e) =>
                                searchSupplierByName(e.target.value)
                              }
                              value={supplierName}
                              required
                            />
                          </>
                        )}
                        {/* customer list  dropdown */}
                        {customerListLoading ? (
                          <div style={{ width: "100%" }}>
                            <Skeleton
                              variant="text"
                              height="40px"
                              sx={{ width: "100%" }}
                            />
                            <Skeleton
                              variant="text"
                              height="40px"
                              sx={{ width: "100%" }}
                            />
                          </div>
                        ) : (
                          <>
                            {suppliers && suppliers.length > 0 && (
                              <>
                                {suppliers.map((s) => (
                                  <SupplierListDropdown
                                    key={s.id || s.person?.id}
                                    handleSelectSupplier={handleSelectSupplier}
                                    supplier={s}
                                  />
                                ))}
                              </>
                            )}
                          </>
                        )}

                        <span className="error mt-2 text-danger">{error}</span>

                        {selectedSupplier && (
                          <SupplierInfo
                            selectedSupplier={selectedSupplier}
                            handleDetachSupplier={handleDetachSupplier}
                            updatePackage={
                              saleName === "unpackaged" ? true : false
                            }
                          />
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                {/* -----amount details----- */}
                {cartItems.length > 0 && (
                  <div className="register-box register-summary paper-cut">
                    <div className="sales_right_function">
                      <ul className="list-group" style={{ marginBottom: 0 }}>
                        <div className="amount-block">
                          <div className="total amount">
                            <div className="side-heading"> Total Items</div>
                            <div
                              className="amount total-amount"
                              data-speed="1000"
                              data-currency="Rs."
                              data-decimals="2"
                            >
                              {cartItems.length}
                            </div>
                          </div>
                          <div className="total amount-due">
                            <div className="side-heading"> Amount Due </div>
                            <div className="amount"> Rs. {cartAmountDue} </div>
                          </div>
                        </div>

                        <div id="finish_sale" className="finish-sale">
                          <form
                            action=""
                            id="finish_sale_form"
                            autoComplete="off"
                            method="post"
                            acceptCharset="utf-8"
                          ></form>
                        </div>

                        {
                          <Container
                            style={{
                              backgroundColor: "white",
                              padding: "20px",
                              paddingTop: "0px",
                              borderRadius: "3px",
                            }}
                          >
                            <h5
                              style={{
                                fontSize: "14px",
                                fontStyle: "-moz-initial",
                              }}
                            >
                              Comments :
                            </h5>
                            <FormGroup
                              style={{
                                display: "inline-block",
                                width: "100%",
                                fontFamily: "Russo One, sans-serif",
                                marginTop: "5px",
                              }}
                            >
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                size="small"
                                value={commentText}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    p: "10px 10px 10px 0px",
                                  },
                                }}
                                onChange={(e) => setCommentText(e.target.value)}
                              />
                            </FormGroup>
                          </Container>
                        }

                        <div className="add-payment">
                          {saleName === "unpackaged" ? (
                            <Button
                              style={{
                                backgroundColor: "#84E184",
                                marginTop: "5px",
                                color: "white",
                                width: "100%",
                                border: "1px solid green",
                              }}
                              onClick={_updatePackageSale}
                            >
                              Complete Sale
                            </Button>
                          ) : (
                            <>
                              {selectedSupplier ? (
                                <AddPaymentSection
                                  paymentMethods={paymentMethods}
                                  handlePaymentMethod={handlePaymentMethod}
                                  cardNumber={cardNumber}
                                  setCartAmountDue={setCartAmountDue}
                                  setCardNumber={setCardNumber}
                                  cartAmountDue={cartAmountDue}
                                  amountTenderedRef={amountTenderedRef}
                                  setAmountTendered={setAmountTendered}
                                  amountTendered={cartAmountDue}
                                  completeSaleBtnText={completeSaleBtnText}
                                  handleAddPayment={handleAddPayment}
                                />
                              ) : null}
                            </>
                          )}
                        </div>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----create new item ----- */}
      <Offcanvas
        show={openItems}
        onHide={() => setOpenItems(false)}
        placement="top"
        className="modal-2"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Create Item</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body
          className="appointment-content"
          style={{
            height: "80vh",
            marginBottom: "10px",
          }}
        >
          <ItemsViewPage toggleOffcanvas={toggleOffcanvas} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* ----create new customer----- */}
      <Offcanvas show={display} placement="top" className="modal-2">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>New Customer</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body
          className="appointment-content"
          style={{
            height: "80vh",
            marginBottom: "10px",
            marginTop: "-20px",
            padding: 0,
          }}
        >
          <CustomerForm
            isEditing={false}
            editItem={null}
            //onSubmitCustomer={createCustomer}
            oCancelCustomer={handleCloseButton}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* ----update customer----- */}
      {custInfo && (
        <Offcanvas show={editCustomer} placement="top" className="modal-2">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Edit Customer</Offcanvas.Title>
          </Offcanvas.Header>
          <hr />
          <Offcanvas.Body
            className="appointment-content"
            style={{
              height: "80vh",
              marginBottom: "10px",
              padding: 0,
            }}
          >
            <CustomerForm
              isEditing={true}
              editItem={selectedSupplier}
              //onSubmitCustomer={updateCustomer}
              oCancelCustomer={() => setEditCustomer(false)}
            />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      <Offcanvas
        show={field}
        onHide={handleAppointmnetClose}
        placement="top"
        className="modal-2"
      >
        <Offcanvas.Body className="appointment-content">
          Go further to book Appointment?
          <div style={{ float: "right", marginTop: "10px" }}>
            <Button
              style={{ border: "1px solid black" }}
              onClick={handleAppointmnetClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaleDate}
              style={{ border: "1px solid blue", marginLeft: "5px" }}
            >
              OK
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {suspendsale && (
        <Offcanvas
          show={suspendsale}
          onHide={handleClose}
          placement="top"
          className="modal-2"
        >
          <Offcanvas.Body className="appointment-content">
            <ul className="suspend_sale_list">
              <li onClick={handleSlip}>
                {" "}
                <a>
                  <FontAwesomeIcon
                    icon={faPause}
                    style={{ marginRight: "10px" }}
                  />
                  Service Slip
                </a>{" "}
              </li>
              <li
                onClick={handleAdvanceSlip}
                style={{ borderTop: "1px solid black" }}
              >
                <a>
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    style={{ marginRight: "10px" }}
                  />
                  Advance Receipt
                </a>
              </li>
            </ul>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {view && (
        <Offcanvas
          show={view}
          onHide={handleClose}
          placement="top"
          className="modal-2"
          style={{
            top: "50%",
          }}
        >
          <Offcanvas.Body className="appointment-content">
            Are you sure you want to suspend this sale?
            <div style={{ float: "right", marginTop: "10px" }}>
              <Button
                style={{ border: "1px solid black" }}
                onClick={handleCloseAppointment}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSuspendSale}
                style={{ border: "1px solid blue", marginLeft: "5px" }}
              >
                OK
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {advanceView && (
        <Offcanvas
          show={advanceView}
          onHide={handleAdvanceSlipClose}
          placement="top"
          className="modal-2"
          style={{
            top: "40%",
          }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              Are you sure you want to suspend this sale?
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="appointment-content">
            <div style={{ float: "right", marginTop: "10px" }}>
              <Button
                style={{ border: "1px solid black" }}
                onClick={handleAdvanceSlipClose}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleAdvanceSlipShow(salesId)}
                style={{ border: "1px solid black", marginLeft: "5px" }}
              >
                OK
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {famCard && (
        <Offcanvas
          show={famCard}
          onHide={handlefamilyCard}
          placement="top"
          className="modal-2"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Familycard Information</Offcanvas.Title>
          </Offcanvas.Header>
          <hr />
          <Offcanvas.Body className="appointment-content">
            <FamilyCardModal
              setFamilyCardNumber={setFamilyCardNumber}
              description={description}
              handleSelect={handleSelect}
              value={value}
              balance={balance}
              setValue={setValue}
              setBalance={setBalance}
              setValdityDate={setValdityDate}
            />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {giftcard && (
        <Offcanvas
          show={giftcard}
          onHide={handleGiftCard}
          placement="top"
          className="modal-2"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Giftcard Information</Offcanvas.Title>
          </Offcanvas.Header>
          <hr />
          <Offcanvas.Body className="appointment-content">
            <Container
              style={{
                backgroundColor: "white",
                padding: "40px",
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
                  Giftcard <br /> Number :
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
                      padding: "5px",
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
                  marginTop: "10px",
                  top: "80%",
                }}
              >
                Submit
              </Button>
            </Container>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {customerPrevSale ? (
        <Offcanvas
          show={showCustPrevSale}
          onHide={handleCustSaleClose}
          placement="top"
          className="modal-6"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Recent Sales</Offcanvas.Title>
          </Offcanvas.Header>
          <hr />
          <Offcanvas.Body className="appointment-content">
            <Table striped bordered hover size="md">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Payments</th>
                  <th>Items Purchased</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      <CircularProgress sx={{ color: "inherit" }} size={40} />
                    </td>
                  </tr>
                ) : customerPrevSale.length > 0 ? (
                  customerPrevSale.map((m, x) => (
                    <tr key={x}>
                      <td>
                        {moment.utc(m.sale_time).format("DD-MM-YYYY @ hh:mm A")}
                      </td>
                      <td>{m.payment_type?.replace(/<br \/>/g, " ")}</td>
                      <td>{`${
                        parseInt(m.ItemsCount) + parseInt(m.ItemKitCount)
                      }`}</td>
                      <td
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() =>
                          navigate(`/sales/receipt?saleId=${m.sale_id}`)
                        }
                      >
                        Invoice
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Offcanvas.Body>
        </Offcanvas>
      ) : (
        <></>
      )}

      {cartItemInfoModal.open && (
        <CartItemInfoPopup
          open={cartItemInfoModal.open}
          onClose={onCloseCartItemInfoModal}
          item={cartItemInfoModal.item}
        />
      )}

      {deleteItemPopup.open && (
        <Offcanvas
          show={deleteItemPopup.open}
          onHide={onCloseDeleteItemPopup}
          placement="top"
          className="modal-2"
          style={{
            top: "40%",
          }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              Are you sure you want to Delete this Item?
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="appointment-content">
            <div style={{ float: "right", marginTop: "10px" }}>
              <Button
                style={{ border: "1px solid black" }}
                onClick={onCloseDeleteItemPopup}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  onConfirmDeleteAppointmentItem(deleteItemPopup.item)
                }
                style={{ border: "1px solid black", marginLeft: "5px" }}
              >
                OK
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      <Backdrop
        open={backdrop}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Recievings;

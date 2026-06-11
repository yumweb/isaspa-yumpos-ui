import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import LabTabs from "../components/Tab";
import clientAdapter from "../../lib/clientAdapter";
import ReactDatePicker from "react-datepicker";
import { Table, Offcanvas } from "react-bootstrap";
import Popup from "reactjs-popup";
import { filter, find, remove } from "lodash";
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
import CartItemTable from "../components/sale/cartItemTable";
import DropdownSales from "../components/sale/Dropdown-sales/DropdownSales";
import { SkeletonLoader } from "../../components/loader/SkeletonLoader";
import CustomerInfo from "../components/sale/customerInfo";
import CustomerListDropdown from "../components/sale/customerListDropdown";
import AddPaymentSection from "../components/sale/addPaymentSection";
import SearchItemSection from "../components/sale/searchItemSection";
import {
  familyCardDefaultPackage,
  familyCardTimePackage,
} from "../../data/sale";
import FamilyCardModal from "../components/sale/familyCardModal";
import { Modal } from "@themesberg/react-bootstrap";
import {
  getTaxConfiguration,
  calculateServiceItemTax,
  calculateBasePrice as calculateBasePriceUtil,
  calculateCartTaxes,
  generateItemTaxData,
  roundTo2,
} from "../../utils/taxCalculations";
const Sales = () => {
  const masterPaymentMethods = [
    {
      name: "Cash",
      selected: false,
    },
    {
      name: "Gift Card",
      selected: false,
      amountLeft: null,
    },
    {
      name: "Family Card",
      selected: false,
      amountLeft: null,
    },
    {
      name: "Coupon",
      selected: false,
      amountLeft: null,
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
      name: "Points",
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
      name: "Deal Sites",
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
  const [testing, setTest] = useState("");
  const [backdrop, setBackdrop] = useState(false);
  const [buttonText, setButtonText] = useState("Show Grid");
  const [showGrid, setShowGrid] = useState(false);
  const [number, setNumber] = useState("");
  const [error, setError] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [selectedCustomer, setSelectCustomer] = useState(null);
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
  const [amountTendered, setAmountTendered] = useState("0.00");

  const [cartSubTotal, setCartSubTotal] = useState(0.0);
  const [cartTaxes, setCartTaxes] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [open, setOpen] = useState(false);
  const [allItemsDiscount, setAllItemsDiscount] = useState(0);
  const [entireSaleDiscount, setEntireSaleDiscount] = useState();
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
  const finalTotal = 0;
  const amountTenderedRef = useRef();
  const discountAllItems = useRef(null);
  const discountEntireSale = useRef(null);
  const [completeSaleBtnText, setCompleteSaleBtnText] = useState({
    text: "Add Payment",
    complete: false,
  });
  const [paymentMethods, setPaymentMethods] = useState(masterPaymentMethods);
  const [salePaymentMethods, setSalePaymentMethods] = useState([]);
  const loggedInUserInfo = JSON.parse(
    window.localStorage.getItem("yumpos_user_info")
  );
  const locationId = JSON.parse(window.localStorage.getItem("yumpos_location"));
  // const [removeTax, setRemoveTax] = useState(false);
  const [display, setDisplay] = useState(false);
  const [famCard, setFamCard] = useState(false);
  const [lastSale, setLastSale] = useState("");
  const [customerPrevSale, setCustomerPrevSale] = useState([]);
  const [showCustPrevSale, setShowCustPrevSale] = useState(false);
  const [familycardNumber, setFamilyCardNumber] = useState("");
  const [balance, setBalance] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");
  const [validityDate, setValdityDate] = useState("");
  const [openItems, setOpenItems] = useState(false);
  const [giftCardNumber, setGiftCardNumber] = useState("");
  const [giftCardvalue, setGiftCardvalue] = useState(0);
  const [appointmentDateAndTime, setAppointmentDateAndTime] = useState("");
  const [locationTaxDetails, setLocationTaxDetails] = useState(null);
  const [cardNumber, setCardNumber] = useState({
    giftCard: { id: null, number: "", redeemValue: 0, cNumber: "" },
    familyCard: {
      id: null,
      number: "",
      redeemValue: 0,
      cNumber: "",
      isTimeBased: 0,
      redeemMinutes: 0,
    },
    cupon: { id: null, number: "", redeemValue: 0, cNumber: "" },
    points: { id: null, number: "", redeemValue: 0, cNumber: "" },
  });
  const [saleIdSuspend, setSaleIdSuspend] = useState("");

  const [loading, setLoading] = useState(false);
  const [itemListLoading, setItemListLoading] = useState(false);
  const [customerListLoading, setCustomerListLoading] = useState(false);
  const [saleIsSuspended, setSaleIsSuspended] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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

  // Helper to mitigate floating point precision issues
  const roundTo2 = (n) => {
    const num = Number(n);
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };
  const handleGiftCard = () => setGiftCard(!giftcard);
  const handleAdvanceSlipClose = () => {
    setAdvanceView(false);
    setSuspendSale(false);
  };

  const storedObject = localStorage.getItem("yumpos_location");
  const locationObject = JSON.parse(storedObject);

  const handleAdvanceSlipShow = async (id) => {
    const res = await clientAdapter.suspendSale(id);
    if (res === 200) {
      navigate(
        `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${id}`
      );
    }
  };

  const toggleOffcanvas = () => {
    setOpenItems(!openItems);
  };

  const handleCloseButton = () => {
    setDisplay(false);
  };

  // useEffect(() => {
  //   console.log(cartItems);
  // }, [cartItems]);

  useEffect(() => {
    const _customer = localStorage.getItem("yuppos_selected_customer");
    const customerData = _customer && JSON.parse(_customer);
    if (customerData) {
      setSelectCustomer(customerData);
    }
  }, []);

  const _setCart = (taxRate) => {
    const cart = localStorage.getItem("yumpos_cart_items");
    const cartList = cart && JSON.parse(cart);
    if (cartList) {
      setCartItems(cartList?.cartItem);
      refreshCart(cartList?.cartItem, salePaymentMethods, taxRate);
    }
  };

  // var test = new Date();
  // test.setDate(test.getDate() - 30);

  // --- Submit Familycard ---//

  const handlefamilyCardValue = (e) => {
    if (description === "default") {
      const _balance = familyCardDefaultPackage.find(
        (f) => f.value === Number(e.target.value)
      ).balance;
      setBalance(_balance);

      const _validity = familyCardDefaultPackage.find(
        (f) => f.value === Number(e.target.value)
      ).expiry;
      setValdityDate(moment().add(_validity, "months").format("YYYY-MM-DD"));
    }
    setValue(e.target.value);
  };

  // Time-based package picked while selling a card in-sale: fill price, minutes
  // and validity from the chosen package.
  const handleTimePackage = (e) => {
    const pkg = familyCardTimePackage.find(
      (p) => p.value === Number(e.target.value)
    );
    if (pkg) {
      setValue(pkg.value);
      setBalance(pkg.value);
      setServiceTime(pkg.serviceTime);
      setValdityDate(moment().add(pkg.expiry, "months").format("YYYY-MM-DD"));
    }
  };

  const submitFamilyCard = async () => {
    const customerId = selectedCustomer?.person.id;
    const options = {
      familycardNumber,
      description,
      balance,
      value,
      validityDate,
      customerId,
    };
    if (!familycardNumber) {
      return setSnackBar({
        open: true,
        severity: "error",
        message: `Please enter Family Card Number`,
      });
    }
    if (!value) {
      return setSnackBar({
        open: true,
        severity: "error",
        message: `Please enter Family Card details`,
      });
    }
    setSnackBar({
      open: true,
      severity: "success",
      message: `Successfully created familycards`,
    });
    const isTimeBasedCard = description === "time" || Number(serviceTime) > 0;
    const cartitem = {
      itemId: 2909,
      // monetary card -> balance (incl. bonus); time card -> price paid
      value: isTimeBasedCard ? Number(options.value) : Number(options.balance),
      type: "familyCard",
      familyCardNumber: options.familycardNumber,
      costPrice: Number(options.value),
      unitPrice: Number(options.value),
      description: options.familycardNumber,
      validityDate: validityDate,
      isTimeBased: isTimeBasedCard ? 1 : 0,
      serviceTime: isTimeBasedCard ? Number(serviceTime) : null,
    };
    addItemToCart(cartitem);
    setFamCard(false);
  };

  //submit gift card//
  const onChangeGiftCardNumber = (e) => {
    setGiftCardNumber(e.target.value);
  };

  const onChangeGiftCardValue = (e) => {
    setGiftCardvalue(e.target.value);
  };

  const submitGiftCard = async () => {
    const customerId = selectedCustomer?.person?.id;
    const options = {
      giftcardNumber: giftCardNumber,
      description: "",
      value: Number(giftCardvalue),
      customerId: customerId || 0,
    };
    try {
      setSnackBar({
        open: true,
        severity: "success",
        message: `Successfully created giftcards`,
      });
      setGiftCard(false);
      const cartitem = {
        itemId: 2944,
        value: options.value,
        type: "giftCard",
        costPrice: Number(options.value),
        unitPrice: Number(options.value),
        description: options.giftcardNumber,
      };
      addItemToCart(cartitem);
    } catch (error) {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Something went wrong`,
      });
    }
  };

  // --- Get Customer Last Sale ---//
  const getCustomerLastSale = async () => {
    if (custSaleId) {
      setShowCustPrevSale(true);
      setLoading(true);
      const res = await clientAdapter.getCustomerSaleHistory(custSaleId);
      setLoading(false);
      setCustomerPrevSale(res);
    }
  };

  const handleEditCustomer = () => {
    setEditCustomer(!editCustomer);
    setCustInfo(selectedCustomer);
  };

  const handleCloseCustomer = () => {
    setEditCustomer(false);
  };

  // --- Create Customer ---//
  const createCustomer = async (res) => {
    setTimeout(() => {
      setDisplay(!display);
    }, 3000);
    if (res.personId || res?.person) {
      try {
        const customer = await clientAdapter.getCustomerPhone(res?.phoneNumber);
        if (customer.statusCode) {
        } else {
          handleSelectCustomer(customer);
        }
      } catch (error) {}
    }
  };

  // --- Update Customer ---//
  const updateCustomer = async (res, data) => {
    setTimeout(() => {
      handleCloseCustomer();
    }, 3000);
    if (res === 200) {
      try {
        const customer = await clientAdapter.getCustomerPhone(
          res === 200 ? data.person?.phoneNumber : res?.phoneNumber
        );
        if (customer.statusCode) {
        } else {
          handleSelectCustomer(customer);
        }
      } catch (error) {}
    }
  };

  // Helper function to safely get tax configuration data
  const getLocationTaxData = () => {
    try {
      const storedTaxRate = localStorage.getItem("yumpos_locationTaxRate");
      return (
        locationTaxDetails ||
        (storedTaxRate ? JSON.parse(storedTaxRate) : null) ||
        locationObject
      );
    } catch (error) {
      console.error("Error parsing tax rate from localStorage:", error);
      return locationTaxDetails || locationObject;
    }
  };

  const cancelSale = () => {
    localStorage.removeItem("yumpos_cart_items");
    localStorage.removeItem("yuppos_selected_customer");
    localStorage.removeItem("yumpos_card_number");
    setAllItemsDiscount(0);
    setEntireSaleDiscount();
    setDeletedCartItems([]);
    setItems([]);
    setSelectCustomer(null);
    setNumber("");
    refreshCart([], []);
    setAppointment(false);
    setOpen(false);
  };

  const getTechnicians = async (id) => {
    setLoading(true);
    const res = await clientAdapter.getLocationData(id);
    setLoading(false);
    if (res.taxRates) {
      setLocationTaxDetails(res.taxRates);
    }
    localStorage.setItem(
      "yumpos_locationTaxRate",
      JSON.stringify(res.taxRates)
    );

    const technicians = filter(res.employeeConnection, (e) => {
      return (
        e.employee &&
        e.employee.deleted === false &&
        e.employee.isCorporate === false &&
        e.employee.isOwner === false
      );
    });
    setTechnicians(technicians);
    _setCart(res.taxRates);
  };

  const addAppointmentItemToCart = (res, taxRate) => {
    let appDetails = [];
    if (
      saleName !== "unpackaged" &&
      res.saleItems &&
      res.saleItems.length > 0
    ) {
      appDetails = res.saleItems.map((saleItem) => {
        // Filter taxes by itemId and line to get the correct taxes for this specific item
        const itemSpecificTaxes = res.saleItemTaxes
          ?.filter(
            (tax) =>
              tax.itemId === saleItem.item.itemId && tax.line === saleItem.line
          )
          .map((tax) => ({
            name: tax.name,
            percent: Number(tax.percent),
          }));

        // Fallback to location taxes if no item-specific taxes found
        const locationTaxData = getLocationTaxData();
        const taxConfig = getTaxConfiguration(locationTaxData);
        const fallbackTaxes = [
          { name: taxConfig.name1, percent: taxConfig.rate1 },
          { name: taxConfig.name2, percent: taxConfig.rate2 },
        ];

        return {
          name: saleItem.item.name,
          id: saleItem.item.itemId,
          _taxIncluded: saleItem.item.taxIncluded,
          itemkitItems: null,
          _isService: saleItem.item.isService,
          itemTaxes:
            itemSpecificTaxes && itemSpecificTaxes.length > 0
              ? itemSpecificTaxes
              : fallbackTaxes,
          description: saleItem.item.description,
          type: "item",
          line: saleItem.line,
          quantityPurchased: saleItem.quantityPurchased,
          itemCostPrice: saleItem.itemCostPrice,
          itemUnitPrice: saleItem.itemUnitPrice,
          discountPercent: saleItem.discountPercent,
          commission: saleItem.commission,
          serviceEmployeeId: saleItem.serviceEmployeeId,
          itemLinePrice: saleItem.itemUnitPrice,
          itemBasePrice: saleItem.itemCostPrice,
          serviceEmployee: saleItem.serviceEmployeeId,
        };
      });
    }

    if (res.saleItemkit && res.saleItemkit.length > 0) {
      appDetails = [
        ...appDetails,
        ...res.saleItemkit.map((saleItemKit) => {
          // Filter taxes by itemKitId and line for this specific item kit
          const kitSpecificTaxes = res.saleItemkitTax
            ?.filter(
              (tax) =>
                tax.itemKitId === saleItemKit.itemkit.itemKitId &&
                tax.line === saleItemKit.line
            )
            .map((tax) => ({
              name: tax.name,
              percent: Number(tax.percent),
            }));

          // Fallback to location taxes if no kit-specific taxes found
          const locationTaxData = getLocationTaxData();
          const taxConfig = getTaxConfiguration(locationTaxData);
          const fallbackTaxes = [
            { name: taxConfig.name1, percent: taxConfig.rate1 },
            { name: taxConfig.name2, percent: taxConfig.rate2 },
          ];

          return {
            name: saleItemKit.itemkit.name,
            id: saleItemKit.itemkit.itemKitId,
            _taxIncluded: saleItemKit.itemkit.taxIncluded,
            itemTaxes:
              kitSpecificTaxes && kitSpecificTaxes.length > 0
                ? kitSpecificTaxes
                : fallbackTaxes,
            itemkitItems: saleItemKit.saleItemkitItems.map((kitItem) => ({
              item: {
                name: kitItem.item.name,
                itemId: kitItem.itemId,
                itemTaxes: fallbackTaxes,
              },
              itemId: kitItem.itemId,
              itemKitId: kitItem.itemKitId,
              quantity: kitItem.purchasedQuantity,
              serviceEmployeeId: kitItem.kitsServiceEmployee,
              redeemed: kitItem.isRedeemed,
            })),
            description: saleItemKit.itemkit.description,
            type: "itemkit",
            line: saleItemKit.line,
            quantityPurchased: saleItemKit.quantityPurchased,
            itemCostPrice: saleItemKit.itemKitCostPrice,
            itemUnitPrice: saleItemKit.itemKitUnitPrice,
            discountPercent: saleItemKit.discountPercent,
            commission: saleItemKit.commission,
            serviceEmployeeId: saleItemKit.serviceEmployeeId,
            itemLinePrice: saleItemKit.itemKitUnitPrice,
            itemBasePrice: saleItemKit.itemKitCostPrice,
          };
        }),
      ];
    }
    setPrevCartItems(appDetails);
    additemsToLocalStorage(appDetails, salePaymentMethods);
    refreshCart(appDetails, salePaymentMethods, taxRate);
  };

  const AppointmentDetails = async (salesId) => {
    if (salesId) {
      setLoading(true);
      const location = locationId.locationId;
      const reslt = await clientAdapter.getLocationData(location);
      if (reslt.taxRates) {
        setLocationTaxDetails(reslt.taxRates);
      }
      const res = await clientAdapter.getSaleReceipt(salesId);
      const result = await clientAdapter.getCustomerPhone(
        res.customer.phoneNumber
      );
      setSelectCustomer(result);
      localStorage.setItem("yuppos_selected_customer", JSON.stringify(result));
      getTechnicians(location);
      addAppointmentItemToCart(res, reslt.taxRates);
      setSaleIsSuspended(res);
      setPrevCustomer(res);
    }
  };

  const handleShowGrid = () => {
    setShowGrid(!showGrid);
    if (showGrid) {
      setButtonText("Show Grid");
    } else {
      setButtonText("Hide Grid");
    }
  };

  const handleDetachCustomer = async () => {
    setSelectCustomer(null);
    setNumber("");
    setOpen(false);
    salesId && saleName === "changeAppointment"
      ? setAppointment(true)
      : setAppointment(false);
    localStorage.removeItem("yuppos_selected_customer");
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
    if (
      (saleName === "complete" ||
        saleName === "unsuspend" ||
        saleName === "edit") &&
      salesId
    ) {
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

      // navigate(`/sales/receipt?saleId=${saleIdSuspend}`);
      window.open(
        `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${saleIdSuspend}`,
        "_blank"
      );
      cancelSale();
      window.location.reload();
    } else {
      // first time suspend a sale
      const res = await clientAdapter.suspendSale(saleIdSuspend);
      if (res === 200) {
        handleClose();
        // navigate(`/sales/receipt?saleId=${saleIdSuspend}`);
        window.open(
          `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${saleIdSuspend}`,
          "_blank"
        );
        cancelSale();
        window.location.reload();
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
      prevCustomer.customer.id !== selectedCustomer?.person.id;

    if (hasCustomerChanged) {
      const detachCustomerPayload = {
        customerId: selectedCustomer?.person.id,
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
  const searchCustomer = async (number) => {
    try {
      setNumber(number);
      if (number.length >= 10) {
        setCustomerListLoading(true);
        const customer = await clientAdapter.getCustomerPhone(number);
        setCustomerListLoading(false);
        if (customer) {
          setCustomer(customer);
        } else {
          setError("Number does not exist");
        }
      } else {
        setCustomer("");
        setError("");
        setSelectCustomer("");
      }
    } catch (error) {
      setCustomerListLoading(false);
    }
  };

  const searchItems = async (keyword, signal) => {
    try {
      if (keyword.length > 0) {
        setItemListLoading(true);
        const itemsres = await clientAdapter.searchItemsAndItemKits(
          keyword,
          signal
        );
        const itemList = [
          ...(itemsres.items?.locationItem || []),
          ...(itemsres.itemKits?.locationItemKit || []),
        ];
        setItems(itemList);
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
    if (item.type === "itemkit") {
      itemDetails = {
        name: item.itemkit.name,
        id: item.itemKitId,
        _taxIncluded: item.itemkit.taxIncluded,
        itemkitItems: item.itemkit.itemkitItems,
        itemTaxes: (() => {
          const taxConfig = getTaxConfiguration(getLocationTaxData());
          return [
            {
              name: taxConfig.name1,
              percent: taxConfig.rate1,
            },
            {
              name: taxConfig.name2,
              percent: taxConfig.rate2,
            },
          ];
        })(),
        description: item.itemkit.description,
        productId: item.itemkit.productId,
        itemkitNumber: item.itemkit.itemkitNumber,
      };
    }
    if (item.type === "item") {
      itemDetails = {
        category: item.category,
        name: item.item.name,
        id: item.itemId,
        _taxIncluded: item.item.taxIncluded,
        itemkitItems: null,
        _isService: item.item.isService,
        itemTaxes: (() => {
          // Check if item has tax override at location level
          if (item.overrideDefaultTax && item.item.itemTaxes && item.item.itemTaxes.length > 0) {
            // Use item-specific taxes
            return item.item.itemTaxes.map((tax) => ({
              name: tax.name,
              percent: tax.percent,
            }));
          }
          // Use location taxes for both service and retail items
          const taxConfig = getTaxConfiguration(getLocationTaxData());
          return [
            {
              name: taxConfig.name1,
              percent: taxConfig.rate1,
            },
            {
              name: taxConfig.name2,
              percent: taxConfig.rate2,
            },
          ];
        })(),
        description: item.item.description,
        // Service duration in minutes (used to deduct from time-based family cards)
        size: Number(item.item.size) || 0,
      };
    }
    if (item.type === "discount") {
      itemDetails = {
        name: "Discount",
        id: 291,
        _taxIncluded: true,
        itemkitItems: null,
        _isService: true,
        itemTaxes: (() => {
          const taxConfig = getTaxConfiguration(getLocationTaxData());
          return [
            {
              name: taxConfig.name2,
              percent: taxConfig.rate2,
            },
            {
              name: taxConfig.name1,
              percent: taxConfig.rate1,
            },
          ];
        })(),
        description: "",
      };
    }
    if (item.type === "giftCard") {
      itemDetails = {
        name: "Gift Card",
        id: item.itemId,
        _taxIncluded: true,
        itemkitItems: null,
        _isService: true, // ✅ Gift cards should also be treated as services
        itemTaxes: (() => {
          const taxConfig = getTaxConfiguration(getLocationTaxData());
          return [
            {
              name: taxConfig.name2,
              percent: taxConfig.rate2,
            },
            {
              name: taxConfig.name1,
              percent: taxConfig.rate1,
            },
          ];
        })(),
        description: item.description,
        giftCardValue: item.value,
      };
    }
    if (item.type === "familyCard") {
      itemDetails = {
        name: "Family Card",
        id: item.itemId,
        _taxIncluded: true,
        itemkitItems: null,
        _isService: true, // ✅ Family cards should be treated as services
        itemTaxes: (() => {
          const taxConfig = getTaxConfiguration(getLocationTaxData());
          return [
            {
              name: taxConfig.name2,
              percent: taxConfig.rate2,
            },
            {
              name: taxConfig.name1,
              percent: taxConfig.rate1,
            },
          ];
        })(),
        description: item.description,
        familyCardNumber: item.familyCardNumber,
        familyCardValue: item.value,
        validityDate: item.validityDate,
        isTimeBased: item.isTimeBased || 0,
        serviceTime: item.serviceTime ?? null,
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
      additemsToLocalStorage([...cartItems], salePaymentMethods);
    } else {
      additemsToLocalStorage([...cartItems, cartItem], salePaymentMethods);
      refreshCart([...cartItems, cartItem], salePaymentMethods);
    }
  };

  const additemsToLocalStorage = (cartItem, salePaymentMethods) => {
    const cartitemDetails = {
      cartItem,
      salePaymentMethods,
    };
    localStorage.setItem("yumpos_cart_items", JSON.stringify(cartitemDetails));
  };

  const onCloseDeleteItemPopup = () => {
    setDeleteItemPopup({ open: false, item: null });
  };

  const onConfirmDeleteAppointmentItem = async (deletedItem) => {
    let res;
    if (deletedItem.type === "item") {
      if (saleName === "edit") {
        res = await clientAdapter.deleteItemFromCompletedSale(
          salesId,
          deletedItem.id
        );
      } else {
        res = await clientAdapter.deleteItemFromSuspendSale(
          salesId,
          deletedItem.id
        );
      }
    }
    if (deletedItem.type === "itemkit") {
      if (saleName === "edit") {
        // TODO: Create deleteItemKitFromCompletedSale when needed
        res = await clientAdapter.deleteItemKitFromSuspendSale(
          salesId,
          deletedItem.id
        );
      } else {
        res = await clientAdapter.deleteItemKitFromSuspendSale(
          salesId,
          deletedItem.id
        );
      }
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
      additemsToLocalStorage(newItems, salePaymentMethods);
      refreshCart(newItems, salePaymentMethods);
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
    if (item.type === "discount") {
      setEntireSaleDiscount();
    }
    if (
      salesId &&
      (saleName === "complete" ||
        saleName === "unsuspend" ||
        saleName === "changeAppointment" ||
        saleName === "edit")
    ) {
      const removedItem = find(cartItems, (i) => i.id === item.id);
      if (!deletedCartItems.some((i) => i.id === item.id)) {
        // Update the deleted items state without duplicates
        setDeletedCartItems((prevDeletedItems) => [
          ...prevDeletedItems,
          removedItem,
        ]);
      }
      if (item.type === "item" || item.type === "itemkit") {
        setDeleteItemPopup({ open: true, item: item });
      }
    } else {
      const newItems = remove(cartItems, (i) => {
        return i.id !== item.id;
      });
      additemsToLocalStorage(newItems, salePaymentMethods);
      refreshCart(newItems, salePaymentMethods);
      if (!newItems?.length) {
        cancelSale();
      }
    }
  };

  const generateUniqueId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  const updateItemQuantity = async (itemId, uniqueIdd, qty) => {
    const updatedCartItems = cartItems?.map((c) => {
      if (c.id === itemId && c.uniqueIdd === uniqueIdd) {
        c.quantityPurchased = +qty || 1;
        c.itemLinePrice =
          c.itemUnitPrice * (+qty || 1) -
          (c.itemUnitPrice * (+qty || 1) * c.discountPercent) / 100;
      }
      return c;
    });

    // If in edit mode, also update backend
    if (saleName === "edit" && salesId) {
      const cartItem = cartItems?.find(
        (c) => c.id === itemId && c.uniqueIdd === uniqueIdd
      );
      if (cartItem && cartItem.saleItemId) {
        try {
          await clientAdapter.editSaleItem(salesId, cartItem.saleItemId, {
            quantity: +qty || 1,
          });
        } catch (error) {
          console.error("Failed to update quantity in backend:", error);
          setSnackBar({
            open: true,
            severity: "error",
            message: "Failed to update quantity. Please try again.",
          });
        }
      }
    }

    if (itemId === 291) {
      const itemDiscount = cartItems.filter(
        (item) => item?.type === "discount"
      );
      const itemQty = itemDiscount[0].itemCostPrice * qty;
      updateEntireSaleDiscount(itemQty);
    }

    refreshCart(updatedCartItems, salePaymentMethods);
    additemsToLocalStorage(updatedCartItems, salePaymentMethods);
  };

  const updateAmountInput = async (itemId, uniqueIdd, price) => {
    // Update local state first
    cartItems?.map((c) => {
      if (c.id === itemId && c.uniqueIdd === uniqueIdd) {
        c.itemCostPrice = price;
        c.itemUnitPrice = price;
        c.itemLinePrice = c.itemUnitPrice * c.quantityPurchased;
      }
    });

    // If in edit mode, also update backend
    if (saleName === "edit" && salesId) {
      const cartItem = cartItems?.find(
        (c) => c.id === itemId && c.uniqueIdd === uniqueIdd
      );
      if (cartItem && cartItem.saleItemId) {
        try {
          await clientAdapter.editSaleItem(salesId, cartItem.saleItemId, {
            price: price,
            costPrice: price,
          });
        } catch (error) {
          console.error("Failed to update price in backend:", error);
          setSnackBar({
            open: true,
            severity: "error",
            message: "Failed to update price. Please try again.",
          });
        }
      }
    }

    if (itemId === 291) {
      const itemAmount = cartItems.filter((item) => item?.type === "discount");
      const itemAmt = itemAmount[0].itemCostPrice;
      updateEntireSaleDiscount(itemAmt);
    }

    additemsToLocalStorage([...cartItems], salePaymentMethods);
    refreshCart([...cartItems], salePaymentMethods);
  };

  const updateItemDiscount = async (itemId, uniqueIdd, discount) => {
    const updatedCartItems = cartItems?.map((c) => {
      if (
        c.id === itemId &&
        c.uniqueIdd === uniqueIdd &&
        c.type !== "discount"
      ) {
        // Only allow discount on service items, but exclude gift cards and family cards
        const canApplyDiscount =
          c._isService && c.type !== "giftCard" && c.type !== "familyCard";
        const finalDiscount = canApplyDiscount ? +discount : 0;
        c.discountPercent = finalDiscount;
        c.itemLinePrice =
          c.itemUnitPrice * c.quantityPurchased -
          (c.itemUnitPrice * c.quantityPurchased * finalDiscount) / 100;
      }
      return c;
    });

    // If in edit mode, also update backend
    if (saleName === "edit" && salesId) {
      const cartItem = cartItems?.find(
        (c) =>
          c.id === itemId && c.uniqueIdd === uniqueIdd && c.type !== "discount"
      );
      if (cartItem && cartItem.saleItemId) {
        try {
          await clientAdapter.editSaleItem(salesId, cartItem.saleItemId, {
            discount: +discount,
          });
        } catch (error) {
          console.error("Failed to update discount in backend:", error);
          setSnackBar({
            open: true,
            severity: "error",
            message: "Failed to update discount. Please try again.",
          });
        }
      }
    }

    refreshCart(updatedCartItems, salePaymentMethods);
    additemsToLocalStorage(updatedCartItems, salePaymentMethods);
  };

  const updateTechnician = async (itemId, uniqueIdd, technicianId) => {
    // Update local state first
    cartItems.map((c) => {
      if (c.id === itemId && c.uniqueIdd === uniqueIdd) {
        c.serviceEmployeeId = technicianId;
      }
    });

    // If in edit mode, also update backend
    if (saleName === "edit" && salesId) {
      const cartItem = cartItems?.find(
        (c) => c.id === itemId && c.uniqueIdd === uniqueIdd
      );
      if (cartItem && cartItem.saleItemId) {
        try {
          await clientAdapter.editSaleItem(salesId, cartItem.saleItemId, {
            serviceEmployeeId: technicianId,
          });
        } catch (error) {
          console.error("Failed to update technician in backend:", error);
          setSnackBar({
            open: true,
            severity: "error",
            message: "Failed to update technician. Please try again.",
          });
        }
      }
    }

    additemsToLocalStorage([...cartItems], salePaymentMethods);
    refreshCart([...cartItems], salePaymentMethods);
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
    additemsToLocalStorage([...cartItems], salePaymentMethods);
    refreshCart([...cartItems], salePaymentMethods);
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
    additemsToLocalStorage([...cartItems], salePaymentMethods);
    refreshCart([...cartItems], salePaymentMethods);
  };

  const handleSelectCustomer = (customer) => {
    setSelectCustomer(customer);
    setCustSaleId(customer.person.id);
    setOpen(!open);
    setCustomer(null);
    refreshCart([...cartItems], salePaymentMethods);
    localStorage.setItem("yuppos_selected_customer", JSON.stringify(customer));
  };

  const handlePaymentMethod = (name) => {
    masterPaymentMethods.map((m) => {
      if (m.name === name) {
        m.selected = true;
      } else {
        m.selected = false;
      }
    });
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

  // Total service minutes in the cart, summed from each line's `size`
  // (service duration). Used to deduct from a time-based family card.
  const getCartServiceMinutes = () => {
    return cartItems.reduce((sum, i) => sum + (Number(i.size) || 0), 0);
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
    const personId = selectedCustomer?.person?.id;
    const res = await clientAdapter.validateCoupon(couponNumber, personId, cartTotal);
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
    const personId = selectedCustomer?.person?.id;

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
      const fcard = familycardExist?.familycards?.[0];
      if (fcard && fcard.person?.id === personId && !fcard.inactive) {
        const isTimeBased = Number(fcard.isTimeBased) === 1;
        if (isTimeBased) {
          // Time-based card: it pays for the cart's services in MINUTES.
          const requiredMinutes = getCartServiceMinutes();
          const availableMinutes = Number(fcard.serviceTime) || 0;
          if (requiredMinutes <= 0) {
            setSnackBar({
              open: true,
              severity: "error",
              message:
                "Add a service to the cart before redeeming a time-based family card.",
            });
            return null;
          }
          if (availableMinutes < requiredMinutes) {
            setSnackBar({
              open: true,
              severity: "error",
              message: `Family card has ${availableMinutes} min left but the cart needs ${requiredMinutes} min.`,
            });
            return null;
          }
          const redeemValue = Number(amountTendered) || 0;
          const d = {
            ...cardNumber,
            familyCard: {
              id: fcard.id,
              number: fcard.familycardNumber,
              redeemValue,
              cNumber: fcard.familycardNumber,
              isTimeBased: 1,
              redeemMinutes: requiredMinutes,
            },
          };
          window.localStorage.setItem("yumpos_card_number", JSON.stringify(d));
          setCardNumber(d);
          return redeemValue;
        }
        // Monetary card (existing behaviour).
        const updatedAmount = await deductAmountFromCard(
          amountTendered,
          fcard.value
        );
        const d = {
          ...cardNumber,
          familyCard: {
            id: fcard.id,
            number: fcard.familycardNumber,
            redeemValue: updatedAmount,
            cNumber: fcard.familycardNumber,
            isTimeBased: 0,
            redeemMinutes: 0,
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
            "Family card does not exist or is inactive. Please enter a valid family card.",
        });
        return null;
      }
    }
    if (selectedPaymentMethod.name === "Coupon") {
      const couponResult = await checkCouponsExists(cardNumber.cupon.number);
      console.log("DEBUG: Coupon validation result:", couponResult);
      if (couponResult.valid && couponResult.coupon) {
        const coupon = couponResult.coupon;
        console.log("DEBUG: Coupon details - couponOption:", coupon.couponOption, "value:", coupon.value);
        // Calculate coupon value based on type (percentage or fixed)
        let couponValue = coupon.value;
        if (coupon.couponOption === "percentage") {
          // For percentage coupons, calculate discount from cart total
          couponValue = (cartTotal * coupon.value) / 100;
          console.log("DEBUG: Percentage coupon - calculated value:", couponValue, "from cartTotal:", cartTotal);
        }
        const updatedAmount = await deductAmountFromCard(
          amountTendered,
          couponValue
        );
        console.log("DEBUG: deductAmountFromCard returned:", updatedAmount);
        const d = {
          ...cardNumber,
          cupon: {
            id: coupon.id,
            number: coupon.couponNumber,
            redeemValue: updatedAmount || 0,
            cNumber: coupon.couponNumber,
            couponOption: coupon.couponOption,
          },
        };
        window.localStorage.setItem(
          "yumpos_card_number",
          JSON.stringify(d)
        );

        setCardNumber(d);
        return updatedAmount;
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: couponResult.error || "Coupon does not exist. Please enter a valid coupon.",
        });
        return null;
      }
    }
    if (selectedPaymentMethod.name === "Points") {
      const point = selectedCustomer?.points;

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

  const handleAddPayment = async () => {
    if (!completeSaleBtnText.complete) {
      const selectedPaymentMethod = paymentMethods.filter((p) => p.selected)[0];
      if (selectedPaymentMethod && amountTendered) {
        // Compare using rounded values to avoid floating point issues
        const dueRounded = roundTo2(cartAmountDue);
        const tenderRounded = roundTo2(amountTendered);
        if (tenderRounded <= dueRounded) {
          let paymentDetails;

          if (checkIfCard(selectedPaymentMethod)) {
            const cardValue = await handleIfCardExists(
              selectedPaymentMethod,
              amountTendered
            );
            if (cardValue) {
              paymentDetails = {
                paymentType: selectedPaymentMethod.name,
                paymentAmount: parseFloat(cardValue),
              };
            } else if (
              cardValue === 0 &&
              selectedPaymentMethod.name === "Coupon"
            ) {
              paymentDetails = {
                paymentType: selectedPaymentMethod.name,
                paymentAmount: parseFloat(cardValue),
              };
            } else {
              paymentDetails = null;
            }
          } else {
            paymentDetails = {
              paymentType:
                selectedPaymentMethod.name === "Google Pay"
                  ? "GooglePay"
                  : selectedPaymentMethod.name,
              paymentAmount: parseFloat(amountTendered),
            };
          }

          const payArray = paymentDetails
            ? [...salePaymentMethods, { ...paymentDetails }]
            : [...salePaymentMethods];

          payArray.map((p, i) => {
            p.key = i;
          });
          setCardNumber({
            giftCard: { ...cardNumber.giftCard, number: "" },
            familyCard: { ...cardNumber.familyCard, number: "" },
            cupon: { ...cardNumber.cupon, number: "" },
            points: { ...cardNumber.points, number: "" },
          });
          additemsToLocalStorage([...cartItems], payArray);
          refreshCart([...cartItems], payArray);
        } else {
          setSnackBar({
            open: true,
            severity: "error",
            message: `Amount tendered cannot be greater than amount due`,
          });
        }
      }
    } else {
      const employeeMissing = cartItems.some((sem) => {
        if (
          (sem.type === "item" ||
            sem.type === "giftCard" ||
            sem.type === "familyCard") &&
          sem.serviceEmployeeId !== 0
        ) {
          return false;
        }

        if (sem.type === "itemkit" && Array.isArray(sem.itemkitItems)) {
          const redeemedItemsWithoutTechnician = sem.itemkitItems.some(
            (kitItem) => kitItem.redeemed && !kitItem.serviceEmployeeId
          );
          return redeemedItemsWithoutTechnician;
        }
        return false;
      });

      if (employeeMissing) {
        setSnackBar({
          open: true,
          severity: "error",
          message: `Please select Items and make sure Technician is selected for every Product(s)/Service(s) added in Cart!`,
        });
        return;
      } else {
        if (
          salesId &&
          (saleName === "complete" ||
            saleName === "unsuspend" ||
            saleName === "edit")
        ) {
          completeSaleForAppointmentAndSuspend();
        } else {
          const _sale = "complete";
          const createSale = await completeSale(_sale);
          if (createSale && createSale.id) {
            if (
              checkifCardReedemed()?.GiftCard ||
              checkifCardReedemed()?.FamilyCard ||
              checkifCardReedemed()?.Coupon ||
              checkifCardReedemed()?.Points
            ) {
              const rres = await reedemCard(createSale.id);
              if (!rres?.statusCode) {
                cancelSale();
                // navigate(`/sales/receipt?saleId=${createSale.id}`);
                window.open(
                  `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${createSale.id}`,
                  "_blank"
                );
                window.location.reload();
              }
            } else {
              cancelSale();
              // navigate(`/sales/receipt?saleId=${createSale.id}`);
              window.open(
                `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${createSale.id}`,
                "_blank"
              );
              window.location.reload();
            }
          } else {
            setSnackBar({
              open: true,
              severity: "error",
              message: `Error in creating Sale, Please contact YumPOS Support!`,
            });
          }
        }
      }
    }
  };

  const containsSpecificPaymentType = (type) =>
    salePaymentMethods.some((payment) => payment.paymentType === type);

  const checkifCardReedemed = () => {
    const paymentTypesToCheck = [
      "Gift Card",
      "Family Card",
      "Coupon",
      "Points",
    ];

    const paymentTypePresence = paymentTypesToCheck.reduce((result, type) => {
      result[type.replace(" ", "")] = containsSpecificPaymentType(type);
      return result;
    }, {});
    return paymentTypePresence;
  };

  const reedemCard = async (saleId) => {
    const cn = JSON.parse(localStorage.getItem("yumpos_card_number"));
    console.log(cn);
    let res;
    if (checkifCardReedemed()?.GiftCard) {
      const data = {
        saleId: String(saleId),
        giftcardNumber: cn.giftCard.cNumber,
        redeemValue: Number(cn.giftCard.redeemValue),
      };
      res = await clientAdapter.redeemGiftCards(cn.giftCard.id, data);
    }
    if (checkifCardReedemed()?.FamilyCard) {
      const data = {
        saleId: String(saleId),
        familyCardNumber: cn.familyCard.cNumber,
        redeemValue: Number(cn.familyCard.redeemValue),
        customerId: selectedCustomer?.person?.id,
      };
      // Time-based cards deduct minutes (service_time), not rupees.
      if (Number(cn.familyCard.isTimeBased) === 1) {
        data.redeemMinutes = Number(cn.familyCard.redeemMinutes) || 0;
      }
      res = await clientAdapter.redeemFamilyCards(cn.familyCard.id, data);
    }
    if (checkifCardReedemed()?.Coupon) {
      const data = {
        couponNumber: cn.cupon.cNumber,
        redeemValue: Number(cn.cupon.redeemValue),
        customerId: selectedCustomer?.person?.id,
        billTotal: cartTotal,
      };
      console.log("DEBUG: Redeeming coupon with data:", data);
      console.log("DEBUG: Full coupon info from localStorage:", cn.cupon);
      res = await clientAdapter.redeemCoupons(cn.cupon.id, data);
      console.log("DEBUG: Coupon redemption response:", res);
    }
    return res;
  };

  const handleSelect = (e) => {
    setDescription(e.target.value);
  };

  const removeSalePaymentMethod = (s) => {
    remove(salePaymentMethods, (p) => {
      return p.key === s.key;
    });
    additemsToLocalStorage([...cartItems], salePaymentMethods);
    refreshCart([...cartItems], salePaymentMethods);
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
        let res;
        if (saleName === "edit") {
          res = await clientAdapter.deleteItemFromCompletedSale(
            salesId,
            deletedItem.id
          );
        } else {
          res = await clientAdapter.deleteItemFromSuspendSale(
            salesId,
            deletedItem.id
          );
        }
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

      let res;
      if (saleName === "unsuspend") {
        res = await clientAdapter.addItemToSuspendSale(salesId, payload);
      } else if (saleName === "edit") {
        res = await clientAdapter.addItemToCompletedSale(salesId, payload);
      } else {
        res = await clientAdapter.addItemToAppointmentSale(salesId, payload);
      }
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
          : saleName === "edit"
          ? await clientAdapter.addItemKitToSuspendSale(salesId, payload) // Use same API for now
          : await clientAdapter.addItemKitToAppointmentSale(salesId, payload);
      if (res?.status === 201) {
        itemKitsSuccess = true;
      }
    } else {
      itemKitsSuccess = true;
    }
    return itemsSuccess && itemKitsSuccess;
  };

  const completeSaleForAppointmentAndSuspend = async () => {
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
        message: `Error in updating Sale, Please contact YumPOS Support!`,
      });
      return;
    }

    const payments = salePaymentMethods?.map((i) => ({
      paymentType: i.paymentType,
      paymentAmount: i.paymentAmount,
    }));

    const appointmentPayload = {
      payments: payments,
      saleTime: moment().format(),
    };

    if (
      checkifCardReedemed()?.GiftCard ||
      checkifCardReedemed()?.FamilyCard ||
      checkifCardReedemed()?.Coupon ||
      checkifCardReedemed()?.Points
    ) {
      const rres = await reedemCard(salesId);
    }

    let res;
    if (saleName === "unsuspend") {
      res = await clientAdapter.completeSuspendSaleBySaleId(
        salesId,
        appointmentPayload
      );
    } else if (saleName === "edit") {
      // For edit mode, use the new edit completed sale endpoint
      const editData = {
        saleTime: date, // Use current date state instead of appointmentPayload
        comment: commentText, // Use current comment state instead of appointmentPayload
        payments: appointmentPayload.payments,
      };
      res = await clientAdapter.editCompletedSale(salesId, editData);
    } else {
      res = await clientAdapter.completeAppointmentSaleBySaleId(
        salesId,
        appointmentPayload
      );
    }

    if (res?.status === 200 || res?.status === 201 || res?.id || res?.success) {
      cancelSale();

      if (saleName === "edit") {
        // For edit mode, show success message and reset to normal sales page
        setSnackBar({
          open: true,
          severity: "success",
          message: "Sale updated successfully!",
        });
        // Clear edit mode parameters and reload to reset to normal sales page
        window.history.replaceState({}, document.title, "/sales");
        // Give delay to show the snackbar before reloading
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        // For new sales, open receipt as usual
        // navigate(`/sales/receipt?saleId=${salesId}`);
        window.open(
          `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${salesId}`,
          "_blank"
        );
        window.location.reload();
      }
    }
  };

  const completeSale = async (_sale) => {
    const endPoint =
      _sale === "new_appointment" ? "salesAppointment" : "completeSale";

    if (!selectedCustomer) {
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
    const customerId = selectedCustomer?.person?.id || selectedCustomer?.id;
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
            isService: i._isService,
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
                  amount: taxAmount,
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
              isTimeBased: i.isTimeBased ? 1 : 0,
              serviceTime: i.isTimeBased ? Number(i.serviceTime) || 0 : null,
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

    const payments = salePaymentMethods?.map((i) => ({
      paymentType: i.paymentType,
      paymentAmount: i.paymentAmount,
    }));

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
      showCommentOnReceipt: commentCheckbox,
      items: sitems.flat(),
      suspended:
        _sale === "suspend"
          ? 1
          : _sale === "new_appointment"
          ? 3
          : isAllreedemed
          ? 0
          : 4,
      saleTime: new Date(date),
    };

    if (_sale !== "new_appointment") {
      saleBody.payments = payments;
    }

    setBackdrop(true);
    console.log(saleBody);
    const res = await clientAdapter[endPoint](saleBody);
    setBackdrop(false);
    if (
      res?.stockWarnings &&
      Array.isArray(res.stockWarnings) &&
      res.stockWarnings.length > 0
    ) {
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
      // navigate(`/sales/receipt?saleId=${Number(salesId)}`);
      window.open(
        `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${salesId}`,
        "_blank"
      );
      window.location.reload();
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
      // navigate(`/sales/receipt?saleId=${createSale.id}`);
      window.open(
        `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${createSale.id}`,
        "_blank"
      );
      setCompleteSaleBtnText({
        text: "Complete Sale",
        complete: false,
      });
      cancelSale();
      window.location.reload();
    }, 1000);
  };

  const handleBookAppointment = async () => {
    let changeAppointmentPayload;
    if (appointmentDateAndTime === "") {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Please select a date and time`,
      });
      return;
    }

    const employeeMissing = cartItems.some((sem) => {
      if (
        (sem.type === "item" ||
          sem.type === "giftCard" ||
          sem.type === "familyCard") &&
        sem.serviceEmployeeId === 0
      ) {
        return true;
      }

      if (sem.type === "itemkit" && Array.isArray(sem.itemkitItems)) {
        const redeemedItemsWithoutTechnician = sem.itemkitItems.some(
          (kitItem) => kitItem.redeemed && !kitItem?.serviceEmployeeId
        );
        return redeemedItemsWithoutTechnician;
      }
      return false;
    });

    if (employeeMissing) {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Please select Items and make sure Technician is selected for every Product(s)/Service(s) added in Cart!`,
      });
      return;
    } else {
      const aTime = moment(appointmentDateAndTime).format(
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
      );

      if (salesId && changeAppointmentId) {
        //change appointment
        if (saleName === "changeAppointment" && salesId) {
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
              message: `Error in updating Sale, Please contact YumPOS Support!`,
            });
            return;
          }
        }

        changeAppointmentPayload = {
          appointmentTime: aTime,
          saleId: Number(salesId),
        };
        const appointmentRes = await clientAdapter.updateAppointment(
          changeAppointmentId,
          changeAppointmentPayload
        );
        if (
          appointmentRes === 201 ||
          appointmentRes?.id ||
          appointmentRes === 200
        ) {
          showRes({ id: Number(salesId) });
        } else {
          setSnackBar({
            open: true,
            severity: "error",
            message: `Something went wrong. Please contact YumPOS Support!`,
          });
        }
      } else {
        // create appointment
        const _sale = "new_appointment";

        const employees = cartItems.map((c) => c.serviceEmployeeId);

        const data = {
          requiredtime: aTime,
          employeeIds: employees,
        };

        const res = await clientAdapter.checkAppointmentAvailability(data);
        if (res.status === "not_available") {
          const employeesNotAvailable = res.employeeIds;

          const unavailableEmployees = employeesNotAvailable.map(
            (employeeId) => {
              const employee = technicians.find(
                (emp) => emp.employeeId === employeeId
              );

              // Construct the employee name and number
              return {
                id: employee?.employeeId || employeeId,
                name: employee?.person.firstName.trim() || "Unknown",
                number: employee?.person.phoneNumber || "N/A",
              };
            }
          );

          const modalBody = (
            <div>
              <h3>Unavailable Employees</h3>
              <ul>
                {unavailableEmployees.map((employee) => (
                  <li key={employee.id}>
                    {employee.name} ({employee.number})
                  </li>
                ))}
              </ul>
              <p>Would you like to continue anyway?</p>
              <button
                onClick={async () => {
                  await handleContinueAnyway(aTime);
                  setShowModal(false);
                }}
              >
                Continue Anyway
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          );
          setModalContent(modalBody);
          setShowModal(true);
          return;
        }

        const createSale = await completeSale(_sale);
        if (createSale && createSale.id) {
          const appointmentPayload = {
            saleId: createSale.id,
            appointmentTime: aTime,
            createdBy: createSale.employeeId,
          };
          const appointmentRes = await clientAdapter.createAppointment(
            appointmentPayload
          );
          if (appointmentRes === 201) {
            showRes(createSale);
          } else {
            setSnackBar({
              open: true,
              severity: "error",
              message: `Error in creating appointment, Please contact YumPOS Support!`,
            });
          }
        } else {
          setSnackBar({
            open: true,
            severity: "error",
            message: `Something went wrong. Please contact YumPOS Support!`,
          });
        }
      }
    }
  };

  const handleContinueAnyway = async (aTime) => {
    // create appointment
    const _sale = "new_appointment";

    const createSale = await completeSale(_sale);
    if (createSale && createSale.id) {
      const appointmentPayload = {
        saleId: createSale.id,
        appointmentTime: aTime,
        createdBy: createSale.employeeId,
      };
      const appointmentRes = await clientAdapter.createAppointment(
        appointmentPayload
      );
      if (appointmentRes === 201) {
        showRes(createSale);
      } else {
        setSnackBar({
          open: true,
          severity: "error",
          message: `Error in creating appointment, Please contact YumPOS Support!`,
        });
      }
    } else {
      setSnackBar({
        open: true,
        severity: "error",
        message: `Something went wrong. Please contact YumPOS Support!`,
      });
    }
  };

  const updateAllItemsDiscount = (discount) => {
    if (discount) {
      cartItems.map((c) => {
        // Only apply discount to service items, but exclude gift cards and family cards
        if (c._isService && c.type !== "giftCard" && c.type !== "familyCard") {
          updateItemDiscount(c.id, c.uniqueIdd, discount);
        } else {
          // Override/remove any existing discounts on retail items, gift cards, and family cards
          updateItemDiscount(c.id, c.uniqueIdd, 0);
        }
      });
      setAllItemsDiscount(discount);
    }
  };

  const updateEntireSaleDiscount = (discount) => {
    if (!discount) {
      removeItemFromCart({ id: 291 });
      return setEntireSaleDiscount(null);
    }

    const discountPrice = Number(discount);
    setEntireSaleDiscount(discountPrice);

    const discountAmount = calculateTotalAmount(discountPrice);

    const cartitem = {
      itemId: 291,
      value: discount,
      type: "discount",
      costPrice: Number(discountAmount),
      unitPrice: Number(discountAmount),
    };
    addItemToCart(cartitem);
  };

  const calculateTotalAmount = (amount, ftotal) => {
    const total = Number(amount);

    return +total;
  };

  const calculateBasePrice = (unitPrice, itemTaxes, isService = true) => {
    const locationTaxData = getLocationTaxData();
    const taxConfig = getTaxConfiguration(locationTaxData);
    return calculateBasePriceUtil(unitPrice, itemTaxes, taxConfig, isService);
  };

  const refreshCart = (cartItems, salePaymentMethods, taxRate, adPayment) => {
    const taxes = [];
    const _taxRates = locationTaxDetails || taxRate || null;

    if (salePaymentMethods && salePaymentMethods.length > 0) {
      setSalePaymentMethods([...salePaymentMethods]);
    }

    // Ensure cartItems is always an array
    const safeCartItems = cartItems || [];
    setCartItems(safeCartItems);

    let subtotal = safeCartItems
      .filter((i) => i.type !== "discount")
      .reduce((acc, item) => {
        const itemPrice =
          (_taxRates && _taxRates[0]?.rate
            ? item._taxIncluded
              ? calculateBasePrice(
                  item.itemUnitPrice,
                  item.itemTaxes,
                  item._isService
                )
              : item.itemUnitPrice
            : item.itemUnitPrice) * item.quantityPurchased;

        return acc + itemPrice;
      }, 0);

    let totalDiscount = cartItems
      .filter((i) => i.type !== "discount")
      .reduce((acc, item) => {
        // Only calculate discount for service items, but exclude gift cards and family cards
        if (
          !item._isService ||
          item.type === "giftCard" ||
          item.type === "familyCard"
        ) {
          return acc;
        }

        const itemPrice =
          (_taxRates && _taxRates[0]?.rate
            ? item._taxIncluded
              ? calculateBasePrice(
                  item.itemUnitPrice,
                  item.itemTaxes,
                  item._isService
                )
              : item.itemUnitPrice
            : item.itemUnitPrice) * item.quantityPurchased;

        const discountedPrice = itemPrice * (item.discountPercent / 100);
        return acc + discountedPrice;
      }, 0);

    let discountedSubtotal = subtotal - totalDiscount;

    // Calculate service items subtotal for entire sale discount calculation
    // For tax-inclusive items, use the tax-inclusive price (not base price) for discount calculation
    const serviceItemsSubtotal = cartItems
      .filter(
        (i) =>
          i.type !== "discount" &&
          i._isService &&
          i.type !== "giftCard" &&
          i.type !== "familyCard"
      )
      .reduce((acc, item) => {
        // Use tax-inclusive price for tax-inclusive items, regular price for others
        const itemPrice = item.itemUnitPrice * item.quantityPurchased;

        // Subtract any individual item discounts already applied to service items
        const itemDiscount = itemPrice * (item.discountPercent / 100);
        return acc + (itemPrice - itemDiscount);
      }, 0);

    const fTotal = discountedSubtotal;

    // Store the entire sale discount amount for later application - only on service items
    // entireSaleDiscount is a fixed amount in Rupees, not a percentage
    let entireSaleDiscountAmount = 0;
    if (entireSaleDiscount && serviceItemsSubtotal > 0) {
      // Use the discount as a fixed amount, but cap it at the service items subtotal
      entireSaleDiscountAmount = Math.min(
        Number(entireSaleDiscount),
        serviceItemsSubtotal
      );
      setEntireSaleDiscountAmount(entireSaleDiscountAmount);
    }

    // Calculate the final subtotal that will be displayed
    // Apply the entire sale discount as a percentage to the base price
    let finalSubTotal = discountedSubtotal;
    if (entireSaleDiscountAmount > 0 && serviceItemsSubtotal > 0) {
      const discountPercentage = (entireSaleDiscountAmount / serviceItemsSubtotal) * 100;
      finalSubTotal = discountedSubtotal * (1 - discountPercentage / 100);
    }

    setCartSubTotal(finalSubTotal);
    setItems([]);

    // Calculate tax on subtotal AFTER applying entire sale discount
    // This ensures taxes are calculated on the correct discounted amount
    const locationTaxData = getLocationTaxData();
    const taxConfig = getTaxConfiguration(locationTaxData);

    // Apply entire sale discount to items for correct tax calculation
    let itemsForTaxCalculation = safeCartItems;
    if (entireSaleDiscountAmount > 0 && serviceItemsSubtotal > 0) {
      // Calculate the discount percentage to apply to each service item
      const discountPercentage =
        (entireSaleDiscountAmount / serviceItemsSubtotal) * 100;

      // Create modified cart items with entire sale discount applied to service items only
      itemsForTaxCalculation = safeCartItems.map((item) => {
        if (
          item._isService &&
          item.type !== "giftCard" &&
          item.type !== "familyCard" &&
          item.type !== "discount"
        ) {
          // Combine individual item discount with entire sale discount
          // Formula: finalDiscount = 1 - (1 - itemDiscount/100) * (1 - saleDiscount/100)
          const itemDiscountFactor = 1 - (item.discountPercent || 0) / 100;
          const saleDiscountFactor = 1 - discountPercentage / 100;
          const combinedDiscountFactor =
            itemDiscountFactor * saleDiscountFactor;
          const combinedDiscountPercent = (1 - combinedDiscountFactor) * 100;

          return {
            ...item,
            discountPercent: combinedDiscountPercent,
          };
        }
        return item;
      });
    }

    const dynamicTaxes = calculateCartTaxes(
      itemsForTaxCalculation,
      taxConfig,
      fTotal
    );

    // if (removeTax) {
    //   dynamicTaxes.forEach(tax => tax.total = 0);
    // }
    setCartTaxes(dynamicTaxes);

    // Calculate cart total with tax (entire sale discount already factored into both subtotal and tax calculation)
    const totalTaxAmount = dynamicTaxes.reduce(
      (sum, tax) => sum + tax.total,
      0
    );
    // Use finalSubTotal (which already has discount applied) instead of fTotal
    const cartTotal = roundTo2(finalSubTotal + totalTaxAmount);

    setCartTotal(cartTotal);

    const safeSalePaymentMethods = salePaymentMethods || [];
    const paidTotal = safeSalePaymentMethods.reduce((total, payment) => {
      return total + parseFloat(payment.paymentAmount);
    }, 0);

    const amountDue = roundTo2(Math.abs(cartTotal - paidTotal));
    setCartAmountDue(amountDue);
    setAmountTendered(amountDue.toFixed(2));

    const serviceEmployeeMissing = safeCartItems.some((item) => {
      if (
        (item.type === "item" || item.type === "discount") &&
        item.serviceEmployeeId === 0
      ) {
        return true;
      }
      if (
        (item.type === "giftCard" || item.type === "familyCard") &&
        item.serviceEmployeeId === 0
      ) {
        return true;
      }

      if (item.type === "itemkit" && Array.isArray(item.itemkitItems)) {
        const redeemedItemsWithoutTechnician = item.itemkitItems.some(
          (kitItem) => kitItem.redeemed && !kitItem?.serviceEmployeeId
        );
        return redeemedItemsWithoutTechnician;
      }

      return false;
    });

    if (cartItems.length && !serviceEmployeeMissing) {
      setShowComplete(true);
    } else {
      setShowComplete(false);
    }

    // Use tolerance for floating point comparison to handle rounding issues
    const tolerance = 0.01; // 1 cent tolerance
    if (Math.abs(Number(amountDue) - Number(finalTotal)) < tolerance) {
      setCompleteSaleBtnText({
        text: "Complete Sale",
        complete: true,
      });
    } else {
      setCompleteSaleBtnText({
        text: "Add Payment",
        complete: false,
      });
    }
  };

  useEffect(() => {
    if (selectedCustomer?.loyaltyCardNumber && allItemsDiscount === 0) {
      updateAllItemsDiscount(selectedCustomer?.loyaltyCardDiscount);
    }
  }, [
    selectedCustomer?.loyaltyCardNumber,
    selectedCustomer?.loyaltyCardDiscount,
    cartItems,
  ]);

  useEffect(() => {
    if (entireSaleDiscount === undefined) {
      setEntireSaleDiscount(null);
      return;
    }
    refreshCart(cartItems, salePaymentMethods);
  }, [entireSaleDiscount]);

  useEffect(() => {
    const changeAppointmentTime = queryParameters.get("appointmentTime");
    if (changeAppointmentTime) {
      const inputFormat = "YYYY-MM-DDTHH:mm:ss.SSSZ";
      const utcTime = moment.utc(changeAppointmentTime, inputFormat);
      setAppointmentDateAndTime(moment(utcTime).format("YYYY-MM-DDTHH:mm"));
    }
    if (changeAppointmentId) {
      setAppointment(true);
    }
    if (salesId) {
      AppointmentDetails(salesId);
    } else {
      getTechnicians(locationId.locationId);
    }
  }, []);

  useEffect(() => {
    if (mobile && Appointment) {
      const getAppointmentInfo = async () => {
        const res = await clientAdapter.getCustomerPhone(mobile);
        if (res) {
          setSelectCustomer(res);
          setOpen(!open);
          setAppointment(!appointment);
        }
      };
      getAppointmentInfo();
    }
  }, []);

  // Handle edit mode - load existing sale data
  useEffect(() => {
    if (saleName === "edit" && salesId) {
      const loadSaleForEdit = async () => {
        try {
          setLoading(true);
          const saleData = await clientAdapter.getSaleDetails(salesId);
          console.log(saleData);

          if (saleData) {
            // Set customer if exists
            if (saleData.customer) {
              setSelectCustomer(saleData.customer);
            }

            // Set comments
            if (saleData.comment) {
              setCommentText(saleData.comment.replace("V2 - ", ""));
            }

            // Convert sale items to cart format
            const cartItemsFromSale = [];

            // Process sale items
            if (saleData.saleItems && saleData.saleItems.length > 0) {
              saleData.saleItems.forEach((saleItem) => {
                const cartItem = {
                  id: saleItem.id,
                  saleItemId: saleItem.id,
                  itemId: saleItem.item?.id || saleItem.id,
                  name: saleItem.item?.name || saleItem.description,
                  category: saleItem.item?.category?.name || "",
                  unit_price: parseFloat(saleItem.itemUnitPrice || 0),
                  cost_price: parseFloat(saleItem.itemCostPrice || 0),
                  quantity: parseFloat(saleItem.quantityPurchased || 1),
                  discount_percent: parseFloat(saleItem.discountPercent || 0),
                  total: parseFloat(saleItem.itemTotal || 0),
                  description: saleItem.description || "",
                  serialnumber: saleItem.serialnumber || "",
                  service_employee: saleItem.serviceEmployeeId || null,
                  taxes: saleItem.taxes || [],
                  type: "item",
                  isEditing: true, // Flag to indicate this is from an existing sale
                };
                cartItemsFromSale.push(cartItem);
              });
            }

            // Process sale item kits
            if (saleData.saleItemkit && saleData.saleItemkit.length > 0) {
              saleData.saleItemkit.forEach((saleItemKit) => {
                const cartItemKit = {
                  id: saleItemKit.id,
                  saleItemKitId: saleItemKit.id,
                  itemKitId: saleItemKit.itemkit?.id || saleItemKit.id,
                  name: saleItemKit.itemkit?.name || "Item Kit",
                  category: saleItemKit.itemkit?.category?.name || "",
                  unit_price: parseFloat(saleItemKit.itemKitUnitPrice || 0),
                  cost_price: parseFloat(saleItemKit.itemKitCostPrice || 0),
                  quantity: parseFloat(saleItemKit.quantityPurchased || 1),
                  discount_percent: parseFloat(
                    saleItemKit.discountPercent || 0
                  ),
                  total: parseFloat(saleItemKit.itemKitTotal || 0),
                  taxes: saleItemKit.taxes || [],
                  type: "itemkit",
                  isEditing: true,
                };
                cartItemsFromSale.push(cartItemKit);
              });
            }

            setCartItems(cartItemsFromSale);
            setPrevCartItems([...cartItemsFromSale]);

            // Set sale date if available
            if (saleData.saleTime) {
              setDate(new Date(saleData.saleTime));
            }

            // Set up payment methods from existing sale
            if (saleData.salePayments && saleData.salePayments.length > 0) {
              const existingPayments = saleData.salePayments.map(
                (payment, index) => ({
                  key: index,
                  paymentType: payment.paymentType,
                  paymentAmount: parseFloat(payment.paymentAmount || 0),
                })
              );
              setSalePaymentMethods(existingPayments);

              // Update payment methods to show which ones are selected
              setPaymentMethods((prevPaymentMethods) => {
                console.log(
                  "🔍 Edit Mode - Previous Payment Methods:",
                  prevPaymentMethods
                );
                const updatedMethods = prevPaymentMethods.map((method) => {
                  const hasPayment = existingPayments.some(
                    (p) => p.paymentType === method.name
                  );
                  console.log(
                    `🔍 Edit Mode - Checking ${method.name}: hasPayment=${hasPayment}`
                  );
                  return {
                    ...method,
                    selected: hasPayment,
                  };
                });
                console.log(
                  "🔍 Edit Mode - Updated Payment Methods:",
                  updatedMethods
                );
                return updatedMethods;
              });
            } else {
              console.log("🔍 Edit Mode - No payments found in sale data");
            }

            // Mark as suspended sale for editing
            setSaleIsSuspended({
              wasAppointment: false,
              suspended: 0, // Completed sale
              isEdit: true,
            });

            // Refresh cart with items only (payments already set above)
            setTimeout(() => {
              refreshCart(cartItemsFromSale, null);
            }, 100);

            setSnackBar({
              open: true,
              severity: "success",
              message: "Sale loaded for editing",
            });
          }
        } catch (error) {
          console.error("Error loading sale for edit:", error);
          setSnackBar({
            open: true,
            severity: "error",
            message: "Failed to load sale data",
          });
        } finally {
          setLoading(false);
        }
      };

      loadSaleForEdit();
    }
  }, [saleName, salesId]);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Unavailable Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
      </Modal>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
      <hr />

      <div className="main-content">
        <div className="page-title">
          <h4>Create Sale</h4>
        </div>
        <div id="sales_page_holder">
          <div id="sale-grid-big-wrapper" className="clearfix register">
            <div className="row">
              <div className="clearfix" id="category_item_selection_wrapper" />
            </div>
          </div>

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
                    selectedCustomer={selectedCustomer}
                  />
                )}
                {/* --grid view--- */}
                <LabTabs showGrid={showGrid} addItemToCart={addItemToCart} />
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
                            <td className="sales_discount">Disc %</td>
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
                                    selectedCustomer={selectedCustomer}
                                    loyaltyDiscount={
                                      selectedCustomer?.loyaltyCardDiscount
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
                                      [Sales]{" "}
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
                    <div className="btn-group">
                      <DropdownSales
                        handleGiftCard={handleGiftCard}
                        handlefamilyCard={handlefamilyCard}
                        lastSale={lastSale}
                      />
                    </div>

                    {selectedCustomer && !saleName && (
                      <Tooltip title="Book Appointment" placement="top">
                        <Button
                          style={{
                            backgroundColor: "#84E184",
                            border: "1px solid green",
                            color: "white",
                            marginLeft: "20px",
                            margin: "5px",
                            fontSize: "10px",
                          }}
                          onClick={handleAppointment}
                        >
                          <FontAwesomeIcon
                            icon={faCalendar}
                            style={{ paddingRight: "5px" }}
                          />
                          Book An Appointment
                        </Button>
                      </Tooltip>
                    )}

                    {selectedCustomer && cartItems.length > 0 ? (
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

                    {/* {cartItems.length > 0 ? (
                      <Tooltip title="Remove" placement="top">
                        <Button
                          style={{
                            backgroundColor: "#FFC55C",
                            color: "white",
                            border: "1px solid orange",
                            marginLeft: "20px",
                            margin: "5px",
                          }}
                          onClick={() => setRemoveTax(!removeTax)}
                        >
                          {removeTax ? "Add Tax" : "Remove Tax"}
                        </Button>
                      </Tooltip>
                    ) : (
                      <></>
                    )} */}

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
                                onClick={handleOpen}
                                className="none"
                                title="New Customer"
                                id="new-customer"
                                tabIndex="-1"
                              >
                                <FontAwesomeIcon
                                  icon={faUserPlus}
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
                              maxLength={10}
                              placeholder="Type Customer Phone Number"
                              autoComplete="off"
                              onChange={(e) => searchCustomer(e.target.value)}
                              value={number}
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
                            {customer && (
                              <CustomerListDropdown
                                handleSelectCustomer={handleSelectCustomer}
                                customer={customer}
                              />
                            )}
                          </>
                        )}

                        <span className="error mt-2 text-danger">{error}</span>

                        {selectedCustomer && (
                          <CustomerInfo
                            getCustomerLastSale={getCustomerLastSale}
                            selectedCustomer={selectedCustomer}
                            handleEditCustomer={handleEditCustomer}
                            handleDetachCustomer={handleDetachCustomer}
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
                        {saleName === "unpackaged" ? null : (
                          <>
                            <li className="list-group-items global-discount-group">
                              <div className="key">
                                Discount all Items by Percent:{" "}
                              </div>
                              <div className="value pull-right">
                                <Popup
                                  trigger={
                                    <a
                                      style={{
                                        color: "red",
                                        fontStyle: "italic",
                                        textDecoration:
                                          "underline dashed #33BEFF",
                                      }}
                                    >
                                      {allItemsDiscount ? (
                                        <>{allItemsDiscount}%</>
                                      ) : (
                                        <>Set Discount</>
                                      )}
                                    </a>
                                  }
                                  position="left center"
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
                                        Discount all Items by Percent
                                      </p>
                                      <input
                                        ref={discountAllItems}
                                        type="text"
                                        placeholder="Set Discount (%)"
                                        style={{
                                          width: "100%",
                                          fontSize: "12px",
                                          padding: "10px",
                                        }}
                                      />
                                      <FontAwesomeIcon
                                        type="button"
                                        icon={faCheck}
                                        className="check-button"
                                        onClick={() => {
                                          updateAllItemsDiscount(
                                            discountAllItems.current.value
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
                              </div>
                            </li>
                            <li className="list-group-items global-discount-group">
                              <div className="key">Discount Entire Sale: </div>
                              <div className="value pull-right">
                                <Popup
                                  trigger={
                                    <div
                                      style={{
                                        cursor: "pointer",
                                        color: "red",
                                        fontStyle: "italic",
                                        textDecoration:
                                          "underline dashed #33BEFF",
                                      }}
                                    >
                                      {entireSaleDiscount
                                        ? `Rs. ${Number(
                                            entireSaleDiscount
                                          ).toFixed(2)}`
                                        : "Set Discount"}
                                    </div>
                                  }
                                  position="left center"
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
                                        Discount Entire Sale
                                      </p>
                                      <input
                                        ref={discountEntireSale}
                                        type="text"
                                        placeholder="Set Discount (%)"
                                        style={{
                                          width: "100%",
                                          fontSize: "12px",
                                          padding: "10px",
                                        }}
                                      />
                                      <FontAwesomeIcon
                                        type="button"
                                        icon={faCheck}
                                        className="check-button"
                                        onClick={() => {
                                          updateEntireSaleDiscount(
                                            discountEntireSale.current.value
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
                              </div>
                            </li>
                          </>
                        )}

                        {entireSaleDiscount ? (
                          <li className="list-group-items">
                            <span className="key">Discount:</span>
                            <span className="value float-right">
                              Rs. -{entireSaleDiscountAmount}
                            </span>
                          </li>
                        ) : null}

                        <li className="sub-total list-group-items">
                          <span className="key">Sub Total:</span>
                          <span className="value float-right">
                            {(locationObject.display_tax && (
                              <>Rs. {cartSubTotal.toFixed(2)}</>
                            )) || (
                              <>
                                {(
                                  parseFloat(cartSubTotal) +
                                  cartTaxes.reduce(
                                    (acc, tax) => acc + parseFloat(tax.total),
                                    0
                                  )
                                ).toFixed(2)}
                              </>
                            )}
                          </span>
                        </li>

                        {(cartTaxes.length > 0 &&
                          locationObject.display_tax && (
                            //!removeTax && (
                            <>
                              {cartTaxes.map((c, x) => {
                                return (
                                  <li className="list-group-items" key={x}>
                                    <span className="key">{c.id}:</span>
                                    <span className="value float-right">
                                      Rs. {c.total.toFixed(2)}
                                    </span>
                                  </li>
                                );
                              })}
                            </>
                          )) || (
                          //)
                          <></>
                        )}
                      </ul>
                      <div className="amount-block">
                        <div className="total amount">
                          <div className="side-heading"> Total </div>
                          <div
                            className="amount total-amount"
                            data-speed="1000"
                            data-currency="Rs."
                            data-decimals="2"
                          >
                            Rs. {cartTotal.toFixed(2)}
                          </div>
                        </div>
                        <div className="total amount-due">
                          <div className="side-heading"> Amount Due </div>
                          <div className="amount">
                            {" "}
                            Rs. {cartAmountDue.toFixed(2)}{" "}
                          </div>
                        </div>
                        {salePaymentMethods.length ? (
                          <div className="payment-methods amount-block pt-2">
                            <ul className="list-group payments mb-2">
                              {salePaymentMethods.map((s, i) => (
                                <li className="list-group-item" key={i}>
                                  <button
                                    className="text-danger btn btn-light"
                                    onClick={() => removeSalePaymentMethod(s)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>{" "}
                                  {s.paymentType}
                                  <span className="value">
                                    {s.paymentAmount.toFixed(2)}{" "}
                                  </span>
                                  {s.paymentType === "Gift Card" ||
                                  s.paymentType === "Family Card" ? (
                                    <div style={{ fontSize: "12px" }}>
                                      [New Balance: Rs.{" "}
                                      {
                                        paymentMethods.filter(
                                          (i) => i.name === s.paymentType
                                        )[0]?.amountLeft
                                      }
                                      ]
                                    </div>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <></>
                        )}
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
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={commentCheckbox}
                                onChange={(e) =>
                                  setCommentCheckbox(e.target.checked)
                                }
                              />
                            }
                            label="Show comments on receipt"
                          />
                        </Container>
                      }
                      {show ||
                        (!appointment && (
                          <div className="change-date">
                            <input
                              type="checkbox"
                              name="change_sale_date_enable"
                              style={{ cursor: "pointer" }}
                              value="1"
                              checked={hide}
                              id="change_sale_date_enable"
                              onChange={() => handleShow()}
                            />
                            <label
                              className="change_sale_date"
                              htmlFor="change_sale_date_enabled"
                            >
                              Change Sale Date
                            </label>
                            {hide && (
                              <div
                                className="date-picker"
                                style={{ fontFamily: "Gill Sans, sans-serif" }}
                              >
                                <ReactDatePicker
                                  className="picker-input"
                                  selected={date}
                                  onChange={(date) => setDate(date)}
                                  maxDate={moment().toDate()}
                                  minDate={moment().subtract(3, "day").toDate()}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      {showComplete ? (
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
                              {" "}
                              {selectedCustomer ? (
                                <>
                                  <AddPaymentSection
                                    paymentMethods={paymentMethods}
                                    handlePaymentMethod={handlePaymentMethod}
                                    cardNumber={cardNumber}
                                    setCartAmountDue={setCartAmountDue}
                                    setCardNumber={setCardNumber}
                                    cartAmountDue={cartAmountDue}
                                    amountTenderedRef={amountTenderedRef}
                                    setAmountTendered={setAmountTendered}
                                    amountTendered={amountTendered}
                                    completeSaleBtnText={completeSaleBtnText}
                                    handleAddPayment={handleAddPayment}
                                  />
                                </>
                              ) : null}
                            </>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="alert alert-danger p-2 m-2">
                            Please select <b>Items</b> and make sure{" "}
                            <b>Technician</b> is selected for every{" "}
                            <b>Product(s)</b> /<b>Service(s)</b> added in Cart!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* create appointment section */}
                {appointment && (
                  <Container
                    style={{
                      backgroundColor: "white",
                      padding: "20px",
                      paddingTop: "0px",
                      borderRadius: "3px",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "14px",
                        fontStyle: "-moz-initial",
                      }}
                    >
                      Pick Date & Time for Appointment
                    </h4>
                    <FormGroup
                      style={{
                        display: "inline-block",
                        width: "100%",
                        fontFamily: "Russo One, sans-serif",
                        marginTop: "10px",
                      }}
                    >
                      <Input
                        disableUnderline={true}
                        required
                        type="datetime-local"
                        size="small"
                        value={appointmentDateAndTime}
                        onChange={(e) => {
                          setAppointmentDateAndTime(e.target.value);
                        }}
                        style={{
                          display: "flex",
                          border: "1px solid Gray",
                          width: "100%",
                          padding: "2px",
                          borderRadius: "3px",
                          backgroundColor: "whitesmoke",
                        }}
                        id="date"
                      ></Input>
                    </FormGroup>

                    <Button
                      style={{
                        backgroundColor: "#84E184",
                        marginTop: "5px",
                        color: "white",
                        width: "100%",
                        border: "1px solid green",
                      }}
                      onClick={handleBookAppointment}
                    >
                      Book Appointment
                    </Button>
                  </Container>
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
      <Offcanvas
        show={display}
        onHide={handleCloseButton}
        placement="top"
        className="modal-2"
      >
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
            onSubmitCustomer={createCustomer}
            oCancelCustomer={handleCloseButton}
          />
        </Offcanvas.Body>
      </Offcanvas>

      {/* ----update customer----- */}
      {custInfo && (
        <Offcanvas
          show={editCustomer}
          onHide={handleCloseCustomer}
          placement="top"
          className="modal-2"
        >
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
              editItem={selectedCustomer}
              onSubmitCustomer={updateCustomer}
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
              handlefamilyCardValue={handlefamilyCardValue}
              submitFamilyCard={submitFamilyCard}
              serviceTime={serviceTime}
              handleTimePackage={handleTimePackage}
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
                    onChange={onChangeGiftCardNumber}
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
                    onChange={onChangeGiftCardValue}
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
                onClick={submitGiftCard}
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
                          // navigate(`/sales/receipt?saleId=${m.sale_id}`)
                          window.open(
                            `${process.env.REACT_APP_RECEIPT_APP_URL}/print/${locationId.locationId}/${m.sale_id}`,
                            "_blank"
                          )
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

export default Sales;

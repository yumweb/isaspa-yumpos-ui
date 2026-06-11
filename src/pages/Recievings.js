// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useState } from "react";
// import { faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
// import { faCircle } from "@fortawesome/free-regular-svg-icons";
// import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
// import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
// import DropdownSales from "./components/Dropdown-sales/DropdownSales";
// import LabTabs from "./components/Tab";
// import clientAdapter from "../lib/clientAdapter";
// import ReactDatePicker from "react-datepicker";
// import Popup from "reactjs-popup";
// import { faCheck } from "@fortawesome/free-solid-svg-icons";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";

// const Sales = () => {
//   const [buttonText, setButtonText] = useState("Show Grid");
//   const [showGrid, setShowGrid] = useState(false);
//   const [number, setNumber] = useState("");
//   const [error, setError] = useState(false);
//   const [customer, setCustomer] = useState(null);
//   const [show, setShow] = useState(false);
//   const [date, setDate] = useState(new Date());

//   const handleShowGrid = () => {
//     setShowGrid(!showGrid);
//     if (showGrid) {
//       setButtonText("Show Grid");
//     } else {
//       setButtonText("Hide Grid");
//     }
//   };

//   const handleShow = () => {
//     setShow(!show);
//   };

//   const searchCustomer = async (number) => {
//     setNumber(number);
//     if (number.length === 10) {
//       const customer = await clientAdapter.getCustomerPhone(number);
//       if (customer) {
//         setCustomer(customer);
//       } else {
//         setError("Number does not exist");
//         //    window.location.reload(100000);
//       }
//     } else {
//       setCustomer("");
//       setError("");
//     }
//   };

//   return (
//     <>
//       <div className="main-content">
//         <div className="site-notice" id="notice-center">
//           {" "}
//         </div>
//         <div id="sales_page_holder">
//           <div id="sale-grid-big-wrapper" className="clearfix register">
//             <div className="row">
//               <div
//                 className="clearfix"
//                 id="category_item_selection_wrapper"
//               ></div>
//             </div>
//           </div>
//           <LabTabs showGrid={showGrid} />
//           <div id="register_container" className="sales clearfix">
//             <div className="row register">
//               <div className="col-lg-8 col-md-7 col-sm-12 col-xs-12">
//                 <div className="register-box register-items-form">
//                   <a
//                     tabIndex="-1"
//                     href="#"
//                     className="dismissfullscreen hidden"
//                   >
//                     <FontAwesomeIcon icon={faCircle} />
//                   </a>
//                   <div className="item-form">
//                     <form
//                       action="http://isaspa.yumpos.co"
//                       id="add_item_form"
//                       className="form-inline"
//                       autoComplete="off"
//                       method="post"
//                       acceptCharset="utf-8"
//                     >
//                       <div className="input-group input-group-mobile contacts hidden">
//                         <span className="input-group-addon">
//                           <a
//                             href="http://isaspa.yumpos.co/items/view/-1/1/sale"
//                             className="none add-new-item"
//                             title="New Item"
//                             id="new-item-mobile"
//                             tabIndex="-1"
//                           >
//                             <FontAwesomeIcon
//                               icon={faEdit}
//                               className="edit-sales"
//                             />
//                             <span className="register-btn-text">New Item</span>
//                           </a>
//                         </span>
//                         <div className="input-group-addon register-mode sale-mode dropdown">
//                           <a
//                             href="http://localhost:3001/"
//                             className="none active"
//                             tabIndex="-1"
//                             title="Sale"
//                             id="select-mode-1"
//                             data-target="#"
//                             data-toggle="dropdown"
//                             aria-haspopup="true"
//                             role="button"
//                             aria-expanded="false"
//                           >
//                             <FontAwesomeIcon icon={faShoppingCart} />
//                             <span className="register-btn-text">Sale</span>
//                           </a>
//                           <ul className="dropdown-menu sales-dropdown">
//                             <li>
//                               <a
//                                 tabIndex="-1"
//                                 href="#"
//                                 data-mode="return"
//                                 className="change-mode"
//                               >
//                                 Return
//                               </a>
//                             </li>
//                           </ul>
//                         </div>
//                         <span className="input-group-addon grid-buttons">
//                           <a
//                             role="button"
//                             className="none show-grid hidden"
//                             tabIndex="-1"
//                             title="Show Grid"
//                           >
//                             <FontAwesomeIcon icon={faLayerGroup} />
//                             <span className="register-btn-text">Show Grid</span>
//                           </a>
//                           <a
//                             className="none hide-grid"
//                             tabIndex="-1"
//                             title="Hide Grid"
//                           >
//                             <FontAwesomeIcon icon={faLayerGroup} />
//                             <span className="register-btn-text">Hide Grid</span>
//                           </a>
//                         </span>
//                       </div>
//                       <div className="input-group contacts register-input-group">
//                         {/* <div className="spinner" id="ajax-loader" >
//                                                 <div className="rect1"></div>
//                                                 <div className="rect2"></div>
//                                                 <div className="rect3"></div>
//                                             </div> */}
//                         <span className="input-group-addon">
//                           <a
//                             href="items-view-page"
//                             className="none add-new-item"
//                             title="New Item"
//                             id="new-item"
//                             tabIndex="-1"
//                           >
//                             <FontAwesomeIcon icon={faEdit} />
//                           </a>
//                         </span>
//                         <span
//                           role="status"
//                           aria-live="polite"
//                           className="ui-helper-hidden-accessible"
//                         ></span>
//                         <input
//                           type="text"
//                           id="item"
//                           name="item"
//                           className="add-item-input pull-left ui-autocomplete-input"
//                           placeholder="Enter item name or scan barcode"
//                           autoComplete="off"
//                         ></input>

//                         <span className="input-group-addon show-grid">
//                           <a
//                             href="sales#"
//                             className="show-grid"
//                             tabIndex="-1"
//                             onClick={() => handleShowGrid()}
//                           >
//                             {buttonText}
//                           </a>
//                         </span>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//                 <div className="register-box register-items paper-cut">
//                   <div className="register-items-holder">
//                     <table id="register" className="table table-hover">
//                       <thead>
//                         <tr className="register-items-header">
//                           <th></th>
//                           <th className="item_name_heading">Item Name</th>
//                           <th className="sales_price">Price</th>
//                           <th className="sales_quantity">Qty.</th>
//                           <th className="sales_discount">Disc %</th>
//                           <th>Total</th>
//                         </tr>
//                       </thead>
//                       <tbody className="register-item-content">
//                         <tr className="cart_content_area">
//                           <td colspan="6">
//                             <div className="text-center text-warning">
//                               <h3>
//                                 There are no items in the cart
//                                 <span className="flatGreenc">
//                                   {" "}
//                                   [Receivings]{" "}
//                                 </span>
//                               </h3>
//                             </div>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-lg-4 col-md-5 col-sm-12 col-xs-12 no-padding-right">
//                 <div className="register-box register-right">
//                   <div className="sale-buttons">
//                     <div className="btn-group">
//                       <button
//                         type="button"
//                         className="btn btn-more dropdown-toggle"
//                         data-toggle="dropdown"
//                         aria-expanded="false"
//                       >
//                         <DropdownSales />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="customer-form">
//                     <form
//                       action=""
//                       id="select_customer_form"
//                       autoComplete="off"
//                       className="form-inline"
//                       method="post"
//                       acceptCharset="utf-8"
//                     >
//                       <div className="input-group contacts">
//                         <span className="input-group-addon">
//                           <a
//                             href="http://localhost:3001/customer-view"
//                             className="none"
//                             title="New Customer"
//                             id="new-customer"
//                             tabIndex="-1"
//                           >
//                             <FontAwesomeIcon
//                               icon={faPlus}
//                               className="address-book"
//                             />
//                           </a>
//                         </span>
//                         <span
//                           role="status"
//                           aria-live="polite"
//                           className="ui-helper-hidden-accessible"
//                         ></span>
//                         <input
//                           type="text"
//                           id="customer"
//                           name="customer"
//                           className="add-customer-input ui-autocomplete-input"
//                           maxLength={10}
//                           placeholder="Type supplier's name..."
//                           autoComplete="off"
//                           onChange={(e) => searchCustomer(e.target.value)}
//                           value={number}
//                           required
//                         ></input>
//                         {customer && (
//                           <span className="data-result">
//                             <p className="customer-number">
//                               {customer.person.phoneNumber}
//                               <br></br>
//                               <span className="customer-name">
//                                 {customer.person.firstName}
//                               </span>
//                               <span className="customer-lname">
//                                 {customer.person.lastName}
//                               </span>
//                             </p>
//                           </span>
//                         )}
//                         <span className="error mt-2 text-danger">{error}</span>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//                 <div className="register-box register-summary paper-cut">
//                   <ul className="list-group">
//                     <li className="sub-total list-group-items">
//                       <span className="key">Sub Total:</span>
//                       <span className="value float-right">Rs.0.00</span>
//                     </li>
//                   </ul>
//                   <div className="amount-block">
//                     <div className="total amount">
//                       <div className="side-heading"> Total </div>
//                       <div
//                         className="amount total-amount"
//                         data-speed="1000"
//                         data-currency="Rs."
//                         data-decimals="2"
//                       >
//                         {" "}
//                         Rs.0.00{" "}
//                       </div>
//                     </div>
//                     <div className="total amount-due">
//                       <div className="side-heading"> Amount Due </div>
//                       <div className="amount"> Rs.0.00 </div>
//                     </div>
//                   </div>
//                   <div id="finish_sale" className="finish-sale">
//                     <form
//                       action=""
//                       id="finish_sale_form"
//                       autoComplete="off"
//                       method="post"
//                       acceptCharset="utf-8"
//                     ></form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sales;

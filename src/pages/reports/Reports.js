/* eslint-disable import/no-anonymous-default-export */
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faCalendar,
  faIdBadge,
  faShoppingCart,
  faPerson,
  faChartBar,
  faWrench,
  faBirthdayCake,
  faRing,
  faCake,
  faCakeCandles,
  faTicketAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";
import SaleReport from "./saleReport";
import CustomerReport from "./customerReport";
import EmployeeReport from "./employeeReport";
import GSTReport from "./gstReport";
import BounceBackReport from "./BounceBackReport";
import FirstVisitReport from "./FirstVisitReport";
import EmployeePerformanceReport from "./EmployeePerformanceReport";
import { useLocation } from "react-router-dom";
import { InventoryReport } from "./inventoryReports/LowStockForm";
// import { CustomerReport } from "./customerReports/customerReport";
import { useNavigate } from "react-router-dom";
import Categories from "../components/Categories";

export default () => {
  const [show, setShow] = useState({ detailReport: false });
  const [heading, setHeading] = useState("");
  const [icon, setIcon] = useState({ icon: "", class: "" });
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/reports") {
      setCurrentScreen(0);
    }
  }, [location]);

  const getIcon = (element) => {
    switch (element) {
      case "sales":
        return { class: "ti-shopping-cart", icon: faShoppingCart };

      case "employees":
        return { class: "ti-id-badge", icon: faIdBadge };

      case "inventory":
        return { class: "ti-shopping-cart", icon: faChartBar };

      case "customer":
        return { class: "ti-shopping-cart", icon: faPerson };

      case "coupons":
        return { class: "ti-ticket", icon: faTicketAlt };

      default:
        break;
    }
  };

  const handleShow = (element) => {
    setHeading(element);
    setIcon(getIcon(element));
    setShow({ ...show, detailReport: true });
  };

  const onClickDetailedReport = () => {
    switch (heading) {
      case "sales":
        setCurrentScreen(2);
        break;
      case "employees":
        setCurrentScreen(1);
        break;
      case "inventory":
        setCurrentScreen(3);
        break;
      case "customer":
        setCurrentScreen(4);
        break;
      case "coupons":
        setCurrentScreen(6);
        break;
      default:
        break;
    }
  };

  const onClickBack = () => {
    setCurrentScreen(0);
  };

  const subCategories = {
    sales: [
      {
        name: "Detailed Report",
        onClick: onClickDetailedReport,
        icon: faCalendar,
      },
      {
        name: "GST Report",
        onClick: () => setCurrentScreen(5),
        icon: faCalendar,
      },
    ],
    employees: [
      {
        name: "Detailed Report",
        onClick: onClickDetailedReport,
        icon: faCalendar,
      },
      {
        name: "Employee Performance",
        onClick: () => setCurrentScreen(8),
        icon: faChartBar,
      },
    ],
    inventory: [
      {
        name: "Low Inventory",
        onClick: () => {
          navigate("/inventory/report-form/low-stock");
        },
        icon: faCalendar,
      },
      {
        name: "Summary",
        onClick: () => {
          navigate("/inventory/report-form/summary");
        },
        icon: faCalendar,
      },
      {
        name: "Receivings",
        onClick: () => {
          navigate("/inventory/report-form/receiving");
        },
        icon: faCalendar,
      },
      {
        name: "Receivings Details",
        onClick: () => {
          navigate("/inventory/report/receivings-details");
        },
        icon: faCalendar,
      },
      {
        name: "Detailed Inventory",
        onClick: () => {
          navigate("/inventory/report-form/detailed");
        },
        icon: faCalendar,
      },
    ],
    customer: [
      {
        name: "Detailed Report",
        onClick: onClickDetailedReport,
        icon: faCalendar,
      },
      {
        name: "First Visit Report",
        onClick: () => setCurrentScreen(7),
        icon: faUserPlus,
      },
      {
        name: "Today's Birthdays",
        onClick: () => {
          navigate(`/customer/report/event?type=1`);
        },
        icon: faBirthdayCake,
      },
      {
        name: "Today's Anniversaries",
        onClick: () => {
          navigate(`/customer/report/event?type=2`);
        },
        icon: faCakeCandles,
      },
      // {
      //   name: "Customer Retention",
      //   onClick: () => {
      //     navigate("/customer/report/retention");
      //   },
      //   icon: faWrench,
      // },
    ],
    coupons: [
      {
        name: "New Customer Bounce Back Coupon Report",
        onClick: () => setCurrentScreen(6),
        icon: faTicketAlt,
      },
    ],
  };

  return (
    <>
      <hr />
      {currentScreen === 0 && (
        <div className="row report-listing mt-3">
          <Typography variant="h5" mb={3} color={"#4A5073"}>
            Reports
          </Typography>
          <div className="col-md-6">
            <div className="panell">
              <div className="panel-body">
                <div className="list-group parent-list">
                  <div
                    className="list-group-item active"
                    id="employees"
                    onClick={() => handleShow("employees")}
                  >
                    <i className="icon ti-id-badge">
                      <FontAwesomeIcon icon={faIdBadge} />
                    </i>
                    Employees
                  </div>
                  <div
                    className="list-group-item active"
                    id="sales"
                    onClick={() => handleShow("sales")}
                  >
                    <i className="icon ti-shopping-cart">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </i>
                    Sales
                  </div>
                  <div
                    className="list-group-item active"
                    id="inventory"
                    onClick={() => handleShow("inventory")}
                  >
                    <i className="icon ti-shopping-cart">
                      <FontAwesomeIcon icon={faChartBar} />
                    </i>
                    Inventory
                  </div>
                  <div
                    className="list-group-item active"
                    id="sales"
                    onClick={() => handleShow("customer")}
                  >
                    <i className="icon ti-shopping-cart">
                      <FontAwesomeIcon icon={faPerson} />
                    </i>
                    Customers
                  </div>
                  <div
                    className="list-group-item active"
                    id="coupons"
                    onClick={() => handleShow("coupons")}
                  >
                    <i className="icon ti-ticket">
                      <FontAwesomeIcon icon={faTicketAlt} />
                    </i>
                    Coupons
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6" id="report_selection">
            <div className="panell">
              <div className="panel-body child-list">
                <h3 className="page-header text-info">
                  <FontAwesomeIcon
                    className={heading ? icon.class : "left-arrow"}
                    icon={heading ? icon.icon : faAngleDoubleLeft}
                  />
                  <span
                    style={{ marginLeft: "8px", textTransform: "capitalize" }}
                  >
                    {heading || "Reports: Make a selection"}
                  </span>
                </h3>
                <hr />

                {show.detailReport && (
                  <div className="list-group employees">
                    {subCategories[heading].map((Category) => (
                      <div
                        key={Category.name} // Adding a unique key is also recommended for mapped elements.
                        className="list-group-items"
                        onClick={Category.onClick}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon
                          className="report-icons"
                          icon={Category.icon}
                        />
                        {Category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {currentScreen === 1 && <EmployeeReport onClickBack={onClickBack} />}
      {currentScreen === 2 && <SaleReport onClickBack={onClickBack} />}
      {currentScreen === 3 && <InventoryReport onClickBack={onClickBack} />}
      {currentScreen === 4 && <CustomerReport onClickBack={onClickBack} />}
      {currentScreen === 5 && <GSTReport onClickBack={onClickBack} />}
      {currentScreen === 6 && <BounceBackReport onClickBack={onClickBack} />}
      {currentScreen === 7 && <FirstVisitReport onClickBack={onClickBack} />}
      {currentScreen === 8 && <EmployeePerformanceReport onClickBack={onClickBack} />}
    </>
  );
};

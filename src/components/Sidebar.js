/* eslint-disable import/no-anonymous-default-export */
import { useState } from "react";
import SimpleBar from "simplebar-react";
import { Link, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import {
  faUserPlus,
  faChartPie,
  faCog,
  faHandHoldingUsd,
  faSignOutAlt,
  faTimes,
  faCalendar,
  faMicrophone,
  faUser,
  faCreditCard,
  faCashRegister,
  faDollarSign,
  faBox,
  faBoxes,
  faIdCard,
  faBuilding,
  faTicketAlt,
  faClock,
  faChartSimple,
  faDownload,
  faBook,
  faBullhorn,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { AppRoutes } from "../routes";
import { getFeatureAccess } from "../lib/featureAccess";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { faServicestack } from "@fortawesome/free-brands-svg-icons";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import { Nav, Badge, Image, Button, Navbar } from "@themesberg/react-bootstrap";
import Logo from "../assets/img/brand/isa-spa-logo.png";

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";
  const onCollapse = () => setShow(!show);
  const userInfo = JSON.parse(localStorage.getItem("yumpos_user_info"));

  // Premium add-on visibility: show the nav when the feature is enabled OR the
  // user is corporate (kept visible even if expired so they can reach the
  // renew/expired screen). Expiry itself is enforced on each feature page.
  const waAccess = getFeatureAccess(userInfo, "whatsapp");
  const gmbAccess = getFeatureAccess(userInfo, "gmb");
  const showWhatsapp = waAccess.enabled || waAccess.isCorporate;
  const showGmb = gmbAccess.enabled || gmbAccess.isCorporate;

  const logout = () => {
    window.localStorage.removeItem("yumpos_token");
    window.localStorage.removeItem("yumpos_location");
    window.localStorage.removeItem("yumpos_user_info");
    window.localStorage.removeItem("yumpos_cart_items");
    window.localStorage.removeItem("yumpos_selected_customers");
    window.location.href = "/";
  };

  const NavItem = (props) => {
    const {
      title,
      link,
      external,
      target,
      icon,
      image,
      badgeText,
      badgeBg = "secondary",
      badgeColor = "primary",
      onClickMethod,
    } = props;
    const classNames = badgeText
      ? "d-flex justify-content-start align-items-center justify-content-between"
      : "";
    const navItemClassName = pathname.includes(link) ? "active" : "";

    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item
        className={navItemClassName}
        onClick={() => {
          setShow(false);
          onClickMethod && onClickMethod();
        }}
      >
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{" "}
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2"
            >
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none"
      >
        <Navbar.Brand className="me-lg-5" as={Link} to={AppRoutes.SignIn.path}>
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}
        >
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image
                    src={ProfilePicture}
                    className="card-img-top rounded-circle border-white"
                  />
                </div>
                <div className="d-block">
                  <h6>Hi, {userInfo.fname}</h6>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={logout}
                    className="text-dark"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{" "}
                    Logout
                  </Button>
                </div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <Image src={Logo} />

              <NavItem
                title="Dashboard"
                link={AppRoutes.Dashboard.path}
                icon={faChartPie}
              />
              <NavItem
                title="Sales"
                icon={faCashRegister}
                link={AppRoutes.Sales.path}
              />
              <NavItem
                title="Leads"
                icon={faHandHoldingUsd}
                link={AppRoutes.Leads.path}
              />
              <NavItem
                title="Appointments"
                icon={faCalendar}
                link={AppRoutes.Appointments.path}
              />
              <NavItem
                title={
                  <>
                    Retention Report{" "}
                    <Badge
                      pill
                      bg="success"
                      text="light"
                      className="badge-md new-badge ms-2"
                      style={{ marginLeft: "0 !important" }}
                    >
                      New
                    </Badge>
                  </>
                }
                icon={faUserPlus}
                link={AppRoutes.CustomerRetentionReport.path}
              />
              {/* Best Practices — hidden until content is refreshed
              <NavItem
                title={
                  <>
                    Best Practices{" "}
                    <Badge
                      pill
                      bg="success"
                      text="light"
                      className="badge-md new-badge ms-2"
                      style={{ marginLeft: "0 !important" }}
                    >
                      New
                    </Badge>
                  </>
                }
                icon={faBook}
                link={AppRoutes.BestPractices.path}
              /> */}
              {showWhatsapp && (
                <>
                  <NavItem
                    title={
                      <>
                        WhatsApp{" "}
                        <Badge
                          pill
                          bg="success"
                          text="light"
                          className="badge-md new-badge ms-2"
                          style={{ marginLeft: "0 !important" }}
                        >
                          Premium
                        </Badge>
                      </>
                    }
                    icon={faWhatsapp}
                    link={AppRoutes.WhatsApp.path}
                  />
                  <NavItem
                    title="WA Campaigns"
                    icon={faBullhorn}
                    link={AppRoutes.WhatsAppCampaigns.path}
                  />
                  <NavItem
                    title="WA Chat"
                    icon={faComments}
                    link={AppRoutes.WhatsAppChat.path}
                  />
                  {userInfo.isCorporate && (
                    <NavItem
                      title="WA Variables"
                      icon={faTags}
                      link={AppRoutes.WhatsAppVariables.path}
                    />
                  )}
                </>
              )}
              {showGmb && (
                <NavItem
                  title={
                    <>
                      Google My Business
                      <span style={{ display: "block", marginTop: 2 }}>
                        <Badge
                          pill
                          bg="success"
                          text="light"
                          className="badge-md new-badge"
                        >
                          Premium
                        </Badge>
                      </span>
                    </>
                  }
                  icon={faGoogle}
                  link={AppRoutes.GoogleMyBusiness.path}
                />
              )}
              <NavItem
                //external
                title="Customers"
                icon={faUser}
                link={AppRoutes.Customers.path}
              />
              <NavItem
                //external
                title="Promotions"
                icon={faMicrophone}
                link={AppRoutes.Promotions.path}
              />
              <NavItem
                //external
                title="Family Cards"
                icon={faCreditCard}
                link={AppRoutes.FamilyCard.path}
              />
              <NavItem
                //external
                title="Gift Cards"
                icon={faCreditCard}
                link={AppRoutes.GiftCard.path}
              />
              <NavItem
                //external
                title="Coupons"
                icon={faDollarSign}
                link={AppRoutes.Coupons.path}
              />
              {/* <NavItem
                external
                title="Reports"
                //icon={faChartLine}
                link={AppRoutes.Reports.path}
              /> */}
              <NavItem
                //external
                title="Services"
                icon={faBox}
                link={AppRoutes.Items.path}
              />
              <NavItem
                //external
                title="Retail Product"
                icon={faServicestack}
                link={AppRoutes.RetailProduct.path}
              />
              <NavItem
                // external
                title="Item Kits"
                icon={faBoxes}
                link={AppRoutes.ItemKits.path}
              />
              <NavItem
                // external
                title="Add Item Kit"
                icon={faBoxes}
                link={AppRoutes.ItemKitView.path}
              />
              <NavItem
                //external
                title="Employees"
                icon={faIdCard}
                link={AppRoutes.Employees.path}
              />
              <NavItem
                title="Recievings"
                icon={faDownload}
                link={AppRoutes.Recievings.path}
              />
              {userInfo.isCorporate && (
                <NavItem
                  // external
                  title="Store Config"
                  icon={faCog}
                  link={AppRoutes.StoreConfig.path}
                />
              )}
              {userInfo.isCorporate && (
                <NavItem
                  //external
                  title="Locations"
                  icon={faBuilding}
                  link={AppRoutes.Locations.path}
                />
              )}
              {/* <NavItem
                //external
                title="Messages"
                icon={faComment}
                link={AppRoutes.Messages.path}
              /> */}
              <NavItem
                //external
                title="Tickets"
                icon={faTicketAlt}
                link={AppRoutes.Tickets.path}
              />
              <NavItem
                //external
                title="Reviews"
                icon={faComments}
                link={AppRoutes.Reviews.path}
              />
              {userInfo.employeeId !== 40696 &&
                userInfo.employeeId !== 5698 &&
                userInfo.employeeId !== 17110 &&
                userInfo.employeeId !== 13268 && (
                  <NavItem
                    //external
                    title="Reports"
                    icon={faChartSimple}
                    link={AppRoutes.Reports.path}
                  />
                )}
              <NavItem
                title="EOD Report"
                icon={faBook}
                link={AppRoutes.EodReport.path}
              />
              <NavItem
                title="Suppliers"
                icon={faDownload}
                link={AppRoutes.Suppliers.path}
              />
              <NavItem
                //external
                title="Time Clock"
                icon={faClock}
                link={AppRoutes.TimeClock.path}
              />
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

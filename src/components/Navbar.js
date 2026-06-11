/* eslint-disable import/no-anonymous-default-export */
import { orderBy } from "lodash";
import {
  Nav,
  Navbar,
  Dropdown,
  Container,
  Modal,
  Button,
  Spinner,
} from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAdapter from "../lib/clientAdapter";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import moment from "moment-timezone";

export default () => {
  const locationInfo = JSON.parse(
    window.localStorage.getItem("yumpos_location")
  );
  const userInfo = JSON.parse(window.localStorage.getItem("yumpos_user_info"));
  const [showDefault, setShowDefault] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [followUpDate, setFollowUpDate] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notificationData, setNotificationData] = useState(null);

  const handleNotificationDropdownClick = async () => {
    setLoading(true);
    try {
      const notifications = await clientAdapter.getNotifications();
      setNotificationData(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const locationPopup = async () => {
    const getLocations = await clientAdapter.getUserLocations();
    const locations = orderBy(getLocations.locations, ["locationId"], ["asc"]);
    setLocationList(locations);
    setShowDefault(true);
  };

  const setLocation = async (location) => {
    const res = await clientAdapter.setUserLocation(location.locationId);
    if (res.token) {
      window.localStorage.setItem("yumpos_token", res.token);
      window.localStorage.setItem("yumpos_location", JSON.stringify(location));
      window.localStorage.setItem(
        "yumpos_user_info",
        JSON.stringify(res.userInfo)
      );
      window.location.reload();
    } else {
      alert("Some error occurred. Please try again later.");
      setShowDefault(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("yumpos_token");
    window.localStorage.removeItem("yumpos_location");
    window.localStorage.removeItem("yumpos_user_info");
    window.localStorage.removeItem("yumpos_cart_items");
    window.localStorage.removeItem("yumpos_selected_customers");
    window.location.href = "/";
  };

  const onCloseLocationPopup = () => {
    setShowDefault(false);
  };

  const handleAppointments = () => {
    navigate(`/appointments`);
  };

  const handleBirthdays = () => {
    window.location.href = `/customer/report/event?type=1`;
  };

  const handleAnniversary = () => {
    window.location.href = `/customer/report/event?type=2`;
  };

  const handleLeads = () => {
    navigate(`/leads`);
  };

  const handleTodayFollowUps = async (
    page,
    limit,
    sortState,
    filterInput,
    filterStatus,
    source,
    startDate,
    endDate,
    followupDateStart,
    followupDateEnd
  ) => {
    const leadFollowUp = await clientAdapter.getLocationLeads(
      page,
      limit,
      sortState,
      filterInput,
      filterStatus,
      source,
      startDate,
      endDate,
      followupDateStart,
      followupDateEnd
    );
    setFollowUpDate(leadFollowUp.leads);
  };

  const onClickTodayFollowUp = () => {
    navigate(`/leads?display=Today`);
  };

  useEffect(() => {
    handleTodayFollowUps(
      1,
      10,
      {},
      "",
      "",
      "",
      "",
      "",
      moment(new Date()).subtract(1, "day").format("YYYY-MM-DD"),
      moment(new Date()).subtract(1, "day").format("YYYY-MM-DD")
    );
  }, []);

  const totalNotifications = `${followUpDate.length}`;

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0 navbar-lead">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center gap-2">
            <a href="https://calendly.com/yumpos" target="_blank">
              <Button className="btn btn-primary">
                Staff training Request
              </Button>
            </a>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdGP7nXjIo9HkOY81oXKVpAuJuw_gH6KH5Q4NSwQ1hBKeBNJQ/viewform"
              target="_blank"
            >
              <img src="/pos-support.png" alt="Support" />
            </a>
            <a href="http://studio11.brandstore.biz" target="_blank">
              <img src="/brandstore-order.png" alt="Brandstore Portal" />
            </a>
          </div>

          <div className="d-flex justify-content-end">
            <Nav className="align-items-center">
              <Dropdown
                onClick={handleNotificationDropdownClick}
                style={{ marginRight: "1rem" }}
              >
                <Dropdown.Toggle
                  style={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  <NotificationsNoneOutlinedIcon color="action" />{" "}
                  {/* Update to your desired letter icon */}
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <Spinner
                        animation="border"
                        role="status"
                        className="mx-auto my-3"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <>
                      <Dropdown.Item
                        onClick={handleAppointments}
                        className="fw-bold d-flex align-items-center gap-5"
                      >
                        Today’s Appointments
                        <span className="ms-auto">
                          {notificationData?.todaysAppointments}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={handleLeads}
                        className="fw-bold d-flex align-items-center gap-5"
                      >
                        New Leads Added Today
                        <span className="ms-auto">
                          {notificationData?.newleadsToday ?? "N/A"}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={onClickTodayFollowUp}
                        className="fw-bold d-flex align-items-center gap-5"
                      >
                        View Todays Followups
                        <span className="ms-auto">
                          {notificationData?.todaysFollowUpCount ?? "N/A"}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        className="fw-bold d-flex align-items-center gap-5"
                        onClick={handleBirthdays}
                      >
                        Today's Birthdays
                        <span className="ms-auto">
                          {notificationData?.todaysBirthdaysCount ?? "N/A"}
                        </span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        className="fw-bold d-flex align-items-center gap-5"
                        onClick={handleAnniversary}
                      >
                        Today's Anniversaries
                        <span className="ms-auto">
                          {notificationData?.todaysAnniversaryCount ?? "N/A"}
                        </span>
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            <Nav className="align-items-center">
              <Dropdown>
                <DropdownItem className="studio11" onClick={locationPopup}>
                  {locationInfo.name}
                </DropdownItem>
              </Dropdown>
            </Nav>
            <Nav className="align-items-center">
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                  <div className="media d-flex align-items-center">
                    <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                      <span className="mb-0 font-small fw-bold">
                        {userInfo.fname} {userInfo.lname}
                      </span>
                    </div>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                  <Dropdown.Item
                    className="fw-bold"
                    href="https://calendly.com/yumpos"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faUserShield} className="me-2" />{" "}
                    Request Training
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="fw-bold" onClick={logout}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="text-danger me-2"
                    />{" "}
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </div>
      </Container>
      <React.Fragment>
        <Modal
          as={Modal.Dialog}
          centered
          show={showDefault}
          onHide={onCloseLocationPopup}
        >
          <Modal.Header closeButton>
            <Modal.Title className="h6 text-center">
              Select Location
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="store-list-body">
              <ul className="store-list">
                {locationList.map((l) => (
                  <Button
                    className="btn-store-select mb-2"
                    key={l.locationId.toString()}
                    onClick={() => setLocation(l)}
                  >
                    <li key={l.locationId.toString()}>{l.name}</li>
                  </Button>
                ))}
              </ul>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </Navbar>
  );
};

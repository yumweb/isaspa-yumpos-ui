/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from "react";
import {
  faCartPlus,
  faIdCard,
  faClock,
  faUserClock,
  faMagnet,
  faTicketAlt,
  faCreditCard,
  faChartBar,
  faShoppingCart,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row } from "@themesberg/react-bootstrap";
import { map, sumBy } from "lodash";
import "../../scss/dashboard.page.scss";
import moment from "moment-timezone";
import clientAdapter from "../../lib/clientAdapter";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import SalesChart from "../components/salesChart";
import { Modal, Button } from "react-bootstrap";
export default () => {
  const [showModal, setShowModal] = useState(false);
  const [graphData, setGraphData] = useState({});
  const [graphTotal, setGraphTotal] = useState(0);
  const [dashboardData, setDashboardData] = useState({});
  const [dashboardMonthlyData, setMonthlyData] = useState({});
  const [subscriptionDate, setSubscriptionDate] = useState("");
  const startOfDay = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
  const endOfDay = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
  const startOfMonth = moment().startOf("month").format("YYYY-MM-DD HH:mm:ss");
  const endOfMonth = moment().endOf("month").format("YYYY-MM-DD HH:mm:ss");

  const navigate = useNavigate();
  const getGraphData = async () => {
    const startDate = moment().startOf("isoWeek").format("YYYY-MM-DD");
    const endDate = moment().endOf("isoWeek").format("YYYY-MM-DD");
    const labels = [];
    const series = [];
    const res = await clientAdapter.getSummaryGraph(startDate, endDate);
    map(res, (item) => {
      labels.push(moment(item?.date).format("Do MMM"));
      series.push(item?.total);
    });
    const data = {
      labels,
      series: [series],
    };
    setGraphData(data);
    setGraphTotal(sumBy(res, "total"));
  };
  useEffect(() => {
    const token = window.localStorage.getItem("yumpos_token");
    const locationId = window.localStorage.getItem("yumpos_location");
    if (!token || !locationId) {
      window.location.href = "/";
    }
    //getGraphData();
  }, []);

  const onClickNewSale = () => {
    navigate("/sales");
  };
  const onClickManageStaff = () => {
    navigate("/employees");
  };
  const onClickManageAppointments = () => {
    navigate("/appointments");
  };
  const onClickManageLeads = () => {
    navigate("/leads");
  };
  const onClickRaiseATcket = () => {
    navigate("/tickets");
  };
  const onClickManageMembership = () => {
    navigate("/family-cards");
  };
  const onClickManageOperations = () => {
    navigate("/family-cards");
  };
  const onClickReports = () => {
    navigate("/reports");
  };

  const saleDashboard = async () => {
    try {
      const todayRes = await clientAdapter.dashboardSales(startOfDay, endOfDay);
      setDashboardData(todayRes);
      const monthlyRes = await clientAdapter.dashboardSales(
        startOfMonth,
        endOfMonth
      );
      setMonthlyData(monthlyRes);
      setSubscriptionDate(todayRes.accountValidity);
      checkSubscriptionValidity(todayRes.accountValidity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    saleDashboard();
  }, [startOfDay, endOfDay, startOfMonth, endOfMonth]);

  const subscriptionExpired = () => {
    const currentDate = moment();
    const expiryDate = moment(subscriptionDate);
    return expiryDate.isBefore(currentDate);
  };

  const subscriptionExpiringSoon = () => {
    const currentDate = moment();
    const expiryDate = moment(subscriptionDate);
    const daysDifference = expiryDate.diff(currentDate, "days");
    return daysDifference <= 30 && daysDifference > 0;
  };

  const formatSubscriptionDate = (dateString) => {
    return moment(dateString).format("DD-MM-YYYY");
  };

  const checkSubscriptionValidity = (expiryDate) => {
    const currentDate = moment();
    const expiryMoment = moment(expiryDate);
    const daysDifference = expiryMoment.diff(currentDate, "days");

    // Only show modal if subscription is expiring soon (not already expired)
    // and within 30 days of expiry
    if (daysDifference <= 30 && daysDifference > 0) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Subscription Expiring Soon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your subscription will expire on{" "}
          {formatSubscriptionDate(subscriptionDate)}. Please renew it soon to
          avoid service interruption.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <section className="card-section mt-3">
        <Alert
          icon={false}
          severity={subscriptionExpired() ? "error" : subscriptionExpiringSoon() ? "warning" : "success"}
          style={{
            fontSize: "20px",
          }}
        >
          {subscriptionExpired()
            ? "Oh snap! Your Subscription is Expired!"
            : subscriptionExpiringSoon()
            ? `Warning: Your subscription will expire on ${formatSubscriptionDate(
                subscriptionDate
              )}. Please renew soon!`
            : `Your subscription is valid until ${formatSubscriptionDate(
                subscriptionDate
              )}`}
        </Alert>
        <h3 className="text-center mb-5 dashboard-title">SnapShot</h3>
        <Row>
          <div className="card one  h-auto" onClick={onClickReports}>
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="icon-box flatBlue"
            />
            <div className="card-body">
              <div className="row">
                <div className="divider col-lg-6">
                  <h3 className="text-center">
                    {dashboardData?.total_sales || 0}
                  </h3>
                  <p className="text-center">
                    M - {dashboardData?.male_total || 0} / F -{" "}
                    {dashboardData?.female_total || 0}{" "}
                  </p>
                  <div className="bottom-box flatgrey"> Walk-ins </div>
                </div>
                <div className="col-lg-6">
                  <h3 className="text-center">
                    Rs. {(Number(dashboardData?.total_payment) || 0).toFixed(2)}
                  </h3>
                  <p className="text-center"> Sales </p>
                  <div className="bottom-box-sales flatgrey"> Total (Rs.) </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card two  h-auto" onClick={onClickManageAppointments}>
            <FontAwesomeIcon icon={faCalendar} className="icon-box flatBlue" />
            <div className="card-body">
              <div className="row">
                <div className="divider col-lg-6">
                  <h3 className="text-center">{dashboardData?.scheduled_appointments || 0}</h3>
                  <p className="text-center">Appointment(s)</p>
                  <div className="bottom-box-appointment flatBlack">
                    Scheduled
                  </div>
                </div>
                <div className="col-lg-6">
                  <h3 className="text-center">{dashboardData?.completed_appointments || 0}</h3>
                  <p className="text-center">Appointment(s)</p>
                  <div className="bottom-box-two flatBlack"> Completed </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card three  h-auto" onClick={onClickReports}>
            <FontAwesomeIcon icon={faBookOpen} className="icon-box flatBlue" />
            <div className="card-body">
              <div className="row">
                <div className="divider col-lg-6">
                  <h3 className="text-center">
                    {dashboardMonthlyData?.total_sales || 0}
                  </h3>
                  <p className="text-center">
                    M - {dashboardMonthlyData?.male_total || 0} / F -{" "}
                    {dashboardMonthlyData?.female_total || 0}{" "}
                  </p>
                  <div className="bottom-box-appointment flatWhite">
                    Walk-ins
                  </div>
                </div>
                <div className="col-lg-6">
                  <h3 className="text-center">
                    Rs.{" "}
                    {(Number(dashboardMonthlyData?.total_payment) || 0).toFixed(
                      2
                    )}
                  </h3>
                  <p className="text-center"> Sales </p>
                  <div className="bottom-box-three flatWhite">Total (Rs.)</div>
                </div>
              </div>
            </div>
          </div>
          <div className="card four h-auto" onClick={onClickReports}>
            <FontAwesomeIcon icon={faChartBar} className="icon-box flatBlue" />
            <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                  <h3 className="text-center">
                    Rs.{" "}
                    {(
                      ((Number(dashboardMonthlyData?.total_payment) || 0) /
                        (moment().date() || 1)) *
                      30
                    ).toFixed(2)}
                  </h3>
                  <p className="text-center"> Projected Sales </p>
                  <div className="bottom-box-four flatWhite">Estimate</div>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </section>
      <h3 className="pos-title text-center mt-5">
        <span>
          Welcome to YumPOS, choose a common task below to get started!
        </span>
      </h3>
      <div className="row quick-actions">
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <a className="list-group-item" onClick={onClickNewSale}>
              <i>
                <FontAwesomeIcon icon={faCartPlus} />
              </i>
              Start A New Sale
            </a>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <a className="list-group-item" onClick={onClickManageStaff}>
              <i>
                <FontAwesomeIcon icon={faIdCard} />
              </i>
              Manage Staff
            </a>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <a className="list-group-item" onClick={onClickManageAppointments}>
              <i>
                <FontAwesomeIcon icon={faClock} />
              </i>
              Manage Appointments
            </a>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <a className="list-group-item" onClick={onClickManageLeads}>
              <i>
                <FontAwesomeIcon icon={faMagnet} />
              </i>
              Manage Leads
            </a>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <a className="list-group-item" onClick={onClickRaiseATcket}>
              <i>
                <FontAwesomeIcon icon={faTicketAlt} />
              </i>
              Raise a Ticket
            </a>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <a className="list-group-item" onClick={onClickManageMembership}>
              <i>
                <FontAwesomeIcon icon={faCreditCard} />
              </i>
              Manage Memberships
            </a>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <a className="list-group-item" onClick={onClickManageOperations}>
              <i>
                <FontAwesomeIcon icon={faUserClock} />
              </i>
              Manage Operations
            </a>
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
          <div className="list-group">
            <a className="list-group-item" onClick={onClickReports}>
              <i>
                <FontAwesomeIcon icon={faChartBar} />
              </i>
              Reports
            </a>
          </div>
        </div>
      </div>
      <SalesChart />
      <div className="row payment_links text-center">
        <h3 className="subscription-title text-center mt-3 mb-3">
          <span> Subscription Payment links </span>
        </h3>
        <p>
          <a
            href="https://imjo.in/75CXfY"
            target="_blank"
            rel="noopener noreferrer"
            id="six_months"
            data-months="6"
            className="btn btn-info payment_type"
          >
            6 Months Renewal
          </a>
          <a
            href="https://imjo.in/VF2WUh"
            target="_blank"
            rel="noopener noreferrer"
            id="twelve_months"
            data-months="12"
            className="btn btn-success success payment_type"
          >
            12 Months Renewal
          </a>
        </p>
        <br></br>
      </div>
      <Row
        className=" graph-style justify-content-md-center"
        style={{ marginRight: "15px" }}
      ></Row>
    </>
  );
};

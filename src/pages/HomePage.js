/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import moment from "moment-timezone";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import Dashboard from "./dashboard/Dashboard";
import Customers from "./customer/Customers";
import Promotions from "./promotion/Promotions";
import Leadtable from "./lead/LeadPage";
import FamilyCard from "./familyCard/FamilyCard";
import FamilyCardView from "./familyCard/FamilyCardView";
import BootstrapTables from "./tables/BootstrapTables";
import SignIn from "./auth/SignIn";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";
import TicketDetails from "./tickets/TicketDetail";

// documentation pages
import DocsBuild from "./documentation/DocsBuild";
import DocsLicense from "./documentation/DocsLicense";
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsChangelog from "./documentation/DocsChangelog";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsFolderStructure from "./documentation/DocsFolderStructure";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import Errorpage from "./Errorpage";
import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
import Appointments from "./appointment/Appointments";
import TimeClock from "./TimeClock";
import GiftCard from "./giftcard/GiftCard";
import GiftcardView from "./giftcard/GiftcardView";
import Coupons from "./cupons/Coupons";
import Reports from "./reports/Reports";
import Items from "./items/Services";
import ItemKits from "./itemkit/ItemKits";
import Employees from "./employee/Employees";
import StoreConfig from "./StoreConfig";
import Locations from "./location/Locations";
import LocationsView from "./location/LocationsView";
import Messages from "./Messages";
import Tickets from "./tickets/Tickets";
import Reviews from "./review/Reviews";
import CustomerView from "./customer/CustomerView";
import PromotionsView from "./promotion/PromotionsView";
import PaymentsView from "./PaymentsView";
import GiftcardInfo from "./Subpages/GiftcardInfo";
import FamilycardInfo from "./Subpages/FamilycardInfo";
import SuspendSales from "./Subpages/SuspendSales";
import PackageSale from "./Subpages/PackageSale";
import CustomerDisplay from "./Subpages/CustomerDisplay";
import Sales from "./sales/Sales";
import TicketGenerator from "./tickets/TicketGenerator";
import ItemsViewPage from "./ItemsViewpage";
import CouponsView from "./cupons/CouponsView";
import EmployeesView from "./employee/EmployeesView";
import ExpensesView from "./ExpensesView";
import RetailProduct from "./items/RetailProduct";
import Receipt from "./components/sale/Receipt";
import { AppRoutes } from "../routes";
import PrivateRoute from "./components/PrivateRoute";
import AnnouncementModal from "../components/AnnouncementModal";
import ResetPasswordNotify from "./examples/ResetPasswordNotify";
import PublicReceipt from "./components/sale/publicReceipts";
import Recievings from "./recievings/recieving";
import clientAdapter from "../lib/clientAdapter";
import SubscriptionAlert from "./PaySubscription";
import Supplier from "./supplier/Supplier";
import { CustomerReportsTable } from "./reports/customerReports/customerReportsTable";
import { CustomerServiceReport } from "./reports/customerReports/customerServiceReport";
import { CustomerRetentionReport } from "./reports/customerReports/customerRetentionReport";
import { CustomerBirthdayAnniversaryReport } from "./reports/customerReports/customerBirthdayAnniversaryReport";
import { InventoryReport } from "./reports/inventoryReports/LowStockForm";
import { LowStockReportTable } from "./reports/inventoryReports/LowStockReportTable";
import { SummarReportTable } from "./reports/inventoryReports/SummaryReportTable";
import { InventorySummaryReport } from "./reports/inventoryReports/SummaryForm";
import { ReceivingsTable } from "./reports/inventoryReports/receivingsTable";
import { ReceivingsForm } from "./reports/inventoryReports/receivingsForm";
import ReceivingsDetailsReport from "./reports/inventoryReports/receivingsDetailsReport";
import { DetailedInventoryForm } from "./reports/inventoryReports/DetailedInventoryForm";
import { DetailedInventoryTable } from "./reports/inventoryReports/DetailedInventoryTable";
import ItemKitView from "./itemkit/ItemKitView";
import appointmentNotificationService from "../lib/AppointmentNotificationService";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FloatingHelpButton from "../components/help/FloatingHelpButton";
import AIChat from "./help/AIChat";
import BestPractices from "./help/BestPractices";
import DocumentView from "./help/DocumentView";
import WhatsAppPage from "./whatsapp/WhatsAppPage";
import TemplateBuilder from "./whatsapp/TemplateBuilder";
import WhatsAppCampaigns from "./whatsapp/WhatsAppCampaigns";
import WhatsAppCampaignForm from "./whatsapp/WhatsAppCampaignForm";
import WhatsAppCampaignView from "./whatsapp/WhatsAppCampaignView";
import WhatsAppChat from "./whatsapp/WhatsAppChat";
import GoogleMyBusiness from "./gmb/GoogleMyBusiness";
import GmbCallback from "./gmb/GmbCallback";

const RouteWithLoader = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader show={loaded ? false : true} /> {children}{" "}
    </>
  );
};

const RouteWithSidebar = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  const [isExpired, setExpired] = useState(false);

  const getSubscription = async () => {
    const startOfDay = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const endOfDay = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");
    const subscription = await clientAdapter.dashboardSales(
      startOfDay,
      endOfDay
    );

    const dateObject = new Date(subscription.accountValidity);

    const now = Date.now();
    if (dateObject.getTime() < now) {
      let user = localStorage.getItem("yumpos_user_info");
      user = JSON.parse(user);
      if (user.isCorporate) {
        setLoaded(true);
      } else {
        setExpired(true);
        setLoaded(true);
      }
    } else {
      setLoaded(true);
    }
  };

  useEffect(() => {
    getSubscription();
    
    // Initialize appointment notification service
    const initializeNotifications = async () => {
      try {
        // Start polling for appointment reminders (no permission needed for toast)
        appointmentNotificationService.startPolling(60); // 60 minutes reminder
        
        // Set up callback for new reminders
        appointmentNotificationService.onNewReminder((reminderData) => {
          console.log('New appointment reminder:', reminderData);
          // Could show additional in-app notification or update UI
        });
        
        // Set up error callback
        appointmentNotificationService.onError((error) => {
          console.error('Appointment notification error:', error);
        });
        
        console.log('Appointment notification service initialized successfully');
      } catch (error) {
        console.error('Error initializing appointment notifications:', error);
      }
    };
    
    initializeNotifications();
    
    // Cleanup function
    return () => {
      appointmentNotificationService.destroy();
    };
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false" ? false : true;
  };

  const [showSettings, setShowSettings] = useState(
    localStorageIsSettingsVisible
  );

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem("settingsVisible", !showSettings);
  };

  if (isExpired) {
    return <SubscriptionAlert />;
  } else {
    return (
      <PrivateRoute>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <AnnouncementModal />
          {children}
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
          <ToastContainer
            position="top-right"
            autoClose={8000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
{/* <FloatingHelpButton /> */}
        </main>
      </PrivateRoute>
    );
  }
};

// Layout without footer for full-height pages like chat
const RouteWithSidebarNoFooter = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <PrivateRoute>
      <Preloader show={loaded ? false : true} />
      <Sidebar />
      <main className="content content-full-height">
        <Navbar />
        <div className="content-area">
          {children}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </PrivateRoute>
  );
};

export default () => (
  <Routes>
    <Route
      exact
      path={AppRoutes.SignIn.path}
      element={
        <RouteWithLoader>
          <SignIn />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.PublicReceipt.path}
      element={
        <RouteWithLoader>
          <PublicReceipt />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.Presentation.path}
      element={
        <RouteWithLoader>
          <Presentation />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.Signup.path}
      element={
        <RouteWithLoader>
          <Signup />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.ForgotPassword.path}
      element={
        <RouteWithLoader>
          <ForgotPassword />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.ResetPassword.path}
      element={
        <RouteWithLoader>
          <ResetPassword />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.ResetPasswordNotify.path}
      element={
        <RouteWithLoader>
          <ResetPasswordNotify />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.Lock.path}
      element={
        <RouteWithLoader>
          <Lock />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.NotFound.path}
      element={
        <RouteWithLoader>
          <NotFoundPage />
        </RouteWithLoader>
      }
    />
    <Route
      exact
      path={AppRoutes.ServerError.path}
      element={
        <RouteWithLoader>
          <ServerError />
        </RouteWithLoader>
      }
    />

    {/* pages */}
    <Route
      exact
      path={AppRoutes.InventoryReceivingsReportTable.path}
      element={
        <RouteWithSidebar>
          <ReceivingsTable />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.InventoryReceivingsDetailsReport.path}
      element={
        <RouteWithSidebar>
          <ReceivingsDetailsReport />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.InventoryReceivingsReportForm.path}
      element={
        <RouteWithSidebar>
          <ReceivingsForm />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.InventorySummaryForm.path}
      element={
        <RouteWithSidebar>
          <InventorySummaryReport />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.InventorySummaryReport.path}
      element={
        <RouteWithSidebar>
          <SummarReportTable />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.LowInventoryForm.path}
      element={
        <RouteWithSidebar>
          <InventoryReport />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.LowInventoryReport.path}
      element={
        <RouteWithSidebar>
          <LowStockReportTable />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.DetailedInventoryForm.path}
      element={
        <RouteWithSidebar>
          <DetailedInventoryForm />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.DetailedInventoryReport.path}
      element={
        <RouteWithSidebar>
          <DetailedInventoryTable />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.Dashboard.path}
      element={
        <RouteWithSidebar>
          <Dashboard />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Upgrade.path}
      element={
        <RouteWithSidebar>
          <Upgrade />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Leads.path}
      element={
        <RouteWithSidebar>
          <Leadtable />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.CustomerServiceReportForm.path}
      element={
        <RouteWithSidebar>
          <CustomerServiceReport />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={`${AppRoutes.Customers.path}/*`}
      element={
        <RouteWithSidebar>
          <Routes>
            <Route path="/" element={<Customers />} />
            <Route
              path={AppRoutes.CustomerView.path}
              element={<CustomerView />}
            />
          </Routes>
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.CustomerRetentionReport.path}
      element={
        <RouteWithSidebar>
          <CustomerRetentionReport />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.CustomerBirthdayAnniversaryReport.path}
      element={
        <RouteWithSidebar>
          <CustomerBirthdayAnniversaryReport />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.Promotions.path}
      element={
        <RouteWithSidebar>
          <Promotions />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.PromotionsView.path}
      element={
        <RouteWithSidebar>
          <PromotionsView />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Appointments.path}
      element={
        <RouteWithSidebar>
          <Appointments />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.FamilyCard.path}
      element={
        <RouteWithSidebar>
          <FamilyCard />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.FamilyCardView.path}
      element={
        <RouteWithSidebar>
          <FamilyCardView />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Suppliers.path}
      element={
        <RouteWithSidebar>
          <Supplier />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Recievings.path}
      element={
        <RouteWithSidebar>
          <Recievings />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.TimeClock.path}
      element={
        <RouteWithSidebar>
          <TimeClock />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.GiftCard.path}
      element={
        <RouteWithSidebar>
          <GiftCard />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.GiftcardView.path}
      element={
        <RouteWithSidebar>
          <GiftcardView />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Coupons.path}
      element={
        <RouteWithSidebar>
          <Coupons />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Reports.path}
      element={
        <RouteWithSidebar>
          <Reports />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Items.path}
      element={
        <RouteWithSidebar>
          <Items />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.ItemKits.path}
      element={
        <RouteWithSidebar>
          <ItemKits />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.ItemKitView.path}
      element={
        <RouteWithSidebar>
          <ItemKitView />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.ItemKitEdit.path}
      element={
        <RouteWithSidebar>
          <ItemKitView />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.Employees.path}
      element={
        <RouteWithSidebar>
          <Employees />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.StoreConfig.path}
      element={
        <RouteWithSidebar>
          <StoreConfig />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Locations.path}
      element={
        <RouteWithSidebar>
          <Locations />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Messages.path}
      element={
        <RouteWithSidebar>
          <Messages />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Tickets.path}
      element={
        <RouteWithSidebar>
          <Tickets />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.PaymentsView.path}
      element={
        <RouteWithSidebar>
          <PaymentsView />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Reviews.path}
      element={
        <RouteWithSidebar>
          <Reviews />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.CustomerReport.path}
      element={
        <RouteWithSidebar>
          <CustomerReportsTable />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.TimeClock.path}
      element={
        <RouteWithSidebar>
          <TimeClock />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.GiftcardInfo.path}
      element={
        <RouteWithSidebar>
          <GiftcardInfo />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.FamilycardInfo.path}
      element={
        <RouteWithSidebar>
          <FamilycardInfo />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.SuspendSales.path}
      element={
        <RouteWithSidebar>
          <SuspendSales />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.PackageSale.path}
      element={
        <RouteWithSidebar>
          <PackageSale />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.Receipt.path}
      element={
        <RouteWithSidebar>
          <Receipt />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.CustomerDisplay.path}
      //component={CustomerDisplay}
      element={
        <RouteWithSidebar>
          <CustomerDisplay />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Sales.path}
      //component={Sales}
      element={
        <RouteWithSidebar>
          <Sales />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.TicketGenerator.path}
      //component={TicketGenerator}
      element={
        <RouteWithSidebar>
          <TicketGenerator />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.ItemsViewpage.path}
      //component={ItemsViewPage}
      element={
        <RouteWithSidebar>
          <ItemsViewPage />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.CouponsView.path}
      //component={CouponsView}
      element={
        <RouteWithSidebar>
          <CouponsView />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.EmployeesView.path}
      //component={EmployeesView}
      element={
        <RouteWithSidebar>
          <EmployeesView />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.ExpensesView.path}
      //component={ExpensesView}
      element={
        <RouteWithSidebar>
          <ExpensesView />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.LocationsView.path}
      //component={LocationsView}
      element={
        <RouteWithSidebar>
          <LocationsView />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.LastSaleReceipt.path}
      //component={lastSaleReceipt}
      element={
        <RouteWithSidebar>
          <lastSaleReceipt />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.RetailProduct.path}
      //component={RetailProduct}
      element={
        <RouteWithSidebar>
          <RetailProduct />
        </RouteWithSidebar>
      }
    />

    <Route
      exact
      path={AppRoutes.BootstrapTables.path}
      //component={BootstrapTables}
      element={
        <RouteWithSidebar>
          <BootstrapTables />
        </RouteWithSidebar>
      }
    />

    {/* Google My Business */}
    <Route
      exact
      path={AppRoutes.GoogleMyBusiness.path}
      element={
        <RouteWithSidebar>
          <GoogleMyBusiness />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.GmbCallback.path}
      element={
        <RouteWithSidebar>
          <GmbCallback />
        </RouteWithSidebar>
      }
    />

    {/* WhatsApp */}
    <Route
      exact
      path={AppRoutes.WhatsApp.path}
      element={
        <RouteWithSidebar>
          <WhatsAppPage />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.WhatsAppTemplateCreate.path}
      element={
        <RouteWithSidebar>
          <TemplateBuilder />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.WhatsAppTemplateEdit.path}
      element={
        <RouteWithSidebar>
          <TemplateBuilder />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.WhatsAppCampaigns.path}
      element={
        <RouteWithSidebar>
          <WhatsAppCampaigns />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.WhatsAppCampaignCreate.path}
      element={
        <RouteWithSidebar>
          <WhatsAppCampaignForm />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.WhatsAppCampaignEdit.path}
      element={
        <RouteWithSidebar>
          <WhatsAppCampaignForm />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.WhatsAppCampaignView.path}
      element={
        <RouteWithSidebar>
          <WhatsAppCampaignView />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.WhatsAppChat.path}
      element={
        <RouteWithSidebarNoFooter>
          <WhatsAppChat />
        </RouteWithSidebarNoFooter>
      }
    />

    {/* Help & Best Practices */}
    <Route
      exact
      path={AppRoutes.AIChat.path}
      element={
        <RouteWithSidebar>
          <AIChat />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.BestPractices.path}
      element={
        <RouteWithSidebar>
          <BestPractices />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.BestPracticesView.path}
      element={
        <RouteWithSidebar>
          <DocumentView />
        </RouteWithSidebar>
      }
    />

    {/* components */}
    <Route
      exact
      path={AppRoutes.Accordions.path}
      component={Accordion}
      element={
        <RouteWithSidebar>
          <Accordion />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Alerts.path}
      component={Alerts}
      element={
        <RouteWithSidebar>
          <Alerts />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Badges.path}
      component={Badges}
      element={
        <RouteWithSidebar>
          <Badges />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Breadcrumbs.path}
      component={Breadcrumbs}
      element={
        <RouteWithSidebar>
          <Breadcrumbs />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Buttons.path}
      component={Buttons}
      element={
        <RouteWithSidebar>
          <Buttons />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Forms.path}
      component={Forms}
      element={
        <RouteWithSidebar>
          <Forms />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Modals.path}
      component={Modals}
      element={
        <RouteWithSidebar>
          <Modals />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Navs.path}
      component={Navs}
      element={
        <RouteWithSidebar>
          <Navs />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Navbars.path}
      component={Navbars}
      element={
        <RouteWithSidebar>
          <Navbars />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Pagination.path}
      component={Pagination}
      element={
        <RouteWithSidebar>
          <Pagination />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Popovers.path}
      component={Popovers}
      element={
        <RouteWithSidebar>
          <Popovers />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Progress.path}
      component={Progress}
      element={
        <RouteWithSidebar>
          <Progress />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Tables.path}
      // component={Tables}
      element={
        <RouteWithSidebar>
          <Tables />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Tabs.path}
      //component={Tabs}
      element={
        <RouteWithSidebar>
          <Tabs />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Tooltips.path}
      //component={Tooltips}
      element={
        <RouteWithSidebar>
          <Tooltips />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.Toasts.path}
      //component={Toasts}
      element={
        <RouteWithSidebar>
          <Toasts />
        </RouteWithSidebar>
      }
    />

    {/* documentation */}
    <Route
      exact
      path={AppRoutes.DocsOverview.path}
      //component={DocsOverview}
      element={
        <RouteWithSidebar>
          <DocsOverview />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.DocsDownload.path}
      //component={DocsDownload}
      element={
        <RouteWithSidebar>
          <DocsDownload />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.DocsQuickStart.path}
      ///component={DocsQuickStart}
      element={
        <RouteWithSidebar>
          <DocsQuickStart />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.DocsLicense.path}
      //component={DocsLicense}
      element={
        <RouteWithSidebar>
          <DocsLicense />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.DocsFolderStructure.path}
      //component={DocsFolderStructure}
      element={
        <RouteWithSidebar>
          <DocsFolderStructure />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.DocsBuild.path}
      //component={DocsBuild}
      element={
        <RouteWithSidebar>
          <DocsBuild />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.DocsChangelog.path}
      //component={DocsChangelog}
      element={
        <RouteWithSidebar>
          <DocsChangelog />
        </RouteWithSidebar>
      }
    />
    <Route
      exact
      path={AppRoutes.TicketDetails.path}
      //component={DocsChangelog}
      element={
        <RouteWithSidebar>
          <TicketDetails />
        </RouteWithSidebar>
      }
    />
    <Route
      //component={Errorpage}
      element={
        <RouteWithSidebar>
          <Errorpage />
        </RouteWithSidebar>
      }
    />
  </Routes>
);

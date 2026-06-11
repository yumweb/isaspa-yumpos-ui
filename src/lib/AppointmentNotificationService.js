import clientAdapter from "./clientAdapter";
import { toast } from "react-toastify";

class AppointmentNotificationService {
  constructor() {
    this.isPolling = false;
    this.pollingInterval = null;
    this.notifiedAppointments = this.getNotifiedAppointments();
    this.reminderMinutes = 120;
    this.pollingIntervalMs = 900000; // 15 minutes
    this.isVisible = true;
    this.callbacks = {
      onNewReminder: null,
      onError: null,
    };

    // Bind methods
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.poll = this.poll.bind(this);

    // Setup page visibility listener
    this.setupVisibilityListener();
  }

  // Setup Page Visibility API to pause polling when tab is not active
  setupVisibilityListener() {
    if (typeof document !== "undefined") {
      document.addEventListener(
        "visibilitychange",
        this.handleVisibilityChange
      );
    }
  }

  handleVisibilityChange() {
    this.isVisible = !document.hidden;

    if (this.isVisible && !this.isPolling) {
      // Resume polling when tab becomes visible
      this.startPolling();
    } else if (!this.isVisible && this.isPolling) {
      // Pause polling when tab is hidden to save resources
      this.stopPolling();
    }
  }

  // Start polling for appointment reminders
  startPolling(reminderMinutes = 60) {
    if (this.isPolling) {
      return;
    }

    this.reminderMinutes = reminderMinutes;
    this.isPolling = true;

    // Initial poll
    this.poll();

    // Set up interval
    this.pollingInterval = setInterval(this.poll, this.pollingIntervalMs);

    console.log(
      `AppointmentNotificationService: Started polling every ${
        this.pollingIntervalMs / 60000
      } minutes for ${reminderMinutes} minute reminders`
    );
  }

  // Stop polling
  stopPolling() {
    if (!this.isPolling) {
      return;
    }

    this.isPolling = false;

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    console.log("AppointmentNotificationService: Stopped polling");
  }

  // Main polling function
  async poll() {
    try {
      const reminderData = await clientAdapter.getUpcomingAppointmentReminders(
        this.reminderMinutes
      );

      if (reminderData && reminderData.count > 0) {
        await this.processReminderData(reminderData);
      }
    } catch (error) {
      console.error(
        "AppointmentNotificationService: Error polling appointments:",
        error
      );
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    }
  }

  // Process reminder data and show notification if count has changed
  async processReminderData(reminderData) {
    const notificationKey = `reminder_${this.reminderMinutes}_${reminderData.timeWindow.startIST}`;

    if (!this.hasBeenNotified(notificationKey)) {
      await this.showCountNotification(reminderData);
      this.markAsNotified(notificationKey);
    }
  }

  // Show toast notification for appointment count
  async showCountNotification(reminderData) {
    const message = reminderData.message;

    // Show toast notification with click action
    toast.info(message, {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClick: () => {
        // Navigate to appointments page
        window.location.href = "/appointments";
      },
      toastId: "appointment-reminder", // Prevent duplicate toasts
    });

    // Call callback if provided
    if (this.callbacks.onNewReminder) {
      this.callbacks.onNewReminder(reminderData);
    }

    console.log(
      `AppointmentNotificationService: Toast notification shown for ${reminderData.count} appointments`
    );
  }

  // Local storage methods for tracking notified appointments
  getNotifiedAppointments() {
    try {
      const stored = localStorage.getItem("notifiedAppointments");
      const notified = stored ? JSON.parse(stored) : {};

      // Clean up old entries (older than 24 hours)
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const cleaned = {};

      for (const [id, timestamp] of Object.entries(notified)) {
        if (timestamp > oneDayAgo) {
          cleaned[id] = timestamp;
        }
      }

      localStorage.setItem("notifiedAppointments", JSON.stringify(cleaned));
      return cleaned;
    } catch (error) {
      console.error(
        "AppointmentNotificationService: Error loading notified appointments:",
        error
      );
      return {};
    }
  }

  hasBeenNotified(appointmentId) {
    return this.notifiedAppointments.hasOwnProperty(appointmentId.toString());
  }

  markAsNotified(appointmentId) {
    this.notifiedAppointments[appointmentId.toString()] = Date.now();
    try {
      localStorage.setItem(
        "notifiedAppointments",
        JSON.stringify(this.notifiedAppointments)
      );
    } catch (error) {
      console.error(
        "AppointmentNotificationService: Error saving notified appointments:",
        error
      );
    }
  }

  // Callback registration
  onNewReminder(callback) {
    this.callbacks.onNewReminder = callback;
  }

  onError(callback) {
    this.callbacks.onError = callback;
  }

  // Configuration methods
  setReminderMinutes(minutes) {
    this.reminderMinutes = minutes;
  }

  setPollingInterval(milliseconds) {
    if (this.isPolling) {
      this.stopPolling();
    }
    this.pollingIntervalMs = milliseconds;
    if (this.isPolling) {
      this.startPolling();
    }
  }

  // Cleanup method
  destroy() {
    this.stopPolling();
    if (typeof document !== "undefined") {
      document.removeEventListener(
        "visibilitychange",
        this.handleVisibilityChange
      );
    }
    this.callbacks = {};
  }

  // Status methods
  getStatus() {
    return {
      isPolling: this.isPolling,
      reminderMinutes: this.reminderMinutes,
      pollingIntervalMs: this.pollingIntervalMs,
      isVisible: this.isVisible,
      notificationType: "toast",
      notifiedCount: Object.keys(this.notifiedAppointments).length,
    };
  }
}

// Export singleton instance
const appointmentNotificationService = new AppointmentNotificationService();
export default appointmentNotificationService;

import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * Mobile notifications service using Capacitor LocalNotifications
 */

export const notificationService = {
  /**
   * Initialize notifications
   */
  async initialize() {
    try {
      // Request permission for notifications
      const permission = await LocalNotifications.requestPermissions();
      console.log('Notification permission:', permission);
      return permission;
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  },

  /**
   * Schedule a local notification
   */
  async sendNotification(options) {
    try {
      const {
        title = 'AI Diet Planner',
        body = '',
        id = Math.floor(Math.random() * 10000),
        delaySeconds = 0,
        smallIcon = 'icon',
      } = options;

      const notificationTime = new Date();
      notificationTime.setSeconds(notificationTime.getSeconds() + delaySeconds);

      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: parseInt(id),
            schedule: {
              at: notificationTime,
            },
            smallIcon,
            largeBody: body,
          },
        ],
      });

      console.log(`Notification scheduled: ${title}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  },

  /**
   * Schedule recurring notifications
   */
  async scheduleRecurring(options) {
    try {
      const {
        title = 'AI Diet Planner',
        body = '',
        id = Math.floor(Math.random() * 10000),
        hourOfDay = 9,
        minuteOfHour = 0,
      } = options;

      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: parseInt(id),
            schedule: {
              on: {
                hour: hourOfDay,
                minute: minuteOfHour,
              },
            },
            smallIcon: 'icon',
            largeBody: body,
          },
        ],
      });

      console.log(`Recurring notification scheduled: ${title}`);
    } catch (error) {
      console.error('Error scheduling recurring notification:', error);
    }
  },

  /**
   * Cancel a notification by ID
   */
  async cancelNotification(id) {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: parseInt(id) }],
      });
      console.log(`Notification ${id} cancelled`);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  },

  /**
   * Cancel all notifications
   */
  async cancelAll() {
    try {
      await LocalNotifications.removeAllDelivered();
      await LocalNotifications.removeAllTags();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  },

  /**
   * Get pending notifications
   */
  async getPending() {
    try {
      const { notifications } = await LocalNotifications.getPending();
      return notifications;
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  },

  /**
   * Set up water reminder notification
   */
  async setWaterReminder(enabled = true, hourOfDay = 9) {
    if (!enabled) {
      await this.cancelNotification(1001);
      return;
    }

    await this.scheduleRecurring({
      id: 1001,
      title: '💧 Water Reminder',
      body: 'Time to drink water! Stay hydrated.',
      hourOfDay,
    });
  },

  /**
   * Set up meal reminder notification
   */
  async setMealReminder(enabled = true, hourOfDay = 12) {
    if (!enabled) {
      await this.cancelNotification(1002);
      return;
    }

    await this.scheduleRecurring({
      id: 1002,
      title: '🥗 Meal Time',
      body: 'Time for your meal. Log your food in the tracker.',
      hourOfDay,
    });
  },

  /**
   * Set up weigh-in reminder notification
   */
  async setWeighInReminder(enabled = true, hourOfDay = 7) {
    if (!enabled) {
      await this.cancelNotification(1003);
      return;
    }

    await this.scheduleRecurring({
      id: 1003,
      title: '⚖️ Weigh In Reminder',
      body: 'Time for your daily weigh-in. Log your weight in progress tracker.',
      hourOfDay,
    });
  },
};

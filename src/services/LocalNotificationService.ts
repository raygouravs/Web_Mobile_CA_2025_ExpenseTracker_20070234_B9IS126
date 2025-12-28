/*
    REFERENCE: Ionic (2025) Local Notifications Native Plugin, docs Available at: https://ionicframework.com/docs/native/local-notifications
*/

import { LocalNotifications } from "@capacitor/local-notifications";
import { showToast } from "../utils/utilitymethods";
import ScheduledTransactionsService from "./ScheduledTransactionsService";

export default class LocalNotificationService {

    static async checkNotificationPermission(): Promise<boolean> {
        const permissionStatus = await LocalNotifications.checkPermissions();
        return permissionStatus.display === 'granted';
    }

    static async requestNotificationPermission(): Promise<boolean> {
        const permissionStatus = await LocalNotifications.requestPermissions();
        return permissionStatus.display === 'granted';
    }

    static checkAndRequestNotificationPermissions = async () => {
        const hasPermission = await LocalNotificationService.checkNotificationPermission();
        if (!hasPermission) {
            const granted = await LocalNotificationService.requestNotificationPermission();
            if (!granted) {
                window.alert('Please enable notifications for this app from Settings!')
            }
        }
   }

    static scheduleReminders = async (description: string, notificationFireDates: string[], schedID:string) => {
        try {

            const hasPermission = await LocalNotificationService.checkNotificationPermission();
            if (!hasPermission) {
                showToast('Please enable notifications for this app from Settings!', 'long');
                return;
            }

            const now = new Date();
            let notification_id_array: number[] = [];

            // ----------------------------------------------------------------------------------------

            notificationFireDates.forEach(async (notification_fire_date) => {
                if (new Date(notification_fire_date) <= now) {
                    showToast('The reminder date has already passed, skipping notification.', 'short');
                    return; 
                }
                const notification_id = Math.floor(Math.random() * 1000000);
                await LocalNotifications.schedule({
                    notifications: [
                        {
                            title: "Alert! Upcoming Transaction...",
                            body: `Reminder: ${description} is due tomorrow!`,
                            id: notification_id, 
                            channelId: 'budget_alerts_high_v3',
                            schedule: { 
                                at: new Date(notification_fire_date),
                                allowWhileIdle: true
                            },
                            sound: 'default',
                            actionTypeId: "",
                            extra: null
                        }
                    ]
                });
                notification_id_array.push(notification_id);
            });
                            
            // ----------------------------------------------------------------------------------------------
            await ScheduledTransactionsService.saveNotificationIDs(schedID, notification_id_array);
            showToast(`Notifications scheduled successfully for the schedule!`, 'short');

        } catch (error) {
            console.error("Error in scheduling reminder:", error);
            showToast("Error in scheduling reminder!", 'short');
        }
    }

    static budgetNotification = async () => {
        await LocalNotifications.schedule({
                notifications: [
                {
                    title: "Budget Alert! ⚠️",
                    body: `You have reached your monthly budget limit of this month!`,
                    id: 999,
                    channelId: 'budget_alerts_high_v3',
                    schedule: { at: new Date(Date.now() + 1000) },
                    sound: 'default',
                    extra: null
                }
                ]
        }); 
    }

    // create notification channel (notification banner)
    static createNotificationChannel = async () => {
      await LocalNotifications.createChannel({
        id: 'budget_alerts_high_v3',
        name: 'Budget & Reminders',
        description: 'Critical alerts for budget limits',
        importance: 5,
        visibility: 1,
        sound: 'default',
        vibration: true,
      });
    }

    //MARK: cancel a batch of local notifications 
    static cancelBatchNotifications = async (ids: number[]) => { 
        try {
            const notificationsToCancel = ids.map(id => ({ id }));
            await LocalNotifications.cancel({
                notifications: notificationsToCancel
            });
            console.log(`${ids.length} notifications cancelled successfully.`);
            showToast(`${ids.length} scheduled notifications cancelled successfully!`, 'short');
        } catch (error) {
            console.error("Failed to cancel notifications:", error);
        }
    }

    // cancel notification
    static cancelNotification = async (id: number) => {
        await LocalNotifications.cancel({
            notifications: [{ id: id }]
        });
        console.log(`Notification ${id} cancelled`);
    }
}




import { LocalNotifications } from "@capacitor/local-notifications";

export default class LocalNotificationService {

    static async checkNotificationPermission(): Promise<boolean> {
        const permissionStatus = await LocalNotifications.checkPermissions();
        return permissionStatus.display === 'granted';
    }

    static async requestNotificationPermission(): Promise<boolean> {
        const permissionStatus = await LocalNotifications.requestPermissions();
        return permissionStatus.display === 'granted';
    }




}
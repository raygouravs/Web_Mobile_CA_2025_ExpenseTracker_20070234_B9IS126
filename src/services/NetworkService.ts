/*
    REFERENCE: Ionic (2025) Network Capacitor Plugin API. Available at: https://ionicframework.com/docs/native/network
*/

import { Network } from '@capacitor/network';
import { showToast } from '../utils/utilitymethods';

export class NetworkConnectivity {
    static async isNetworkAvailable(): Promise<boolean> {
        const status = await Network.getStatus();
        return status.connected ?? false;
    }
}
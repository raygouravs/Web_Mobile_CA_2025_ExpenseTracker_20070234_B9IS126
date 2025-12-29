/*
    REFERENCE: Ionic (2025) @capacitor/device plugin. Available at: https://capacitorjs.com/docs/apis/device.
*/

import { Device } from '@capacitor/device';
import ScheduledTransactionsService from './ScheduledTransactionsService';


export default class DeviceIdentifierService {
    private static storeDeviceIdentifier = async (): Promise<string> => {
     const id = (await Device.getId()).identifier;
     await ScheduledTransactionsService.storeDeviceIdentifier(id);
     return id;
    };

    static fetchDeviceIdentifier = async (): Promise<string> => {
     const id = await ScheduledTransactionsService.getDeviceIdentifier();
     if(id.trim() === ''){
        const id = await this.storeDeviceIdentifier();
        return id;
     }
     return id;
    }
}



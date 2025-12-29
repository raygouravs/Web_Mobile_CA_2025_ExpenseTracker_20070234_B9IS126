/*
    REFERENCE: Firebase (2025) Firebase Javascript API reference. Available at: https://firebase.google.com/docs/reference/js/storage.md?authuser=0#storage_package
*/
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { storage } from '../firebase/firebaseConfig';
import DeviceIdentifierService from '../services/DeviceIdentifierService';
import { NetworkConnectivity } from '../services/NetworkService';
import { DiskStorageService } from '../services/DiskStorageService';
import { showToast } from '../utils/utilitymethods';


export class FirebaseSyncService {

  //MARK: sync with server
  static async syncToFirebase(): Promise<void> {
    
    const deviceId = await DeviceIdentifierService.fetchDeviceIdentifier();
        
    let FILES: string[] = [];

    FILES = DiskStorageService.getUserDataFileNames();

    const isOnline = await NetworkConnectivity.isNetworkAvailable();

    if(!isOnline) {
        showToast('No internet connectivity! Please try again!', 'short');
        return;
    }

    for (const fileName of FILES) {
      try {
        const localFile = await Filesystem.readFile({
          path: fileName,
          directory: Directory.Data,
          encoding: Encoding.UTF8
        });

        const storageRef = ref(
          storage,
          `devices/${deviceId}/${fileName}`
        );

        await uploadString(storageRef, localFile.data as string, 'raw', {
          contentType: 'application/json'
        });

      } catch (err) {
        console.warn(`Skipping upload for ${fileName}`, err);
      }
    }
  }

  //MARK: download from server only in case of fresh install
  static async restoreFromFirebase(): Promise<void> {

    const deviceId = await DeviceIdentifierService.fetchDeviceIdentifier();

    let FILES: string[] = [];
    
    FILES = DiskStorageService.getUserDataFileNames();

    const isOnline = await NetworkConnectivity.isNetworkAvailable();

    if(!isOnline) {
        showToast('No internet connectivity! Please try again!', 'short');
        return;
    }

    for (const fileName of FILES) {
      try {
            // Check if local file already exists
            await Filesystem.readFile({
                path: fileName,
                directory: Directory.Data,
                encoding: Encoding.UTF8
            });
            continue;
      } catch {
        console.log('file does not exist, download from firebase...')
      }

      try {
        const fileRef = ref(
          storage,
          `devices/${deviceId}/${fileName}`
        );

        const url = await getDownloadURL(fileRef);
        const response = await fetch(url);
        const json = await response.text();

        await Filesystem.writeFile({
          path: fileName,
          data: json,
          directory: Directory.Data,
          encoding: Encoding.UTF8
        });

      } catch (err) {
        console.warn(`Restore failed for ${fileName}`, err);
      }
    }
  }
}

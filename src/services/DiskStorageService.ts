/*
    REFERENCE: Ionic (2024) Filesystem Capacitor Plugin API. Available at: https://ionicframework.com/docs/native/filesystem
*/

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Entry } from '../models/Entry';

export class DiskStorageService {
  
  private static DEFAULT_DIR = Directory.Data;
  private static FILE_NAME = 'user_expense_data.json';

  static async saveEntry(data: Entry) {
    try {
        let entries = await this.loadEntries();
        entries.push(data);
        await Filesystem.writeFile({
        path: DiskStorageService.FILE_NAME,
        data: JSON.stringify(entries),
        directory: this.DEFAULT_DIR,
        encoding: Encoding.UTF8,
      });
      console.log(`${DiskStorageService.FILE_NAME} saved successfully.`);      
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  }

  static async loadEntries(): Promise<Entry[]> {
    try {
      const result = await Filesystem.readFile({
        path: DiskStorageService.FILE_NAME,
        directory: DiskStorageService.DEFAULT_DIR,
        encoding: Encoding.UTF8,
      });
      return JSON.parse(result.data as string);
    } catch (error) {
      console.error("Error loading file:", error);
      return [];
    }
  }
}


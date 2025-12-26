/*
    REFERENCE: Ionic (2025) Filesystem Capacitor Plugin API. Available at: https://ionicframework.com/docs/native/filesystem
*/

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Entry } from '../models/Entry';
import { refresh } from 'ionicons/icons';

export class DiskStorageService {
  
  private static DEFAULT_DIR = Directory.Data;
  private static FILE_NAME = 'user_expense_data.json';
  private static PAST_DATA_FILE_NAME_PREFIX: string = 'user_past_data_';

  private static pastDataFileNameGenerator() {
    const todaysDate: string = new Date().toISOString().split('T')[0];
    // "2025-12-26"
    const currentYear: string = todaysDate.split("-")[0];
    return this.PAST_DATA_FILE_NAME_PREFIX + currentYear + '.json';
  }

  private static lastYearsFileNameGenerator() {
    const todaysDate: string = new Date().toISOString().split('T')[0];
    // "2025-12-26"
    const currentYear: string = todaysDate.split("-")[0];
    const previousYear: number = Number(currentYear) - 1;
    return this.PAST_DATA_FILE_NAME_PREFIX + String(previousYear) + '.json';
  }

  private static getCurrentMonth() {
    const todaysDate: string = new Date().toISOString().split('T')[0];
    // "2025-12-26"
    const parts: string[] = todaysDate.split("-");
    const MM = Number(parts[1]);
    return MM;
  }

  private static getDateYear(date_str:string) {
    const todaysDate: string = date_str;
    const parts: string[] = todaysDate.split("-");
    const YYYY = Number(parts[0]);
    return YYYY;
  }

  private static filterOlderData(entries: Entry[]) {
    let olderData: Entry[] = []
    let MM = this.getCurrentMonth();
    const todaysDate: string = new Date().toISOString().split('T')[0];
    const current_year = Number(todaysDate.split("-")[0]);
    entries.forEach((e) => {
      let entry_date = e.date;
      let e_date_year = Number(entry_date.split("-")[0]);
      let year_diff = current_year - e_date_year;
      if(year_diff === 0 && Number(entry_date.split("-")[1]) < MM) {
        olderData.push(e);
      }
      if(year_diff > 0) {
        if(Number(entry_date.split("-")[1]) - MM === 11){
          olderData.push(e);
        }
      }
    })
    return olderData;
  }

  private static async savePastDataBeforePurge(olderEntries: Entry[]){
    let monthly_data_dict = await this.loadPastData();
    olderEntries.forEach((e) => {
      const e_date_month = Number(e.date.split("-")[1]);
      const currentTotal = monthly_data_dict[e_date_month] || 0;
      const newTotal = currentTotal + e.amount;
      monthly_data_dict[e_date_month] = Number(newTotal.toFixed(2));
    });
    //MARK: save older entries to separate json file here !!!
    try {
      const MM = this.getCurrentMonth();
      let past_data_path = '';
      if(MM === 1) {
        past_data_path = this.lastYearsFileNameGenerator();
      } else {
        past_data_path = this.pastDataFileNameGenerator();
      }
      await Filesystem.writeFile({
        path: past_data_path,
        data: JSON.stringify(monthly_data_dict),
        directory: this.DEFAULT_DIR,
        encoding: Encoding.UTF8,
      });
      console.log(`${past_data_path} saved successfully.`); 
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  }

  static async saveEntry(data: Entry) {
    try {
        let entries = await this.loadEntries();
        entries.push(data);
        let olderData = this.filterOlderData(entries);
        if(olderData.length > 0) {
          const _ = await this.savePastDataBeforePurge(olderData);
        }
        let MM = this.getCurrentMonth();
        const todaysDate: string = new Date().toISOString().split('T')[0];
        const current_year = this.getDateYear(todaysDate);
        const current_years_data = entries.filter(e => Number(e.date.split("-")[0]) === Number(current_year))
        const filtered_data = current_years_data.filter((e) => {
          const year_diff = current_year - Number(e.date.split("-")[0]);
          return (year_diff === 0 && Number(e.date.split("-")[1]) === MM);
        });
        await Filesystem.writeFile({
          path: DiskStorageService.FILE_NAME,
          data: JSON.stringify(filtered_data),
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

  static async saveEntries(data: Entry[]) {
    // This method is called only in the handleDelete function, used to handle swipe-to-delete
    try {
        await Filesystem.writeFile({
        path: DiskStorageService.FILE_NAME,
        data: JSON.stringify(data),
        directory: this.DEFAULT_DIR,
        encoding: Encoding.UTF8,
      });
      console.log(`${DiskStorageService.FILE_NAME} saved successfully.`);      
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  }

  static async loadPastData(): Promise<Record<number, number>> {
    try {
      const MM = this.getCurrentMonth();
      let past_data_path = '';
      if(MM === 1) {
        past_data_path = this.lastYearsFileNameGenerator();
      } else {
        past_data_path = this.pastDataFileNameGenerator();
      }
      const result = await Filesystem.readFile({
        path: past_data_path,
        directory: DiskStorageService.DEFAULT_DIR,
        encoding: Encoding.UTF8,
      });
      return JSON.parse(result.data as string);
    } catch (error) {
      console.error("Error loading file:", error);
      const monthly_data_dict: Record<number, number> = {
        1: 0.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
        6: 0.0,
        7: 0.0,
        8: 0.0,
        9: 0.0,
        10: 0.0,
        11: 0.0,
        12: 0.0
      };
      return monthly_data_dict;
    }
  }
}


/*
    REFERENCE: Ionic (2025) Preferences Capacitor Plugin. Available at: https://capacitorjs.com/docs/apis/preferences
*/
import { Preferences } from '@capacitor/preferences';
import { RecurringSchedule, RecurrencePeriod } from '../models/RecurringEntry';
import { MonthlyBudget, showToast } from '../utils/utilitymethods';
import LocalNotificationService from '../services/LocalNotificationService';

const SCHEDULE_KEY = 'recurring_transactions';
const BUDGET_KEY_PREFIX = 'budget_'; // 'bugdet_2025_12'

export default class ScheduledTransactionsService {

    private static budgetKeyGen = (budget: MonthlyBudget) => {
        return `${BUDGET_KEY_PREFIX}${budget.year}_${budget.month}`;
    }

    static async loadSchedules(): Promise<RecurringSchedule[]> {
        const { value } = await Preferences.get({ key: SCHEDULE_KEY });
        return value ? JSON.parse(value) : [];
    }

    static saveSchedule = async (schedule: RecurringSchedule) => {
        const schedules = await this.loadSchedules();
        schedules.push(schedule);
        await Preferences.set({
            key: SCHEDULE_KEY,
            value: JSON.stringify(schedules)
        });
    }

    //for saving an entire batch of schedules
    static saveSchedulesBatch = async (schedules: RecurringSchedule[]) => {
        await Preferences.set({
            key: SCHEDULE_KEY,
            value: JSON.stringify(schedules)
        });
        showToast(`Notifications batch updated!`, 'short')
    }

    static deleteSchedule = async (id: string) => {
        const schedules = await this.loadSchedules();
        const filteredSchedules = schedules.filter(s => s.id !== id);
        await Preferences.set({
            key: SCHEDULE_KEY,
            value: JSON.stringify(filteredSchedules)
        });
        // delete the associated notification IDs
        const notif_id_to_delete = this.getNotificationIDsBySchedID(id);
        const notif_ids_batch = await notif_id_to_delete;
        await LocalNotificationService.cancelBatchNotifications(notif_ids_batch);
    }

    //setting screen budget tracker
    static updateMonthlyBudget = async (budget: MonthlyBudget) => {
        const budget_key = this.budgetKeyGen(budget);
        const { value } = await Preferences.get({ key: budget_key}); 
        let mbudget = value ? JSON.parse(value) : {amount: 0, month: budget.month, year: budget.year};
        mbudget.amount = budget.amount;
        await Preferences.set({
            key: budget_key,
            value: JSON.stringify(mbudget)
        });
    }

    //setting screen budget tracker
    static getMonthlyBudget = async (budget: MonthlyBudget): Promise<MonthlyBudget> => {
        const budget_key = this.budgetKeyGen(budget);
        const { value } = await Preferences.get({ key: budget_key});
        return value ? JSON.parse(value) : {amount: 0, month: budget.month, year: budget.year};
    }

    //store notification IDs
    static saveNotificationIDs = async (schedID:string, notIDs:number[]) => {
        await Preferences.set({
            key: schedID,
            value: JSON.stringify(notIDs)
        });
    }

    //fetch notification IDs
    static getNotificationIDsBySchedID = async (schedID:string): Promise<number[]> => {
        const { value } = await Preferences.get({ key: schedID });
        return value ? JSON.parse(value) : [];
    }
}


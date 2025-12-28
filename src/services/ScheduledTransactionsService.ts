/*
    REFERENCE: Ionic (2025) Preferences Capacitor Plugin. Available at: https://capacitorjs.com/docs/apis/preferences
*/
import { Preferences } from '@capacitor/preferences';
import { RecurringSchedule, RecurrencePeriod } from '../models/RecurringEntry';

const SCHEDULE_KEY = 'recurring_transactions';

export default class ScheduledTransactionsService {

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

    static deleteSchedule = async (id: string) => {
        const schedules = await this.loadSchedules();
        const filteredSchedules = schedules.filter(s => s.id !== id);
        await Preferences.set({
            key: SCHEDULE_KEY,
            value: JSON.stringify(filteredSchedules)
        });
    }
}


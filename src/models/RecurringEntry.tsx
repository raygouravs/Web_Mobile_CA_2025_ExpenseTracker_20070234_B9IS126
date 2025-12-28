export type RecurrencePeriod = 'weekly' | 'monthly' | 'yearly';

export interface RecurringSchedule {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryOrSource: string;
  description: string;
  period: RecurrencePeriod;
  startDate: string; //YYYY-MM-DD
  endDate?: string; //YYYY-MM-DD 
  notificationDates: string[]; //[YYYY-MM-DD] 
  timestamp: number;
}


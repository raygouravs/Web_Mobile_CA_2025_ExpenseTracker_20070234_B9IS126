import { Toast } from '@capacitor/toast';

export class UtilityMethods {
    static getCurrentMonth = () => {
        const todaysDate: string = new Date().toISOString().split('T')[0];
        // "2025-12-26"
        const parts: string[] = todaysDate.split("-");
        const MM = Number(parts[1]);
        return MM;
    }
}

export interface MonthlyStats {
  expense: number,
  income: number
}

export interface DoughnutData {
  labels: string[],
  datasets: {
    label: string,
    data: number[],
    backgroundColor: string[],
    hoverOffset: number
  }[]
}

export interface MonthlyBudget {
  amount: number;
  month: string; // MM
  year: string; // YYYY
}



export const showToast = async (desc: string, duration: 'short' | 'long') => {
  await Toast.show({
    text: desc,
    duration: duration,
    position: 'bottom',
  });
};


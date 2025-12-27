import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem } from '@ionic/react';
import FilterToggle from '../components/FilterToggle';
import { useEffect, useState } from 'react';
import { DiskStorageService } from '../services/DiskStorageService';
import WalletTopHalfComponent from '../components/WalletTopHalfComponent';
import WalletBottomHalfComponent from '../components/WalletBottomHalfComponent';
import { ModuleNode } from 'vite';

export default function Tab2() {
  const [cashflow, setCashflow] = useState(0);
  const [totalwealth, setTotalwealth] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [tincome, setTincome] = useState(0);
  const [texpense, setTexpense] = useState(0);
  const [mcashflow, setMcashflow] = useState<number[]>([]);

  useEffect(() => {

    const initData = async () => {
      //current month data
      const entries = await DiskStorageService.loadEntries();
      let income = 0;
      entries.filter(e => e.type === 'income').forEach((e) => {
        income = income + e.amount;
      });
      let expense = 0;
      entries.filter(e => e.type === 'expense').forEach((e) => {
        expense = expense + e.amount;
      });
      let cash_flow = income-expense;

      //past data
      const past_data = await DiskStorageService.loadPastData();
      let total_wealth = Object.values(past_data).reduce((s, month) => {
        const month_balance = month.income - month.expense;
        s = s + month_balance;
        return s;
      }, 0)
      total_wealth = total_wealth + cash_flow;

      let t_income = Object.values(past_data).reduce((s, month) => {
        s = s + month.income;
        return s;
      }, 0)
      t_income = t_income + income;

      let t_expense = Object.values(past_data).reduce((s, month) => {
        s = s + month.expense;
        return s;
      }, 0)
      t_expense = t_expense + expense;

      //calculating monthly cash-flow data
      let mcf = [];
      Object.values(past_data).forEach((e) => {
        const monthly_cashflow = e.income - e.expense;
        mcf.push(monthly_cashflow);
      })
      mcf.push(cash_flow);

      //set all state
      setIncome(income);
      setExpense(expense);
      setCashflow(cash_flow);
      setTotalwealth(total_wealth);
      setTincome(t_income);
      setTexpense(t_expense);
      setMcashflow(mcf);
    }
      
    initData();
  }, []);

  function currentMonthYear() {
    const todaysDate: string = new Date().toISOString().split('T')[0];
    const current_year = Number(todaysDate.split("-")[0]);
    const current_month_number = Number(todaysDate.split("-")[1]);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const current_month = months[Number(current_month_number)-1];
    return `${current_month}, ${current_year}`;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{currentMonthYear()}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <WalletTopHalfComponent totalIncome={String(tincome.toFixed(2))} totalExpenses={String(texpense.toFixed(2))} monthlycashflow={mcashflow}/>
        <WalletBottomHalfComponent />
      </IonContent>
    </IonPage>
  );
}

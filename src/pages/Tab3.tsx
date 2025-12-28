/*
  REFERENCE: Ionic (2025) ion-progress-bar api docs. Avaialbe at: https://ionicframework.com/docs/api/progress-bar
*/
import { IonContent, IonHeader, IonPage, 
         IonTitle, IonToolbar, IonItem,
         IonLabel, IonInput, IonButton, 
         IonProgressBar, IonLoading } from '@ionic/react';
import './Tab3.css';
import { useEffect, useState } from 'react';
import { MonthlyBudget, showToast } from '../utils/utilitymethods';
import ScheduledTransactionsService from '../services/ScheduledTransactionsService';
import { VibrationService } from '../services/VibrationService';
import { DiskStorageService } from '../services/DiskStorageService';
import { useIonViewWillEnter } from '@ionic/react';

const Tab3: React.FC = () => {
  const [bamount, setBamount] = useState<number>(0);
  const [editable, setEditable] = useState<boolean>(false);
  const [pval, setPval] = useState<number>(0.0);
  const [buttontitle, setButtontitle] = useState<'Modify' | 'Save'>('Modify');
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const BUDGET_KEY_PREFIX = 'budget_'; // 'bugdet_2025_12'

  const getCurrentMonth = () => {
    const todaysDate: string = new Date().toISOString().split('T')[0];
    // "2025-12-26"
    const parts: string[] = todaysDate.split("-");
    const MM = parts[1];
    return MM;
  }

  const getCurrentYear = () => {
    const todaysDate: string = new Date().toISOString().split('T')[0];
    // "2025-12-26"
    const parts: string[] = todaysDate.split("-");
    const YYYY = parts[0];
    return YYYY;
  }

  const budgetKeyGen = (year: string, month: string) => {
    return `${BUDGET_KEY_PREFIX}${year}_${month}`;
  }

  async function handleButtonClick(inputAmount?: number) {
    // modify mode
    if(editable === false){
      setEditable(true);
      setButtontitle('Save')
    }

    // save mode
    if(editable === true){
      setShowLoading(true);
      const cyear = getCurrentYear();
      const cmonth = getCurrentMonth();
      const updatedBudget: MonthlyBudget = {
        amount: inputAmount ?? 0,
        month: cmonth,
        year: cyear
      }
      await ScheduledTransactionsService.updateMonthlyBudget(updatedBudget);
      VibrationService.vibrate();
      budgetProgressTracker();
      setEditable(false)
      setButtontitle('Modify')
      setShowLoading(false);
      showToast('Budget updated successfully!', 'short');
    }
  }

  async function budgetProgressTracker(){
    const cyear = getCurrentYear();
    const cmonth = getCurrentMonth();
    const gbudget:MonthlyBudget = {
      amount: 0,
      month: cmonth,
      year: cyear
    }
    const current_month_budget_obj = await ScheduledTransactionsService.getMonthlyBudget(gbudget);
    const current_month_budget_amt = current_month_budget_obj.amount;
    if(current_month_budget_amt === 0 || current_month_budget_amt === 0.0){
      return;
    } 
    const entries = await DiskStorageService.loadEntries();
    let t_expense:number = 0;
    t_expense = entries.reduce((acc, e) => {
      if(e.type === 'expense'){
        acc = acc + e.amount;
      }
      return acc;
    }, 0)
    let progress = t_expense/current_month_budget_amt;
    if(progress>1){
      progress = 1.0;
    }
    setBamount(current_month_budget_amt);
    setPval(progress);
  }

  useIonViewWillEnter(() => {
    budgetProgressTracker();
  });
   
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonItem color='dark'>
            <IonLabel className="ion-text-wrap" color='warning'><b>BUDGET TRACKER:</b> Create a monthly spending budget. Get notified when you hit your limit.</IonLabel>
      </IonItem>
      <IonContent className="ion-padding" color='light'>
          <IonItem lines="none" style={{ '--padding-start': '0px', '--inner-padding-end': '0px' }}>
              <IonLabel slot="start" style={{ marginRight: '4px', fontSize: '1.2rem', fontWeight: 'bold', flex: 'none' }}>
                €
              </IonLabel>
              <IonInput
                id = 'budgetInput'
                type="number"
                placeholder="0.00"
                value={bamount}
                disabled={!editable}
                onIonChange={e => setBamount(Number(e.detail.value))}
                style={{ fontSize: '1.2rem', fontWeight: 'bold',  '--padding-start': '0px' }}
              />
          </IonItem>
              <div style={{ height: '8px' }} />
              <IonButton expand="block" onClick={() => handleButtonClick(Number((document.getElementById('budgetInput') as HTMLInputElement)?.value))} color='warning'>{buttontitle}</IonButton>
              <div style={{ height: '15px' }} />
                <IonItem lines="none" color="light" style={{ '--padding-start': '0px' }}>
                  <IonLabel color='dark' style={{ fontSize: '1.0rem', fontWeight: 'bold' }}>
                    Budget Progress:
                  </IonLabel>
                </IonItem>
              <div style={{ height: '5px' }} />
              <div style={{ padding: '0 5px' }}>
                <IonProgressBar value={pval} color={pval < 1 ? 'success' : 'danger'} />
              </div>
              <div style={{ height: '3px' }} />
              {pval >= 1.0 && (
                <div style={{ padding: '0 5px' }}>
                  <IonLabel color='danger'>Budget limit reached!</IonLabel>
                </div>
              )}
      </IonContent>
      <IonLoading
      isOpen={showLoading}
      message={'Saving budget...'}
      spinner="crescent"
    />
    </IonPage>
  );
};

export default Tab3;

/*
    REFERENCE: Ionic (2025) IonSelect UI Component. Available at: https://ionicframework.com/docs/api/select
*/
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonInput, IonButton, IonSelect,
  IonSelectOption, IonLabel, IonItem, IonDatetime, 
  useIonRouter
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ScheduledTransactionsService from '../services/ScheduledTransactionsService';
import { VibrationService } from '../services/VibrationService';
import { RecurrencePeriod } from '../models/RecurringEntry';
import LocalNotificationService from '../services/LocalNotificationService';

export default function AddSchedule({ history }: any) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [sdate, setSdate] = useState(new Date().toISOString());
  const [description, setDescription] = useState('');
  const [mindate, setMindate] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrencePeriod>('monthly');
  const [notificationDate, setNotificationDate] = useState(new Date().toISOString());
  const ionRouter = useIonRouter();

  function close() {
    ionRouter.goBack();
  }

  /*
  const calculateNotificationDate = (startDateStr: string, period:RecurrencePeriod): string => {
    const date = new Date(startDateStr);
    date.setDate(date.getDate() - 1);
    date.setHours(9, 0, 0); 
    return date.toISOString();
  };*/

  const calculateNotificationDates = (startDateStr: string, period: RecurrencePeriod): string[] => {
    const dates: string[] = [];
    
    let count = 0;
    if (period === 'monthly') count = 12;
    else if (period === 'weekly') count = 48;
    else if (period === 'yearly') count = 2;

    const currentDate = new Date(startDateStr);
    currentDate.setDate(currentDate.getDate() - 1);
    currentDate.setHours(9, 0, 0, 0);

    for (let i = 0; i < count; i++) {
      dates.push(currentDate.toISOString());
      if (period === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (period === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (period === 'yearly') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }
    return dates;
};

  async function save() {
    if(amount === 0){
        window.alert('Please enter an amount!');
        return;
    }
    if(category.trim() === ''){
        window.alert('Please enter a category!');
        return;
    }
    if(description.trim() === ''){
        window.alert('Please enter a description!');
        return;
    }
    let new_schedule = {
      id: `${uuid()}-${new Date().toISOString()}`,
      type,
      amount,
      categoryOrSource: category,
      description,
      period: recurrence,
      startDate: sdate,
      notificationDates: calculateNotificationDates(sdate, recurrence),
      timestamp: Date.now(),
    };
    await ScheduledTransactionsService.saveSchedule(new_schedule);
    VibrationService.vibrate();
    let updated = await ScheduledTransactionsService.loadSchedules();
    window.dispatchEvent(
        new CustomEvent('schedules:updated', { detail: updated })
    );
    await LocalNotificationService.scheduleReminders(description, new_schedule.notificationDates, new_schedule.id);
    //toggle below comment for testing -
    //await LocalNotificationService.scheduleReminder(description, '2025-12-28T04:32:00.000Z');
    ionRouter.goBack();
}

const handleStartDateSave = (e: CustomEvent) => {
  const selectedDate = e.detail.value as string;
  
  if (selectedDate) {
    const sDate = selectedDate.split('T')[0];
    setSdate(sDate);
    console.log("Date saved for DB:", sDate);
  }
};

useEffect(() => { 
   const todaysDate: string = new Date().toISOString().split('T')[0];
   const tomorrowDate: string = new Date(
    new Date(todaysDate).setDate(new Date(todaysDate).getDate() + 1)
   )
  .toISOString()
  .split('T')[0];
   setMindate(tomorrowDate);
}, []);

return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Schedule</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonItem color='dark'>
        <IonLabel className="ion-text-wrap" color='warning'>Add scheduled transactions to receive timely reminder notifications as per the schedule!</IonLabel>
      </IonItem>
      <IonContent className="ion-padding" color='light'>
        <IonItem lines="none" style={{ '--padding-start': '0px' }}>
          <IonSelect 
            label="Select Entry Type:" 
            labelPlacement="stacked"
            fill="solid" 
            value={type} 
            onIonChange={e => setType(e.detail.value)}
            style={{
              '--background': '#e0e0e0',
              '--border-radius': '8px',
              '--color': '#ffc409',
              '--label-color': '#ffc409',
              '--highlight-color-focused': '#ffc409',
              '--highlight-color-valid': '#ffc409',
              'fontWeight': 'bold',
              'margin-top': '10px'
            } as React.CSSProperties}>
              <IonSelectOption value="expense">Expense</IonSelectOption>
              <IonSelectOption value="income">Income</IonSelectOption>
          </IonSelect>
        </IonItem>

        <div style={{ height: '20px' }} />

        <IonItem lines="none" style={{ '--padding-start': '0px', '--inner-padding-end': '0px' }}>
        <IonLabel slot="start" style={{ marginRight: '15px', fontSize: '1.2rem', fontWeight: 'bold', flex: 'none' }}>
          €
        </IonLabel>
        <IonInput
          type="number"
          placeholder="0.00"
          onIonChange={e => setAmount(Number(e.detail.value))}
          style={{ fontSize: '1.2rem', fontWeight: 'bold',  '--padding-start': '0px' }}
        />
        </IonItem>

        <div style={{ height: '8px' }} />

        <IonItem lines="none" style={{ '--padding-start': '0px' }}>
          <IonSelect 
            label="Recurrence Period:"
            labelPlacement="stacked"
            fill="solid" 
            value={recurrence} 
            onIonChange={e => setRecurrence(e.detail.value)}
            style={{
              '--background': '#e0e0e0',
              '--border-radius': '8px',
              '--color': '#ffc409',
              '--label-color': '#ffc409',
              '--highlight-color-focused': '#ffc409',
              '--highlight-color-valid': '#ffc409',
              'fontWeight': 'bold',
              'margin-top': '10px'
            } as React.CSSProperties}>
              <IonSelectOption value="weekly">Weekly</IonSelectOption>
              <IonSelectOption value="monthly">Monthly</IonSelectOption>
              <IonSelectOption value="yearly">Yearly</IonSelectOption>
          </IonSelect>
        </IonItem>

        <div style={{ height: '8px' }} />

        <IonItem lines="none" style={{ '--padding-start': '0px' }}>
            <IonLabel position="stacked" style={{fontSize: '1.3rem', fontWeight: 'bold', color: '#ffc409'}}>Start Date:</IonLabel>
            <IonDatetime
              color='warning'
              presentation="date"
              value={sdate}
              min={mindate}
              onIonChange={handleStartDateSave}
            />
        </IonItem>

        <div style={{ height: '8px' }} />

        {type === 'expense' && (
          <>
            <IonItem lines="none" style={{ '--padding-start': '0px' }}>
            <IonSelect 
            key="expense_category"
            placeholder="Category"
            label="Expense Category:" 
            labelPlacement="stacked"
            fill="solid" 
            value={category}
            onIonChange={e => setCategory(e.detail.value!)}
            style={{
              '--background': '#e0e0e0',
              '--border-radius': '8px',
              '--color': '#ffc409',
              '--label-color': '#ffc409',
              '--highlight-color-focused': '#ffc409',
              '--highlight-color-valid': '#ffc409',
              'fontWeight': 'bold',
              'margin-top': '10px'
            } as React.CSSProperties}>  
              <IonSelectOption value="bills">Bills & Fees</IonSelectOption>
              <IonSelectOption value="houserent">House Rent</IonSelectOption>
              <IonSelectOption value="food">Food & Drink</IonSelectOption>
              <IonSelectOption value="groceries">Groceries</IonSelectOption>
              <IonSelectOption value="shopping">Shopping</IonSelectOption>
              <IonSelectOption value="transport">Transport</IonSelectOption>
              <IonSelectOption value="entertainment">Entertainment</IonSelectOption>
              <IonSelectOption value="healthcare">Healthcare</IonSelectOption>
              <IonSelectOption value="other">Other</IonSelectOption>
            </IonSelect>
            </IonItem>
          </>
        )}

        <div style={{ height: '8px' }} />

        {type === 'income' && (
          <>
            <IonItem lines="none" style={{ '--padding-start': '0px' }}>
            <IonSelect 
            key="income_source"
            placeholder="Source"
            label="Income Source:" 
            labelPlacement="stacked"
            fill="solid" 
            value={category}
            onIonChange={e => setCategory(e.detail.value!)}
            style={{
              '--background': '#e0e0e0',
              '--border-radius': '8px',
              '--color': '#ffc409',
              '--label-color': '#ffc409',
              '--highlight-color-focused': '#ffc409',
              '--highlight-color-valid': '#ffc409',
              'fontWeight': 'bold',
              'margin-top': '10px'
            } as React.CSSProperties}>
              <IonSelectOption value="salary">Salary</IonSelectOption>
              <IonSelectOption value="business">Business</IonSelectOption>
              <IonSelectOption value="other">Other</IonSelectOption>
            </IonSelect>
            </IonItem>
          </>
        )}

        <div style={{ height: '8px' }} />

          <div>
          <IonLabel 
            style={{ 
              color: '#ffc409', 
              fontWeight: 'bold', 
              fontSize: '0.9rem',
              display: 'block',
              marginBottom: '8px'
            }}>
            Description:</IonLabel>
          <IonInput
            placeholder="add a description..."
            value={description}
            maxlength={30}              
            counter={true}
            onIonInput={e => setDescription(e.detail.value!)}
            style={{
              '--background': '#e0e0e0',
              '--padding-start': '12px',
              '--border-radius': '8px',
              'color': 'black',
              'minHeight': '45px'
            } as React.CSSProperties}
          />
        </div>

        <div style={{ height: '8px' }} />

        <IonButton expand="block" onClick={save} color='warning'>Save</IonButton>
        <div style={{ height: '8px' }} />
        <IonButton expand="block" onClick={close} color='danger'>Close</IonButton>
      </IonContent>
    </IonPage>
  );
}

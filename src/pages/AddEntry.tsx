/*
    REFERENCE: Ionic (2025) IonSelect UI Component. Available at: https://ionicframework.com/docs/api/select
*/
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonInput, IonButton, IonSelect,
  IonSelectOption, IonLabel, IonItem, IonDatetime, 
  useIonRouter
} from '@ionic/react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DiskStorageService } from '../services/DiskStorageService';
import { VibrationService } from '../services/VibrationService';

export default function AddEntry({ history }: any) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const ionRouter = useIonRouter();

  function close() {
    ionRouter.goBack();
  }

  async function save() {
    if(amount === 0){
        window.alert('Please enter an amount!');
        return;
    }
    if(type === 'income' && source === ''){
        window.alert('Please enter a source!');
        return;
    }
    if(type === 'expense' && category === ''){
        window.alert('Please enter a category!');
        return;
    }
    let new_entry = {
      id: `${uuid()}-${new Date().toISOString()}`,
      type,
      date,
      amount,
      expense_category: category,
      income_source: source
    };
    await DiskStorageService.saveEntry(new_entry);
    VibrationService.vibrate();
    let updated = await DiskStorageService.loadEntries();
    window.dispatchEvent(
        new CustomEvent('entries:updated', { detail: updated })
    );
    ionRouter.goBack();
  }

  const handleDateSave = (e: CustomEvent) => {
  const selectedDate = e.detail.value as string;
  
  if (selectedDate) {
    const dbDate = selectedDate.split('T')[0];
    setDate(dbDate);
    console.log("Date saved for DB:", dbDate);
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Entry</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        <IonItem lines="none" style={{ '--padding-start': '0px' }}>
          {/*
          <IonLabel style={{fontSize: '1.0rem', fontWeight: 'bold', color: '#ffc409'}}>Select Entry Type:</IonLabel>
          <IonSelect value={type} onIonChange={e => setType(e.detail.value)}>
            <IonSelectOption value="expense">Expense</IonSelectOption>
            <IonSelectOption value="income">Income</IonSelectOption>
          </IonSelect>
          */}
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

        <IonItem lines="none" style={{ '--padding-start': '0px' }}>
            <IonLabel position="stacked" style={{fontSize: '1.3rem', fontWeight: 'bold', color: '#ffc409'}}>Select Date:</IonLabel>
            <IonDatetime
              color='warning'
              presentation="date"
              value={date}
              onIonChange={handleDateSave}
            />
        </IonItem>

        <div style={{ height: '8px' }} />

        <IonItem lines="none" style={{ '--padding-start': '0px', '--inner-padding-end': '0px' }}>
        <IonLabel slot="start" style={{ marginRight: '4px', fontSize: '1.2rem', fontWeight: 'bold', flex: 'none' }}>
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

        {/*
        {type === 'expense' && (
          <IonInput key="expense_category" placeholder="Category" value={category} onIonInput={e => setCategory(e.detail.value!)} />
        )}

        {type === 'income' && (
          <IonInput key="income_source" placeholder="Source" value={source} onIonInput={e => setSource(e.detail.value!)} />
        )}
        */}

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
            value={source}
            onIonChange={e => setSource(e.detail.value!)}
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
    
        <IonButton expand="block" onClick={save} color='warning'>Save</IonButton>
        <div style={{ height: '8px' }} />
        <IonButton expand="block" onClick={close} color='danger'>Close</IonButton>
      </IonContent>
    </IonPage>
  );
}

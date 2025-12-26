import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { DiskStorageService } from '../services/DiskStorageService';

export default function Tab2() {
  const [cashflow, setCashflow] = useState(0);

  useEffect(() => {
    DiskStorageService.loadEntries().then(entries => {
      let income = 0;
      entries.filter(e => e.type === 'income').forEach((e) => {
        income = income + e.amount;
      });
      let expense = 0;
      entries.filter(e => e.type === 'expense').forEach((e) => {
        expense = expense + e.amount;
      });
      setCashflow(income - expense);
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Wallet</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1>€ {cashflow}</h1>
      </IonContent>
    </IonPage>
  );
}

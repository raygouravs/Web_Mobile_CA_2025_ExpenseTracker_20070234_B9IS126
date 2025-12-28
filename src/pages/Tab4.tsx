import { IonContent, IonHeader, IonPage, 
         IonTitle, IonToolbar, IonItem, 
         IonLabel, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import './Tab4.css';
import { useState } from 'react';
import { RecurringSchedule } from '../models/RecurringEntry';
import ScheduleListView from '../components/ScheduleListView';
import { useIonViewWillEnter } from '@ionic/react';
import ScheduledTransactionsService from '../services/ScheduledTransactionsService';
import { useIonRouter } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useEffect } from 'react';
import LocalNotificationService from '../services/LocalNotificationService';

const Tab4: React.FC = () => {
  const ionRouter = useIonRouter();
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);

  useEffect(() => {
    const handler = (event: CustomEvent) => {
      setSchedules(event.detail);
    };
     window.addEventListener('schedules:updated', handler as EventListener);
     return () => window.removeEventListener('schedules:updated', handler as EventListener);
  }, []);

  const loadView = async () => {
    const scheds = await ScheduledTransactionsService.loadSchedules();
    setSchedules(scheds);
  }

  const checkNotificationPermissions = async () => {
    const hasPermission = await LocalNotificationService.checkNotificationPermission();
    if (!hasPermission) {
        const granted = await LocalNotificationService.requestNotificationPermission();
        if (!granted) {
          console.warn('Notification permission denied');
          window.alert('Please enable notifications for this app from Settings!')
        }
    }
  }

  useIonViewWillEnter(() => {
    loadView();
    checkNotificationPermissions();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scheduled Transactions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent color='light'>
          {schedules.length === 0 && (
            <IonItem color='dark'>
              <IonLabel className="ion-text-wrap" color='warning'>No schedules to show. Use the + button to add some schedules!</IonLabel>
            </IonItem>
          )}
        <ScheduleListView schedules={schedules} reloadView={loadView} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => ionRouter.push('/addSchedule', 'forward')} color='warning'>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;

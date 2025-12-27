/*
  REFERENCE: Ionic (2025) Ion Fab UI component. Available at: https://ionicframework.com/docs/api/fab
*/

import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonFab, IonFabButton, IonIcon,
  useIonRouter, IonItem,
  IonLabel
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { DiskStorageService } from '../services/DiskStorageService';
import EntryListView from '../components/EntryListView';
import FilterToggle from '../components/FilterToggle';

export default function Tab1() {
  const ionRouter = useIonRouter();
  const [entries, setEntries] = useState<any[]>([]);
  //const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('expense');

  useEffect(() => {
    DiskStorageService.loadEntries().then(setEntries);
  }, []); 

  useEffect(() => {
  const handler = (event: CustomEvent) => {
    setEntries(event.detail);
  };
   window.addEventListener('entries:updated', handler as EventListener);
   return () => window.removeEventListener('entries:updated', handler as EventListener);
  }, []);



  const filtered = entries
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const sortedEntries = filtered.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Timeline</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonItem color='light' lines="none">
        <FilterToggle value={filter} onChange={setFilter} />
      </IonItem>
      <IonContent color='light'>
        {entries.length === 0 && (
          <IonItem>
            <IonLabel className="ion-text-wrap" color='warning'>No entries to show. Use the + button to add some entries!</IonLabel>
          </IonItem>
        )}
        <EntryListView entries={sortedEntries} setEntries={setEntries}/>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => ionRouter.push('/add', 'forward')} color='warning'>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

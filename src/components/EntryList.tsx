/*
    REFERENCE: 
    Ionic (2025) ION LIST UI Component. Available at: https://ionicframework.com/docs/api/list
    Ionic (2025) IonItemSliding UI Component. Available at: https://ionicframework.com/docs/api/item-sliding
*/

import { IonList, IonItemSliding, IonLabel, IonContent, IonIcon, IonItemOptions, IonItemOption } from '@ionic/react';
import { Entry } from '../models/Entry';
import { addOutline, removeOutline, trash } from 'ionicons/icons';
import { DiskStorageService } from '../services/DiskStorageService';

export default function EntryListView(props: { entries: Entry[], setEntries: any }) {

  const handleDelete = async (id: string) => {
    //update UI
    let up_entries = props.entries.filter(e => e.id != id);
    props.setEntries(up_entries);
    //update disk records
    const result = await DiskStorageService.saveEntries(up_entries);
  };

  return (
    <IonContent color="light">
    <IonList inset={true}>
    {props.entries.map((e) => (
    <IonItemSliding 
      key={e.id}
      style={{
        '--background': e.type === 'income' 
          ? 'rgba(45, 211, 111, 0.5)'
          : 'rgba(235, 68, 90, 0.5)'
      } as React.CSSProperties}>
      <IonIcon 
        slot="start"
        icon={e.type === 'income' ? addOutline : removeOutline }
        style={{ fontSize: 24, color: e.type === 'income' ? '#2dd36f' : '#eb445a'}}
      />
      <IonLabel>
        <h2>{e.type.toUpperCase()} - ₹{e.amount}</h2>
        <p>{e.date}</p>
        <p>{e.expense_category || e.income_source}</p>
      </IonLabel>
      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={() => handleDelete(e.id)}>
          <IonIcon slot="icon-only" icon={trash} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
    ))}
    </IonList>
    </IonContent>
  );
}


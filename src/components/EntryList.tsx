import { IonList, IonItem, IonLabel } from '@ionic/react';
import { Entry } from '../models/Entry';

export default function EntryList(props: { entries: Entry[] }) {
  return (
    <IonList>
      {props.entries.map(e => (
        <IonItem key={e.id}>
          <IonLabel>
            <h2>{e.type.toUpperCase()} - ₹{e.amount}</h2>
            <p>{e.date}</p>
            <p>{e.expense_category|| e.income_source}</p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}

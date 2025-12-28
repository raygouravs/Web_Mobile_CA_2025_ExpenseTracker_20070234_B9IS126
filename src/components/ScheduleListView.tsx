/*
    REFERENCE: 
    Ionic (2025) ION LIST UI Component. Available at: https://ionicframework.com/docs/api/list
    Ionic (2025) IonItemSliding UI Component. Available at: https://ionicframework.com/docs/api/item-sliding
*/

import { 
  IonList, IonItemSliding, IonLabel, IonIcon, 
  IonItemOptions, IonItemOption, IonItem 
} from '@ionic/react';
import { RecurringSchedule } from '../models/RecurringEntry';
import { addOutline, removeOutline, trash } from 'ionicons/icons';
import ScheduledTransactionsService from '../services/ScheduledTransactionsService';

const formatDateString = (dateString: string) => {
    const dateStr = dateString;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [year, month, day] = dateStr.split("-");
    const customFormat = `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
    console.log(customFormat); // Output: "Dec 25, 2025"
    return customFormat;
}

export default function ScheduleListView(props: { schedules: RecurringSchedule[], reloadView: any }) {

  const handleDelete = async (id: string) => {
    await ScheduledTransactionsService.deleteSchedule(id);
    const up_schedules = await ScheduledTransactionsService.loadSchedules();
    props.reloadView();
  };

  return (
    <IonList inset={true} style={{ background: 'transparent' }} lines='none'>
      {props.schedules.map((e) => (
        <IonItemSliding key={e.id}>
          <IonItem 
            style={{
              '--background': e.type === 'income' 
                ? 'rgba(45, 211, 111, 0.15)'
                : 'rgba(235, 68, 90, 0.15)',
              '--border-radius': '12px',
              '--inner-padding-bottom': '10px',
              '--inner-padding-top': '10px',
              'margin-bottom': '10px'
            } as React.CSSProperties}
            lines="none"
          >
            <IonIcon 
              slot="start"
              icon={e.type === 'income' ? addOutline : removeOutline }
              style={{ fontSize: 24, color: e.type === 'income' ? '#2dd36f' : '#eb445a'}}
            />
             <IonLabel className="ion-text-wrap" style={{ display: 'block' }}>
               <p style={{ fontSize: '1.1rem', color: e.type === 'income' ? 'olive' : 'maroon', marginBottom: '4px', fontWeight: 'bold' }}>
                 {e.type.toUpperCase()} — €{e.amount.toFixed(2)}
               </p>
              
              <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '4px' }}>
                Start date: {formatDateString(e.startDate)}
              </p>

              <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '4px' }}>
                🔔 Notification on: {formatDateString(e.notificationDate.split('T')[0])}
              </p>

              {e.endDate && (
                <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '4px' }}>
                    End date: {formatDateString(e.endDate)}
                </p>
              )}
              
              <h2 style={{ fontWeight: '700', color: '#000', fontSize: '0.95rem', marginBottom: '4px' }}>
                Repeats {e.period}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#000', marginBottom: '4px' }}>
                <b>Category:</b> {e.categoryOrSource}
              </p>
              <p style={{ fontSize: '0.95rem', color: '#349', marginBottom: '4px' }}>
                <b>Desc:</b> {e.description}
              </p>
            </IonLabel>
          </IonItem>
          <IonItemOptions side="end" className="swipe-options">
            <IonItemOption
                color="danger"
                className="swipe-delete"
                onClick={() => handleDelete(e.id)}>
            <IonIcon slot="icon-only" icon={trash} />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </IonList>
  );
}
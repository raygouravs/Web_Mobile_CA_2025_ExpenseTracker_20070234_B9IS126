import React from 'react';
import { IonContent, IonIcon, IonItem, IonLabel, IonSegment, IonSegmentButton, SegmentChangeEventDetail } from '@ionic/react';
import { useState } from 'react';
import CategoriesToggle from './CategoriesToggle';
import { DoughnutData } from '../utils/utilitymethods';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

function WalletBottomHalfComponent(props: { expenseDoughnutdata: DoughnutData, incomeDoughnutdata: DoughnutData }) {

  const [filter, setFilter] = useState('expenses');

  return (
    <>
      <CategoriesToggle value={filter} onChange={setFilter} />
      <div style={{ height: '20px' }} />
      {filter === 'expenses' && props.expenseDoughnutdata.datasets[0].data.length === 0 && (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <IonLabel color='dark'>No data available! Add some entries!</IonLabel>
        </div>
      )}

      {filter === 'income' && props.incomeDoughnutdata.datasets[0].data.length === 0 && (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IonLabel color='dark'>No data available! Add some entries!</IonLabel>
        </div>
      )}

      {filter === 'expenses' && (
        // show doughnut chart for expenses
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',     
            height: '280px', 
            width: '100%'      
          }}>
           <div style={{ width: '100%', maxWidth: '280px' }}>
              <Doughnut data={props.expenseDoughnutdata} options={{ maintainAspectRatio: true }} />
           </div>
          </div>
      )}
      {filter === 'income' && (
        // show doughnut chart for income
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',     
            height: '280px', 
            width: '100%'      
          }}>
            <div style={{ width: '100%', maxWidth: '280px' }}>
              <Doughnut data={props.incomeDoughnutdata} options={{ maintainAspectRatio: true }} />
            </div>
          </div>
      )}
    </>
  );
}

export default WalletBottomHalfComponent;
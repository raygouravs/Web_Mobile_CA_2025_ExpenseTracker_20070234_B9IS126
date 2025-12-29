import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { list, wallet, cog, timerOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import AddEntry from './pages/AddEntry';
import { MonthlyBudget } from './utils/utilitymethods';
import ScheduledTransactionsService from './services/ScheduledTransactionsService';
import { DiskStorageService } from './services/DiskStorageService';
import { LocalNotifications } from '@capacitor/local-notifications';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import AddSchedule from './pages/AddSchedule';
import LocalNotificationService from './services/LocalNotificationService';
import { useEffect } from 'react';
import { RecurringSchedule } from './models/RecurringEntry';

setupIonicReact();

/*
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/tab3">
            <Tab3 />
          </Route>
          <Route path="/add">
            <AddEntry />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={list} />
            <IonLabel>Timeline</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={wallet} />
            <IonLabel>Wallet</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={cog} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);
*/

const App: React.FC = () => {

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
      if(progress===1.0 || progress===1){
        await LocalNotificationService.budgetNotification();
      }
  }

  const initNotificationChannel = async () => {
    await LocalNotificationService.createNotificationChannel();
  }

  useEffect(() => {
    initNotificationChannel();
  }, []);

  //MARK: local notification listener for banner display
  useEffect(() => {
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received while app is open:', notification);
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      await LocalNotificationService.checkAndRequestNotificationPermissions();
    };

    init();
  }, []);

   useEffect(() => {
    budgetProgressTracker();
  }, []);

  // update the latest notification batch dates
  const updateNotificationsBatch = async () => {
    const now = new Date();
    const schedules = await ScheduledTransactionsService.loadSchedules();
    const updated_schedules: RecurringSchedule[] = schedules.map((schedule) => {
      let updated_dates = schedule.notificationDates.filter((datestr) => {
        const notf_date = new Date(datestr);
        if (notf_date > now) {
          return true;
        } else {
          return false;
        }
      });
      const sortedDates = updated_dates.sort((a, b) => 
        new Date(a).getTime() - new Date(b).getTime()
      );
      return {
        ...schedule,
        notificationDates: sortedDates
      }
    });
    await ScheduledTransactionsService.saveSchedulesBatch(updated_schedules);
  }

  useEffect(() => {
    //updateNotificationsBatch(); ///check later
  }, []);

  async function syncDataWithCLoudStorage() {
    const first_launch = await ScheduledTransactionsService.getFirstLaunchFlag();
    if(first_launch){
      await ScheduledTransactionsService.storeFirstLaunchFlag();
    }
    //MARK: complete this...
  }

  useEffect(() => {
    syncDataWithCLoudStorage();
  }, [])


  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/tabs" render={() => (
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/tabs/tab1"><Tab1 /></Route>
                <Route exact path="/tabs/tab2"><Tab2 /></Route>
                <Route exact path="/tabs/tab3"><Tab3 /></Route>
                <Route exact path="/tabs/tab4"><Tab4 /></Route>
              </IonRouterOutlet>
              
              <IonTabBar slot="bottom">
                <IonTabButton tab="tab1" href="/tabs/tab1">
                  <IonIcon icon={list} />
                  <IonLabel>Timeline</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tabs/tab2">
                  <IonIcon icon={wallet} />
                  <IonLabel>Wallet</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab4" href="/tabs/tab4">
                  <IonIcon icon={timerOutline} />
                  <IonLabel>Scheduled</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tabs/tab3">
                  <IonIcon icon={cog} />
                  <IonLabel>Settings</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          )} />

          <Route exact path="/add">
            <AddEntry />
          </Route>

          <Route exact path="/addSchedule">
            <AddSchedule />
          </Route>

          <Route exact path="/">
            <Redirect to="/tabs/tab1" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

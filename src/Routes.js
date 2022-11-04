import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { browserHistory, Route, Router } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { isEmpty } from 'lodash';
import { persistor, store } from './redux/store';
import App from './App';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import TraineeLogin from './pages/TraineeLogin';
import PrincipalLogin from './components/Principle/PrincipalLogin';
import ITILogin from './components/ITI/ITILogin';
import Otp from './components/Otp';
import Welcome from './components/Welcome';
// import TrainerLogin from './components/Trainer/TrainerLogin';
import DstMc from './components/DstMc/DstMc';
import CreateDstMc from './components/DstMc/CreateDstMc';
import TrainerOptions from './components/Trainer/TrainerOptions';
import Global from './components/Global';
import { getUser } from './common/globals';
import TraineeDetail from './pages/TraineeDetail';
import TrainerDetail from './components/Trainer/TrainerDetail';
import TraineeRegistration from './components/Trainee/TraineeRegistration';
import PrincipalOptions from "./components/Principle/PrincipalOptions";
import ViewDstMc from "./components/DstMc/ViewDstMc";
import ITIWelcome from "./components/ITI/ITIWelcome";
import ITIOptions from "./components/ITI/ITIOptions";
import ResetPassword from "./components/ITI/ResetPassword";
import DstMcOptions from "./components/DstMc/DstMcOptions";
import UpdateDstMc from "./components/DstMc/UpdateDstMc";
import CancelDstMc from "./components/DstMc/CancelDstMc";
import TraineeOptions from './pages/TraineeOptions';
import ViewTraineeAttendance from './components/Trainee/ViewTraineeAttendance';
import ViewOJTAttendance from './components/OJT/ViewOJTAttendance';
import OJTAttendanceTable from './components/OJT/OJTAttendanceTable';

class Routes extends PureComponent {
  // eslint-disable-next-line class-methods-use-this
  checkAuth = async () => {
    const user = await getUser();

    if (!isEmpty(user) && user !== null) {
      browserHistory.push('/trainee-options');
    }
    window.scrollTo(0, 0);
  };

  // eslint-disable-next-line class-methods-use-this
  requireAuth = async () => {
    const user = await getUser();
    if (isEmpty(user)) {
      browserHistory.push('/');
      window.scrollTo(0, 0);
    }
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Global />
          <Router history={browserHistory}>
            <Route component={App}>
              <Route exact path="/" components={{ component: Home }} onEnter={this.checkAuth} />
              <Route exact path="/principal-login" components={{ component: PrincipalLogin }} />
              <Route exact path="/trainee-login" components={{ component: TraineeLogin }} onEnter={this.checkAuth} />
              <Route exact path="/trainee-options" components={{ component: TraineeOptions }} onEnter={this.requireAuth} />
              <Route exact path="/trainee-record-attendance" components={{ component: TraineeDetail }} onEnter={this.requireAuth} />
              <Route exact path="/trainee-view-attendance" components={{ component: ViewTraineeAttendance }} onEnter={this.requireAuth} />
              <Route exact path="/verify-otp" components={{ component: Otp }} onEnter={this.checkAuth} />
              <Route exact path="/welcome" components={{ component: Welcome }} />
              <Route exact path="/iti-login" components={{ component: ITILogin }} />
              <Route exact path="/iti-welcome" components={{ component: ITIWelcome }} />
              <Route exact path="/iti-options" components={{ component: ITIOptions }} />
              <Route exact path="/iti-reset" components={{ component: ResetPassword }} />
              {/*
               <Route exact path="/trainer-login" components={{ component: TrainerLogin }} />
               */}
              <Route exact path="/dst-mc" components={{ component: DstMc }} onEnter={this.requireAuth} />
              <Route exact path="/view-dst-mc" components={{ component: ViewDstMc }} />
              <Route exact path="/view-ojt-attendance" components={{ component: ViewOJTAttendance }} />
              <Route exact path="/view-ojt-attendance/:iti/:industry/:batch/:tradeName/:fromDt/:toDt" components={{ component: OJTAttendanceTable }} />
              <Route exact path="/create-dst-mc" components={{ component: CreateDstMc }} />
              <Route exact path="/trainer-options" components={{ component: TrainerOptions }} />
              <Route exact path="/principal-options" components={{ component: PrincipalOptions }} />

              <Route exact path="/trainer-detail" components={{ component: TrainerDetail }} />

              <Route exact path="/trainee-registration" components={{ component: TraineeRegistration }} />
              <Route exact path="/dst-mc-options" components={{ component: DstMcOptions }} />
              <Route exact path="/update-dst-mc" components={{ component: UpdateDstMc }} />
              <Route exact path="/cancel-dst-mc" components={{ component: CancelDstMc }} />
              <Route path="*" components={{ component: NotFound }} />
            </Route>
          </Router>
        </PersistGate>
      </Provider>
    );
  }
}

export default Routes;

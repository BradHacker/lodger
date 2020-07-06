import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import Hotels from './pages/hotels';
import API from './api';

import './App.scss';
import UserContext from './user-context';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faPlus, faHome, faUser, faList, faInfo, faPowerOff } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes, faPlus, faHome, faUser, faList, faInfo, faPowerOff);

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: {
        loaded: false,
      },
    };
  }

  componentDidMount() {
    API.getJson('/users/me').then(
      (user) => this.setState({ user: { ...user, loaded: true } }),
      () => this.setState({ user: { loaded: true } })
    );
  }

  render() {
    const { user } = this.state;
    return (
      <Router>
        <UserContext.Provider value={user}>
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path={user.loaded && !user._id ? ['/', 'login'] : '/login'} component={Login} />
            {user.loaded && user._id && <Route path="/hotels" component={Hotels} />}
            {user.loaded && user._id && <Route path="/" component={Home} />}
          </Switch>
        </UserContext.Provider>
      </Router>
    );
  }
}

export default App;
